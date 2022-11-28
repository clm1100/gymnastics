import store from 'store';

let initState = store.get('container') ? store.get('container') : []

// function container(state = initState, { type, payload }) {
//     switch (type) {
//         case 'initcontainer':
//             return payload;
//         default:
//             return state
//     }
// }

// export default container;



function container(state = initState, { type, payload }) {
    switch (type) {
        case 'updatepersons':
            const {num,data} = payload;
            let index=null;
            state.forEach((e,i)=>{
                if(e.num==num){
                    index=i
                }
            });
            if(index==null)return state;
            state[index]= data
            state = JSON.parse(JSON.stringify(state))
            store.set('container', state);
            return state;
        case 'sortcontainer':
            state = payload
            // store.set('container', state);
            return state;
        case 'initcontainer':
            return JSON.parse(JSON.stringify(payload));
        default:
            return state
    }
}

export default container;

