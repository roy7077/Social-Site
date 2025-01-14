const Tag = require('../models/Tag'); // Assuming Tag is the Mongoose model for tags
let {errorResponse,successResponse} = require('../utils');
const {AppError} = require('../utils');
const {logger}=require('../config');

// create tag
const createTag = async (req, res) => {
    try {
        // Extract data from request body
        const { name } = req.body;


        // Check if the tag already exists
        const existingTag = await Tag.findOne({ name: name.trim() });
        if (existingTag) {
            logger.error(`Tag with the same name already exists`);
            throw new AppError("Tag with the same name already exists.", 409); // Conflict
        }

        // Create a new tag
        const newTag = new Tag({ name: name.trim() });
        await newTag.save();

        // Prepare and send success response
        successResponse.message = "Tag created successfully.";
        successResponse.data = { tag: newTag };
        return res.status(201).json(successResponse);
    } catch (error) {
        if (error instanceof AppError) {
            // Handle AppError specifically
            errorResponse.message = error.message;
            errorResponse.explanation = error.explanation || error.message;
            errorResponse.error = { statusCode: error.statusCode };

            return res.status(error.statusCode).json(errorResponse);
        }

        logger.error(`Unexpected Error:, ${error}`)

        // Log unexpected errors for debugging
        console.error("Unexpected Error:", error);

        // Handle unexpected errors
        errorResponse.message = "An unexpected error occurred.";
        errorResponse.explanation = error.message || "Internal server error.";
        errorResponse.error = { statusCode: 500 };

        return res.status(500).json(errorResponse);
    }
};

module.exports = {
    createTag
}
