import React from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import PageTitle from '../PageTitle/PageTitle';
import './Profile.css';
import { AuthContext } from '../../context/authContext';

// TODO: UI of page
// Fetch existing user data when component mounts (or redirect if unauthenticated)
// On backend, dont allow changes to a user that's not the current user
class Profile extends React.Component {
    state = {
        redirectToLogin: false
    };

    componentDidMount = () => {
        if (!localStorage.getItem('userData')) {
            this.setState({ redirectToLogin: true });
            return;
        }

        this.fetchUserInfo();
    };

    fetchUserInfo = async () => {
        if (!localStorage.getItem('userData')) {
            return;
        }

        try {
            const { token, userId } = JSON.parse(
                localStorage.getItem('userData')
            );
            console.log(`Bearer ${token}`);
            const response = await axios.get(
                `http://localhost:5000/api/user/${userId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (e) {
            this.context.logout();
            this.setState({ redirectToLogin: true });
        }
    };

    render() {
        // Redirect to login if user is not authenticated
        if (!localStorage.getItem('userData')) {
            return <Redirect to='/auth' />;
        }

        return (
            <div className='profile'>
                <div className='container'>
                    <PageTitle text='Your name' />
                    <div>{this.context.token}</div>
                    <div>{this.context.userId}</div>
                </div>
            </div>
        );
    }
}

Profile.contextType = AuthContext;

export default Profile;
