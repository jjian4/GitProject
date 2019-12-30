import React from 'react';
import {
    faGithub,
    faGitlab,
    faBitbucket
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './SearchCard.css';

class SearchCard extends React.Component {
    render() {
        // const details = Object.keys(this.props.details).map((key, index) => {
        //     return (
        //         <div className='col-lg-6' key={index}>
        //             {key}: {this.props.details[key]}
        //         </div>
        //     );
        // });

        let cardClass;
        let sourceIcon;
        switch (this.props.source) {
            case 'github':
                cardClass = 'grayCard';
                sourceIcon = <FontAwesomeIcon icon={faGithub} />;
                break;
            case 'gitlab':
                cardClass = 'orangeCard';
                sourceIcon = <FontAwesomeIcon icon={faGitlab} />;
                break;
            case 'bitbucket':
                cardClass = 'blueCard';
                sourceIcon = <FontAwesomeIcon icon={faBitbucket} />;
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
                <span className='username'>{this.props.user.login}</span>
                <span className='source'>{sourceIcon}</span>
                <div>Name: {this.props.user.name}</div>
                <div>Created at: {this.props.user.created_at}</div>
                {this.props.user.bio && <div>Bio: {this.props.user.bio}</div>}
                <div>{this.props.user.public_repos} Public Repos</div>
                <div className='cardButtons'>
                    <button className='cardButton'>Details</button>
                    <button className='cardButton'>Visit</button>
                    <button className='cardButton'>Follow</button>
                </div>
            </div>
        );
    }
}

export default SearchCard;
