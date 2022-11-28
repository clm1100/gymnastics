var initState = {
    count:1
}

function Obj(state = initState,{type,payload}) {
    switch (type) {
        case "add":
            state.count +=1;
            return {
                ...state
            }
        case "increame":
            state.count -= 1;
            return {
                ...state
            }
        default:
           return state;
    }
}
 
export default Obj