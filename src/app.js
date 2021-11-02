const express=require("express");
const path=require("path");
const app=express();
const crypto=require("crypto");
const nodemailer = require('nodemailer');


var flash = require('express-flash-messages')
app.use(flash())



require("./db/conn");
const Register=require("./models/register")
const Otp=require("./models/otp")
const port=process.env.PORT ||3000;

const static_path=path.join(__dirname,"../public");
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(static_path));
app.set("view engine","hbs");
app.get("/",(req,res)=>{
  res.render("index");
});
app.get("/register",(req,res)=>{
  res.render("register");
});
app.get("/login",(req,res)=>{
  res.render("login");
});
app.get("/fp",(req,res)=>{
  res.render("fp");
});
app.get("/otp",(req,res)=>{
  res.render("otp");
});
app.get("/reset",(req,res)=>{
  res.render("reset");
})

//register


app.post("/register",async (req,res)=>{
  try{
        const password= req.body.password;
        const cpassword= req.body.cpassword;
        if(password===cpassword)
        {
          const registerEmp= new Register({
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            email:req.body.email,
            phone:req.body.phone,
            birthdate:req.body.birthdate,
            password:req.body.password,
            confirmpassword:req.body.cpassword
          })
            const registered=await registerEmp.save();
            res.status(201).render("registersucessful");

        }
        else{
          res.send("password are not same");
        }
  }catch(error){
    res.status(400).send(error);
  }
})

//Login
app.post("/login",async(req,res)=>{
  try{
    const email=req.body.email;
    const password=req.body.password;

    const useremail=await Register.findOne({email:email});
    if(useremail.password===password)
    {
      res.status(201).render("logout");
    }
    else
    {
      res.send("password are not correct");
    }

  }catch(error)
  {
    res.status(400).send(error);
  }
})

//Mail Sender Function

const mailer=(e,otpcode)=>{
  //console.log(e);
  var transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
      user:'donotrply80@gmail.com',
      pass:'Shija229@'
    }
  });
  var mailOptions={
    from:'donotrply80@gmail.com',
    to:e,
    subject:'Forgot password mail',
    text:otpcode.toString()
  };
    transporter.sendMail( mailOptions,function(error,info){
      if(error){
        console.log(error);
      }
      else{
        console.log('Email sent'+info.response);
      }
    });
}









//otp generate and send to mail id

app.post("/otp",async(req,res)=>{
  let data=await Register.findOne({email:req.body.mail});
   d=req.body.mail;
  const  responsetype={};
  if (data)
  {
    const otpcode=Math.floor((Math.random()*10000)+1);
    const e=req.body.mail;
    const otpData=new Otp({
      email:req.body.mail,
      code:otpcode,
      expireIn: new Date().getTime()+300*1000
    })
    const otpresponse=await otpData.save();
    const email=req.body.mail;
    const otp=otpcode;
    mailer(e,otpcode);
  //  reset(e,otpcode);
    res.status(200).render("otp");

  }
  }

)

//reset

   app.post("/reset",async(req,res)=>{
    let dd=req.body.otp;
  let data=await Otp.findOne({code:dd});
  const response={}
  if(data)
  {
    let currentTime=new Date().getTime();
    let diff=data.expireIn-currentTime;
      if(diff<0)
      {
        response.message="token Expire";
        response.statustext="error";
      }
      else
      {
          res.status(200).render("reset");





          app.post("/passreset",async(req,res)=>{


            try{
                  const pass= req.body.password;
                  const cpass= req.body.cpassword;
                  const edata=req.body.mail;
                  console.log(edata);
                  if(pass===cpass)
                  {
                    let data=await Register.findOne({email:req.body.mail});
                      const em=data.email;
                      const updateDocument=async(email,pass,cpass)=>{
                        const result=await Register.updateOne({email:email},{
                          $set:{
                              password:pass,
                              cpassword:cpass
                          }
                        });
                      }

                        updateDocument(em,pass,cpass);
                  }
                    res.status(200).render("pc");

                }catch(error){
                  res.status(400).send(error);
                  console.log(error);
                }
          })

      }
  }
  else
  {
    console.log("otp not match");
  }
}
);
app.get("/logout",(req,res)=>{
  res.render("logout");
});
app.post("/logout",(req,res)=>{
  res.status(200).render("index");
})



app.listen(port,()=>{
  console.log('server is running ');
})
