import '../node_modules/normalize.css/normalize.css'
import './App.less'
import React from "react";
import {HashRouter as Router,Switch,Route,} from "react-router-dom";
import store from './store';
import {Provider} from 'react-redux'
import NavBar from './components/NavBar'
import Content from './components/Content'

import NavBar2 from './components/NavBar2'
import Content2 from './components/Content2'
import NewLocalProvider from './Language';
import Display from './pages/display';

const App1 = ()=>{
  return <>
         <NavBar/>
        <Content/>
  </>
}

const App2 = ()=>{
  return <>
         <NavBar2/>
        <Content2/>
  </>
}

export default function App() {
  return (
    <Provider store={store}>
      <NewLocalProvider>
      <Router>
        <Switch>
            <Route path="/grade">
                <App2 />
            </Route>
            <Route path="/display">
                <Display />
            </Route>
            <Route path="/">
                <App1 />
            </Route>
        </Switch>
      </Router>
      </NewLocalProvider>
    </Provider>
  );
}


