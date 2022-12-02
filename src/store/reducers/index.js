import { combineReducers } from 'redux';
import Obj from './obj';
import i18 from './i18';
import setting from './setting';
import throwSetting from "./throw";
import jumpSetting from "./jump";
import persons from "./persons";
import order from "./order";
import round from "./round";
import eventInfo from './eventInfo'; 
import serverIp from './serverIp'; 
import highList from './highList';
import circle from './circle'
import container from './container';
import onoff from './onoff';
import allscore from './allscore';
let reducers = combineReducers({ 
    serverIp,Obj, 
    i18, setting,
    throwSetting, jumpSetting,
    persons, round,
    order,eventInfo,
    highList,circle,
    container,onoff,allscore,
    });

export default reducers;