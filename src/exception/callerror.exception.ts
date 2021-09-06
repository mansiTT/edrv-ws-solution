import ErrorCode from "../dto/error-code.dto";

class CallError extends Error {
    public uniqueId:string;
    public errorCode: ErrorCode;
    public errorDescription?: string;
    public errorDetails?:any

    constructor(uniqueId: string, errorCode: ErrorCode, errorDescription?: any, errorDetails?: any) {
        super(errorDescription);
        this.uniqueId = uniqueId
        this.errorCode = errorCode
        this.errorDescription = errorDescription
        this.errorDetails = errorDetails
      }
}

export default CallError