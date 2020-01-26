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
        redirectToLogin: false,
        name: null,
        email: null
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

            const response = await axios.get(
                `http://localhost:5000/api/user/${userId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const { name, email } = response.data;
            this.setState({ name, email });
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
                    <PageTitle text={this.state.name} />

                    <div>{this.state.email}</div>
                </div>
            </div>
        );
    }
}

Profile.contextType = AuthContext;

export default Profile;
