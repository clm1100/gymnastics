// import ParserAngle from "./ParserAngle";
// let ParserAngleToRadin = require('./ParserAngle')
import ParserAngleToRadin from "./ParserAngle";


// 计算throw类型比赛距离
export function throwCalculate({AB,AC,HR,CD}) {
    let CB = Math.sqrt(AB * AB + AC * AC - 2 * AB * AC * Math.cos(HR));
    let BD = CB-CD;
    return BD
}

// 靠近沙坑的测量方法
export function jumpCalculateA({AE,AF,EAF,AB,BAF}) {
    let EF = Math.sqrt(AE*AE+AF*AF-2*AE*AF*Math.cos(EAF));
    let cos_AFE = (AF*AF+EF*EF-AE*AE)/(2*AF*EF);
    let AFE = Math.acos(cos_AFE);
    const CG = AF * Math.sin(AFE);
    const GAF = AFE;
    const GAB = BAF-GAF;
    const BG = AB * Math.sin(GAB);
    const BC=BG+CG;
    return BC;
}


// 远离沙坑的测量方法
export function jumpCalculateB({ AE, AF, EAF, AB, BAF }) {
    let EF = Math.sqrt(AE * AE + AF * AF - 2 * AE * AF * Math.cos(EAF));
    let cos_AFE = (AF * AF + EF * EF - AE * AE) / (2 * AF * EF);
    let AFE = Math.acos(cos_AFE);
    let AD= AF*Math.sin(AFE);
    let CH=AD;
    let FAI=AFE;
    let BAH= BAF+FAI;
    let BH = AB * Math.sin(BAH);
    let CB= BH-CH;
    return CB;
}



// 截取小数点后多少位数字
export function getBit(value, bit = 2) {
    let str = value.toString();
    let strIndex = str.indexOf('.');
    if (strIndex === -1) return str;
    str = str.substring(0, strIndex + bit+1);
    console.log(str, bit);
    return str;
}











export function calculate1(params,props) {
    let { AB, H } = params;

    let { CG, ang_GAF } = measuringPos1(props);

    const ang_GBA = ParserAngleToRadin(H) - ang_GAF;
    const GB = AB * Math.sin(ang_GBA);
    const CB = CG + GB;
    return CB;
}

export function calculate2(params,props) {
    let { AB, H } = params;
    let { CH, ang_FAI} = measuringPos2(props);
    const ang_BAH = ParserAngleToRadin(H) + ang_FAI;
    const HB = AB * Math.sin(ang_BAH);
    const CB = HB - CH;
    return CB;
}



function measuringPos1(props) {
    let {AF,AE,H} = props;
    const cos_EAF = Math.cos(ParserAngleToRadin(H));

    const EF = Math.sqrt(AE * AE + AF * AF - 2 * AE * AF * cos_EAF);
    const cos_AFE = (AF * AF + EF * EF - AE * AE) / (2 * AF * EF);
    const ang_AFE = Math.acos(cos_AFE);
    const CG = AF * Math.sin(ang_AFE);
    const ang_GAF = ang_AFE;
    return {
        CG,
        ang_GAF
    }
}
function measuringPos2(props) {
    let { AF, AE, H } = props;
    const cos_EAF = Math.cos(ParserAngleToRadin(H));
    const EF = Math.sqrt(AE * AE + AF * AF - 2 * AE * AF * cos_EAF);
    const cos_AFE = (AF * AF + EF * EF - AE * AE) / (2 * AF * EF);
    const ang_AFE = Math.acos(cos_AFE);
    const CH = AF * Math.sin(ang_AFE);
    const ang_FAI = ang_AFE;

    return {
        CH,
        ang_FAI
    }

}


export default {
    calculate1,
    calculate2,
    throwCalculate
}
