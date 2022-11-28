import store from 'store';
let initState = store.get('onoff') ? store.get('onoff') : false

function onoff(state = initState, { type, payload }) {
    switch (type) {
        case 'initonoff':
            store.set('onoff', payload);
            return payload;
        default:
            return state
    }
}

export default onoff;