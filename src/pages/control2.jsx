import React, { useEffect, useState,useRef } from "react";
import { connect } from "react-redux";
import { AddAction } from '../store/actions/countActions'
import { nextOrderAction, upOrderAction} from '../store/actions/nextorder'
import { initOrderAction } from '../store/actions/initorder'
import { roundAction } from "../store/actions/roundAction";
import { circleAction } from "../store/actions/circleAction";
import { updatePersonsAction } from "../store/actions/updatepersonsaction";
import { FormattedMessage } from "react-intl";
import { message, Typography,Select,  Button, Input,Modal,Divider,Form} from 'antd';
import './control.less'
import { initContainerAction } from "../store/actions/containerActions";
import { initOnoffAction } from '../store/actions/onoffAction'
import createWsConnect from '../utils/ws'
import { StringCodec } from "../utils/nats";
import Moment from 'moment';
import { ApiFilled } from "@ant-design/icons";
import API from '../utils/api'
import { setCartesian } from "mathjs/lib/cjs/entry/pureFunctionsAny.generated";

const {Option} = Select;
const arrs = ["D1","D2","D3","D4","E1","E2","E3","E4","E5","E6"]

const sc = StringCodec();

const { Title } = Typography;

function Control(props) {
    const {
        circle,circleAction,highList, eventInfo,order,
         round, persons, nextorder, uporder, initorder, 
         roundAction, updatePerson ,initContainer,
         container,initOnoff,serverIp
        } = props;


    const  ws = useRef();
    const [timeText,setTimeText] = useState(0);
    const timeId = useRef();
    const [person, setPerson] = useState({});
    const [score,setScore] = useState(0);
    const [referee, setReferee] = useState('');
    const [category,setCategory] = useState('');

    const startInterval = ()=>{
        if(timeId.current) return ;
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

    const add = (v)=>{
        setScore((t)=>{
            return (t*10+v*10)/10;
        })
    }

    const abstract = (v)=>{
        setScore((t)=>{
            if(t-v<=0) return 0;
            return (t*10-v*10)/10;
        })
    }

    const updateScore = async()=>{
        const result = await API.UpdateResult({
            ggsiId:person.ggsiId,
            eventId:person.eventId,
            subSportId:person.subSportId,
            playerId:person.id,
            resultId:person.resultId,
            resultInfo:[{
                key:referee,
                value:score,
                playerGameTime:timeText,
                catagory:category
            }]
        },serverIp)

        if(!referee||!category) return  message.error("????????????????????????????????????")

        ws.current.pushCollectData({
            key:referee,
            value:score,
            playerGameTime:timeText,
            category:category
        })

        message.success("????????????")
        
    }

    useEffect(() => {

 
        createWsConnect((socket, sc)=>{
            ws.current = {};
            // console.log('socket is connect successfuly:',socket);
            ws.current.socket = socket;

            ws.current.pushCollectData = (msg)=>{
                socket.publish('collect-data', sc.encode(JSON.stringify(msg)));
            }

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
                console.log("???????????????")
            })

            const t2 = socket.subscribe('end-time');

            printMsgs(t2,(a)=>{
                stopInterval()
                console.log("???????????????");
                message.info("??????????????????,?????????????????????")
            })

        });

        return () => { 
            ws.current.socket&&ws.current.socket.closed(); 
            console.log("??????????????????") 
        }
    }, []);

   

    return <div className="control">
        <div className="title">
            <Title level={3}>
            ??????????????????
            </Title>
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
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{order + 1}</td>
                        <td>
                        {person.subSportName}
                        </td>
                        <td>
                        {person.playerNameA}
                        </td>
                        <td>
                        {person.teamName}
                        </td>
                       
                    </tr>
                </tbody>
            </table>
            
        </div>
        <div className="controlBox">
            <div className="leftbutton">
               
            </div>
            <div className="center">
                <div className="upcontent">
                    <div className="text">
                       ??????
                    </div>
                    <Input disabled className="input" value={person&&person.playerNameA} />
                </div>
                <div className="downcontent">
                    <div className="text">
                        ??????
                    </div>
                    <Input disabled className="input" value={Moment(timeText).format("mm:ss")} />
                </div>
            </div>
            <div className="rightbutton">
                
            </div>
        </div>
        <div className="controlData">
            <Button>???????????????</Button>
            <Select style={{width:100}} value={referee} onChange={(e)=>{
                setReferee(e);
            }}>
                {arrs.map(e=>{
                return <Option key={e} value={e}>{e}</Option>
                })}
            </Select>
            <Divider type="vertical" ></Divider>
            <Button>????????????:</Button>
            <Select style={{width:100}} value={category} onChange={(e)=>{
                setCategory(e);
            }}>
                <Option key={1} value="diffcult"> ?????????</Option>
                <Option key={2} value="execution"> ?????????</Option>
            </Select>
        </div>
        <div className="Z">
                
                <Button type="primary" onClick={()=>{add(10)}}>+10</Button><Divider type="vertical"></Divider>
                <Button type="primary" onClick={()=>{add(1)}}>+1</Button><Divider type="vertical"></Divider>
                <Button type="primary" onClick={()=>{add(0.1)}}>+0.1</Button><Divider type="vertical"></Divider>
                <div style={{width:"100px"}} className="fenshu">{score}</div> 
                <Divider type="vertical"></Divider>
                <Button danger onClick={()=>abstract(10)} type="primary">-10</Button><Divider type="vertical"></Divider>
                <Button danger onClick={()=>abstract(1)} type="primary">-1</Button><Divider type="vertical"></Divider>
                <Button danger onClick={()=>abstract(0.1)} type="primary">-0.1</Button><Divider type="vertical"></Divider>
                <Button onClick={updateScore}  type="primary">????????????</Button>
                
        </div>
    </div>
}

let mapstatetoprops = ({ serverIp,Obj, order, round, persons, setting,eventInfo,highList,circle,container }) => {
    return {
        serverIp,
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