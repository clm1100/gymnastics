import store from 'store';

let initState = store.get('round') ? store.get('round') : 0

function round(state = initState, { type, payload }) {
    switch (type) {
        case 'nextround':
            state = state + 1;
            store.set('round', state);
            return state;
        case 'initround':
            store.set('round', 0);
            return 0;
        case 'upperround':
            state = state - 1;
            store.set('round', state);
            return state;
        default:
            return state
    }
}

export default round;