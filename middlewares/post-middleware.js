const { errorResponse, successResponse } = require('../utils');
const {AppError} = require('../utils');
const {logger}=require('../config');

const validatePost = async (req, res, next) => {
    try {
        // Extract data from the request body
        const { title, desc, image, tags } = req.body;

        // Validate title and description
        if (!title || !desc) {
            logger.error(`Title and description are required.`);
            throw new AppError("Title and description are required.", 400);
        }

        // validate image
        const thumbnail=req.files.image;

        if(!thumbnail)
        {
            logger.error(`Image is required`);
            throw new AppError("Image is required.", 400);
        }
        // console.log(req.body);
        //  console.log(tags);
        // Validate tags
        if (!tags || !Array.isArray(tags) || tags.length === 0) {
            logger.error(`Tags are required and should be an array.`);
            throw new AppError("Tags are required and should be an array.", 400);
        }

        // If validation passes, proceed to the next middleware/controller
        next();
    } catch (error) {
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
};

module.exports = {
    validatePost
};
