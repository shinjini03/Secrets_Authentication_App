//jshint esversion:6
require('dotenv').config();
const express=require("express");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");
const plugin=require("plugin");
const app=express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));
mongoose.connect("mongodb://localhost:27017/secretDB",{useNewUrlParser:true});

const secretSchema=new mongoose.Schema({
    email:String,
    password:String
});

// const secret="Helloabscdfghjklu";
const secret=process.env.SECRET;
secretSchema.plugin(encrypt,{secret:secret, encryptedFields: ['password']});
const Secret=new mongoose.model("Secret",secretSchema);
app.get("/",function(req,res){
    res.render("home");
})
app.get("/login",function(req,res){
    res.render("login");
})
app.get("/register",function(req,res){
    res.render("register");
});
app.post("/register",function(req,res){
    const newSecret=new Secret({
        email:req.body.username,
        password:req.body.password
    });
    newSecret.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("secrets");
        };
    });
});

app.post("/login",function(req,res){
    const username=req.body.username;
    const password=req.body.password;
    Secret.findOne({email:req.body.username},function(req,foundUser){
        if(foundUser){
            if(foundUser.password===password){
                res.render("secrets");
            }
        }else{
          console.log(err);
          res.render("You do not have an account existing , kindly try again");
        };
    });
});
// app.get("/secrets",function(req,res){
//     res.render("secrets");
// })
// app.get("/submit",function(req,res){
//     res.render("submit");
// })

app.listen(3000,function(){
    console.log("Server started sucessfully");
})
