import React, { useEffect} from "react";
import { connect } from "react-redux";
// import { AddAction} from '../store/actions/countActions'
// import { useSpring, animated } from 'react-spring'
import { updateSettingAction } from "../store/actions/updateSetting";
// import Button from '@material-ui/core/Button';
// import { makeStyles } from '@material-ui/core/styles';
// import useAnimateNumber from 'use-animate-number';
// import stroe from '../store'
// import {FormattedMessage} from 'react-intl'
// import { message} from 'antd';
// import { playPage } from "../utils/play";
import SheetJSApp from '../components/Sheet'
import ParseJson from "../components/ParseJson/index";
// import { wsUrl } from "../config";


import './export.less'

// playPage()

function Device(props) {

  // const { setting, updateSetting, change, persons } = props;


  // let opt = {
  //   duration: 1000,
  //   enterance: true,
  //   direct: false,
  //   disabled: false,
  //   decimals: 2
  // }
  // const [excatValue, setExcatValue] = useAnimateNumber(0, { ...opt, decimals: 3 })
  // const [standardValue, setStandardValue] = useAnimateNumber(0, opt);


  // var ws;
  useEffect(() => {

    // ws = new WebSocket(wsUrl);
    // // Web Socket 已连接上，使用 send() 方法发送数据
    // ws.onopen = function () {
    //   console.log("链接ok")
    //   // 这里用一个延时器模拟事件
    //   // ws.send(params);
    // }
    // // 这里接受服务器端发过来的消息
    // ws.onmessage = function (e) {
    //   setExcatValue(e.data);
    //   setStandardValue(e.data);
    //   // 

    //   let score = Number(e.data).toFixed(2);

    //   let order = stroe.getState().order
    //   let round = stroe.getState().round
    //   // persons[order].score[round] = score;
    //   // updatePerson({ index: order, data: persons[order] });
    //   message.success('接收到消息');
    //   // playNumber();
    //   document.getElementById("number").play();

    // }
    // ws.onerror = function (code, reason) {
    //   // console.log("Connection error");
    //   message.warning("出错了请重新连接")
    // }

    // return () => { ws.close(); console.log("退出赛事管理") }
  }, []);

  return <div className="exportcheckoutwrap">
      <div className="exportcheckout">
       <SheetJSApp/>
      <ParseJson/>
      </div>
    </div>;
}


let mapstatetoprops = ({ setting, persons }) => {

  console.log("=====",persons)
  return {
    setting, persons
  }
}

let mapdispatchtoprops = (dispatch) => {
  return {
    updateSetting: (payload) => dispatch(updateSettingAction(payload)),
    change: (e) => dispatch({ type: e })
  }
}

// export default Home;

export default connect(mapstatetoprops, mapdispatchtoprops)(Device)