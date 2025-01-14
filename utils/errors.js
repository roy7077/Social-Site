
class AppError extends Error{
    constructor(message,stausCode){
        super(message);
        this.stausCode=stausCode;
        this.explanation=message;
    }
}

module.exports=AppError;