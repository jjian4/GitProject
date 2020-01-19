import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    NavLink
} from 'react-router-dom';
import { AuthContext } from './context/authContext';
import './App.css';
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
import Details from './components/Details/Details';

class App extends React.Component {
    state = {
        isLoggedIn: false,
        userId: null
    };

    login = uid => {
        this.setState({
            isLoggedIn: true,
            userId: uid
        });
    };

    logout = () => {
        this.setState({
            isLoggedIn: false,
            userId: null
        });
    };

    render() {
        return (
            <AuthContext.Provider
                value={{
                    isLoggedIn: this.state.isLoggedIn,
                    userId: this.state.userId,
                    login: this.login,
                    logout: this.logout
                }}
            >
                <Router>
                    <div className='navBar'>
                        <div className='container navBarContainer'>
                            <div className='navItem logo'>
                                <Link to='/'>GitTogether</Link>
                            </div>
                            <nav>
                                <ul className='navBarRight'>
                                    {this.state.isLoggedIn ? (
                                        <li className='navItem'>
                                            <NavLink
                                                exact
                                                to='/logout'
                                                activeClassName='navItemActive'
                                            >
                                                LOGOUT
                                            </NavLink>
                                        </li>
                                    ) : (
                                        <li className='navItem'>
                                            <NavLink
                                                exact
                                                to='/auth'
                                                activeClassName='navItemActive'
                                            >
                                                LOGIN
                                            </NavLink>
                                        </li>
                                    )}
                                </ul>
                            </nav>
                        </div>
                    </div>

                    {/* Renders Route where path matches current url */}
                    <Switch>
                        <Route exact path='/' component={Home} />
                        <Route exact path='/auth' component={Auth} />
                        <Route
                            path='/details/github/:username'
                            component={Details}
                        />
                        <Route
                            path='/details/gitlab/:username'
                            component={Details}
                        />
                        <Route
                            path='/details/bitbucket/:username'
                            component={Details}
                        />
                        <Route component={Home} />
                    </Switch>
                </Router>
            </AuthContext.Provider>
        );
    }
}

export default App;
