import store from 'store';

let initState = store.get('eventInfo') ? store.get('eventInfo') : {}

function eventInfo(state = initState, { type, payload }) {
    switch (type) {
        case 'initEventInfo':
            return payload;
        default:
            return state
    }
}

export default eventInfo;