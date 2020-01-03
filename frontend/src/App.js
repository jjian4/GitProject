import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    NavLink
} from 'react-router-dom';
import './App.css';
import Home from './components/Home/Home';
import Details from './components/Details/Details';

function App() {
    return (
        <Router>
            <div className='navBar'>
                <div className='container navBarContainer'>
                    <div className='navItem logo'>
                        <Link to='/'>GitTogether</Link>
                    </div>
                    <nav>
                        <ul className='navBarRight'>
                            <li className='navItem'>
                                <NavLink
                                    exact
                                    to='/login'
                                    activeClassName='navItemActive'
                                >
                                    LOGIN
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Renders Route where path matches current url */}
            <Switch>
                <Route exact path='/' component={Home} />
                <Route path='/details/github/:username' component={Details} />
                <Route path='/details/gitlab/:username' component={Details} />

                <Route component={Home} />
            </Switch>
        </Router>
    );
}

export default App;
