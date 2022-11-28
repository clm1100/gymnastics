import store from 'store';

let initState = store.get('serverIp') ? store.get('serverIp') : "127.0.0.1:8080"

function serverIp(state = initState, { type, payload }) {
    switch (type) {
        case 'initServerIp':
            return payload;
        default:
            return state
    }
}

export default serverIp;