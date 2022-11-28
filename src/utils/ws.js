import { connect, StringCodec } from "./nats";
import {wsUrl} from '../config'

function createWsConnect(callBack){
    connect({ servers: wsUrl, reconnect: true, maxReconnectAttempts: -1 }).then(res=>{
        callBack && callBack(res, StringCodec());
    })
}

export default createWsConnect;