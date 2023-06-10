const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;


let users = []

//user check
const doesExist = (username)=>{
  let samenameuser = users.filter((user)=>{
    return user.username === username
  });
  if(samenameuser.length > 0){
    return true;
  } else {
    return false;
  }
}

//authentification
const authenticatedUser = (username,password)=>{
  let valid_users = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(valid_users.length > 0){
    return true;
  } else {
    return false;
  }
}


const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){

//Write the authenication mechanism here
if(req.session.authorization) { //get the authorization object stored in the session
    token = req.session.authorization['accessToken']; //retrieve the token from authorization object
    jwt.verify(token, "access",(err,user)=>{ //Use JWT to verify token
        if(!err){
            req.user = user;
            next();
        }
        else{
            return res.status(403).json({message: "User not authenticated"})
        }
     });
 } else {
     return res.status(403).json({message: "User not logged in"})
 }
});
 
const PORT =3000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));