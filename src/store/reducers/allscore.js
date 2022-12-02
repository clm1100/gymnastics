import store from 'store';


let initState = store.get('allScore') ? store.get('allScore') : []

function allScore(state = initState, { type, payload }) {
    switch (type) {
        case 'updateallScore':

            state.push(payload)
           
            return [...state];
        default:
            return state
    }
}

export default allScore;