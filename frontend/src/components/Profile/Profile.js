import React from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import {
    faGithub,
    faGitlab,
    faBitbucket
} from '@fortawesome/free-brands-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PageTitle from '../PageTitle/PageTitle';
import './Profile.css';
import { AuthContext } from '../../context/authContext';
import SearchCard from '../SearchCard/SearchCard';

class Profile extends React.Component {
    state = {
        redirectToLogin: false,
        email: null,
        name: null,
        githubUsername: '',
        gitlabUsername: '',
        bitbucketUsername: '',
        following: [],
        formHasChanged: false
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

            this.setState(response.data);
        } catch {
            this.context.logout();
            this.setState({ redirectToLogin: true });
        }
    };

    handleFormChange = event => {
        this.setState({
            [event.target.name]: event.target.value,
            formHasChanged: true
        });
    };

    profileSubmitHandler = async event => {
        event.preventDefault();

        if (this.state.name.length === 0) {
            alert('Name is required.');
            return;
        }

        try {
            const { token, userId } = JSON.parse(
                localStorage.getItem('userData')
            );

            await axios.patch(
                `http://localhost:5000/api/user/${userId}`,
                {
                    name: this.state.name,
                    githubUsername: this.state.githubUsername,
                    gitlabUsername: this.state.gitlabUsername,
                    bitbucketUsername: this.state.bitbucketUsername
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            this.setState({
                formHasChanged: false
            });
        } catch {
            alert('Could not save updates.');
        }
    };

    render() {
        // Redirect to login if user is not authenticated
        if (!localStorage.getItem('userData')) {
            return <Redirect to='/auth' />;
        }

        console.log(this.state.following);

        return (
            <div className='profile'>
                <div className='container'>
                    <PageTitle text={this.state.email} />
                    <form
                        className='profileForm'
                        onSubmit={this.profileSubmitHandler}
                    >
                        <FontAwesomeIcon icon={faUser} />
                        {/* <label for='name'>Name</label> */}
                        <input
                            name='name'
                            type='text'
                            placeholder='Your Name'
                            autoComplete='off'
                            value={this.state.name || ''}
                            onChange={this.handleFormChange}
                        />
                        <br />
                        <FontAwesomeIcon icon={faGithub} />
                        <input
                            name='githubUsername'
                            type='text'
                            placeholder='Github username'
                            autoComplete='off'
                            value={this.state.githubUsername}
                            onChange={this.handleFormChange}
                        />
                        <br />
                        <FontAwesomeIcon icon={faGitlab} />
                        <input
                            name='gitlabUsername'
                            type='text'
                            placeholder='Gitlab username'
                            autoComplete='off'
                            value={this.state.gitlabUsername}
                            onChange={this.handleFormChange}
                        />
                        <br />
                        <FontAwesomeIcon icon={faBitbucket} />
                        <input
                            name='bitbucketUsername'
                            type='text'
                            placeholder='Bitbucket username'
                            autoComplete='off'
                            value={this.state.bitbucketUsername}
                            onChange={this.handleFormChange}
                        />
                        <br />
                        {this.state.formHasChanged && (
                            <input
                                type='submit'
                                className='saveButton customButton'
                                value='Update'
                            />
                        )}
                    </form>

                    <div className='followingTitle'>Following</div>
                    <div className='followingList row'>
                        <div className='col-md-6'>
                            <SearchCard
                                user={{
                                    source: 'github',
                                    login: 'login',
                                    avatar_url: '#',
                                    name: 'name',
                                    created_at: Date.now(),
                                    bio: 'bio',
                                    public_repos: 0,
                                    html_url: '#'
                                }}
                            />
                        </div>
                        <div className='col-md-6'>
                            <SearchCard
                                user={{
                                    source: 'github',
                                    login: 'login',
                                    avatar_url: '#',
                                    name: 'name',
                                    created_at: Date.now(),
                                    bio: 'bio',
                                    public_repos: 0,
                                    html_url: '#'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Profile.contextType = AuthContext;

export default Profile;
