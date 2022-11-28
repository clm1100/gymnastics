export function initOrderAction() {
    return function (dispatch) {
        dispatch({
            type: "init",
        })
    }
}
