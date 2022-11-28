export function roundAction(type) {
    return function (dispatch) {
        console.log("轮次变化")
        // store.set('setting', payload);
        dispatch({
            type: type,
        })
    }
}
