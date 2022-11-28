import React, { useEffect, useState}from "react";
import { connect } from "react-redux";
import { AddAction } from '../store/actions/countActions'
import { nextOrderAction } from '../store/actions/nextorder'
import { initOrderAction } from '../store/actions/initorder'
import { roundAction } from "../store/actions/roundAction";
import { updatePersonsAction } from "../store/actions/updatepersonsaction";
import { FormattedMessage } from "react-intl";
import { message,Typography, Table, Radio, Button, Input, Row,Col} from 'antd';
import { playError } from "../utils/play";
import storage from "store";
import './control.less'
import stroe from '../store'
import { wsUrl } from "../config";
import { throwCalculate, getBit, jumpCalculateA, jumpCalculateB } from '../utils/calculate'
import { parse16 } from '../utils/parse16'

const { Title } = Typography;


function Control(props) {
    const { order, round, persons, nextorder, initorder, roundAction, updatePerson, setting} = props;
    const { category, name, radius: CD, site, HD: AC, HD1, HD2, HR } = setting;
    const [excatValue, setExcatValue] = useState(0)
    const [standardValue, setStandardValue] = useState(0);

    var ws;
    useEffect(()=>{
        
        ws = new WebSocket(wsUrl);
        // Web Socket 已连接上，使用 send() 方法发送数据
        ws.onopen = function () {
            console.log("链接ok")
            // 这里用一个延时器模拟事件
            // ws.send(params);
        }
        // 这里接受服务器端发过来的消息
        ws.onmessage = function (e) {
            
            let obj = parse16(JSON.parse(e.data));

            if (category == 'throw') {
                message.success('throw');
                let { HR, HD: AB } = obj;
                let result = throwCalculate({ AB, AC, HR, CD })
                console.log(result);
                setExcatValue(getBit(result, 3))
                setStandardValue(getBit(result))

            } else if (category == "jump") {
                message.success(site);
                if (site == 'a') {
                    message.success('a');
                    // export function jumpCalculateA({AE,AF,EAF,AB,BAF}) 
                    let { HR: BAF, HD: AB } = obj;
                    let result = jumpCalculateA({ AE: HD1, AF: HD2, EAF: HR, AB, BAF });
                    console.log(result);
                    setExcatValue(getBit(result, 3))
                    setStandardValue(getBit(result))
                } else if (site == 'b') {
                    message.success('b');
                    // jumpCalculateB({ AE, AF, EAF, AB, BAF })
                    let { HR: BAF, HD: AB } = obj;
                    let result = jumpCalculateB({ AE: HD1, AF: HD2, EAF: HR, AB, BAF });
                    console.log(result);
                    setExcatValue(getBit(result, 3))
                    setStandardValue(getBit(result))
                }
            }

            // let score = Number(result).toFixed(2);

            // let order = stroe.getState().order
            // let round = stroe.getState().round
            // persons[order].score[round] = score;
            // updatePerson({ index: order, data: persons[order] });
            
        }
        ws.onerror = function (code, reason) {
            console.log("Connection error");
            message.warning("出错了请重新连接")
        }

        return () => { ws.close();console.log("退出赛事管理")}
    },[]);

    useEffect(()=>{
        console.log("切换");
        let score = persons[order].score[round]||0;
        console.log(score)
        setExcatValue(score, true)
        setStandardValue(score, true)
    }, [order])

    function next() {
        let l = persons.length;
        
        if (order + 1 == l) {
            alert("是否开始新的一轮");
            roundAction('nextround');
            return initorder() 
        }
        nextorder()
    }

    function Error(){
        console.log(persons[order-1].score[round-1])
        playError()
       
    }

    return <div className="control">
        <div className="title">
            <Title level={3}>
                铅球
            <FormattedMessage id="比赛"></FormattedMessage>
            </Title>
        </div>
        <div className="table">
            <table className="imagetable">
                <thead>
                    <tr>
                        <td>
                            <FormattedMessage id="序号"></FormattedMessage>
                        </td>
                        {/* <td>
                            <FormattedMessage id="场次"></FormattedMessage>
                        </td> */}
                        <td>
                            <FormattedMessage id="轮次"></FormattedMessage>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{order+1}</td>
                        {/* <td>2</td> */}
                        <td>{round}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div className="controlBox">
            <div className="leftbutton">
                <Button>
                    <FormattedMessage id="上一位选手"></FormattedMessage>
                </Button>
            </div>
            <div className="center">
                <div className="upcontent">
                    <div className="text">
                        <FormattedMessage id="姓名"></FormattedMessage>
                    </div>
                    <Input className="input" value={persons[order].name} />
                </div>
                <div className="downcontent">
                    <div className="text">
                        <FormattedMessage id="编号"></FormattedMessage>
                    </div>
                    <Input className="input" value={persons[order].num}/>
                </div>
            </div>
            <div className="rightbutton">
                <Button onClick={next}>
                    <FormattedMessage id="下一位选手"></FormattedMessage>
                </Button>
            </div>
        </div>
        <div className="controlData">
            <div className="controlLeft">
                <div className="controlLeftup">
                    <div className="controlLeftuptext smalltext"><FormattedMessage id="测量精确值"></FormattedMessage>(<FormattedMessage id="米"></FormattedMessage>)</div>
                    <Input className="small" value={excatValue}/>
                </div>
                <div className="controlLeftup">
                    <div className="controlLeftuptext"><FormattedMessage id="比赛成绩"></FormattedMessage>(<FormattedMessage id="米"></FormattedMessage>)</div>
                    <Input className="input" value={standardValue}/>
                </div>
            </div>
            <div className="controlRight">
                <Button onClick={() => { Error() }}><FormattedMessage id="成绩无效"></FormattedMessage></Button>
                <Button onClick={next}>
                    <FormattedMessage id="下一位选手"></FormattedMessage>
                </Button>
            </div>
        </div>
    </div>
}

let mapstatetoprops = ({ Obj, order, round, persons, setting}) => {
    return {
        Obj,
        order,
        round,
        persons,
        setting
    }
}

let mapdispatchtoprops = (dispatch) => {
    return {
        add: () => dispatch(AddAction()),
        nextorder:()=>dispatch(nextOrderAction()),
        initorder: () => dispatch(initOrderAction()),
        roundAction: (type) => dispatch(roundAction(type)),
        updatePerson: (payload) => dispatch(updatePersonsAction(payload))
    }
}

// export default Control;

export default connect(mapstatetoprops, mapdispatchtoprops)(Control)