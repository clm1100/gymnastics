import store from 'store';
/**跳跃项目数据**/

let initState = store.get('jumpSetting') ? store.get('jumpSetting') : {
    cg: 0,
    ang_gaf: 0,
    ch: 0,
    ang_fai: 0,
    sta_position: 0
}

function jumpSetting(state = initState, { type, payload }) {
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

export default jumpSetting;