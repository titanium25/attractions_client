import React from 'react'
import Dashboard from "./Dashboard";
import Attractions from "./Attractions";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Attractions2 from "./Attractions2";

function App() {

    return (
        <div className="main">
        <Router>
            <Switch>
                <Route exact path='/' component={Dashboard}/>
                <Route exact path='/attractions' component={Attractions}/>
                <Route exact path='/attractions-2' component={Attractions2}/>
            </Switch>
        </Router>
        </div>
    )
}

export default App;