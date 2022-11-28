export function initOnoffAction(payload) {
    return function (dispatch) {
        console.log("initOnoffAction")
        dispatch({
            type: 'initonoff',
            payload
        })
    }
}
