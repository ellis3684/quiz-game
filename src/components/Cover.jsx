import React from 'react'
import { Button } from '@mui/material'

export default function Cover({ getQuestions, categories }) {

    // Capitalize category first letter for display to user
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <div className="cover">
            <div style={{ height: '15%' }}></div>
            <h1>Quiz Time</h1>
            <h2>Choose a category, or click 'Start quiz' for general knowledge</h2>
            <Button variant='contained' onClick={() => getQuestions('general')}>Start quiz</Button>
            <div className='category-btn-group'>
                {Object.entries(categories).map(([key], index) => {
                    return key !== 'general' && <Button key={index} id={'category-' + key} className='category-btn' variant='contained' onClick={() => getQuestions(key)}>{capitalizeFirstLetter(key)}</Button>
                })}
            </div>
        </div>
    )
}