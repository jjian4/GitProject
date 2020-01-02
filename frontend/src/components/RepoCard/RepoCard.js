import React from 'react';
import moment from 'moment';
import {
    faCalendarAlt,
    faEdit,
    faCode
} from '@fortawesome/free-solid-svg-icons';
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
                        <span className='repoDetailsIcon'>
                            <FontAwesomeIcon icon={faCalendarAlt} />
                        </span>
                        {moment(this.props.details.created_at).format(
                            'MMM DD, YYYY'
                        )}
                    </div>
                    <div className='col-6'>
                        <span className='repoDetailsIcon'>
                            <FontAwesomeIcon icon={faEdit} />{' '}
                        </span>
                        {moment(this.props.details.updated_at).format(
                            'MMM DD, YYYY'
                        )}
                    </div>
                </div>

                <div>{this.props.details.description}</div>

                <span>
                    <span className='repoDetailsIcon'>
                        <FontAwesomeIcon icon={faCode} />
                    </span>
                    {this.props.details.language}
                </span>
                <span className='starsAndForks'>
                    <span className='repoDetailsIcon'>
                        <Octicon icon={Star} />
                    </span>
                    {this.props.details.stargazers_count}
                    <span className='repoDetailsIcon forksIcon'>
                        <Octicon icon={RepoForked} />
                    </span>
                    {this.props.details.forks_count}
                </span>
            </a>
        );
    }
}

export default RepoCard;
