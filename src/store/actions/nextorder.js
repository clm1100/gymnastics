export function nextOrderAction() {
    return function (dispatch) {
        dispatch({
            type: "next",
        })
    }
}


export function upOrderAction() {
    return function (dispatch) {
        dispatch({
            type: "up",
        })
    }
}