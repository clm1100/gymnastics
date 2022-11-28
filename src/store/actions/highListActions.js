
import store from 'store';

export function initHighListAction(payload){
    return function (dispatch){
        console.log("执行dispatch:initHighListAction");
        store.set('highList', payload);
        dispatch({
            type:'initHighList',
            payload
        })
    }
}
