const Conducteur = require('../models/conducteur')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validation = require('../middleware/validation')
const nodemailer = require('nodemailer')

const conducteurCtrl = {

    register: async (req, res) =>{
        try {
            console.log(req.body);
            const { error } = validation.registerValidation(req.body);
            if (error) return res.status(400).send(error.details[0].message);

            const {matricule, nom, prenom, email, phone, address, numPermis, password, } = req.body

            const conducteur = await Conducteur.findOne({email})
            if(conducteur) return res.status(400).json({msg: "The email already exists."})

           
            // Password Encryption
            const passwordHash = await bcrypt.hash(password, 10)
            const newConducture = new Conducteur({
                matricule, 
                nom,
                prenom,
                email, 
                phone,
                address,
                numPermis,
                password : passwordHash
            })

            // Save mongodb
            await newConducture.save()

            // Then create jsonwebtoken to authentication
            const accesstoken = createAccessToken({matricule: newConducture.matricule, email: newConducture.email})

            const transport = nodemailer.createTransport({
                service: "gmail",
                    auth: {
                        user: process.env.EMAIL,  // TODO: your gmail account
                        pass: process.env.PASSWORD // TODO: your gmail password
                    }
                })
              
                await transport.sendMail({
                    from: process.env.EMAIL,
                    to: email,
                    subject: "Email Activated Account",
                    html: `
                    <h2>Please click on below link to activate your account</h2>
                    <p>https://http://127.0.0.1:5501/permis/src/verify.html?token=${accesstoken}</p>
                `
                })
           
            res.json({'Conducture' : newConducture, accesstoken})

        } catch (err) {
            return res.status(500).json({message: err.message})
        }
    },


    //------------------------Activate Account---------------------
    activateAccount : async(req, res) => {
        
    const token = req.params.token;
    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  
    let matricule = decodeToken.matricule;
  
     await Conducteur.findOneAndUpdate({ matricule: matricule },{isValide : true});
  
     res.json({
             message : "Account is Valide"
     });
  },



    //------------------------Authentification---------------------
    Login : async (req, res, next) =>{
        const { email, password } = req.body
    
        try {
        const conducteur = await Conducteur.findOne({ email });
        if (conducteur) {
            bcrypt.compare(password, conducteur.password, (err, result) => {
                if (result) {
                    
                    if (conducteur.isValide == false) {
                        res.status(200).json({ message: 'Your account is still being processed' })

                    }

                    else {
                        const accesstoken = createAccessToken({id: conducteur._id})
                        res.status(200).json({ conducteur, accesstoken })
                    }

                } else {
                    res.status(200).json({message: 'email or password incorrect ' })
                }
            })
        } else {
            res.status(401).json({ message: 'we can\'t find this email' })
        }
    } catch (error) {
    
        }
    
    },

 // --------- fetch All Conducteur---------//
 getAllConducteur : async(req, res)=>{
    
   await Conducteur.find((err, conducteur)=>{
        if(err || !conducteur){
            return res.json({error: 'No data'})
        }
        res.json({conducteur})
    })
},


// --------- fetch Product by ID ---------//
 getConducteurById :  async (req,res)=>{
   
    let id = req.params.id;
    await Conducteur.findOne({_id : id }).then(Conducteur=>{
      res.json({Conducteur})
    }).catch(err=>{
      console.log(err);
    })
  }


}



const createAccessToken = (conducteur) =>{
    return jwt.sign(conducteur, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
}


module.exports = conducteurCtrl