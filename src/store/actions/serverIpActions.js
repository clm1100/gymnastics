import store from 'store';
export function initServerIpAction(payload){
    return function (dispatch) {
        console.log("initServerIp");
        store.set('serverIp', payload);
        dispatch({
            type:"initServerIp",
            payload
        })
    }
}