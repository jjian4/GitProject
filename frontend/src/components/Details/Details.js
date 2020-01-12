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
import { Pie, HorizontalBar } from 'react-chartjs-2';
import { backgroundColor, borderColor } from '../../static/chartColors';
import Spinner from '../Spinner/Spinner';
import RepoCard from '../RepoCard/RepoCard';
import './Details.css';

class Details extends React.Component {
    constants = {
        source: this.props.location.pathname.split('/')[2],
        username: this.props.location.pathname.split('/')[3],
        // Number of repos to show when state.showMoreRepos is false
        repoPreviewCount: 4
    };

    state = {
        user: null,
        detailsPending: false,
        userNotFound: false,
        showMoreRepos: false
    };

    componentDidMount = () => {
        document.title = `${this.constants.username} (${this.constants.source})`;
        this.fetchUserDetails();
    };

    fetchUserDetails = async () => {
        this.setState({ detailsPending: true });

        try {
            const response = await axios.get(
                `http://localhost:5000/api/details/${this.constants.source}/${this.constants.username}`
            );
            this.setState({
                user: response.data,
                detailsPending: false
            });
        } catch (e) {
            console.log(e);
            this.setState({ userNotFound: true, detailsPending: false });
        }
    };

    toggleMoreRepos = () => {
        this.setState(prevState => {
            return { showMoreRepos: !prevState.showMoreRepos };
        });
    };

    render() {
        // Redirect to home if no profile found
        if (this.state.userNotFound) {
            alert(
                `Cannot find ${this.constants.source} profile with username "${this.constants.username}".`
            );
            return <Redirect to='/' />;
        }

        let details;
        let repos;
        let sourceIcon;
        if (this.state.user) {
            details = this.state.user.details;

            repos = details.repos.map((item, index) => {
                return (
                    <div className='col-md-6' key={index}>
                        <RepoCard details={item} />
                    </div>
                );
            });
            if (!this.state.showMoreRepos) {
                repos = repos.slice(0, this.constants.repoPreviewCount);
            }

            switch (details.source) {
                case 'github':
                    sourceIcon = <FontAwesomeIcon icon={faGithub} />;
                    break;
                case 'gitlab':
                    sourceIcon = <FontAwesomeIcon icon={faGitlab} />;
                    break;
                case 'bitbucket':
                    sourceIcon = <FontAwesomeIcon icon={faBitbucket} />;
                    break;
                default:
                    break;
            }
        }

        return (
            <div className='details'>
                {this.state.detailsPending && <Spinner />}
                {details && (
                    <div>
                        <div className={'heading'}>
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
                                    <br />
                                    {/* Display either 'Username' or 'Name (username)' */}
                                    <span className='name'>
                                        <span className='sourceIcon'>
                                            {sourceIcon}
                                        </span>
                                        {details.name || details.login}{' '}
                                        {details.name && (
                                            <span>({details.login})</span>
                                        )}
                                    </span>
                                </a>
                                <div>
                                    <span className='headingJoinDate'>
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
                                    <span className='headingRepoNum'>
                                        <span
                                            className='detailsIcon'
                                            title='Repositories'
                                        >
                                            <Octicon icon={Repo} />
                                        </span>
                                        {details.public_repos}{' '}
                                        {details.public_repos === 1
                                            ? 'Project'
                                            : 'Projects'}
                                    </span>
                                </div>
                                {details.bio && (
                                    <div>
                                        <b>Bio: </b>
                                        {details.bio}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='container'>
                            <div>
                                <div className='row'>
                                    <div className='col-md-6'>
                                        <div className='detailsSubtitle'>
                                            Languages
                                        </div>
                                        {Object.entries(details.language_counts)
                                            .length > 0 ? (
                                            <Pie
                                                data={{
                                                    datasets: [
                                                        {
                                                            data: Object.values(
                                                                details.language_counts
                                                            ),
                                                            backgroundColor
                                                        }
                                                    ],
                                                    labels: Object.keys(
                                                        details.language_counts
                                                    )
                                                }}
                                                options={{
                                                    legend: {
                                                        position: 'bottom'
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <div>[No Languages Found]</div>
                                        )}
                                    </div>

                                    <div className='col-md-6'>
                                        <div className='detailsSubtitle'>
                                            Recent Activity
                                        </div>
                                        {Object.entries(details.event_counts)
                                            .length > 0 ? (
                                            <HorizontalBar
                                                data={{
                                                    labels: Object.keys(
                                                        details.event_counts
                                                    ),
                                                    datasets: [
                                                        {
                                                            label:
                                                                '# of Events (Push, Merge, Issue, etc.)',
                                                            data: Object.values(
                                                                details.event_counts
                                                            ),
                                                            backgroundColor,
                                                            borderColor,
                                                            borderWidth: 1
                                                        }
                                                    ]
                                                }}
                                                options={{
                                                    scales: {
                                                        xAxes: [
                                                            {
                                                                ticks: {
                                                                    beginAtZero: true,
                                                                    precision: 0 // Round to whole numbers
                                                                }
                                                            }
                                                        ]
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <div>
                                                [No Recent Public Activity]
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className='detailsSubtitle'>Projects</div>
                                {details.public_repos > 0 ? (
                                    <div className='row'>{repos}</div>
                                ) : (
                                    <div>[No Public Projects]</div>
                                )}
                                {details.public_repos >
                                    this.constants.repoPreviewCount && (
                                    <div className='moreProjectsButtonWrapper'>
                                        <button
                                            className='moreProjectsButton customButton'
                                            onClick={this.toggleMoreRepos}
                                        >
                                            Show{' '}
                                            {this.state.showMoreRepos
                                                ? 'Less'
                                                : `More (${details.repos.length})`}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default Details;
