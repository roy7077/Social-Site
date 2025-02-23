const { errorResponse, successResponse } = require('../utils');
const {AppError} = require('../utils');
const {logger}=require('../config');

const validateTag=async(req,res,next)=>{
    try{
        // get tag from req's body
        const {name}=req.body;

        if (!name || typeof name !== 'string' || name.trim() === '') {
            logger.error("Tag name is required and should be a non-empty string.");
            throw new AppError("Tag name is required and should be a non-empty string.", 400);
        }

        next();
    }
    catch(error){
        // Handle known AppError and other errors
        if (error instanceof AppError) {
            errorResponse.message=error.message
            return res.status(error.statusCode).json(errorResponse);
        }

        // Unexpected error handling
        logger.error(`Unexpected Error:, ${error}`);
        console.error("Unexpected Error:", error);
        errorResponse.message="An unexpected error occurred";
        return res.status(500).json(errorResponse);
    }
}

module.exports={
    validateTag
}