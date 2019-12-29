import React from 'react';

class SearchCard extends React.Component {
    render() {
        const details = Object.keys(this.props.details).map(key => {
            return (
                <div>
                    {key}: {this.props.details[key]}
                </div>
            );
        });

        return (
            <div>
                <h1>{this.props.source}</h1>
                {details}
            </div>
        );
    }
}

export default SearchCard;
