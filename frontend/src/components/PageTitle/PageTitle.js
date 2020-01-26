import React from 'react';
import './PageTitle.css';

class PageTitle extends React.Component {
    render() {
        return (
            <div className='pageTitle'>
                <span onClick={this.props.onClick}>{this.props.text}</span>
            </div>
        );
    }
}

export default PageTitle;
