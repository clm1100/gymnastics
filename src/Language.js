import React from "react";
import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import zh from './locales/zh-CN';
import en from './locales/en-US';

const mssageObj = (str) => {
    let o = {
        zh, en
    }
    return o[str]
}


function LocalProvider(props) {

    let { i18 } = props;

    return <IntlProvider
        locale={i18}
        messages={mssageObj(i18)}
    >
        {props.children}
    </IntlProvider>

}

const mapStatetoProps = (state) => {
    return {
        i18: state.i18
    }
}
const mapActionstoProps = (dispatch) => {
    return {
        change(s) {
            dispatch({
                type: s
            })
        }
    }
}

const NewLocalProvider = connect(mapStatetoProps, mapActionstoProps)(LocalProvider);

export default NewLocalProvider