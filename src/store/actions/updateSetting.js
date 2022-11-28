import store from 'store';
export function updateSettingAction(payload){
    return function (dispatch) {
        console.log("执行dispatch");
        store.set('setting', payload);
        dispatch({
            type:"update",
            payload
        })
    }
}

