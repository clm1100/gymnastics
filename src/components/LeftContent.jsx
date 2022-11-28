import React, {useState,useEffect}from 'react';
import { Typography, Table,Button,Divider} from 'antd';
// import { PlayCircleTwoTone, StopTwoTone} from '@ant-design/icons'
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import './LeftContent.less';
const { Column} = Table;
const { Title } = Typography;

function LeftContent(props){


    const { persons:data,order,i18} = props;

    let [selectedRowKeys, setselectedRowKeys] = useState([order + 1])

    useEffect(()=>{
        setselectedRowKeys([data[order]&&data[order].id])
    },[order,data])

    const rowSelection = {
        columnTitle: i18 === "zh" ? "序号" :"Order",
        columnWidth:50,
        hideSelectAll:true,
        type: "checkbox",
        onChange: (selectedRowKeys, selectedRows) => {
            console.log("bianhuale ")
        },
        selectedRowKeys: selectedRowKeys,
        renderCell: (checked, record,index)=>{
            return <span>{index+1}</span>
        }
    };

    return <div className="left">
        <div className="container">
            <Title level={5}>
                <FormattedMessage id="参赛人员信息"></FormattedMessage>
                <Divider type="vertical" />
                {/* 第{circle + 1}轮-第{order + 1}位 */}
                order:{order+1}
               
            </Title>
            
            <div className="info">
                    <Table
                        scroll={data.length>=12?{y:420}:null}
                        locale={
                           {
                            emptyText:"比赛完成"
                           }
                        }
                        rowKey={e=>{return e.id}}
                        bordered={true}
                        pagination={false}
                        rowSelection={rowSelection}
                        dataSource={data}
                        size="small"
                    >
                    <Column style={{width:'128px'}} align="center" title={i18 === "zh" ? "姓名" : "Name"} dataIndex="playerNameA" key="playerNameA"  render={(value,record,index)=>{
                        return <>{value}{record.DNS?<span style={{color:"#f45"}}>(DNS)</span>:""}</>
                    }}/>
                    <Column style={{width:'167px'}} align="center" title={i18 === "zh" ? "编号" : "Number"}  dataIndex="id" key="id" />
                    </Table>
        </div>
        </div>
    </div>
}




let mapstatetoprops = ({ highList,setting, throwSetting, jumpSetting,persons,order,round,i18,circle,container }) => {
    return {
        setting,
        throwSetting,
        jumpSetting,
        persons,
        order,
        round,
        i18,
        highList,
        circle,
        container
    }
}

let mapdispatchtoprops = (dispatch) => {
    return {
    }
}

export default connect(mapstatetoprops, mapdispatchtoprops)(LeftContent)
// export default LeftContent;