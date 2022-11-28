import store from 'store';
export function initEventInfoAction(payload){
    return function (dispatch) {
        console.log("执行dispatch:updateEventInfoAction");
        store.set('eventInfo', payload);
        dispatch({
            type:"initEventInfo",
            payload
        })
    }
}

