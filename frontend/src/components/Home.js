import React from 'react';
import './Home.css';
import axios from 'axios';
import SearchCard from './SearchCard';

class Home extends React.Component {
    state = {
        prevValue: '',
        searchValue: '',
        githubUser: null,
        gitlabUser: null,
        bitbucketUser: null
    };

    fetchUsers = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/search/${this.state.searchValue}`
            );
            this.setState({
                githubUser: response.data.searchResults.github_user,
                gitlabUser: response.data.searchResults.gitlab_user,
                bitbucketUser: response.data.searchResults.bitbucket_user
            });
        } catch {
            this.setState({ githubUser: null, gitlabUser: null });
        }
    };

    handleSearchSubmit = event => {
        event.preventDefault();
        // Avoid unecessary requests
        if (
            this.state.prevValue === this.state.searchValue ||
            this.state.searchValue === ''
        ) {
            return;
        }
        this.setState({ prevValue: this.state.searchValue });
        this.fetchUsers();
    };

    handleSearchEdit = event => {
        this.setState({
            searchValue: event.target.value
        });
    };

    render() {
        return (
            <div className='home'>
                <div className='container'>
                    <div className='homeTitle'>Website Title</div>
                    <form
                        className='searchForm'
                        onSubmit={this.handleSearchSubmit}
                    >
                        <input
                            className='searchBar'
                            type='text'
                            placeholder='Search for user'
                            value={this.state.searchValue}
                            onChange={this.handleSearchEdit}
                        />
                    </form>

                    <div className='searchResults'>
                        {this.state.githubUser && (
                            <SearchCard
                                source='github'
                                user={this.state.githubUser}
                            />
                        )}
                        {this.state.gitlabUser && (
                            <SearchCard
                                source='gitlab'
                                user={this.state.gitlabUser}
                            />
                        )}
                        {this.state.bitbucketUser && (
                            <SearchCard
                                source='bitbucket'
                                user={this.state.bitbucketUser}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
