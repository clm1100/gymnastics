
export function pushAllScore(payload){
    return function (dispatch) {
        dispatch({
            type:"updateallScore",
            payload
        })
    }
}