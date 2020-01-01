import React from 'react';
import './Home.css';
import axios from 'axios';
import SearchCard from './SearchCard';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
                    <div className='homeTitle'>GitTogether</div>
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

                    {this.state.searchPending && (
                        <div className='spinnerWrapper'>
                            <span className='searchSpinner'>
                                <FontAwesomeIcon icon={faSpinner} />
                            </span>
                        </div>
                    )}

                    {!this.state.searchPending && <div>{cards}</div>}
                </div>
            </div>
        );
    }
}

export default Home;
