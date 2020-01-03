import React from 'react';
import moment from 'moment';
import { faEdit, faCode } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Octicon, { Star, RepoForked } from '@primer/octicons-react';
import './RepoCard.css';

class RepoCard extends React.Component {
    render() {
        return (
            <a
                className='repoCard'
                href={this.props.details.html_url}
                target='_blank'
                rel='noopener noreferrer'
            >
                <div className='repoName'>{this.props.details.name}</div>

                <div className='row'>
                    <div className='col-6'>
                        <span className='repoDetailsIcon' title='Date Created'>
                            <FontAwesomeIcon icon={faCalendar} />
                        </span>
                        {moment(this.props.details.created_at).format(
                            'MMM DD, YYYY'
                        )}
                    </div>
                    <div className='col-6'>
                        <span className='repoDetailsIcon' title='Latest Update'>
                            <FontAwesomeIcon icon={faEdit} />
                        </span>
                        {moment(this.props.details.updated_at).format(
                            'MMM DD, YYYY'
                        )}
                    </div>
                </div>

                {this.props.details.description &&
                    this.props.details.description !== '' && (
                        <div className='description'>
                            {this.props.details.description}
                        </div>
                    )}

                <div className='bottomRow'>
                    <span>
                        <span className='repoDetailsIcon' title='Language'>
                            <FontAwesomeIcon icon={faCode} />
                        </span>
                        {this.props.details.language || 'Unknown'}
                    </span>
                    <span className='starsAndForks' title='Stars'>
                        <span className='repoDetailsIcon'>
                            <Octicon icon={Star} />
                        </span>
                        {this.props.details.stargazers_count}
                        <span
                            className='repoDetailsIcon forksIcon'
                            title='Forks'
                        >
                            <Octicon icon={RepoForked} />
                        </span>
                        {this.props.details.forks_count}
                    </span>
                </div>
            </a>
        );
    }
}

export default RepoCard;
