export function circleAction(type) {
    return function (dispatch) {
        dispatch({
            type: type,
        })
    }
}

