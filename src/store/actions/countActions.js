export function AddAction(){
    return function (dispatch) {
        dispatch({
            type:"add",
            payload:"1234"
        })
    }
}

