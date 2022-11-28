import store from 'store';

let initState = store.get('circle') ? store.get('circle') : 0

function circle(state = initState, { type, payload }) {
    switch (type) {
        case 'nextcircle':
            state=state+1
            store.set('circle', state);
            return state;
        case 'upcircle':
            state=state-1
            store.set('circle', state);
            return state;
        case 'initcircle':
            state=0
            store.set('circle', state);
            return state;
        default:
            return state
    }
}

export default circle;


