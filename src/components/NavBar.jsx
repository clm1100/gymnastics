import beat from '../voice/beat.wav'
import button from '../voice/button.wav'
import page from '../voice/page.wav'
import onoff from '../voice/onoff.wav'
import numbervoice from '../voice/number.wav'
import errorvoice from '../voice/error.wav'
import React from "react";
import { connect } from 'react-redux';
import { FormattedMessage } from "react-intl";
import {
    useLocation,
    useHistory
} from "react-router-dom";
import { Layout, Button} from 'antd';
import { playPage} from '../utils/play'

const { Header } = Layout;

function NavBar(props) {

    let {change,i18} = props
    const { pathname } = useLocation();
    const history = useHistory();
    // const play = (e) => {
    //     let audio = document.getElementById("123");
    //     audio.play()
    // }
    let goPage = (path)=>{
        history.push(path);
        console.log(path)
        playPage()
    }

    let changeLanguage = ()=>{
        if (i18==="en"){
            change("zh");
        }else{
            change("en");
        }

    }

    return   <>
    <Header className="header">
            <div className="logo" >
                {/* <FormattedMessage id="田赛打分控制器"></FormattedMessage>   */}
            </div>
            <div>
                <Button
                    onClick={() => { goPage('/control') }}
                    className={pathname === "/control" ? "buttonLink active" : "buttonLink"}
                    type="default">
                    主裁判
                </Button>
                {/* <Button
                    onClick={() => { goPage('/record') }}
                    className={pathname === "/record" ? "buttonLink active" : "buttonLink"}
                    type="default">
                    <FormattedMessage id="成绩记录" />
                </Button> */}
                {/* <Button
                    onClick={() => { goPage('/export') }}
                    className={pathname === "/export" ? "buttonLink active" : "buttonLink"}
                    type="default">
                    <FormattedMessage id="信息录入" />
                </Button> */}
                {/* <Button
                    onClick={() => { goPage('/setting')}}
                    className={pathname === "/setting" ? "buttonLink active" : "buttonLink" }
                    type="default">
                    <FormattedMessage id="赛事设置" />
                </Button> */}
               
                {/* <Button 
                    onClick={() => { goPage('/') }}
                    className={pathname === "/" ? "buttonLink active" : "buttonLink" }
                    type="default">
                    赛事设置
                </Button> */}

                <Button
                    onClick={() => { goPage('/assistant') }}
                    className={pathname === "/assistant" ? "buttonLink active" : "buttonLink"}
                    type="default">
                    裁判
                </Button>

                <Button
                    onClick={() => { goPage('/racelist') }}
                    className={pathname === "/racelist" ? "buttonLink active" : "buttonLink"}
                    type="default">
                    赛事列表
                </Button>

                {/* assistant */}
                {/* <Button
                    style={{"marginLeft":'20px'}}
                    className="changeLanguageButton"
                    onClick={() => { changeLanguage() }}
                    type="primary">
                    <FormattedMessage id="语言切换" />
                </Button> */}
                
                <audio
                    id="beat"
                    preload="auto"
                    src={beat}
                    autoPlay={false}
                >
                </audio>
                <audio
                    id="page"
                    preload="auto"
                    src={page}
                    autoPlay={false}
                >
                </audio>
                <audio
                    id="onoff"
                    src={onoff}
                    preload="auto"
                    autoPlay={false}
                >
                </audio>
                <audio
                    id="button"
                    preload="auto"
                    src={button}
                    autoPlay={false}
                >
                </audio>
                <audio
                    id="number"
                    preload="auto"
                    src={numbervoice}
                    autoPlay={false}
                >
                </audio>
                <audio
                    id="error"
                    preload="auto"
                    src={errorvoice}
                    autoPlay={false}
                >
                </audio>
            </div>
        </Header>
    </>
}

const mapStatetoProps = (state) => {
    return {
        i18:state.i18
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
export default connect(mapStatetoProps, mapActionstoProps)(NavBar);