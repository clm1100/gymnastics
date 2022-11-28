import store from 'store';

/**投掷项目数据**/

let initState = store.get('throwSetting') ? store.get('throwSetting') : {
    hd: 0,
    R: 0
}

function throwSetting(state = initState,{type,payload}){
    switch (type) {
        case 'update':
            
            return {
                ...state,
                ...payload
            }
    
        default:
            return state
    }
}

export default throwSetting;