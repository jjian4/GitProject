import React from 'react';
import './Home.css';
import axios from 'axios';
import SearchCard from './SearchCard';

class Home extends React.Component {
    state = {
        searchValue: '',
        githubUser: null,
        gitlabUser: null
    };

    fetchUsers = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/search/${this.state.searchValue}`
            );
            this.setState({
                githubUser: response.data.searchResults.github_user,
                gitlabUser: response.data.searchResults.gitlab_user
            });
        } catch {
            this.setState({ githubUser: null, gitlabUser: null });
        }
    };

    handleSearchSubmit = event => {
        event.preventDefault();
        this.fetchUsers();
    };

    handleSearch = event => {
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
                            onChange={this.handleSearch}
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
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
