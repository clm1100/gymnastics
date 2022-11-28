export function parse16(obj) {
    let {data:str,route,sn}=obj
    let data= String.fromCharCode(...str.split(' ').map(item => parseInt(item, 16)))
    let arr = data.split("+");

    // SD: "00000511m1021711"
    // HD: "00000499***"
    // HR: "0904422d"
    let SD = parseInt(arr[1],10)/1000
    let HR = strtoangle(arr[2]);
    let HD = parseInt(arr[3], 10)/1000
    return {
        SD, HR, HD, route, sn
    };
}

// 字符串转弧度
function strtoangle(str) {
    const sub1 = str.substr(0, 3);
    const sub2 = str.substr(3, 2);
    const sub3 = str.substr(5, 2);


    let d = parseFloat(sub1) + parseFloat(sub2) / 60 + parseFloat(sub3) / 3600;
    if (d > 180) {
        d = 360 - d;
    }
    return (d * Math.PI) / 180;
}