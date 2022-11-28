import React, { useEffect, useState } from "react";
import { Button, Modal } from 'antd';
import { connect } from "react-redux";
import API from '../utils/api'
import { initPersonsAction } from "../store/actions/updatepersonsaction";
import { initEventInfoAction } from "../store/actions/eventInfoActions"
import { circleAction } from "../store/actions/circleAction";
// import { initPersonsAction } from "../store/actions/updatepersonsaction";
import { roundAction } from "../store/actions/roundAction";
import { initOrderAction } from '../store/actions/initorder';
import { initContainerAction } from '../store/actions/containerActions'

function EventSessionButton( props ) {
    const {initEventInfo,initCircle,highList} = props;
    const [sessions, setSessions]=useState([]);
    useEffect(()=>{
        const eventId=props.id
        loadData(eventId)
    },[])

    const loadData = (eventId)=>{
        API.GetEventSession(eventId).then((data) => {
            // console.log(data);
            setSessions(data);
        });
    }

    const StartEvent = (e)=>{
        let persons = [];

        Modal.confirm({
            title:"注意",
            content:"确定要开始本组比赛吗,开始比赛会重新加载参赛人员信息",
            okText:"确定",
            cancelText:"取消",
            onOk() {
                const eventId = props.id
                //比赛信息
                API.GetEventInfo(eventId).then((data) => {
                    console.log("GetEventInfo",data);
                    initEventInfo(data)
                });

                // 获取运动员信息
                API.GetAthleteList(eventId, e).then((data) => {
                    console.log("GetAthleteList",data)
                    let {athletes} = data
                    console.log(athletes);
                    athletes.forEach((item) => {
                        persons.push({
                            id:item.id,
                            recordId:item.recordId,
                            teamName: item.teamName,
                            name: item.realName,
                            num: item.displayAthleteNumber,
                            athleteNumber: item.athleteNumber,
                            DNS: item.state==='DNS',
                            score:[],
                        })
                    });

                    let normal = [];
                    let dns = [];
                    persons.forEach(e=>{
                        if(e.DNS){
                            dns.push(e)
                        }else{
                            normal.push(e); 
                        }
                    })

                    let dist = normal.concat(dns);

                
                    initCircle()
                    props.initOrder();
                    props.initRound();
                    props.initPerson(dist);
                    props.initContainer(dist);
                    // setTimeout(()=>{
                    //     // window.location.reload()
                    //     props.initPerson(dist);
                    // },0)

                });
              },
              onCancel() {
                console.log('Cancel');
              },
        });

    }

  return (
    <>
     {sessions.map(e=>{
        return <p style={{marginBottom:"0px",marginTop:"5px"}} key={e}><Button  onClick={()=>{StartEvent(e)}} size="small" type="primary">开始第{e}组</Button></p> 
     })}
    </>
  );
}


let mapstatetoprops = ({ Obj, order, round, persons,circle,highList }) => {
    return {
        Obj,
        order,
        round,
        persons,
        circle,
        highList
    }
}

let mapdispatchtoprops = (dispatch) => {
    return {
        initPerson: (payload) => dispatch(initPersonsAction(payload)),
        initContainer: (payload) => dispatch(initContainerAction(payload)),
        initEventInfo:(payload) => dispatch(initEventInfoAction(payload)),
        initRound: () => dispatch(roundAction('initround')),
        initOrder: () => dispatch(initOrderAction()),
        initCircle: () => dispatch(circleAction('initcircle')),
    }
}


// export default EventSessionButton;
export default connect(mapstatetoprops, mapdispatchtoprops)(EventSessionButton)
