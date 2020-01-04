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
        userNotFound: false,
        showMoreRepos: false
    };

    componentDidMount = () => {
        document.title = `${this.constants.username} (${this.constants.source})`;
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
        let headingClass;
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
                    headingClass = 'githubHeading';
                    sourceIcon = (
                        <span className='sourceIcon'>
                            <FontAwesomeIcon icon={faGithub} />
                        </span>
                    );
                    break;
                case 'gitlab':
                    headingClass = 'gitlabHeading';
                    sourceIcon = (
                        <span className='sourceIcon'>
                            <FontAwesomeIcon icon={faGitlab} />
                        </span>
                    );
                    break;
                case 'bitbucket':
                    headingClass = 'bitbucketHeading';
                    sourceIcon = (
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
                        <div className={`heading ${headingClass}`}>
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
                                        {sourceIcon}{' '}
                                        {details.name || details.login}{' '}
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
                                        <Pie
                                            data={{
                                                datasets: [
                                                    {
                                                        data: [10, 20, 30],
                                                        backgroundColor: [
                                                            'rgba(255, 99, 132, 0.2)',
                                                            'rgba(54, 162, 235, 0.2)',
                                                            'rgba(255, 206, 86, 0.2)',
                                                            'rgba(75, 192, 192, 0.2)',
                                                            'rgba(153, 102, 255, 0.2)',
                                                            'rgba(255, 159, 64, 0.2)'
                                                        ]
                                                    }
                                                ],
                                                labels: [
                                                    'Red',
                                                    'Yellow',
                                                    'Blue'
                                                ]
                                            }}
                                            options={{
                                                legend: {
                                                    position: 'bottom'
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className='col-md-6'>
                                        <div className='detailsSubtitle'>
                                            Recent Activity
                                        </div>
                                        <HorizontalBar
                                            data={{
                                                labels: [
                                                    'Red',
                                                    'Blue',
                                                    'Yellow',
                                                    'Green',
                                                    'Purple',
                                                    'Orange'
                                                ],
                                                datasets: [
                                                    {
                                                        label: '# of Votes',
                                                        data: [
                                                            12,
                                                            19,
                                                            3,
                                                            5,
                                                            2,
                                                            3
                                                        ],
                                                        backgroundColor: [
                                                            'rgba(255, 99, 132, 0.2)',
                                                            'rgba(54, 162, 235, 0.2)',
                                                            'rgba(255, 206, 86, 0.2)',
                                                            'rgba(75, 192, 192, 0.2)',
                                                            'rgba(153, 102, 255, 0.2)',
                                                            'rgba(255, 159, 64, 0.2)'
                                                        ],
                                                        borderColor: [
                                                            'rgba(255, 99, 132, 1)',
                                                            'rgba(54, 162, 235, 1)',
                                                            'rgba(255, 206, 86, 1)',
                                                            'rgba(75, 192, 192, 1)',
                                                            'rgba(153, 102, 255, 1)',
                                                            'rgba(255, 159, 64, 1)'
                                                        ],
                                                        borderWidth: 1
                                                    }
                                                ]
                                            }}
                                            options={{
                                                scales: {
                                                    yAxes: [
                                                        {
                                                            ticks: {
                                                                beginAtZero: true
                                                            }
                                                        }
                                                    ]
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className='detailsSubtitle'>Projects</div>
                                <div className='row'>{repos}</div>
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
                                                : `More (${details.public_repos})`}
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
