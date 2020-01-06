import React from 'react';
import './Home.css';
import axios from 'axios';
import SearchCard from '../SearchCard/SearchCard';
import Spinner from '../Spinner/Spinner';

class Home extends React.Component {
    state = {
        prevValue: '',
        searchValue: '',
        searchResults: null,
        searchPending: false
    };

    fetchUsers = async () => {
        this.setState({ searchPending: true });

        try {
            const response = await axios.get(
                `http://localhost:5000/api/search/${this.state.searchValue}`
            );
            this.setState({
                searchResults: response.data.searchResults,
                searchPending: false
            });
        } catch {
            this.setState({ searchResults: null, searchPending: false });
        }
    };

    clearSearch = () => {
        this.setState({
            prevValue: '',
            searchValue: '',
            searchResults: null,
            searchPending: false
        });
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
        // Don't allow spaces and other risky chars
        const newChar = event.target.value.slice(-1);
        if (
            newChar === ' ' ||
            newChar === '/' ||
            newChar === ' \\' ||
            newChar === '%' ||
            newChar === '?'
        ) {
            return;
        }

        this.setState({
            searchValue: event.target.value
        });
    };

    render() {
        let cards;
        if (this.state.searchResults) {
            cards = this.state.searchResults.map((item, index) => {
                return <SearchCard key={index} user={item} />;
            });
        }

        return (
            <div className='home'>
                <div className='container'>
                    <div className='homeTitle'>
                        <span onClick={this.clearSearch}>GitTogether</span>
                    </div>
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

                    {this.state.searchPending && <Spinner />}

                    {!this.state.searchPending && !this.state.searchResults && (
                        <div className='about'>
                            <p>
                                GitTogether is a website that makes it easy to
                                discover and learn about developers on different
                                version control platforms such as Github,
                                Bitbucket, and Gitlab. After finding an account,
                                the user can visit the developer's official
                                profile or see a comprehensive summary, which
                                includes recent activity, repository details,
                                and programming language distributions.
                            </p>
                            <div>To complete before Spring 2020</div>
                            <ul>
                                <li>Set up database</li>
                                <li>Authentication</li>
                                <li>
                                    Allow authenticated users to claim their own
                                    profiles and 'follow' other accounts
                                </li>
                                <li>Deployment</li>
                            </ul>
                        </div>
                    )}

                    {!this.state.searchPending && <div>{cards}</div>}
                </div>
            </div>
        );
    }
}

export default Home;
