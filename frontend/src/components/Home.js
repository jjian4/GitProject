import React from 'react';
import './Home.css';
import axios from 'axios';

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
                        <hr />
                        {this.state.githubUser && (
                            <div>
                                <div>Github</div>
                                <div>
                                    Username: {this.state.githubUser.login}
                                </div>
                                <div>Bio: {this.state.githubUser.bio}</div>
                                <div>
                                    Location: {this.state.githubUser.login}
                                </div>
                                <div>
                                    Date Created:{' '}
                                    {this.state.githubUser.created_at}
                                </div>
                            </div>
                        )}
                        <hr />
                        {this.state.gitlabUser && (
                            <div>
                                <div>Gitlab</div>
                                <div>id: {this.state.gitlabUser.id}</div>
                                <div>name: {this.state.gitlabUser.name}</div>
                                <div>
                                    username: {this.state.gitlabUser.username}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
