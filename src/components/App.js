import React from 'react'
import Dashboard from "./Dashboard";
import Attractions from "./Attractions";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

function App() {

    return (
        <Router>
            <Switch>
                <Route exact path='/' component={Dashboard}/>
                <Route exact path='/attractions' component={Attractions}/>
            </Switch>
        </Router>
    )
}

export default App;