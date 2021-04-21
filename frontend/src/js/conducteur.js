let Register = document.getElementById('save');

   Register &&  Register.addEventListener('click', () => {
   
    let matricule = document.getElementById('matricule').value;
        let nom = document.getElementById('nom').value;
        let prenom = document.getElementById('prenom').value;
        let email = document.getElementById('email').value;
        let phone = document.getElementById('phone').value;
        let address = document.getElementById('address').value;
        let numPermis =document.getElementById('numPermis').value
        let password = document.getElementById('password').value;
        // let confirmerPassword = document.getElementById('confirmerPassword').value;


    
        let data = {
            matricule,
            nom,
            prenom,
            email,
            phone,
            address,
            numPermis,
            password   
        }

console.log({data})

        axios.post('http://localhost:5000/register', data)
            .then(function (response) {
            
                const myNotification = new Notification('Notification', {
                    body: 'Register successfully'
                })
                location.reload();
    
            })
            .catch(function (err) {
                console.log(err);
                (err.response.data.error.message!==undefined) ? 
                alert(err.response.data.error.message)
                : 
                alert(err.response.data.error.errors)
            });
    })



// Confirmer acoount 
    let confirmer = document.getElementById('confirmer');

    confirmer && confirmer.addEventListener('click',()=>{
    let searchUrl = window.location.search;
    console.log(searchUrl)
    let newSearch= searchUrl.replace('?', '');
    let sendtoken=  newSearch.split('=');
    let token = sendtoken[0]=="token" && sendtoken[1];
    console.log(token)
    axios.get(`http://localhost:5000/activateAccount/${token}`)
    .then(function (response) {
        console.log(response);

                    const myNotification = new Notification('Notification', {
                        body: 'Confirmer successfully'
                    })
                   window.location.href="Condtrlogin.html";
        
                })
                .catch(function (err) {
                    console.log(err);
                    (err.response.data.error.message!==undefined) ? 
                    alert(err.response.data.error.message)
                    : 
                    alert(err.response.data.error.errors)
                });
    })




     ///LOGIN CONDUCTEUR ///

  let  loginConducteur = document.getElementById('loginConducteur');

  loginConducteur && loginConducteur.addEventListener('click', () => {

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    
let conducteur = {
    email,
    password
}


console.log(conducteur)
    axios.post('http://localhost:5000/login', conducteur)
    .then((response) => {
        let getData= response.data;
        
                if(response){
                    localStorage.setItem('conducteur',JSON.stringify(getData.conducteur));
                    localStorage.setItem('token', getData.accesstoken);
                    window.location.href = "Home.html";
                }
                else{
                    alert('email or password incorrect')
                }
        
                })
                .catch(function (err) {
                    console.log(err);
                    alert("email or password incorrect")
                });

})