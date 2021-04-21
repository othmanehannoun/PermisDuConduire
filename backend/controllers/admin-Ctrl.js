const Admin = require('../models/admin')
const Conducteur = require('../models/conducteur')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validation = require('../middleware/validation')
const nodemailer = require('nodemailer')

const adminCtrl = {

    register: async (req, res) =>{
        try {
            
            const { error } = validation.registerAdminValidation(req.body);
            if (error) return res.status(400).send(error.details[0].message);

            const {full_name, email, phone, password } = req.body

            const admin = await Admin.findOne({email})
            if(admin) return res.status(400).json({msg: "The email already exists."})

           
            // Password Encryption
            const passwordHash = await bcrypt.hash(password, 10)
            const newAdmin = new Admin({
               
                full_name,
                email, 
                phone,
                password : passwordHash
            })

            // Save mongodb
            await newAdmin.save()

            // Then create jsonwebtoken to authentication
            const accesstoken = createAccessToken({id: newAdmin._id})
           
            res.json({'Admin' : newAdmin, accesstoken})

        } catch (err) {
            return res.status(500).json({message: err.message})
        }
    },


    //------------------------Authentification---------------------
    Login : async (req, res, next) =>{

        const { error } = validation.loginValidation(req.body);
        if (error) return res.status(400).send(error.details[0].message);
    
        try {
            const {email, password} = req.body;

            const admin = await Admin.findOne({email})
            if(!admin) return res.status(400).json({msg: "admin does not exist."})

            const isMatch = await bcrypt.compare(password, admin.password)
            if(!isMatch) return res.status(400).json({msg: "Incorrect password."})

            // If login success , create access token 
             const accesstoken = createAccessToken({id: admin._id})
           
            res.json({admin, accesstoken})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    
    },


    //---------------updating Conducteur-------------------//
    updateConducteur : async(req, res, next) => {

     await Conducteur.findOneAndUpdate({_id: req.params.id}, {numPoint: req.body.numPoint}, (err, conducteur)=>{
        if(err){
            if(err) return next(err)
        }
     
            // console.log(conducteur.email);

            const transport = nodemailer.createTransport({
                service: "gmail",
                    auth: {
                        user: process.env.EMAIL,  // TODO: your gmail account
                        pass: process.env.PASSWORD // TODO: your gmail password
                    }
                })
              
                let info =  transport.sendMail({
                    from: process.env.EMAIL,
                    to: conducteur.email,
                    subject: "Email Activated Account",
                    html: `
                    <div class="box" style="	position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 400px;
                    height: 174px;
                    background: #001e2d;
                    box-sizing: border-box;
                    box-shadow: 0 20px 50px rgba(0,0,0,.5);
                    border:2px solid rgba(0,0,0,.5);">
                        <svg><rect></rect></svg>
                        <div class="content" style="	position: absolute;
                    top: 15px;
                    left: 15px;
                    right: 15px;
                    bottom: 15px;
                    border: 2px solid #ffeb3b;
                    padding: 30px;
                    box-shadow: 0 5px 10px rgba(0,0,0,.5);
                    text-align: center;">
                            
                            <h4 style="	color: #fff;
                    position: absolute;
                    color: #fff;
                    top: 39%;
                    left: 11%;
                    font-size: 25px;
                    padding: 0;">
                                Your Point changed to  ${req.body.numPoint} </h4>
                        
                        </div>
                    </div>
                   
                    
                    
                `
                })

                res.json(conducteur);
       
      
      })
        

    }


}



const createAccessToken = (admin) =>{
    return jwt.sign(admin, process.env.ACCESS_TOKEN_ADMIN, {expiresIn: '1d'})
}


module.exports = adminCtrl