import { CustomError } from "./custom-errors";

export class BadRequestError extends CustomError{
    errorCode = 400;

    constructor(public message: string){
        super(message);

        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeErrors(): { message: string; }[] {
        return [{ message : '' }]
    }
}