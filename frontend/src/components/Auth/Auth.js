import React from 'react';
import axios from 'axios';
import SiteTitle from '../SiteTitle/SiteTitle';
import './Auth.css';
import { AuthContext } from '../../context/authContext';

class Login extends React.Component {
    state = {
        registration: false,
        formName: '',
        formEmail: '',
        formPassword: ''
    };

    static authContext = AuthContext;

    switchMode = () => {
        this.setState(prevState => ({
            registration: !prevState.registration
        }));
    };

    handleFormChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    authSubmitHandler = async event => {
        event.preventDefault();
        // Validate
        if (this.state.formEmail.length === 0) {
            alert('Email is required.');
            return;
        } else if (this.state.formPassword.length < 6) {
            alert('Passeord must be at least 6 characters.');
            return;
        }

        const user = {
            email: this.state.formEmail,
            password: this.state.password
        };

        // REGISTER
        if (this.state.registration) {
            if (this.state.formName.length === 0) {
                alert('Name is required.');
                return;
            }

            const newUser = { name: this.state.formName, ...user };
            try {
                const response = await axios.post(
                    'http://localhost:5000/api/user/register',
                    newUser
                );
                this.authContext.login(response.data.user.id);
            } catch (e) {
                console.log(e);
            }
        }
        // LOGIN
        else {
            try {
                const response = await axios.post(
                    'http://localhost:5000/api/user/login',
                    user
                );
                this.authContext.login(response.data.user.id);
            } catch (e) {
                console.log(e);
            }
        }
    };

    render() {
        return (
            <div className='auth'>
                <div className='container'>
                    <SiteTitle />
                    <form
                        className='authForm'
                        onSubmit={this.authSubmitHandler}
                    >
                        {this.state.registration && (
                            <input
                                name='formName'
                                type='text'
                                placeholder='Full name'
                                autoComplete='off'
                                value={this.state.formName}
                                onChange={this.handleFormChange}
                            />
                        )}
                        <input
                            name='formEmail'
                            type='email'
                            placeholder='Email'
                            autoComplete='off'
                            value={this.state.formEmail}
                            onChange={this.handleFormChange}
                        />
                        <input
                            name='formPassword'
                            type='password'
                            placeholder='Password'
                            autoComplete='off'
                            value={this.state.formPassword}
                            onChange={this.handleFormChange}
                        />
                        <input
                            type='submit'
                            value={
                                this.state.registration ? 'Register' : 'Login'
                            }
                            className='customButton'
                        />
                    </form>
                    <span className='switchMode' onClick={this.switchMode}>
                        {this.state.registration
                            ? 'Already have account'
                            : 'Create an account'}
                    </span>
                </div>
            </div>
        );
    }
}

export default Login;
