const mongoose=require("mongoose");

mongoose.connect("mongodb+srv://Shivamjain80:Shija229@e-commerceweb.nmiwp.mongodb.net/PROJECT0?retryWrites=true&w=majority",{
  useNewUrlParser:true,useUnifiedTopology:true
}).then(()=>{
  console.log("connection successful");
}).catch((e)=>{
   console.log("no connection");
})
