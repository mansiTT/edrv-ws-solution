import  * as WebSocket from 'ws';
import { CSID } from './common/constant';
import ChargingStationManagementSystem from './service/CSMS';
const port: number = 3002;

const OCPP_PROTOCOL_1_6 = 'ocpp1.6'

let WebSocketServer = WebSocket.Server;

const wsOptions = {
  port,
  handleProtocols: (protocols:any) => {
    if (Array.from(protocols).indexOf(OCPP_PROTOCOL_1_6) === -1) {
      return '';
    }
    return OCPP_PROTOCOL_1_6;
  },
  checkCSID: async (info: any, cb:any) => {
    console.log(info.req.url)
    if (info.req.url === '/'+CSID) {
      return cb(true);
    }
    cb(false, 204, 'Charge Station not registered!!!');
  }
};
console.log(wsOptions)
let wss = new WebSocketServer(wsOptions);

wss.on('connection', function connection(ws:any) {
  
  // Send ping every 900 seconds
  setInterval(function ping() {
      ws.ping("ping");
  }, 900);

  console.log(ws.protocol)
  if (!ws.protocol) { // if ws protocol does not exists 'ocpp1.6'
    console.log(`Close connection due to unsupported protocol`,ws);
    return ws.close();
  }
  
  ws.on('message', function incoming(message : any) {
    console.log(message)
    const msg = new ChargingStationManagementSystem().process(message)
    if(msg.length > 0) sendWSMsgToClient(ws,msg)
  });

});



function sendWSMsgToClient(ws: any, msg : string){
  ws.send(Buffer.from(msg).toString())
}


