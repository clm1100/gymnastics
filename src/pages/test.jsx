import React, { useEffect } from "react";
import { connect } from "react-redux";
import { parse16 } from '../utils/parse16'
import { message, 
    // Typography, Table, Radio, Button, Input, Row, Col
 } from 'antd';
import { wsUrl } from "../config";
function App(params) {
    var ws;
    useEffect(() => {
        // ws = new WebSocket('ws://localhost:8080/ws');
        ws = new WebSocket(wsUrl);
        ws.onopen = function () {
            message.success('链接成功');
        }
        // 这里接受服务器端发过来的消息
        ws.onmessage = function (e) {
            let obj = parse16(JSON.parse(e.data));
            console.log(obj);
            message.success(`接收到消息${obj}`);
            // playNumber();

        }
        ws.onerror = function (code, reason) {
            message.warning("出错了请重新连接")
        }

        return () => { ws.close(); console.log("退出赛事管理") }
    }, []);

    return <div>
        test
    </div>
}



let mapstatetoprops = ({ Obj, order, round, persons }) => {
    return {
       
    }
}

let mapdispatchtoprops = (dispatch) => {
    return {
       
    }
}


export default connect(mapstatetoprops, mapdispatchtoprops)(App)