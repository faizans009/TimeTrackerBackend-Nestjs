/* eslint-disable prettier/prettier */
export class ResponseModel {
    status: boolean;
    data: any;
    message: string;
    errors: any;

    constructor(status: boolean, data: any, message: string, errors: any) {
        this.status = status;
        this.data = data;
        this.message = message;
        this.errors = errors;
    }
}