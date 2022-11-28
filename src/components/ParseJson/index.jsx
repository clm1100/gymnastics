import React from 'react';
import { initPersonsAction } from "../../store/actions/updatepersonsaction";
import { roundAction } from "../../store/actions/roundAction";
import { initOrderAction } from '../../store/actions/initorder'
import { connect } from "react-redux";
import './index.less';

class ParseJson extends React.Component {
    constructor(props) {
        super(props);
       
    };
    handleFile(file) {
        
    };
    dealData(body) {
        
        let newArr = []
        for (let i = 0; i < body.length; i++) {
            const element = body[i];
            let obj = {
                name: element['name'],
                num: element['num'],
                scores: [],
                nationality: element['nationality']
            }
            newArr.push(obj)
        }
        return newArr;
    }
    exportFile() {
        
    };

    onChange(info) {
        let that = this;
       
        // if (this.value === '' || this.files.length < 1) {
        //     return false; //  如果没有选择文件就什么也不做
        // }
        let file = info.target.files[0];

        // return ;
        var reader = new FileReader(); //  创建 FileReader对象
        reader.readAsText(file); //  把文件读取为字符串
        //  文件加载完成
        reader.onload = function (ev) {
            var jsonStr = ev.target.result; //  把字符串传给 jsonStr
            jsonStr = JSON.parse(jsonStr); //  把 JSON 字符串转换为 JSON 对象
            console.log(jsonStr); //  在控制台输出 JSON
            let newdata = that.dealData(jsonStr);
            console.log(newdata)
            that.props.initRound();
            that.props.initOrder();
            that.props.initPerson(newdata)
        };
        
    };

    render() {
        return (

            // <Upload action={null} onChange={this.onChange}>
            //     <Button > Upload Data</Button>
            // </Upload>
            // <input type="file" onChange={this.onChange}></input>
            <div className="wrap">
                <input className="se2" id="f_file" type="file"  onChange={this.onChange.bind(this)}/>
                <label htmlFor="f_file">
                    <input className="se1" type="button" value="Upload Data" />
                </label>
            </div>
        );
    };
};





let mapstatetoprops = ({ Obj, order, round, persons }) => {
    return {
        Obj,
        order,
        round,
        persons
    }
}

let mapdispatchtoprops = (dispatch) => {
    return {
        initPerson: (payload) => dispatch(initPersonsAction(payload)),
        initRound: () => dispatch(roundAction('initround')),
        initOrder: () => dispatch(initOrderAction())
    }
}


export default connect(mapstatetoprops, mapdispatchtoprops)(ParseJson)