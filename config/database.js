const mongoose=require('mongoose');
require('dotenv').config();

const dbconnect=()=>{
    mongoose.connect(process.env.MONGODB_URL,{
        // useNewUrlParser:true,
        // useUnifiedTopology:true,
    })
    .then(()=>{
        console.log("DB connected Successful");
    })
    .catch((error)=>{
        console.log("DB connection failed");
        console.log(error);
        process.exit(1);
    })
}

module.exports=dbconnect;