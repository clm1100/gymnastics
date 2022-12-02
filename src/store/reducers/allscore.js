import store from 'store';


let initState = store.get('allScore') ? store.get('allScore') : []

function allScore(state = initState, { type, payload }) {
    switch (type) {
        case 'updateallScore':
            const {key} = payload;
            const l = state.filter(e=>e.key===key);
            if(l.length===0){
                state.push(payload);
            }
            store.set('allScore',state);
            return [...state];
        default:
            return state
    }
}

export default allScore;