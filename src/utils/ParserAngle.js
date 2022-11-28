function ParserAngleToRadin(str) {
    console.log("str:",str);

    let arr = str.split(/\D/);
    
    arr = arr.map(e=>{
        if (parseFloat(e) != parseFloat(e)){
            return 0
        }else{
            return e
        }
    })
    const [sub1=0,sub2=0,sub3=0] = arr;
    let d = parseFloat(sub1) + parseFloat(sub2) / 60 + parseFloat(sub3) / 3600;
    if (d > 180) {
        d = 360 - d;
    }
    return (d * Math.PI) / 180;
}

export default ParserAngleToRadin

// module.exports = ParserAngleToRadin