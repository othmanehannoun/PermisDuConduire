 ///LOGIN CONDUCTEUR ///

 let  loginConducteur = document.getElementById('adminlogin');

 loginConducteur && loginConducteur.addEventListener('click', () => {

   var email = document.getElementById("email").value;
   var password = document.getElementById("password").value;
   
let admin = {
   email,
   password
}


console.log(admin)
   axios.post('http://localhost:5000/admin/login', admin)
    .then(res => {
       let getData= res.data;
         localStorage.setItem('admin',JSON.stringify(getData.admin));
         localStorage.setItem('token', getData.accesstoken);
         window.location.href = "Dashbord.html";  
     })

    .catch(err => {
        console.log(err);
        alert("email or password incorrect")
    });

})


// --------------get conducteur from db---------------- 

let rowConducteur = document.getElementById('row');

axios.get('http://localhost:5000/allconducteur')
.then(function (response) {

    // console.log(response.data.conducteur)
 
    response.data.conducteur.forEach(element => {
        rowConducteur.innerHTML += `<tr>
        
    </td>
    <td>${element.matricule}</td>
    <td>${element.nom}</td>
    <td>${element.prenom}</td>
    <td>${element.email}</td>
    <td>${element.phone}</td>
    <td>${element.address}</td>
    <td>${element.numPermis}</td>
    <td>${element.numPoint}</td>
    <td>
    <a onclick="update('${element._id}')" href="#editEmployeeModal" class="edit" data-toggle="modal" id="editCatg"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>      
    </td></tr>`
       
    });
    
}).catch(function (err) {
    console.log(err);
});


// ---------------------update Conducteur-------------------- 


function update(id){
    axios.get(`http://localhost:5000/getconducteur/${id}`)
    .then(response =>{
        
    let conducteur = response.data.Conducteur;
    console.log(conducteur)
     document.getElementById('numPoint').value = conducteur.numPoint
    
    }).catch(err => {
        console.log(err);
    });
    
    let updateConducteur = document.getElementById('updateConducteur');
    
    updateConducteur.addEventListener('click', () => {
     
    
        let numPoint = document.getElementById('numPoint').value;
    
        var point =     {
            numPoint : numPoint
           }
    
        axios.put(`http://localhost:5000/admin/updateConducteur/${id}`, point)
        .then(function (response) {
            console.log(response);
          
            window.location.href = "Dashbord.html"; 
           
        }).catch(function (err) {
            console.log(err);  
    })
    });  
    }