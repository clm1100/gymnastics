import React, { useEffect, useState } from "react";
import {  Table, Input,Button,Divider,message,Select} from 'antd';
import { connect } from "react-redux";
import { updatePersonsAction,initPersonsAction } from "../store/actions/updatepersonsaction";
import { initServerIpAction } from "../store/actions/serverIpActions"
import API from '../utils/api'

const { Search } = Input;
const { Column } = Table;
const { Option } = Select;
const categorys ={
  TEAM_SCORE_COMPARE:'团体',ALMIGHTY_SCORE_COMPARE:'个人全能',SCORE_COMPARE:'单项'
}


function RaceList(props) {
  const {serverIp, initServerIp,eventInfo,initPerson} = props
  const [list,setList] = useState([]);
  const [loading,setLoading] = useState(false);
  const [chang,setChang] = useState("1");
  const  [stemp,setStemp] = useState('0');
  const  [changlist,setChanglist] = useState([{sessionName:"第一阶段",serial:1},{sessionName:"第二阶段",serial:2}])


  useEffect(()=>{
    
   
  },[])

  const getData = async (index,serverIp)=>{
   
   await  API.GetChangList(index,serverIp).then(res=>{
      console.log(res.data);
      let list =res.data
      setList(list);
      if(res.data.length==0){
       return message.success("本阶段无数据,请重新选择阶段")
      }
      message.success("数据请求成功")
    })
  }


  const onSelect = (v)=>{
    console.log(v);
    setChang(v);
  }

  const getPersons = async (v)=>{
    const data = await API.GetAthleteList(v)
    // console.log(data);
    let persons = data.data;
    console.log(persons);
    initPerson(persons)

  }

  const onSearch=async (value)=>{
    console.log(value);
    initServerIp(value)
    setLoading(true)
    await getData(1,value);
    setLoading(false)
  }

  return (
    <div>
      <Button size="large">当前比赛：{eventInfo.displayName?eventInfo.displayName:"请选择比赛"}</Button>
      <Divider type="vertical" />
      <Search
      loading={loading}
      addonBefore="http://"
      placeholder="请填写服务器地址"
      enterButton="获取赛事数据"
      size="large"
      style={{ width: 400 }}
      // suffix={suffix}
      defaultValue={serverIp}
      onSearch={onSearch}
    /> 
    
      <Table loading={loading} size="small" dataSource={list} rowKey={record => record.id} >
        <Column title="序号" dataIndex="id" render={(a,b,c)=>{
          return c+1
        }} />
        <Column title="参赛组" dataIndex="displayName" />
        <Column title="时间" dataIndex="planStartTime" />
        <Column title="category" dataIndex="category" 
         render={(e)=>{
          return categorys[e];
         }}
        />
        <Column title="状态" dataIndex="state" />
        {/* <Column title="项目"  render={(record)=>{
            if(!record.subSportId) return `项目：${record.ggsiSportName}`
            return <>
            项目：<Select style={{ width: 100 }} label="项目"  size="large" defaultValue="平衡木">
              {record.subSportId.map(item=>{
                return  <Option key={item.subSportId} value={item.subSportId}>{item.subSportName}</Option>
              })}
             
            </Select>
            </>
        }} /> */}
        <Column title="操作" render={(record)=>{

          return <>
          <Button size="small" onClick={()=>{getPersons(record.id)}}>开始比赛</Button>
          </>
        }}/>
      </Table>
    </div>
  );
}

let mapstatetoprops = ({  persons,serverIp,eventInfo }) => {

  return {
      persons,
      serverIp,
      eventInfo
  }
}

let mapdispatchtoprops = (dispatch) => {
  return {
      updatePerson: (payload) => dispatch(updatePersonsAction(payload)),
      initPerson: (payload) => dispatch(initPersonsAction(payload)),
      initServerIp:(payload) => dispatch(initServerIpAction(payload)),
  }
}

// export default Control;

export default connect(mapstatetoprops, mapdispatchtoprops)(RaceList)