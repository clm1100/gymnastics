export const throws = [
    {
        label: '铅球',
        value: 'shot',
        radius: '1.0675'
    },
    {
        label: '链球',
        value: 'hammer',
        radius: '1.0675'
    },
    {
        label: '铁饼',
        value: 'discus',
        radius: '1.25'
    },
    {
        label: '标枪',
        value: 'javelin',
        radius: '8'
    }
]
export const jumps = [
    // {
    //     label: '跳高',
    //     value: 'highjump'
    // },
    {
        label: '跳远',
        value: 'broadjump'
    }
]


export const categorysobj = {
    throw: throws,
    jump: jumps
}

export const categoryobj = {
    throw: "投掷项目",
    jump: "跳跃项目"
}

export const objectnameobj = {
    shot: '铅球',
    discus: '铁饼',
    javelin: '标枪',
    hammer: '链球',
    highjump: '跳高',
    broadjump: '跳远'
}

// export const wsUrl = 'ws://192.168.0.101:8080/ws';
// export const wsUrl = 'ws://localhost:18088/ws';
export const wsUrl = 'nats://47.104.7.142:30229';