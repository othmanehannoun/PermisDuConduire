const express = require('express');
const cors = require('cors');
const mongoose = require('./database/config');


const server = express();

//routes
var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin')


server.use(express.json());
server.use(cors());
server.use(express.urlencoded({ extended: false }));
//server.use(express.static(path.join(__dirname, 'public')));


server.use('/', indexRouter);
server.use('/admin', adminRouter)



// error handler
server.use((req,res,next)=>{
  res.status(404).send('Sorry Dont find this route');
  
});

const PORT = process.env.PORT || 5000
server.listen(PORT,()=>{
 console.log(`Server listen this Port ${PORT}`);
});

module.exports = server
