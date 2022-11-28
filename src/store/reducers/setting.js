import  store from 'store';

let  initState = store.get('setting') ? store.get('setting'):{}

function Setting(state = initState,{type,payload}) {
    switch (type) {
        case "update":
            return {
                ...payload
            }
        default:
            return state
    }
}
 
export default Setting