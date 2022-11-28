import React, { useEffect, useState,useRef } from "react";
import { connect } from "react-redux";
import { AddAction } from '../store/actions/countActions'
import { nextOrderAction, upOrderAction} from '../store/actions/nextorder'
import { initOrderAction } from '../store/actions/initorder'
import { roundAction } from "../store/actions/roundAction";
import { circleAction } from "../store/actions/circleAction";
import { updatePersonsAction } from "../store/actions/updatepersonsaction";
import { FormattedMessage } from "react-intl";
import { message, Typography,  Button, Input,Modal,Divider,Form  } from 'antd';
import { playError } from "../utils/play";
import './control.less'
import { wsUrl } from "../config";
import { initContainerAction } from "../store/actions/containerActions";
import { initOnoffAction } from '../store/actions/onoffAction'
import createWsConnect from '../utils/ws'
import { StringCodec } from "../utils/nats";
import Moment from 'moment';
const arrs = ["D1","D2","D3","D4","E1","E2","E3","E4","E5","E6"]

const sc = StringCodec();

const { Title } = Typography;

function Control(props) {
    const {
        circle,circleAction,highList, eventInfo,order,
         round, persons, nextorder, uporder, initorder, 
         roundAction, updatePerson ,initContainer,
         container,initOnoff
        } = props;


    const  ws = useRef();
    const [timeText,setTimeText] = useState(0);

    const timeId = useRef();

    const startInterval = ()=>{
        if(timeId.current) return ;
        ws.current.startTime({msg:'start'})
        timeId.current= setInterval(()=>{
            console.log("111")
            setTimeText((v)=>{
                return 1000+v
            })
        },1000)
    }

    const stopInterval = ()=>{
        if(!timeId.current) return ;
        ws.current.endTime({msg:'end'})
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

            // ws.current = (msg)=>{
            //     socket.publish('gymnastics-screen-show', sc.encode(JSON.stringify(msg)));
            // }
            // 开始比赛 发送当前用户信息
            ws.current.startGymnastics = (msg)=>{
                socket.publish('start-gymnastics', sc.encode(JSON.stringify(msg)));
            }
            // 发送用户信息
            ws.current.sendPlayerInfo = (msg)=>{
                socket.publish('player-info', sc.encode(JSON.stringify(msg)));
            }
            // 开始计时
            ws.current.startTime = (msg)=>{
                socket.publish('start-time', sc.encode(JSON.stringify(msg)));
            }
            // 结束计时
            ws.current.endTime = (msg)=>{
                socket.publish('end-time', sc.encode(JSON.stringify(msg)));
            }

            const sub = socket.subscribe('update-result');

            printMsgs(sub,(a)=>{
                const obj = JSON.parse(a);
                console.log(obj);
                let data = JSON.parse(JSON.stringify(persons[order]));
                let score = data.score;
                let index = score.findIndex(e=>{
                   return  e.key===obj.key
                });

                if(index>0){
                    score[index]=obj
                }else{
                    score.push(obj)
                }

                updatePerson({
                    num:data.num,
                    data:data
                })

              })

        });

        // console.log(ws.current.socket.closed((e)=>{
        //     e('断开')
        // }));
        return () => { 

            ws.current.socket&&ws.current.socket.closed(); 
            console.log("退出赛事管理") 
        }
    }, []);

    useEffect(()=>{
        if(ws.current&&ws.current.socket.protocol.connected===true){
            console.log(order,persons[order].teamName)
            ws.current.sendPlayerInfo({
                playerNameA:persons[order].playerNameA,
                gameGroupSportItemName:persons[order].gameGroupSportItemName?persons[order].gameGroupSportItemName:"个人",
                order:Number(order),
                id:persons[order].playerA,
                resultId:persons[order].id,
                subSportName: persons[order].subSportName,
                teamId: persons[order].teamId,
                teamName:persons[order].teamName,
                ggsiId:persons[order].ggsiId,
                eventId:persons[order].eventId,
                subSportId:persons[order].subSportId,
                playerId:persons[order].id,
                catagory:persons[order].catagory,
            })
        }
    },[order])


    function next() {

        let l = persons.length;
     

        if (order + 1 === l) {
            return alert('比赛结束了')
        }

        nextorder()
        setTimeText(0);
    }

    function show(){
        Modal.confirm({
            title:'注意',
            content:'确定开启大屏',
            onOk(){
                openScreen({show:true});
                initOnoff(true);
                setTimeout(()=>{
                    sendScreen({
                        realName:persons[order].name,
                        teamName:persons[order].teamName,
                        round:round,
                        order:order,
                        value:persons[order].score[round]
                    })
                },200)
            }
        })
        
    }

    function hide(){
        Modal.confirm({
            title:'注意',
            content:"确定关闭大屏",
            onOk(){
                openScreen({show:false});
                initOnoff(false);
            }
        })
    }


    function up() {
        if(Number(order)===0){
            alert("Do not");
            return 
        }
        uporder()
        
    }

    function sendScreen(data){
        ws.current.send(JSON.stringify({route:'screen',data}))
    }

    function openScreen(data){
        ws.current.send(JSON.stringify({route:'onoff',data}))
    }





    return <div className="control">
        <div className="title">
            <Title level={3}>
            {/* {eventInfo.displayName?eventInfo.displayName+"-第"+eventInfo.sessionsCount+"组":'未设置'} */}
            当前参赛队员
            </Title>
            <div><Button onClick={show} size="small">开始显示</Button>
            <Button danger onClick={hide} size="small">关闭显示</Button></div>
        </div>
        <div className="table">
            <table className="imagetable">
                <thead>
                    <tr>
                        <td>
                            <FormattedMessage id="序号"></FormattedMessage>
                        </td>
                        <td>
                            比赛项目
                        </td>
                        <td>
                            参赛选手
                        </td>
                        <td>
                            队伍
                        </td>
                        <td>
                            操作
                        </td>
                        
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{order + 1}</td>
                        <td>
                            跳马
                        </td>
                        <td>
                        {persons[order]&&persons[order].playerNameA}
                        </td>
                        <td>
                        {persons[order]&&persons[order].teamName}
                        </td>
                        <td>
                        <Button onClick={startInterval} type="primary" size="small">开始</Button>
                        <Button onClick={stopInterval} danger size="small">结束</Button>
                        </td>
                    </tr>
                </tbody>
            </table>
            
        </div>
        <div className="controlBox">
            <div className="leftbutton">
                <Button onClick={up}>
                    <FormattedMessage id="上一位选手"></FormattedMessage>
                </Button>
            </div>
            <div className="center">
                <div className="upcontent">
                    <div className="text">
                       姓名
                    </div>
                    <Input disabled className="input" value={persons[order]&&persons[order].playerNameA} />
                </div>
                <div className="downcontent">
                    <div className="text">
                        时间
                    </div>
                    <Input disabled className="input" value={Moment(timeText).format("mm:ss")} />
                </div>
            </div>
            <div className="rightbutton">
                <Button onClick={next}>
                    <FormattedMessage id="下一位选手"></FormattedMessage>
                </Button>
            </div>
        </div>
        <div className="controlData">
            <div className="controlRight">
                <div className="D">

                    {/* {arrs.filter(e=>e.startsWith("D")).map(e=>{
                        return <div key={e} className="kuai">
                        <Button type="text">{e}</Button>
                        <div className="fenshu">
                            {persons[order].score.filter(item=>item.key===e)[0]&&persons[order].score.filter(item=>item.key===e)[0].value}
                        </div>
                    </div>
                    })} */}

                    {/* {persons[order].score.filter(e=>e.category==="diffcult").map(e=>{
                        return <div key={e.key} className="kuai">
                        <Button type="text">{e.key}</Button>
                        <div className="fenshu">
                            {e.value}
                        </div>
                    </div>
                    })} */}
                    <div className="kuai">
                        <Button type="text">平均分</Button>
                        <div className="fenshu">
                            13.4
                        </div>
                    </div>
                </div>
                <div className="E">
                {/* {persons[order].score.filter(e=>e.category==="execution").map(e=>{
                        return <div key={e.key} className="kuai">
                        <Button type="text">{e.key}</Button>
                        <div className="fenshu">
                            {e.value}
                        </div>
                    </div>
                    })} */}

                    {/* {arrs.filter(e=>e.startsWith("E")).map(e=>{
                        return <div key={e} className="kuai">
                        <Button type="text">{e}</Button>
                        <div className="fenshu">
                            {persons[order].score.filter(item=>item.key===e)[0]&&persons[order].score.filter(item=>item.key===e)[0].value}
                        </div>
                    </div>
                    })} */}


                    <div className="kuai">
                        <Button type="text">平均分</Button>
                        <div className="fenshu">
                            13.4
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="Z">
                总分：<div className="fenshu"> 13.4</div> <Button type="primary">确认成绩</Button>
        </div>
    </div>
}

let mapstatetoprops = ({ Obj, order, round, persons, setting,eventInfo,highList,circle,container }) => {
    return {
        Obj,
        order,
        round,
        persons,
        setting,
        eventInfo,
        highList,
        circle,
        container,
    }
}

let mapdispatchtoprops = (dispatch) => {
    return {
        add: () => dispatch(AddAction()),
        nextorder: () => dispatch(nextOrderAction()),
        uporder: () => dispatch(upOrderAction()),
        initorder: () => dispatch(initOrderAction()),
        roundAction: (type) => dispatch(roundAction(type)),
        circleAction: (type) => dispatch(circleAction(type)),
        initContainer: (payload) => dispatch(initContainerAction(payload)),
        updatePerson: (payload) => dispatch(updatePersonsAction(payload)),
        initOnoff: (payload) => dispatch(initOnoffAction(payload))
    }
}

// export default Control;

export default connect(mapstatetoprops, mapdispatchtoprops)(Control)