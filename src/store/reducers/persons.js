import store from 'store';


let initState = store.get('persons') ? store.get('persons') : []

function persons(state = initState, { type, payload }) {
    switch (type) {
        case 'updatepersons':
            console.log("更新数据")
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
           
            store.set('persons', state);
            return state;
        case 'sortpersons':
            state = payload
            // store.set('persons', state);
            return state;
        case 'initpersons':
            return JSON.parse(JSON.stringify(payload));
        default:
            return state
    }
}

export default persons;