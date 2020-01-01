import React from 'react';
import { Link } from 'react-router-dom';
import {
    faGithub,
    faGitlab,
    faBitbucket
} from '@fortawesome/free-brands-svg-icons';
import { faUser, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import './SearchCard.css';

class SearchCard extends React.Component {
    render() {
        let cardClass;
        let sourceIcon;
        switch (this.props.user.source) {
            case 'github':
                cardClass = 'grayCard';
                sourceIcon = (
                    <span className='source' title='Github'>
                        <FontAwesomeIcon icon={faGithub} />
                    </span>
                );
                break;
            case 'gitlab':
                cardClass = 'orangeCard';
                sourceIcon = (
                    <span className='source' title='Gitlab'>
                        <FontAwesomeIcon icon={faGitlab} />
                    </span>
                );
                break;
            case 'bitbucket':
                cardClass = 'blueCard';
                sourceIcon = (
                    <span className='source' title='Bitbucket'>
                        <FontAwesomeIcon icon={faBitbucket} />
                    </span>
                );
                break;
            default:
                break;
        }

        // props.user has the following keys: login, avatar_url, name, bio, created_at, public_repos
        return (
            <div className={`searchCard ${cardClass}`}>
                <img
                    className='avatar'
                    src={this.props.user.avatar_url}
                    alt='avatar'
                />
                <span className='name'>
                    {this.props.user.name || this.props.user.login}
                </span>
                {sourceIcon}
                <div className='cardDetails'>
                    <div className='row'>
                        <div className='col-sm-6'>
                            <span className='cardDetailsIcon'>
                                <FontAwesomeIcon icon={faUser} />
                            </span>
                            {this.props.user.login}
                        </div>
                        <div className='col-sm-6'>
                            <span className='cardDetailsIcon'>
                                <FontAwesomeIcon icon={faCalendarAlt} />
                            </span>
                            {moment(this.props.user.created_at).format(
                                'MMM DD, YYYY'
                            )}
                        </div>
                    </div>
                    {this.props.user.bio && (
                        <div>
                            <b>Bio:</b> {this.props.user.bio}
                        </div>
                    )}
                    <div className='numRepositories'>
                        <b>
                            {this.props.user.public_repos}{' '}
                            {this.props.user.public_repos === 1
                                ? 'Project'
                                : 'Projects'}
                        </b>
                    </div>
                </div>

                <div className='cardButtons'>
                    <Link
                        className='cardButton'
                        to={`/details/${this.props.user.source}/${this.props.user.login}`}
                    >
                        Details
                    </Link>
                    <a
                        className='cardButton'
                        href={this.props.user.html_url}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        Visit
                    </a>
                    <a className='cardButton' href=':;javascript'>
                        Follow
                    </a>
                </div>
            </div>
        );
    }
}

export default SearchCard;
