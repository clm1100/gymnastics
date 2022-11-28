import React, { useState, useEffect } from 'react';
import { Typography, Table, Radio, Button } from 'antd';
import { PlayCircleTwoTone, StopTwoTone } from '@ant-design/icons'
import { connect } from "react-redux";
import { useSpring, animated } from 'react-spring'
import { FormattedMessage } from "react-intl";
const { Column } = Table;
const { Title } = Typography;


function LeftContent(props) {


    const { persons: data, order, round, i18 } = props;

    let [selectedRowKeys, setselectedRowKeys] = useState([order + 1 + ""])

    useEffect(() => {
        console.log("00000", i18)
        setselectedRowKeys([order + 1 + ""])
    }, [order])

    const rowSelection = {
        columnTitle: i18 == "zh" ? "序号" : "Order",
        hideSelectAll: true,
        type: "radio",
        onChange: (selectedRowKeys, selectedRows) => {
            setselectedRowKeys(selectedRowKeys);
        },
        selectedRowKeys: selectedRowKeys,
        renderCell: (checked, record, index) => {

            return <span>{index + 1}</span>
            // if (record.key == selectedRowKeys[0]){
            //     return <PlayCircleTwoTone twoToneColor="#eb2f96"/>
            // }else{
            //     return <StopTwoTone twoToneColor="#52c41a" />
            // }
        }
    };

    return <div className="left">
        <div className="container">
            <Title level={4}>
                <FormattedMessage id="参赛人员信息"></FormattedMessage>
                -{order + 1}-{round}
            </Title>
            <div className="info">
                <Table
                    onRow={
                        (record, index) => {
                            return {
                                onClick: event => {
                                    console.log(record)
                                    setselectedRowKeys([record.key]);

                                }
                            }
                        }
                    }
                    bordered={true}
                    pagination={false}
                    rowSelection={rowSelection}
                    dataSource={data}
                    size="small"
                >
                    {/* <Column 
                            align="center"
                        title="编号" dataIndex="name" render={(a, b, c) =>{
                            return <span>{c+1}</span>
                        }}/> */}

                    <Column align="center" title={i18 == "zh" ? "姓名" : "Name"} dataIndex="name" key="name" />
                    <Column align="center" title={i18 == "zh" ? "编号" : "Number"} dataIndex="num" key="num" />
                    <Column align="center" title={i18 == "zh" ? "成绩" : "Achievement"} dataIndex="score" key="score" render={(e, i, o) => {

                        return <span>{e[round]}</span>
                    }} />

                </Table>
            </div>
        </div>
    </div>
}




let mapstatetoprops = ({ setting, throwSetting, jumpSetting, persons, order, round, i18 }) => {
    return {
        setting,
        throwSetting,
        jumpSetting,
        persons,
        order,
        round,
        i18
    }
}

let mapdispatchtoprops = (dispatch) => {
    return {
    }
}

export default connect(mapstatetoprops, mapdispatchtoprops)(LeftContent)
// export default LeftContent;