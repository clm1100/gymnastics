import React, { useState, useRef } from "react";
import { connect } from "react-redux";
// import ReactToPrint from 'react-to-print';
import print from "print-js";

import { Input, Button, Table, message, Modal } from "antd";
import { FormattedMessage } from "react-intl";
import {
  SortPersonsAction,
  updatePersonsAction,
} from "../store/actions/updatepersonsaction";
import { roundAction } from "../store/actions/roundAction";
import { initOrderAction } from "../store/actions/initorder";
import "./score.less";
import * as XLSX from "xlsx";
import API from "../utils/api";

const { Column } = Table;

function TemporaryDrawer(props) {
  const {
    highList,
    round,
    i18,
    persons,
    SortPersons,
    setting,
    setPersons,
    initRound,
    initOrder,
    eventInfo,
  } = props;

  const componentRef = useRef();

  function getMostBig(o) {
    let arr = o.score;
    arr = JSON.parse(JSON.stringify(arr));
    arr = arr.map((e) => {
      return e.join("");
    });
    let index = null;
    for (let i = arr.length - 1; i > -1; i--) {
      const element = arr[i];
      if (element === "o" || element === "xo" || element === "xxo") {
        index = i;
        break;
      }
    }
    let dist = 0;
    if (index === null) return 0;
    let v = arr[index];
    switch (v) {
      case "o":
        dist = Number(highList[index]);
        break;
      case "xo":
        dist = Number(highList[index]) - 0.001;
        break;
      case "xxo":
        dist = Number(highList[index]) - 0.002;
        break;
      default:
        dist = 0;
        break;
    }
    return dist;
  }

  function translateScore(o){
    let arr = o.score;
    arr = JSON.parse(JSON.stringify(arr));
    arr = arr.map((e,index) => {
      let v= e.join("");
      let dist = 0;
      switch (v) {
        case "o":
          dist = Number(highList[index]);
          break;
        case "xo":
          dist = (Number(highList[index])*1000 - 1)/1000;
          break;
        case "xxo":
          dist = (Number(highList[index])*1000 - 2)/1000;
          break;
        default:
          dist = 0;
          break;
      }
      return dist;
    });
    return arr;
  }

  function Sort() {
    let data = JSON.parse(JSON.stringify(persons));
    data.sort((a, b) => {
      let A = translateScore(a);
      let B = translateScore(b);
      console.log(A,B)
      let result = 0;
      for (let i = highList.length-1; i > 0; i--) {
        console.log(i);
        const elementa = A[i]*1000;
        const elementb = B[i]*1000;
        if(elementa-elementb!==0){
          // return elementa-elementb;
          result=elementb-elementa;
          console.log(elementa,elementb)
          break;
        }
      }
      return result;
    });

    SortPersons(JSON.parse(JSON.stringify(data)));
    // initRound();
    initOrder();
  }

  function upData() {
    let results = JSON.parse(JSON.stringify(persons));
    results.map((e) => {
      if (e.DNS) {
        e.windspeed = [];
        e.score = [];
      }
      return e;
    });
    let data = {
      eventId: eventInfo.id,
      result_type: "distance",
      results,
    };
    console.log(data);

    API.UpdateResult(data);
  }

  function ImportData() {
    console.log(persons);
    let heads = ["姓名", "编号", ...highList, "成绩"];

    function getBig(arr) {
      let index = null;
      for (let i = arr.length - 1; i > -1; i--) {
        const element = arr[i];
        if (element === "o" || element === "xo" || element === "xxo") {
          index = i;
          break;
        }
      }
      return index == null ? "NM" : highList[index];
    }

    let data = persons.map((e) => {
      let arr = e.score;
      let arrs = arr.map((e) => e.join(""));
      return [e.name, e.num, ...arrs, getBig(arrs)];
    });
    data.unshift(heads);
    console.log(data);
    var ws_name = "SheetJS";
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, ws_name);

    console.log(eventInfo);
    const fileName = eventInfo.displayName
      ? eventInfo.displayName.split("--")[1]
      : "未知比赛";
    console.log(fileName);

    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  const printTable = () => {
    // const style = '@page {  } ' +'@media print { .print-div{ padding:8px;background-color:#cccccc;line-height:12px } .red{ color:#f00} .green{color:green}' ;
    const style =
      "@page { margin: 3mm 5mm; } " +
      "@media print { table{ width: 100%; border-collapse: collapse;}table caption{ font-size: 2em; font-weight: bold; margin: 1em 0;}th,td{ border: 1px solid #999; text-align: center; padding: 5px 0;}table thead tr{ background-color: #008c8c; color: #fff;}table tbody tr:nth-child(odd){ background-color: #eee;}table tbody tr:hover{ background-color: #ccc;}table tbody tr td:first-child{ color: #f40;}table tfoot tr td{ text-align: right; padding-right: 10px;}.print_title{text-align: center;} }";
    print({
      printable: "print_area",
      type: "html",
      style: style, // 亦可使用引入的外部css;
      scanStyles: false,
    });
  };

  return (
    <div className="score">
      <div className="headerline">
        <div className="title">
          <h2>
            {eventInfo.displayName
              ? eventInfo.displayName + "-第" + eventInfo.sessionsCount + "组"
              : "未设置"}
            -<FormattedMessage id="比赛成绩单"></FormattedMessage>
            {/* {hang} 行 - {lie}列 */}
          </h2>
        </div>
        <div className="buttons">
          <Button type="primary" className="myButton" onClick={Sort}>
            排名
          </Button>
          <Button className="myButton" onClick={upData}>
            提交成绩
          </Button>
          <Button
            className="myButton"
            onClick={() => {
              ImportData();
            }}
          >
            <FormattedMessage id="导出"></FormattedMessage>
          </Button>
          <Button onClick={printTable}>打印</Button>
          {/* <ReactToPrint
          trigger={() => <button>打印</button>}
          content={() => componentRef.current}
        /> */}
        </div>
      </div>
      <ComponentToPrint
        i18={i18}
        highList={highList}
        persons={persons}
        setPersons={setPersons}
        ref={componentRef}
        eventInfo={eventInfo}
      ></ComponentToPrint>
      <ComponentToPrint
        i18={i18}
        highList={highList}
        persons={persons}
        setPersons={setPersons}
        ref={componentRef}
        eventInfo={eventInfo}
        hidden={true}
      ></ComponentToPrint>
    </div>
  );
}

