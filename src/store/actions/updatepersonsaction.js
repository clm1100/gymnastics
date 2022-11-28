// 修改数据，更新分数
import store from 'store';
export function updatePersonsAction(payload){
    console.log("updatePersonsAction")
    return function (dispatch) {
        console.log("dispatch =====updatePersonsAction")
        dispatch({
            type:"updatepersons",
            payload: payload
        })
    }
}


//  从表格获取数据
export function initPersonsAction(payload) {
    return function (dispatch) {
        for (let i = 0; i < payload.length; i++) {
            if(!payload[i]['score'])payload[i]['score']=[]
        }
        console.log(payload);
        store.set('persons', payload);
        dispatch({
            type: "initpersons",
            payload: payload
        })
    }
}

export function SortPersonsAction(payload) {
    return function (dispatch) {
        store.set('persons', payload);
        dispatch({
            type: "sortpersons",
            payload: payload
        })
    }
}

