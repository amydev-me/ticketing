import { CustomError } from "./custom-errors";

export class NotFoundError extends CustomError {
   
    errorCode = 404;

    constructor(){
        super('Route not found');

        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeErrors() {
        return [{ message:'Not Found'}];
    }
}