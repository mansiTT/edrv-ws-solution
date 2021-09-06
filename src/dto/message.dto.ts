import { Actions } from "../common/message.enum";


class Message {
    msgId: number;
    requestId: string;
    action: Actions;
    payload:any
}

export default Message