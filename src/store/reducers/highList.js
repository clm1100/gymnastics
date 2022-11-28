
import store from 'store';
let initState = store.get('highList') ? store.get('highList') : [
    'D1',
    'D2',
    'D3',
    'D4',
    'E1',
    'E2',
    'E3',
    'E4',
    'E5',
    'E6'


]

function highList(state = initState, { type, payload }) {
    switch (type) {
        case 'initHighList':
            // store.set(highList, payload);
            return payload;
        default:
            return state;

    }
}




// import store from 'store';
// let initState = store.get('order') ? store.get('order') : 0

// function order(state = initState, { type, payload }) {
//     switch (type) {
//         case 'next':
//             state = state + 1;
//             store.set('order', state);
//             return state;
//         case 'up':
//             state = state - 1;
//             store.set('order', state);
//             return state;
//         case 'init':
//             store.set('order', 0);
//             return 0;
//         default:
//             return state
//     }
// }

export default highList;