import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
// import { AddAction} from '../store/actions/countActions'
// import { useSpring, animated } from 'react-spring'
import { updateSettingAction } from "../store/actions/updateSetting";
import { initHighListAction } from "../store/actions/highListActions";
// import stroe from '../store'
// import storage from 'store';
import { FormattedMessage } from "react-intl";
import { Row, Col, Input, Form, message, Button,Typography } from "antd";
import { wsUrl } from "../config";
import { parse16 } from "../utils/parse16";


import "./device.less";

const {Title}= Typography;


function Device(props) {
  const { highList,initHighList } = props;

  const [list,setList]=useState(highList)
  const [inpt,setIpt] = useState('');

  const add= (v)=>{
      let arr = list.slice(0)
      arr.push(v);
      setList(arr);
  }

  const Save = ()=>{
    console.log(list);
    let dist = list.filter(e=>e!=="")
    setList(dist)
    initHighList(dist)
  }
const onClick =()=>{
  if(inpt==""){
    return alert("请输入数字")
  }
  add(inpt);
  setIpt('');
}

  useEffect(()=>{

  },[])

  const onFinish = (values) => {
    console.log("Received values of form:", values);
  };

  return (
    <div className="devicecheckoutwrap">
      <div className="highlist">
          <ul>
          {highList.map((e,index)=>{
            return <li key={index}>
              <Title level={4}>第<span className="caipan">{index+1}</span>裁判：{e}</Title>
              </li> 
          })}
          </ul>
      </div>
      <div className="devicecheckout">
        <div className="btns">
        <Input style={{width:200}} value={inpt} onInput={e=>setIpt(e.target.value)}/>
        <Button onClick={onClick}>增加</Button>
        <Button onClick={Save}>保存</Button>
        </div>
        <Row>
          <Col span="12">
            <Form
              name="dynamic_form_item"
              // {...formItemLayoutWithOutLabel}
              onFinish={onFinish}
            >
              
               {list.map((e,index)=>{
                return  <Form.Item 
                label={index+1}
                key={index}>
                  <Input onChange={(e)=>{
                    console.log(index,e.target.value);
                    let arr = [...list]
                    arr[index]=e.target.value;
                    setList(arr);
                  }} value={e} ></Input>
                </Form.Item>
               })}
            </Form>
          </Col>
        </Row>
      </div>
      
    </div>
  );
}

let mapstatetoprops = ({ setting, persons,highList }) => {
  return {
    setting,
    persons,
    highList
  };
};

let mapdispatchtoprops = (dispatch) => {
  return {
    updateSetting: (payload) => dispatch(updateSettingAction(payload)),
    change: (e) => dispatch({ type: e }),
    initHighList: (payload)=>dispatch(initHighListAction(payload))
  };
};

// export default Home;

export default connect(mapstatetoprops, mapdispatchtoprops)(Device);
