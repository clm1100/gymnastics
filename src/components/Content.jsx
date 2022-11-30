import Home from '../pages/home'
import RaceList from '../pages/RaceList'
import Record from "../pages/record";
import Control from '../pages/control'
import Control2 from '../pages/control2'
import Export from '../pages/export'
import Setting from '../pages/setting'
import Test from '../pages/test'
import LeftContent from './LeftContent'
import Display from '../pages/display'
// import Assistant from '../pages/assistant/index';


import {
    // BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import Grid from '@material-ui/core/Grid';

function Content() {
    return <Grid container spacing={0}>
        <Grid item xs={4}>
            <LeftContent/>
        </Grid>
        <Grid item xs={8}>
            <div className={'right'}>
                <div className={'container'} >
                    <Switch>
                        <Route path="/display">
                            <Display />
                        </Route>
                        <Route path="/racelist">
                            <RaceList />
                        </Route>
                        <Route path="/setting">
                            <Setting />
                        </Route>
                        <Route path="/record">
                            <Record />
                        </Route>
                        <Route path="/control">
                            <Control />
                        </Route>
                        <Route path="/assistant">
                            <Control2 />
                        </Route>
                        <Route path="/export">
                            <Export />
                        </Route>
                        <Route path="/test">
                            <Test />
                        </Route>
                        <Route path="/">
                            <RaceList />
                        </Route>
                    </Switch>
                </div>
            </div>
        </Grid>

    </Grid>
}

export default Content