const  logger  = require("./logger-config");
const  uploadImageToCloudinary  = require("./cloudinary-config");
const dbconnect = require("./database");

module.exports={
    dbconnect,
    uploadImageToCloudinary,
    logger
}