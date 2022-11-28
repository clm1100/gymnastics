import store from 'store';
let initState = store.get('order') ? store.get('order') : 0

function order(state = initState, { type, payload }) {
    switch (type) {
        case 'next':
            state = state + 1;
            store.set('order', state);
            return state;
        case 'up':
            state = state - 1;
            store.set('order', state);
            return state;
        case 'init':
            store.set('order', 0);
            return 0;
        default:
            return state
    }
}

export default order;