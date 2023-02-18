import React, { useState } from 'react'
import { nanoid } from 'nanoid'
import Cover from './components/Cover'
import Question from './components/Question'


export default function App() {
    // gameStart tracks whether user should be shown 'Cover' page or 'Game' page
    const [gameStart, setGameStart] = useState(false)

    // category tracks quiz category selected, defaults to general knowledge 
    const [category, setCategory] = useState('general')

    // choicesMade to render button CSS once user clicks 'Check answers'
    const [choicesMade, setChoicesMade] = useState(false)

    // questions to store quiz questions fetched from OpenTDB API
    const [questions, setQuestions] = useState([])

    // Link categories to respective number used for API query
    const categoryObj = {
      film: '11',
      general: '9',
      history: '23',
      geography: '22',
      sports: '21',
      television: '14'
    }

    // Parse question retrieved from API query and return question object to be used for game
    function getNewQuestion(newQuestion) {
        const currentQuestion = newQuestion
        const answersArr = currentQuestion.incorrect_answers
        const randomNum = Math.floor(Math.random() * (answersArr.length + 1))
        answersArr.splice(randomNum, 0, currentQuestion.correct_answer)
        return {
            id: nanoid(),
            question: currentQuestion.question,
            choices: answersArr,
            answer: randomNum,
            selected: -1,
            correct: false
        }
    }
    
    // Add question object returned from getNewQuestion to array of new question objects
    function addNewQuestions(questionsArray) {
        const newQuestions = []
        for (let i = 0; i < questionsArray.length; i++) {
            newQuestions.push(getNewQuestion(questionsArray[i]))
        }
        return newQuestions
    }
    
    // Fetch questions from OpenTDB API. State that affects render is set within resolved promises
    function getQuestions(category) {
      setCategory(category)
      fetch(`https://opentdb.com/api.php?amount=5&type=multiple&category=${categoryObj[category]}`)
          .then(res => res.json())
          .then(data => {
            setQuestions(addNewQuestions(data.results))
            setChoicesMade(false)
            setGameStart(true)
            window.scrollTo({
              top: 0,
              left: 0
          })
          })
    }

    // Change question choice button CSS when selected by setting question object 'selected' property
    function selectButton(index, question) {
      setQuestions(prevQuestionArr => {
        return prevQuestionArr.map(prevQuestion => {
          return prevQuestion.id === question.id ? 
          {
            ...prevQuestion,
            selected: index
          } 
          : prevQuestion
        })
      })
    }

    // Once answers checked, set correct/incorrect choice button CSS by comparing question object 'selected' property to 'answer' property
    function checkAnswers() {
      setQuestions(prevQuestionArr => prevQuestionArr.map(prevQuestion => {
        return prevQuestion.answer === prevQuestion.selected ? {
          ...prevQuestion,
          correct: true
        } :
        prevQuestion
      }))
      setChoicesMade(true)
    }

    // When user chooses to change category (from the game menu, not cover menu), reset relevant state and reset category to 'General'
    function changeCategoryHandler() {
      setGameStart(false);
      setChoicesMade(false);
      setCategory('general')
    }

    // Iterate through question objects, count amount with 'correct' property set to true
    function calculateCorrectAnswers() {
      let correctCount = 0
      for (let i = 0; i < questions.length; i++) {
        questions[i].correct && correctCount++
      }
      return correctCount.toString()
    }

    // If user chooses 'Play again', fetch new questions
    function restartGame() {
      getQuestions(category)
    }
    
    // Cover menu
    const cover = (
            <Cover categories={categoryObj} getQuestions={getQuestions} />
        )

    // Game menu
    const game = (
        <div className='game'>
            {questions.map(question => {
                return (
                    <Question key={nanoid()} choicesMade={choicesMade} question={question} handleClick={selectButton} />
                )
            })}
            <div className='bottom-wrapper'>
                {choicesMade && <p>You scored {calculateCorrectAnswers()}/{questions.length} correct answers</p>}
                <div className='bottom-btn-wrapper'>
                  <button onClick={changeCategoryHandler} className='btn'>Change category</button>
                  <button onClick={choicesMade ? restartGame : checkAnswers} className='btn'>{choicesMade ? 'Play again' : 'Check answers'}</button>
                </div>
            </div>
        </div>
    )

    return (
        <div>
          {gameStart ? game : cover}
        </div>
    )
}