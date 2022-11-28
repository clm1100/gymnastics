var initState = "zh"

function i18(state = initState, { type, payload }) {
    switch (type) {
        
        case "zh":
            return "zh"
        case "en":
            return "en"
        default:
            return state;
    }
}

export default i18