const express=require('express');
const {dbconnect}=require('./config');
const cookieParser = require('cookie-parser')
const fileUpload=require('express-fileupload');
const bodyParser = require('body-parser')
const app=express();



app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json())

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));


app.get('/',(req,res)=>{
    return res.send("Hello");
})


const PORT = process.env.PORT || 8080
app.listen(PORT,()=>{
    console.log("Server is running at PORT ",PORT);
})

dbconnect();