import './setting.less';
import React, {useState,useEffect} from "react";
import { connect } from "react-redux";
import { updateSettingAction } from "../store/actions/updateSetting";
// import { useSpring, animated } from 'react-spring'
import { FormattedMessage } from 'react-intl'
import { Typography, Button, Form, Input, Select, Radio, Row, Col,  Modal, message} from 'antd';
import { throws, jumps, categoryobj, categorysobj, objectnameobj} from '../config/index'
// import { SignalCellularNullSharp } from '@material-ui/icons';
import { playButton} from '../utils/play'
import { parse16 } from '../utils/parse16'
import { wsUrl } from "../config";
const { Title } = Typography;
const { Option } = Select;
const { Group} = Radio;
const {Item} = Form


function SettingComponent(props) {

  var ws;

  const { setting, updateSetting, throwSetting, jumpSetting,i18} = props;
  let { HD: HDvalue, HD1: HDvalue1, HD2: HDvalue2, HR: HRvalue, Screenurl}= setting
 
  const [isedit,setIsedit] = useState(false);
  const [currentInput,setCurrentInput] = useState(null);
  const [HD, setHD] = useState(HDvalue);
  const [HD1, setHD1] = useState(HDvalue1);
  const [HD2, setHD2] = useState(HDvalue2);
  const [HR, setHR] = useState(HRvalue);
  // const [Screenurl, setScreenurl] = useState(Screenurl);
 
  const [formState, setState] = useState({
    ...setting
  });

  const modifyInfo = (callback) => {
    playButton()
    Modal.confirm({
      title: '您确定要更新赛事项目信息码？',
      content: '修改后的信息会覆盖旧的信息！',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        playButton()
        callback && callback(true);
      },
      onCancel: () => {
        playButton()
        //this.onCancel()
      },
    });

  }

  useEffect(()=>{
    console.log("更新")
  }, [formState.category])

  useEffect(() => {
    // ws = new WebSocket('ws://localhost:8080/ws');

    ws = new WebSocket(wsUrl);
    ws.onopen = function () {
      message.success('链接成功');
    }
    // 这里接受服务器端发过来的消息
    ws.onmessage = function (e) {
      console.log(e)

      let data = JSON.parse(e.data);
      if(data.route !== "track-and-field-hardware") return ;
      let obj = parse16(JSON.parse(e.data));
      

      console.log(obj);
      if (currentInput=="HD"){
        setHD(obj.HD);
      }

      if (currentInput == "HD1") {
        console.log("999999999999922299")
        setHD1(obj.HD);
      }

      if (currentInput == "HD2") {
        console.log("9999999999")
        setHD2(obj.HD);
      }
      
      
      setHR(obj.HR);
    }
    ws.onerror = function (code, reason) {
      message.warning("出错了请重新连接")
    }

    return () => { ws.close(); console.log("退出赛事管理") }
  }, [currentInput]);




  const onnameChange = (value)=>{
    playButton()
   let dist =  throws.filter(e=>e.value==value)[0];
   console.log(dist);

    setState({
      ...formState,
      "name": value,
      "radius": dist.radius
    })
  }

  const onCategoryChange = (v)=>{
    playButton()
    setState({
      ...formState,
      category: v,
      name:null
    })
  }

  const onBigScreenChange = (v) => {
    playButton()
    console.log(v.target.value);
    setState({
      ...formState,
      bigscreen: v.target.value,
      name: null
    })
  }

  const updateField = e => {
    playButton()
    setState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const updateSelected = (v,n) => {
    playButton()
    setState({
      ...formState,
      [n]: v
    });
  };
  const save = ()=>{
    playButton()
    console.log("formState:", formState);
    formState.HR = HR
    formState.HD = HD
    formState.HD1 = HD1
    formState.HD2 = HD2
    updateSetting(formState)
  }


  let jumpLayout = ()=><>
    <Row type='flex' align='middle' >
      <Col span={9}>
        <div className="requiredLabel" style={{ textAlign: 'right', height: '40px', lineHeight: '40px' }}>
        {/* 项目分类  */}
          <FormattedMessage id="项目名称"></FormattedMessage>
        ：</div>
      </Col>
      <Col span={8} offset={1}>
        <Select
          placeholder="please choice"
          value={formState.name}
          onChange={(v) => { updateSelected(v,'name')}}
          style={{ width: '200px' }}>
          {jumps.map(e => <Option key={e.label} value={e.value}>{e.label}</Option>)}
        </Select>
      </Col>
    </Row>


    <Row type='flex' align='middle'>
      <Col span={9}>
        <div className="requiredLabel" style={{ textAlign: 'right', height: '40px', lineHeight: '40px' }}>
        
          {/* 仪器安装位置 */}
        <FormattedMessage id="仪器安装位置"></FormattedMessage>：
        </div>
      </Col>
      <Col span={13} offset={1}>
        <Group name="site" onChange={updateField} value={formState.site}>
          <Radio value="a">
          {/* 起跳点前,靠近沙坑 */}
            <FormattedMessage id="起跳点前,靠近沙坑"></FormattedMessage>
          </Radio>
          <Radio value="b">
            {/* 起跳点后,远离沙坑 */}
            <FormattedMessage id="起跳点后,远离沙坑"></FormattedMessage>
          </Radio>
        </Group>
      </Col>
    </Row>

    <Row type='flex' align='middle'>
      <Col span={9}>
        <div className="requiredLabel" style={{ textAlign: 'right', height: '40px', lineHeight: '40px' }}>
          {/* 基准点1(远离全站仪安置点) */}
          <FormattedMessage id="基准点1(靠近全站仪安置点)"></FormattedMessage>
        ：</div>
      </Col>
      <Col span={8} offset={1}>
        <Input
          value={HD1}
          name="HD1"
          onChange={updateField} 
          onFocus={(e) => { setCurrentInput('HD1'); console.log("HD1") }}
          />
      </Col>
      <Col span={1} offset={0}>
        <div style={{ textAlign: 'right', height: '40px', lineHeight: '40px' }}>
          <FormattedMessage id="米"></FormattedMessage>
        </div>
      </Col>
    </Row>


    <Row type='flex' align='middle'>
      <Col span={9}>
        <div className="requiredLabel" style={{ textAlign: 'right', height: '40px', lineHeight: '40px' }}>
          {/* 基准点2(远离全站仪安置点) */}
          <FormattedMessage id="基准点2(远离全站仪安置点)"></FormattedMessage>
        ：</div>
      </Col>
      <Col span={8} offset={1}>
        <Input
          value={HD2}
          name="HD2"
          onChange={updateField} 
          onFocus={(e) => { setCurrentInput('HD2'); console.log("HD2") }}
          />
      </Col>
      <Col span={1} offset={0}>
        <div style={{ textAlign: 'right', height: '40px', lineHeight: '40px' }}>
          <FormattedMessage id="米"></FormattedMessage>
        </div>
      </Col>
    </Row>
  </>

  let throwLayout = () => <>
    <Row type='flex' align='middle' >
      <Col span={9}>
        <div className="requiredLabel" style={{ textAlign: 'right', height: '40px', lineHeight: '40px' }}>
        {/* 项目分类 */}
          <FormattedMessage id="项目名称"></FormattedMessage>
        ：</div>
      </Col>
      <Col span={8} offset={1}>
        <Select 
          placeholder="please choice" 
          value={formState.name} 
          onChange={onnameChange}
          style={{ width: '200px' }}>
          {i18 == "zh" ? throws.map(e => <Option key={e.label} value={e.value}>{e.label}</Option>) : throws.map(e => <Option key={e.label} value={e.value}>{e.value}</Option>)}
        </Select>
      </Col>
    </Row>

    <Row type='flex' align='middle' >
      <Col span={9}>
        <div className="requiredLabel" style={{ textAlign: 'right', height: '40px', lineHeight: '40px' }}>
          
          <FormattedMessage id="投掷半径"></FormattedMessage>：
        </div>
      </Col>
      <Col span={8} offset={1}>
        <Select
          placeholder="请选择"
          value={formState.radius}
          disabled
          style={{ width: '200px' }}>
          {throws.map(e => <Option key={e.label} value={e.value}>{e.radius}</Option>)}
        </Select>
      </Col>
      <Col span={1} offset={0}>
        <div style={{ textAlign: 'right', height: '40px', lineHeight: '40px' }}>
          <FormattedMessage id="米"></FormattedMessage>
        </div>
      </Col>
    </Row>
    <Row type='flex' align='middle'>
      <Col span={9}>
        <div className="requiredLabel" style={{ textAlign: 'right', height: '40px', lineHeight: '40px' }}>
          <FormattedMessage id="基准点平距(HD)"></FormattedMessage>
        ：
        </div>
      </Col>
      <Col span={8} offset={1}>
        <Input 
          value={HD}
          name="HD"
          onFocus={(e) => {  setCurrentInput('HD');console.log("HD")}}
        />
      </Col>
      <Col span={1} offset={0}>
        <div style={{ textAlign: 'right', height: '40px', lineHeight: '40px' }}>
          <FormattedMessage id="米"></FormattedMessage>
        </div>
      </Col>
    </Row>
  </>


  return <div className="setting">
    <Title className="title" level={4}>
      {/* 赛事项目设置 */}
      {/* <h1>{i18}</h1> */}
    <FormattedMessage id="赛事项目设置"></FormattedMessage>
    </Title>
    <Title className="参赛人员信息" level={4}>
      {/* 裁判设置 */}
     <FormattedMessage id="裁判设置"></FormattedMessage>
    </Title>
    <div className="settingInfo">

    {/* --------start------- */}
      <Row type='flex' align='middle'>
        <Col span={9}>
          <div className="requiredLabel" style={{ textAlign: 'right', height: '40px', lineHeight: '40px' }}>
            {/* 大屏地址 */}
            <FormattedMessage id="大屏地址"></FormattedMessage>：
          </div>
        </Col>
        <Col span={8} offset={1}>
          {/* <Select
            placeholder="请选择"
            name="category"
            value={formState.category}
            onChange={onCategoryChange}
            style={{ width: '250px' }}>
            <Option value="throw">

              <FormattedMessage id="投掷项目"></FormattedMessage>
            </Option>
            <Option value="jump">
              <FormattedMessage id="跳跃项目"></FormattedMessage>
            </Option>

          </Select> */}

          <Input
            style={{ width: '250px' }}
            value={formState.bigscreen}
            name="bigscreen"
            onChange={onBigScreenChange}
          />
        </Col>
      </Row>
    {/* --------end---------- */}

      <Row type='flex' align='middle'>
        <Col span={9}>
          <div className="requiredLabel" style={{ textAlign: 'right', height: '40px', lineHeight: '40px' }}>
            {/* 项目分类 */}
          <FormattedMessage id="项目分类"></FormattedMessage>：
          </div>
        </Col>
        <Col span={8} offset={1}>
          <Select 
            placeholder="请选择"
            name="category" 
            value={formState.category} 
            onChange={onCategoryChange } 
            style={{ width: '200px' }}>
            <Option value="throw">
              
              <FormattedMessage id="投掷项目"></FormattedMessage>
            </Option>
            <Option value="jump">
              <FormattedMessage id="跳跃项目"></FormattedMessage>
            </Option>
            
          </Select>
        </Col>
      </Row>
      {
        formState.category == "throw" ? throwLayout() : formState.category == "jump" ? jumpLayout() :null
      }
      <Row type='flex' align='middle'>

        <Col span={6} offset={10}>
          {isedit ? <Button type="primary" onClick={() => { modifyInfo(setIsedit) }}>
            
            <FormattedMessage id="编辑"></FormattedMessage>
          </Button> : <Button onClick={save} type="primary">
              
              <FormattedMessage id="保存"></FormattedMessage>
          </Button> }
        </Col>
      </Row>
    </div>
  </div>
}






let mapstatetoprops = ({ setting, throwSetting, jumpSetting, i18 }) => {
  console.log(setting);
    return {
      setting,
      throwSetting,
      jumpSetting,
      i18
    }
}

let mapdispatchtoprops = (dispatch)=>{
    return {
      updateSetting: (payload) => dispatch(updateSettingAction(payload)),
      change:(e)=>dispatch({type:e})
    }
}

export default connect(mapstatetoprops, mapdispatchtoprops)(SettingComponent)