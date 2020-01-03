import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import {
    faGithub,
    faGitlab,
    faBitbucket
} from '@fortawesome/free-brands-svg-icons';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Octicon, { Repo } from '@primer/octicons-react';
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
        let icon;
        if (this.state.user) {
            details = this.state.user.details;
            repos = details.repos.map((item, index) => {
                return (
                    <div className='col-md-6' key={index}>
                        <RepoCard details={item} />
                    </div>
                );
            });
            switch (details.source) {
                case 'github':
                    icon = (
                        <span className='sourceIcon'>
                            <FontAwesomeIcon icon={faGithub} />
                        </span>
                    );
                    break;
                case 'gitlab':
                    icon = (
                        <span className='sourceIcon'>
                            <FontAwesomeIcon icon={faGitlab} />
                        </span>
                    );
                    break;
                case 'bitbucket':
                    icon = (
                        <span className='sourceIcon'>
                            <FontAwesomeIcon icon={faBitbucket} />
                        </span>
                    );
                    break;
                default:
                    break;
            }
        }

        return (
            <div className='details'>
                {details && (
                    <div>
                        <div className='heading'>
                            <div className='container'>
                                <a
                                    href={details.html_url}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    <img
                                        className='avatar'
                                        src={details.avatar_url}
                                        alt='avatar'
                                    />
                                    {/* Display either 'Username' or 'Name (username)' */}
                                    <div className='name'>
                                        {icon} {details.name || details.login}{' '}
                                        {details.name && (
                                            <span>({details.login})</span>
                                        )}
                                    </div>
                                </a>
                                <div>
                                    <span className='joinDate'>
                                        <span
                                            className='detailsIcon'
                                            title='Date Created'
                                        >
                                            <FontAwesomeIcon
                                                icon={faCalendarAlt}
                                            />
                                        </span>
                                        Joined{' '}
                                        {moment(details.created_at).format(
                                            'MMM DD, YYYY'
                                        )}
                                    </span>
                                    <span>
                                        <span
                                            className='detailsIcon'
                                            title='Repositories'
                                        >
                                            <Octicon icon={Repo} />
                                        </span>
                                        {details.public_repos} Projects
                                    </span>
                                </div>
                                <div>
                                    <b>Bio: </b>
                                    {details.bio}
                                </div>
                            </div>
                        </div>

                        <div className='container'>
                            <div>
                                <div className='detailsSubtitle'>Projects</div>
                                <div className='row'>{repos}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default Details;
