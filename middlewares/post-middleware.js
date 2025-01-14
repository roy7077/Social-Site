const { errorResponse, successResponse } = require('../utils');
const {AppError} = require('../utils');

const validatePost = async (req, res, next) => {
    try {
        // Extract data from the request body
        const { title, desc, image, tags } = req.body;

        // Validate title and description
        if (!title || !desc) {
            throw new AppError("Title and description are required.", 400);
        }

        // validate image
        const thumbnail=req.files.image;

        if(!thumbnail)
        throw new AppError("Image is required.", 400);

        // console.log(req.body);
        //  console.log(tags);
        // Validate tags
        if (!tags || !Array.isArray(tags) || tags.length === 0) {
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
        console.error("Unexpected Error:", error);
        errorResponse.message="An unexpected error occurred";
        return res.status(500).json(errorResponse);
    }
};

module.exports = {
    validatePost
};
