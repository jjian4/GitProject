import React from 'react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Spinner.css';

const Spinner = () => {
    return (
        <div className='spinnerWrapper'>
            <span className='searchSpinner'>
                <FontAwesomeIcon icon={faSpinner} />
            </span>
        </div>
    );
};

export default Spinner;
