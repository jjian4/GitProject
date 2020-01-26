import React from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import PageTitle from '../PageTitle/PageTitle';
import './Auth.css';
import { AuthContext } from '../../context/authContext';

class Auth extends React.Component {
    state = {
        registration: false,
        formName: '',
        formEmail: '',
        formPassword: '',
        redirectToProfile: false
    };

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
            password: this.state.formPassword
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
                    'http://localhost:5000/api/auth/register',
                    newUser
                );
                this.context.login(response.data.userId, response.data.token);
                this.setState({
                    redirectToProfile: true
                });
            } catch (e) {
                alert('Failed to register.');
                console.log(e);
            }
        }
        // LOGIN
        else {
            try {
                const response = await axios.post(
                    'http://localhost:5000/api/auth/login',
                    user
                );
                this.context.login(response.data.userId, response.data.token);
                this.setState({
                    redirectToProfile: true
                });
            } catch (e) {
                alert('Failed to log in.');
                console.log(e);
            }
        }
    };

    render() {
        if (this.state.redirectToProfile) {
            return <Redirect to='/profile' />;
        }
        return (
            <div className='auth'>
                <div className='container'>
                    <PageTitle text='GitTogether' />
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

Auth.contextType = AuthContext;

export default Auth;
