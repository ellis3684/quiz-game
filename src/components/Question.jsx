import React from 'react'
import { nanoid } from 'nanoid'

export default function Question({ question, handleClick, choicesMade }) {

    // Determine appropriate CSS class for question choice buttons
    function getChoiceBtnCssClass(question, index) {
        const appendedClasses = []
        const isSelectedQuestion = (question.selected === index)
        const isCorrectChoice = (question.answer === index)
        const isIncorrectSelection = (isSelectedQuestion && !isCorrectChoice)

        if (!choicesMade) {
            if (isSelectedQuestion) {
                appendedClasses.push('selected')
            }
        }
        
        else {
            if (isCorrectChoice) {
                appendedClasses.push('correct')
            } else {
                appendedClasses.push('faded')
                if (isIncorrectSelection) {
                    appendedClasses.push('incorrect')
                } 
            }
        }

        return 'choice-btn ' + appendedClasses.join(' ')
    }

    // OpenTDB API returns unescaped HTML, so must be parsed with DOMParser
    function htmlDecode(input) {
        const doc = new DOMParser().parseFromString(input, "text/html");
        return doc.documentElement.textContent;
    }

    return (
        <div>
            <p>{htmlDecode(question.question)}</p>
            <div className='btn-group'>
                {question.choices.map((choice, index) => {
                    return (
                        <button 
                            key={nanoid()}
                            className={getChoiceBtnCssClass(question, index)}
                            onClick={() => {
                                handleClick(index, question)
                            }} 
                        >{htmlDecode(choice)}
                        </button>
                    )
                })}
            </div>
            <hr />
        </div>
    )
}