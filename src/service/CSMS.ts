import { CALL, CALLERROR, CALLRESULT, ERROR_CODE_WITH_MSG } from "../common/constant"
import { Actions } from "../common/message.enum"
import Message from "../dto/message.dto"
import ErrorCode from "../dto/error-code.dto"
import CallError from "../exception/callerror.exception"

/**
 * Implementation of the central stattion management system which is 
 * responsible for the communication with charging station.
 */
class ChargingStationManagementSystem {

    /**
     * Process message from charge station
     * Perfrom message validation, transformation and response processing
     * @param message 
     * @param ws 
     */
    public process(message: any): string {
      console.log("Enter :: process", message)
        try {
            let responseMsg = ""
            // Validate Message
              const validMsg = this.msgValidation(message)
              if(validMsg.length > 0) {
                console.log(" Valid Message received ", validMsg)
                // Convert message
                const transformedMsg = this.msgConvertor(validMsg)
                // Generate response
                responseMsg = this.buildResponse(transformedMsg)
                // Send message to charge station
              }
            return responseMsg
          } catch(error){
             console.log("Exit :: process with error", typeof(error))
             return this.errorMsgBuilder(error)
          }
    }

    /**
     * Performs message validation checks for 
     * - valid message type i.e 2
     * - valid actions i.e BootNotification, StatusNotification
     * @param message 
     * @returns 
     */
    private msgValidation(message: Buffer): any[] {
        console.log("Enter :: msgValidation", message)
        if(message.length === 0) {
          return [] // Ignore the message
        }
        const tempMsg = JSON.parse(message.toString())
        if(tempMsg.length > 0){
          if(tempMsg[0] !== CALL){
            return [] // Ignore the message
          }
          if(tempMsg[2] in Actions){
            throw new CallError( tempMsg[1], new ErrorCode(ERROR_CODE_WITH_MSG.NOT_IMPLEMENTED.CODE, ERROR_CODE_WITH_MSG.NOT_IMPLEMENTED.MSG))
          }
        }
        console.log("Exit :: msgValidation", tempMsg)
        return tempMsg
      }
      
      // Convert msg string to Message DTO
      private msgConvertor(message: any[]): Message{
        console.log("Enter :: msgConvertor")
         let transformedMsg = new Message();
         transformedMsg.msgId = message[0]
         transformedMsg.requestId = message[1]
         transformedMsg.action = message[2]
         transformedMsg.payload = message[3]
         console.debug(transformedMsg)
         console.log("Exit:: msgConvertor")
         return transformedMsg
      }
      
      // Creates error message string
      private errorMsgBuilder(callError: any): string{
        console.log(callError)
         if(callError.errorCode){
           // Return specific error code messages
          return `[${CALLERROR} , ${callError.uniqueId}, ${callError.errorCode.code}, ${callError.errorCode.description}]`
         } else {
           // Return generic error message
          return `[${CALLERROR} , "" , ${ERROR_CODE_WITH_MSG.INTERNAL_ERROR.CODE}, ${ERROR_CODE_WITH_MSG.INTERNAL_ERROR.MSG}]`
         }
      }
      
      // Creates response message and send it to charge station via websocket
      private buildResponse(message: Message): string {
        console.log("buildResponseAndSend", message)
        let responseBody = ""
        switch (message.action){
          case Actions.BOOT_NOTIFICATION: {
            const bootstrapRes = {
              "currentTime" : new Date(),
              "interval":900,
              "status":"Accepted"
            }
            console.log("bootstrapRes",JSON.stringify(bootstrapRes))
             responseBody = `[ ${CALLRESULT}, ${JSON.stringify(message.requestId)}, ${JSON.stringify(bootstrapRes)}]`
            break;
      
          }
          case Actions.STATUS_NOTIFICATION:{
            responseBody = `[${CALLRESULT}, ${JSON.stringify(message.requestId)}, ${JSON.stringify({})}]`
            break;
            }
             
          default: {
            throw new CallError(message.requestId, new ErrorCode(ERROR_CODE_WITH_MSG.NOT_IMPLEMENTED.CODE, ERROR_CODE_WITH_MSG.NOT_IMPLEMENTED.MSG))
          }
        }
        return responseBody
      }
      
}

export default ChargingStationManagementSystem