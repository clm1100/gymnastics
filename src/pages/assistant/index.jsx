import React, { useEffect, useState,useRef } from "react";
import { connect } from "react-redux";
import { nextOrderAction, upOrderAction} from '../store/actions/nextorder'
import { initOrderAction } from '../store/actions/initorder'
import { roundAction } from "../store/actions/roundAction";
import { updatePersonsAction } from "../../store/actions/updatepersonsaction";
import { FormattedMessage } from "react-intl";
import { message, Typography,  Button, Input,Modal,Divider,Form  } from 'antd';
import { playError } from "../utils/play";
import './control.less'
import { initOnoffAction } from '../store/actions/onoffAction'
import createWsConnect from '../utils/ws'
import { StringCodec } from "../utils/nats";
import Moment from 'moment';
const arrs = ["D1","D2","D3","D4","E1","E2","E3","E4","E5","E6"]

const sc = StringCodec();

const { Title } = Typography;

function Control(props) {
    const {
        circle,highList, eventInfo,order,
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
            // ???????????? ????????????????????????
            ws.current.startGymnastics = (msg)=>{
                socket.publish('start-gymnastics', sc.encode(JSON.stringify(msg)));
            }
            // ??????????????????
            ws.current.sendPlayerInfo = (msg)=>{
                socket.publish('player-info', sc.encode(JSON.stringify(msg)));
            }
            // ????????????
            ws.current.startTime = (msg)=>{
                socket.publish('start-time', sc.encode(JSON.stringify(msg)));
            }
            // ????????????
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
        //     e('??????')
        // }));
        return () => { 

            ws.current.socket&&ws.current.socket.closed(); 
            console.log("??????????????????") 
        }
    }, []);

    useEffect(()=>{
        if(ws.current&&ws.current.socket.protocol.connected===true){
            console.log(order)
            ws.current.sendPlayerInfo({
                realName:persons[order].displayName,
                teamName:persons[order].gameGroupSportItemName?persons[order].gameGroupSportItemName:"??????",
                order:Number(order),
                id:persons[order].id,
            })
        }
    },[order])


    function next() {

        let l = persons.length;
     

        if (order + 1 === l) {
            return alert('???????????????')
        }

        nextorder()
        setTimeText(0);
    }

    function show(){
        Modal.confirm({
            title:'??????',
            content:'??????????????????',
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
            title:'??????',
            content:"??????????????????",
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
            {/* {eventInfo.displayName?eventInfo.displayName+"-???"+eventInfo.sessionsCount+"???":'?????????'} */}
            ??????????????????
            </Title>
            <div><Button onClick={show} size="small">????????????</Button>
            <Button danger onClick={hide} size="small">????????????</Button></div>
        </div>
        <div className="table">
            <table className="imagetable">
                <thead>
                    <tr>
                        <td>
                            <FormattedMessage id="??????"></FormattedMessage>
                        </td>
                        <td>
                            ????????????
                        </td>
                        <td>
                            ????????????
                        </td>
                        <td>
                            ??????
                        </td>
                        <td>
                            ??????
                        </td>
                        
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{order + 1}</td>
                        <td>
                            ??????
                        </td>
                        <td>
                        {persons[order]&&persons[order].name}
                        </td>
                        <td>
                        {persons[order]&&persons[order].teamName}
                        </td>
                        <td>
                        <Button onClick={startInterval} type="primary" size="small">??????</Button>
                        <Button onClick={stopInterval} danger size="small">??????</Button>
                        </td>
                    </tr>
                </tbody>
            </table>
            
        </div>
        <div className="controlBox">
            <div className="leftbutton">
                <Button onClick={up}>
                    <FormattedMessage id="???????????????"></FormattedMessage>
                </Button>
            </div>
            <div className="center">
                <div className="upcontent">
                    <div className="text">
                       ??????
                    </div>
                    <Input disabled className="input" value={persons[order]&&persons[order].playerNameA} />
                </div>
                <div className="downcontent">
                    <div className="text">
                        ??????
                    </div>
                    <Input disabled className="input" value={Moment(timeText).format("mm:ss")} />
                </div>
            </div>
            <div className="rightbutton">
                <Button onClick={next}>
                    <FormattedMessage id="???????????????"></FormattedMessage>
                </Button>
            </div>
        </div>
        <div className="controlData">
            <div className="controlRight">
                <div className="D">

                    {arrs.filter(e=>e.startsWith("D")).map(e=>{
                        return <div key={e} className="kuai">
                        <Button type="text">{e}</Button>
                        <div className="fenshu">
                            {persons[order].score.filter(item=>item.key===e)[0]&&persons[order].score.filter(item=>item.key===e)[0].value}
                        </div>
                    </div>
                    })}

                    {persons[order].score.filter(e=>e.category==="diffcult").map(e=>{
                        return <div key={e.key} className="kuai">
                        <Button type="text">{e.key}</Button>
                        <div className="fenshu">
                            {e.value}
                        </div>
                    </div>
                    })}
                    <div className="kuai">
                        <Button type="text">?????????</Button>
                        <div className="fenshu">
                            
                        </div>
                    </div>
                </div>
                <div className="E">


                    <div className="kuai">
                        <Button type="text">?????????</Button>
                        <div className="fenshu">
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="Z">
                ?????????<div className="fenshu"> </div> <Button type="primary">????????????</Button>
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
       
    }
}

// export default Control;

export default connect(mapstatetoprops, mapdispatchtoprops)(Control)