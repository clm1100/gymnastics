import store from 'store';
export function initContainerAction(payload){
    return function (dispatch) {
        console.log("init container")
        store.set('container', payload);
        dispatch({
            type:"initcontainer",
            payload
        })
    }
}