import React, { useRef, useEffect, useState } from "react";
import { connect } from "react-redux";
import { wsUrl } from "../config";
// import {
//   CheckCircleFilled,
//   CloseOutlined,
//   MinusOutlined,
// } from "@ant-design/icons";
import { message } from "antd";
import "./display.less";
import { initOnoffAction } from '../store/actions/onoffAction'
import createWsConnect from '../utils/ws'
import { StringCodec } from "../utils/nats";

const sc = StringCodec();

function Mark(props) {

  const {value}=props
  console.log(value)

  let obj = {
    o: "O",
    x: "X",
    "-":"—",
  };
  return (
    <>
      {value.map((e, index) => {
        return <span key={index}>{obj[e]}</span>;
      })}
    </>
  );
}

function Display(props) {
  const { highList,onoff,circle,container,round,order,initOnoff } = props;
  const [status,setStatus] = useState(false);
  const [person, setPerson] = useState({});
  const [timeText,setTimeText] = useState(0);
  const [obj, setObj] = useState({
    realName:container[order]?container[order].name:"",
    teamName:container[order]?container[order].teamName:'',
    round:round,
    order:order,
    value:container[order]?container[order].score[round]:[]
  });
  const ws = useRef();

  const timeId = useRef();

  const startInterval = ()=>{
      if(timeId.current) return ;
      // ws.current.startTime({msg:'start'})
      timeId.current= setInterval(()=>{
          console.log("111")
          setTimeText((v)=>{
              return 1000+v
          })
      },1000)
  }

  const stopInterval = ()=>{
    if(!timeId.current) return ;
    clearInterval( timeId.current)
    timeId.current=undefined;
}

const printMsgs =  async(s,callback) =>{
  for await (const m of s) {
    callback&&callback(sc.decode(m.data))
  }
}

useEffect(() => {

 
  createWsConnect((socket, sc)=>{
      ws.current = {};
      // console.log('socket is connect successfuly:',socket);
      ws.current.socket = socket;

      const start = socket.subscribe('gymnastics-screen-show');

      printMsgs(start,(a)=>{
          const obj = JSON.parse(a);
          console.log(obj);
          setPerson(obj)
        })


      const sub = socket.subscribe('player-info');

      printMsgs(sub,(a)=>{
          const obj = JSON.parse(a);
          console.log(obj);
          // stopInterval()
          setTimeText(0);
          setPerson(obj)
        })




      const t1 = socket.subscribe('start-time');

      printMsgs(t1,(a)=>{
          //   const obj = JSON.parse(a);
          startInterval()
          console.log("开始倒计时")
      })

      const t2 = socket.subscribe('end-time');

      printMsgs(t2,(a)=>{
          stopInterval()
          console.log("结束倒计时");
          message.info("选手动作结束,请裁判员打分！")
      })

  });

  return () => { 
      ws.current.socket&&ws.current.socket.closed(); 
      console.log("退出赛事管理") 
  }
}, []);

  // console.log(ws.current.socket.closed((e)=>{
  //     e('断开')
  // }));

  return (
    <div className="displayWrap">
      <div className="content">
      {timeText}
      {onoff?<><div className="up">
          <span
            style={{ marginRight:"5px",fontSize: obj.realName.length >= 4 ? "20px" : "36px" }}
          >
            {obj.realName}
          </span>
          <span className="round">{highList[obj.round]}</span>
        </div>
        <div className="down">
          <div className="row">{obj.teamName}</div>
          <div className="row row1">
            <div style={{ marginRight: "30px" }}>
              成绩：{timeText}
              <span className="round">
                <Mark value={obj.value}></Mark>
              </span>
            </div>
          </div>
        </div></>:""}
      </div>
    </div>
  );
}

let mapstatetoprops = ({ setting, persons, highList,onoff,circle,container,round,order }) => {
  return {
    setting,
    persons,
    highList,
    onoff,
    circle,container,round,order
  };
};

let mapdispatchtoprops = (dispatch) => {
  return {
    initOnoff: (payload) => dispatch(initOnoffAction(payload))
  };
};

// export default Home;

export default connect(mapstatetoprops, mapdispatchtoprops)(Display);
