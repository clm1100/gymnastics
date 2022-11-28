// // function hex2int(hex) {
// //     let len = hex.length, a = new Array(len), code;
// //     for (let i = 0; i < len; i++) {
// //         code = hex.charCodeAt(i);
// //         if (48 <= code && code < 58) {
// //             code -= 48;
// //         } else {
// //             code = (code & 0xdf) - 65 + 10;
// //         }
// //         a[i] = code;
// //     }

// //     return a.reduce(function (acc, c) {
// //         acc = 16 * acc + c;
// //         return acc;
// //     }, 0);
// // }

// // let str = hex2int('3F 2B 30 30 30 30 30 34 33 35 6D 30 38 31 34 32 34 34 2B 30 30 32 32 34 34 39 64 2B 30 30 30 30 30 34 33 30 2A 2A 2A 2B 2A 2A 2B 2A 2A 30 35 32 03 0D 0A')
// // console.log(str);


// // const origin = '3F 2B 30 30 30 30 30 34 33 35 6D 30 38 31 34 32 34 34 2B 30 30 32 32 34 34 39 64 2B 30 30 30 30 30 34 33 30 2A 2A 2A 2B 2A 2A 2B 2A 2A 30 35 32 03 0D 0A'.split(' ');
// // let arr = [];
// // origin.forEach(i => {
// //     arr.push(parseInt(i, 16))
// // });
// // console.log(Buffer.from(arr).toString('utf-8'));


// function hexCharCodeToStr(hexCharCodeStr) {
//     var trimedStr = hexCharCodeStr.trim().split(" ").join("");
//     var rawStr =
//         trimedStr.substr(0, 2).toLowerCase() === "0x"
//             ?
//             trimedStr.substr(2)
//             :
//             trimedStr;
//     var len = rawStr.length;
//     if (len % 2 !== 0) {
//         alert("Illegal Format ASCII Code!");
//         return "";
//     }
//     var curCharCode;
//     var resultStr = [];
//     for (var i = 0; i < len; i = i + 2) {
//         curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
//         resultStr.push(String.fromCharCode(curCharCode));
//     }
//     return resultStr.join("");
// }

// let str = hexCharCodeToStr("3F 2B 30 30 30 30 30 34 33 35 6D 30 38 31 34 32 34 34 2B 30 30 32 32 34 34 39 64 2B 30 30 30 30 30 34 33 30 2A 2A 2A 2B 2A 2A 2B 2A 2A 30 35 32 03 0D 0A")
// console.log(str);


 function getBit(value, bit = 2) {
    let str = value.toString();
    console.log(str);
    let strIndex = str.indexOf('.');
     console.log("strIndex:", strIndex);
    if (strIndex === -1) return str;
     console.log("strIndex + bit:", strIndex + bit+1)
    str = str.substring(0, strIndex + bit+1);
    console.log(str, bit);
    return str;
}

getBit(10.11111,2)

