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
                    {/* TODO: Replace hardcoded following list */}
                    <div className='followingList row'>
                        <div className='col-md-6'>
                            <SearchCard
                                user={{
                                    source: 'github',
                                    login: 'shiyeli1999',
                                    avatar_url:
                                        'https://avatars0.githubusercontent.com/u/47112363?v=4',
                                    name: null,
                                    created_at: '2019-01-28T14:38:18Z',
                                    bio: 'Doris Li',
                                    public_repos: 6,
                                    html_url: 'https://github.com/shiyeli1999'
                                }}
                            />
                        </div>
                        <div className='col-md-6'>
                            <SearchCard
                                user={{
                                    source: 'gitlab',
                                    login: 'karen',
                                    avatar_url:
                                        'https://secure.gravatar.com/avatar/8b82bce21ec5797488e720b8ed601159?s=80&d=identicon',
                                    name: 'Karen Sijbrandij',
                                    created_at: '2012-09-17T16:18:06.000Z',
                                    public_repos: 4,
                                    html_url: 'https://gitlab.com/karen'
                                }}
                            />
                        </div>
                        <div className='col-md-6'>
                            <SearchCard
                                user={{
                                    source: 'bitbucket',
                                    login: 'jonathanj',
                                    avatar_url:
                                        'https://secure.gravatar.com/avatar/eda8d3b94b8caa3d86d372854eadd696?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FJJ-1.png',
                                    name: 'Jonathan Jacobs',
                                    created_at:
                                        '2010-10-24T21:14:09.321664+00:00',
                                    public_repos: 3,
                                    html_url:
                                        'https://bitbucket.org/%7B6a5e6060-d1fe-49c0-8abf-b187130d1f6f%7D/'
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
