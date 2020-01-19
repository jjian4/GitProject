import React from 'react';
import './SiteTitle.css';

class SiteTitle extends React.Component {
    render() {
        return (
            <div className='siteTitle'>
                <span onClick={this.props.onClick}>GitTogether</span>
            </div>
        );
    }
}

export default SiteTitle;