let mapstatetoprops = ({
  setting,
  throwSetting,
  jumpSetting,
  persons,
  order,
  round,
  i18,
  eventInfo,
  highList,
}) => {
  return {
    setting,
    throwSetting,
    jumpSetting,
    persons,
    order,
    round,
    i18,
    eventInfo,
    highList,
  };
};

let mapdispatchtoprops = (dispatch) => {
  return {
    SortPersons: function (payload) {
      dispatch(SortPersonsAction(payload));
    },
    setPersons: function (payload) {
      dispatch(updatePersonsAction(payload));
    },
    initRound: () => dispatch(roundAction("initround")),
    initOrder: () => dispatch(initOrderAction()),
  };
};

export default connect(mapstatetoprops, mapdispatchtoprops)(TemporaryDrawer);

const ComponentToPrint = React.forwardRef((props, ref) => {
  const { highList, persons, i18, setPersons, eventInfo, hidden } = props;
  const [hang, setHang] = useState(null);
  const [lie, setLie] = useState(null);

  function onDoubleClick(e, i, event, dataIndex) {
    // console.log(e,i,event)
    setHang(i);
    setLie(dataIndex);
  }
  function onKeyDown(e, o, dataIndex, i) {
    if (Number(e.keyCode) === 13) {
      console.log(e.target.value);
      let newScore = e.target.value.split(",");
      console.log(newScore);

      let index = null;
      index = dataIndex.replace(/[^0-9]/gi, "") - 1;
      o.score[index] = newScore;
      console.log(o);
      console.log(i);
      let payload = {
        num: o.num,
        data: o,
      };
      console.log("payload:", payload);
      setPersons(payload);
      // updatePerson({ num: container[order].num, data: container[order] });
      setHang(null);
      setLie(null);
    }
  }

  function onBulr(e, o, dataIndex, i) {
    console.log(e.target.value);
    let newScore = e.target.value.split(",");
    console.log(newScore);
    let index = null;
    index = dataIndex.replace(/[^0-9]/gi, "") - 1;
    o.score[index] = newScore;
    console.log(o);
    console.log(i);
    let payload = {
      num: o.num,
      data: o,
    };
    console.log("payload:", payload);
    setPersons(payload);
    setPersons(payload);
    setHang(null);
    setLie(null);
  }

  return (
    <div className="table" ref={ref} id={hidden ? "print_area" : ""}>
      <h2 className="print_title">
        {eventInfo.displayName
          ? eventInfo.displayName + "-第" + eventInfo.sessionsCount + "组"
          : "未设置"}
        -<FormattedMessage id="比赛成绩单"></FormattedMessage>
        {/* {hang} 行 - {lie}列 */}
      </h2>
      <Table
        scroll={hidden ? "" : { y: 420 }}
        size="small"
        bordered={true}
        pagination={false}
        id="Table"
        rowKey={(e) => e.num}
        dataSource={persons}
        rowClassName={(record, index) => {
          return index % 2 === 1 ? "once" : "twoe";
        }}
      >
        <Column
          align="center"
          title={i18 === "zh" ? "序号" : "Order"}
          dataIndex="name"
          key="name"
          render={(a, b, c) => {
            return <span>{c + 1}</span>;
          }}
        />
        <Column
          align="center"
          width={170}
          title={i18 === "zh" ? "姓名" : "Name"}
          dataIndex="name"
          key="name"
          render={(value, record, index) => {
            return (
              <>
                {value}
                {record.DNS ? (
                  <span style={{ color: "#f45" }}>(DNS)</span>
                ) : record.state ? (
                  <span style={{ color: "#f45" }}>({record.state})</span>
                ) : (
                  ""
                )}
              </>
            );
          }}
        />
        <Column
          align="center"
          title={i18 === "zh" ? "编号" : "Number"}
          dataIndex="num"
          key="num"
        />

        {/* {highList.map((ele, index) => {
          return (
            <Column
              onCell={(e, i, t) => {
                return {
                  onDoubleClick: (event) => {
                    onDoubleClick(e, i, event, `score${1 + index}`);
                  },
                };
              }}
              align="center"
              title={ele}
              dataIndex="score"
              key="score"
              render={(e, o, i) => {
                if (hang == i && lie == `score${1 + index}`) {
                  return (
                    <Input
                      style={{ width: "110px" }}
                      size="large"
                      defaultValue={e[index].join(",")}
                      onKeyDown={(e) => onKeyDown(e, o, `score${1 + index}`, i)}
                      onBlur={(e) => onBulr(e, o, `score${1 + index}`, i)}
                    ></Input>
                  );
                } else {
                  return <span>{e[index]}</span>;
                }
              }}
            />
          );
        })} */}
        {/* <Column
          align="center"
          title="成绩"
          key="num"
          render={(e, o, i) => {
            let arr = o.score;
            arr = JSON.parse(JSON.stringify(arr));
            arr = arr.map((e) => {
              return e.join("");
            });
            let index = null;
            for (let i = arr.length - 1; i > -1; i--) {
              const element = arr[i];
              if (element === "o" || element === "xo" || element === "xxo") {
                index = i;
                break;
              }
            }
            return index == null ? "NM" : highList[index];
          }}
        /> */}
      </Table>
      <div className="title_print">
        <div className="right">
          <h3>裁判签字：</h3>
          <h3>技术官员签字：</h3>
          <h3>日期：</h3>
        </div>
      </div>
    </div>
  );
});
