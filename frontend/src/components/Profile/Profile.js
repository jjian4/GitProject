import React from 'react';
import axios from 'axios';
import PageTitle from '../PageTitle/PageTitle';
import './Profile.css';
import { AuthContext } from '../../context/authContext';

// TODO: UI of page
// Fetch existing user data when component mounts (or redirect if unauthenticated)
// On backend, dont allow changes to a user that's not the current user
class Profile extends React.Component {
    state = {};

    componentDidMount = () => {};

    render() {
        return (
            <div className='profile'>
                <div className='container'>
                    <PageTitle text='Your name' />
                    <div>{this.context.userId}</div>
                </div>
            </div>
        );
    }
}

Profile.contextType = AuthContext;

export default Profile;
