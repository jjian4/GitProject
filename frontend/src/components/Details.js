import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import './Details.css';

class Details extends React.Component {
    constants = {
        source: this.props.location.pathname.split('/')[2],
        username: this.props.location.pathname.split('/')[3]
    };

    state = {
        userInfo: null,
        userNotFound: false
    };

    componentDidMount = () => {
        this.fetchUserDetails();
    };

    fetchUserDetails = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/details/${this.constants.source}/${this.constants.username}` //TODO: implement on backend
            );
            this.setState({
                userInfo: response.data
            });
        } catch (e) {
            console.log(e);
            this.setState({ userNotFound: true });
        }
    };

    render() {
        // Redirect to home if no profile found
        if (this.state.userNotFound) {
            alert(
                `No ${this.constants.source} profile with username "${this.constants.username}" found.`
            );
            return <Redirect to='/' />;
        }

        return (
            <div className='details'>
                <div className='container'>
                    <div>{this.constants.source}</div>
                    <div>{this.constants.username}</div>
                </div>
            </div>
        );
    }
}

export default Details;
