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
import { pushAllScore } from '../store/actions/allScoreAction'
import { playError } from "../utils/play";
import './control.less'
import { wsUrl } from "../config";
import { initContainerAction } from "../store/actions/containerActions";
import { initOnoffAction } from '../store/actions/onoffAction'
import createWsConnect from '../utils/ws'
import { StringCodec } from "../utils/nats";
import Moment from 'moment';
import API from '../utils/api'

const arrs = ["D1","D2","D3","D4","E1","E2","E3","E4","E5","E6"]

const sc = StringCodec();

const { Title } = Typography;

function Control(props) {
    const {
        circle,circleAction,highList, eventInfo,order,
         round, persons, nextorder, uporder, initorder, 
         roundAction, updatePerson ,initContainer,
         container,initOnoff,pushAllScore,allscore=[]
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




              const collectData = socket.subscribe('collect-data');

              printMsgs(collectData,(a)=>{
                const obj = JSON.parse(a);
                console.log(obj);
                pushAllScore(obj);
            })


        });

        return () => { 

            ws.current.socket&&ws.current.socket.closed(); 
            console.log("?????????????????????") 
        }
    }, []);

    useEffect(()=>{
        if(ws.current&&ws.current.socket.protocol.connected===true){
            console.log(order,persons[order].teamName)
            ws.current.sendPlayerInfo({
                playerNameA:persons[order].playerNameA,
                gameGroupSportItemName:persons[order].gameGroupSportItemName?persons[order].gameGroupSportItemName:"??????",
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

    useEffect(()=>{
        console.log("init");
        setTimeout(()=>{
            if(ws.current&&ws.current.socket.protocol.connected===true){
                console.log(order,persons[order].teamName)
                ws.current.sendPlayerInfo({
                    playerNameA:persons[order].playerNameA,
                    gameGroupSportItemName:persons[order].gameGroupSportItemName?persons[order].gameGroupSportItemName:"??????",
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
        },1000)
        
    },[])


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

    function SyncData(){
        message.loading("????????????");
        ws.current.sendPlayerInfo({
            playerNameA:persons[order].playerNameA,
            gameGroupSportItemName:persons[order].gameGroupSportItemName?persons[order].gameGroupSportItemName:"??????",
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

    // function confirmScore(){
    //     message.loading("????????????");
    // }

    const confirmScore = async()=>{
        console.log("allscore",allscore)
        console.log(persons[order]);
        const result = await API.UpdateResult({
            ggsiId:persons[order].ggsiId,
            eventId:persons[order].eventId,
            subSportId:persons[order].subSportId,
            playerId:persons[order].playerA,
            resultId:persons[order].id,
            resultInfo:allscore
        })

        console.log(result)

        // if(!referee||!category) return  message.error("????????????????????????????????????")

        // ws.current.pushCollectData({
        //     key:referee,
        //     value:score,
        //     playerGameTime:timeText,
        //     category:category
        // })

        message.success("????????????")
        
    }




    return <div className="control">
        <div className="title">
            <Title level={3}>
            {/* {eventInfo.displayName?eventInfo.displayName+"-???"+eventInfo.sessionsCount+"???":'?????????'} */}
            ??????????????????
            </Title>
            {/* <div><Button onClick={show} size="small">????????????</Button>
            <Button danger onClick={hide} size="small">????????????</Button></div> */}
            <div>
                <Button onClick={SyncData} size="small">????????????</Button>
            </div>
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
                         {persons[order]&&persons[order].subSportName}
                        </td>
                        <td>
                        {persons[order]&&persons[order].playerNameA}
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
                <div style={{height:'100px',boxSizing:'border-box'}} className="D">

                    {/* {arrs.filter(e=>e.startsWith("D")).map(e=>{
                        return <div key={e} className="kuai">
                        <Button type="text">{e}</Button>
                        <div className="fenshu">
                            {persons[order].score.filter(item=>item.key===e)[0]&&persons[order].score.filter(item=>item.key===e)[0].value}
                        </div>
                    </div>
                    })} */}

                    {allscore.filter(e=>e.category==="diffcult").map(e=>{
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
                {allscore.filter(e=>e.category==="execution").map(e=>{
                        return <div key={e.key} className="kuai">
                        <Button type="text">{e.key}</Button>
                        <div className="fenshu">
                            {e.value}
                        </div>
                    </div>
                    })}
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
                        <Button type="text">?????????</Button>
                        <div className="fenshu">
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="Z">
                {/* ?????????<div style={{width:50}} className="fenshu"> </div>  */}
                <Button onClick={confirmScore} type="primary">????????????</Button>
        </div>
    </div>
}

let mapstatetoprops = ({ Obj, order, round, persons, setting,eventInfo,highList,circle,container,allscore }) => {
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
        allscore,
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
        initOnoff: (payload) => dispatch(initOnoffAction(payload)),
        pushAllScore: (payload) => dispatch(pushAllScore(payload))
    }
}

// export default Control;

export default connect(mapstatetoprops, mapdispatchtoprops)(Control)