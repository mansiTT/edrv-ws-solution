export const OCPP_PROTOCOL_1_6 = 'ocpp1.6'

export const CSID = "mt11"

export const CALL = 2;

export const CALLRESULT = 3

export const CALLERROR = 4

export const ERROR_CODE_WITH_MSG = {
    NOT_IMPLEMENTED :  {
        CODE : 'NotImplemented',
        MSG : 'Requested Action is not known by receiver'
    },

    INTERNAL_ERROR : {
        CODE : 'InternalError',
        MSG : 'An internal error occurred and the receiver was not able to process the requested Action successfully'
    }
}