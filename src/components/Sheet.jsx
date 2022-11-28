import React from 'react';
import XLSX from 'xlsx'
import './sheet.less'
import { FormattedMessage } from 'react-intl'
import { initPersonsAction } from "../store/actions/updatepersonsaction";
import { roundAction } from "../store/actions/roundAction";
import { initOrderAction} from '../store/actions/initorder'
import { connect } from "react-redux";

class SheetJSApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [], /* Array of Arrays e.g. [["a","b"],[1,2]] */
            cols: []  /* Array of column objects e.g. { name: "C", K: 2 } */
        };
        this.handleFile = this.handleFile.bind(this);
        this.exportFile = this.exportFile.bind(this);
    };
    handleFile(file) {
        this.props.initRound();
        this.props.initOrder();
        /* Boilerplate to set up FileReader */
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;
        reader.onload = (e) => {
            /* Parse data */
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
            console.log(ws['!ref']);

            /* Update state */
            this.setState({ data: data, cols: make_cols(ws['!ref']) });
            let newdata = this.dealData(data);
            console.log(newdata);
            this.props.initPerson(newdata)
        };
        if (rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
    };
    dealData(arr){
        let [head,...body]=arr;
        console.log(head,body)
        let newArr = []
        for (let i = 0; i < body.length; i++) {
            const element = body[i];
            let obj={
                name: element[1],
                num:element[2],
                scores:[]
            }
            newArr.push(obj)
        }
        return newArr;
    }
    exportFile() {
        /* convert state to workbook */
        const ws = XLSX.utils.aoa_to_sheet(this.state.data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
        /* generate XLSX file and send to client */
        XLSX.writeFile(wb, "sheetjs.xlsx")
    };
    render() {
        // console.log("this.state.cols", this.state.cols)
        return (
            <DragDropFile handleFile={this.handleFile}>
                <div >
                    <div>
                    <DataInput handleFile={this.handleFile} />
                    </div>
                </div>
                <div className="OutTable">
                    <OutTable data={this.state.data} cols={this.state.cols} />
                </div>
            </DragDropFile>
        );
    };
};


/* -------------------------------------------------------------------------- */

/*
  Simple HTML5 file drag-and-drop wrapper
  usage: <DragDropFile handleFile={handleFile}>...</DragDropFile>
    handleFile(file:File):void;
*/
class DragDropFile extends React.Component {
    constructor(props) {
        super(props);
        this.onDrop = this.onDrop.bind(this);
    };
    suppress(evt) { evt.stopPropagation(); evt.preventDefault(); };
    onDrop(evt) {
        evt.stopPropagation(); evt.preventDefault();
        const files = evt.dataTransfer.files;
        if (files && files[0]) this.props.handleFile(files[0]);
    };
    render() {
        return (
            <div onDrop={this.onDrop} onDragEnter={this.suppress} onDragOver={this.suppress}>
                {this.props.children}
            </div>
        );
    };
};

/*
  Simple HTML5 file input wrapper
  usage: <DataInput handleFile={callback} />
    handleFile(file:File):void;
*/
class DataInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    };
    handleChange(e) {
        const files = e.target.files;
        if (files && files[0]) this.props.handleFile(files[0]);
    };
    render() {
        return (
            <form className="form-inline">
                <div className="form-group outfileButton">
                    <label className="labelButton" htmlFor="file">
                        <FormattedMessage id="上传参赛人员资料"></FormattedMessage>
                    </label>
                    <input  type="file" className="form-control fileButton" id="file" accept={SheetJSFT} onChange={this.handleChange} />
                </div>
            </form>
        );
    };
}

/*
  Simple HTML Table
  usage: <OutTable data={data} cols={cols} />
    data:Array<Array<any> >;
    cols:Array<{name:string, key:number|string}>;
*/
class OutTable extends React.Component {
    constructor(props) { super(props); };
    render() {
        // console.log(this.props.cols)
        return (
            <div className="table-responsive">
                <table className="table formdata">
                    <thead>
                        <tr>{this.props.cols.map((c) => <th scope="col" key={c.key}>{c.name}</th>)}</tr>
                    </thead>
                    <tbody>
                        {this.props.data.map((r, i) => <tr key={i}>
                            {this.props.cols.map(c => <td key={c.key}>{r[c.key]}</td>)}
                        </tr>)}
                    </tbody>
                </table>
            </div>
        );
    };
};

/* list of supported file types */
const SheetJSFT = [
    "xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "txt", "ods", "fods", "uos", "sylk", "dif", "dbf", "prn", "qpw", "123", "wb*", "wq*", "html", "htm"
].map(function (x) { return "." + x; }).join(",");

/* generate an array of column objects */
const make_cols = refstr => {
    let o = [], C = XLSX.utils.decode_range(refstr).e.c + 1;
    console.log(C);
    for (var i = 0; i < C; ++i) o[i] = { name: XLSX.utils.encode_col(i), key: i }
    return o;
};




// export default SheetJSApp;


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

// export default Control;

export default connect(mapstatetoprops, mapdispatchtoprops)(SheetJSApp)