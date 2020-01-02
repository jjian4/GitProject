import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import RepoCard from '../RepoCard/RepoCard';
import './Details.css';

class Details extends React.Component {
    constants = {
        source: this.props.location.pathname.split('/')[2],
        username: this.props.location.pathname.split('/')[3]
    };

    state = {
        user: null,
        userNotFound: false
    };

    componentDidMount = () => {
        this.fetchUserDetails();
    };

    fetchUserDetails = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/details/${this.constants.source}/${this.constants.username}`
            );
            this.setState({
                user: response.data
            });
        } catch (e) {
            console.log(e);
            this.setState({ userNotFound: true });
        }
    };

    render() {
        // Redirect to home if no profile found
        if (this.state.userNotFound) {
            alert(
                `No ${this.constants.source} profile with username "${this.constants.username}" found.`
            );
            return <Redirect to='/' />;
        }

        let details;
        let repos;
        if (this.state.user) {
            details = this.state.user.details;
            repos = details.repos.map((item, index) => {
                return (
                    <div className='col-md-6' key={index}>
                        <RepoCard details={item} />
                    </div>
                );
            });
        }

        return (
            <div className='details'>
                <div className='container'>
                    <div>Source: {this.constants.source}</div>
                    <div>Username: {this.constants.username}</div>
                    {details && (
                        <div>
                            <img src={details.avatar_url} alt='avatar' />
                            <div>Name: {details.name}</div>
                            <div>Bio: {details.bio}</div>
                            <a href={details.html_url}>Visit profile page</a>
                            <div>Joined: {details.created_at}</div>
                            <div>Number of repos: {details.public_repos}</div>
                            <br />
                            <div className='row'>{repos}</div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default Details;
