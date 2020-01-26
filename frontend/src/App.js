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
import Profile from './components/Profile/Profile';

let logoutTimer;

class App extends React.Component {
    state = {
        token: false,
        userId: null,
        tokenExpirationDate: null
    };

    componentDidMount = () => {
        // If there is a session
        if (localStorage.getItem('userData')) {
            const { token, userId, tokenExpirationDate } = JSON.parse(
                localStorage.getItem('userData')
            );
            // And if it has not expired yet
            if (tokenExpirationDate > new Date().getTime()) {
                this.setState({ token, userId, tokenExpirationDate });
                // Set timer to logout
                logoutTimer = setTimeout(
                    this.logout,
                    tokenExpirationDate - new Date().getTime()
                );
            } else {
                clearTimeout(logoutTimer);
            }
        } else {
            clearTimeout(logoutTimer);
        }
    };

    login = (uid, token) => {
        // Expire localStorage userData in 1 hour to match token's expiration
        const oneHourLater = new Date(
            new Date().getTime() + 1000 * 60 * 60
        ).getTime();

        const userData = {
            token: token,
            userId: uid,
            tokenExpirationDate: oneHourLater
        };

        this.setState(userData);
        localStorage.setItem('userData', JSON.stringify(userData));

        // Set timer to logout
        logoutTimer = setTimeout(
            this.logout,
            oneHourLater - new Date().getTime()
        );
    };

    logout = () => {
        this.setState({
            token: false,
            userId: null,
            tokenExpirationDate: null
        });
        localStorage.removeItem('userData');
        clearTimeout(logoutTimer);
    };

    render() {
        return (
            <AuthContext.Provider
                value={{
                    token: this.state.token,
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
                                    {this.state.token ? (
                                        <li className='navItem'>
                                            <NavLink
                                                exact
                                                onClick={this.logout}
                                                to='/'
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
                        <Route exact path='/profile' component={Profile} />
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
