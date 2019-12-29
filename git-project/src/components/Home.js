import React from 'react';
import './Home.css';
import axios from 'axios';

class Home extends React.Component {
    state = {
        searchValue: '',
        githubUser: null
    };

    fetchUsers = async () => {
        try {
            const response = await axios.get(
                'https://api.github.com/users/' + this.state.searchValue
            );
            console.log(response);
            this.setState({ githubUser: response.data });
        } catch {
            this.setState({ githubUser: null });
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
                    <form class='searchForm' onSubmit={this.handleSearchSubmit}>
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
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
