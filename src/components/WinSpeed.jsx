import React, { useEffect, useState,useRef } from "react";
import { connect } from "react-redux";
import { message, Typography,  Button, Input,Modal,Divider,Form  } from 'antd';
import { updatePersonsAction } from "../store/actions/updatepersonsaction";
function WinSpeed(props) {

    const { eventInfo,order, round, persons, nextorder, uporder, initorder, roundAction, updatePerson, setting } = props;

    const [windspeed,setWindspeed] = useState("");

    const onInput = (e)=>{
        // console.log(e.target.value)
        persons[order].windspeed[round] = e.target.value
        // console.log(persons[order].windspeed[round])
        setWindspeed(e.target.value)

        updatePerson({ index: order, data: persons[order] });

    }

    useEffect(()=>{
        console.log("999999999")
        setWindspeed("")
    },[order,round])

  return (
    <div className="windspeed">
                <Form.Item
                    label="风速"
                    >
                        {/* {order} -{round}-{persons[order].windspeed[round]} */}
                 <Input
                 style={{width:'200px'}}
                 onInput={onInput} 
                 value={windspeed}
                //  defaultValue={order} 
                //  defaultValue=
                 />
                </Form.Item>
            </div>
  );
}



let mapstatetoprops = ({ Obj, order, round, persons, setting,eventInfo }) => {
    console.log("seting:",setting)
    return {
        Obj,
        // order,
        // round,
        persons,
        setting,
        eventInfo
    }
}

let mapdispatchtoprops = (dispatch) => {
    return {
        // add: () => dispatch(AddAction()),
        // nextorder: () => dispatch(nextOrderAction()),
        // uporder: () => dispatch(upOrderAction()),
        // initorder: () => dispatch(initOrderAction()),
        // roundAction: (type) => dispatch(roundAction(type)),
        updatePerson: (payload) => dispatch(updatePersonsAction(payload))
    }
}

// export default Control;

export default connect(mapstatetoprops, mapdispatchtoprops)(WinSpeed)
