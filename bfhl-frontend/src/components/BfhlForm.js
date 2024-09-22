import React, { useState } from 'react';
import axios from 'axios';

const BfhlForm = () => {
    const [inputData, setInputData] = useState('');
    const [error, setError] = useState('');
    const [responseData, setResponseData] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleInputChange = (e) => {
        setInputData(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setResponseData(null);
        setShowDropdown(false);

        try {
            console.log('Input Data:', inputData); // Log the input data
            const jsonData = JSON.parse(inputData);
            const res = await axios.post('http://localhost:8080/bfhl', jsonData);
            console.log('Server Response:', res); // Log the server response
            setResponseData(res.data);
            setShowDropdown(true);
        } catch (err) {
            console.error('Error:', err); // Log the error for debugging
            if (err.response) {
                setError(`Server responded with status ${err.response.status}: ${err.response.data}`);
            } else {
                setError('Invalid JSON format or server error.');
            }
        }
    };

    const handleDropdownChange = (e) => {
        const options = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedOptions(options);
    };

    const renderResponse = () => {
    if (!responseData) return null;

    let filteredResponse = responseData;
    if (selectedOptions.includes('numbers')) {
        filteredResponse = { Numbers: responseData.Numbers };
    }

    return (
        <div>
            {Object.keys(filteredResponse).map(key => (
                <p key={key}>
                    {key}: {Array.isArray(filteredResponse[key]) ? filteredResponse[key].join(', ') : filteredResponse[key]}
                </p>
            ))}
        </div>
    );
};

    return (
        <div>
            <h1>Your Roll Number</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={inputData}
                    onChange={handleInputChange}
                    rows="4"
                    cols="50"
                    placeholder='Enter JSON input e.g., {"data": ["A", "C", "z"]}'
                />
                <button type="submit">Submit</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {showDropdown && (
                <div>
                    <select multiple onChange={handleDropdownChange}>
                        <option value="alphabets">Alphabets</option>
                        <option value="numbers">Numbers</option>
                        <option value="highestLowercaseAlphabet">Highest Lowercase Alphabet</option>
                    </select>
                </div>
            )}
            {renderResponse()}
        </div>
    );
};

export default BfhlForm;