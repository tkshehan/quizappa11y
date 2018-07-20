'use strict';

$(runQuiz);
let quizState;

function runQuiz() {
  handleButtons();
  resetQuizState();
  renderPage('start');
}

function handleButtons() {
  handleStart();
  handleSubmit();
  handleNext();
  handleRestart();
}

function resetQuizState() {
  quizState = new QuizState();
}

/* Holds all data(questions, options, and answers), the state of the quiz,
and validates answers. */
function QuizState() {
  this.DATA = JSON.parse(DATA);
  this.numOfQuestions = Object.keys(this.DATA).length;

  this.currentQuestionNum = 1;
  this.currentQuestionData = this.DATA['question' + this.currentQuestionNum];

  this.score = 0;
  this.isCorrect = false;

  this.nextQuestion = function() {
    this.currentQuestionNum++;
    this.isCorrect = false;
    this.currentQuestionData = this.DATA['question' + this.currentQuestionNum];
  };

  this.submitOption = function(optionKey) {
    if (optionKey === this.currentQuestionData.answerKey) {
      this.isCorrect = true;
      this.score++;
    }
  };
}

function handleStart() {
  $('.js-start').on('click', '.js-start-button', function() {
    renderPage('question');
  });
}

function handleSubmit() {
  $('.js-question').on('submit', '#js-quiz-form', function(event) {
    event.preventDefault();
    let selection = $('input[name=option]:checked').val();
    quizState.submitOption(selection);
    renderPage('feedback');
  });
}

function handleNext() {
  $('.js-feedback').on('click', '.js-next-button', function() {
    if (quizState.currentQuestionNum < quizState.numOfQuestions) {
      quizState.nextQuestion();
      renderPage('question');
    } else {
      renderPage('final');
    }
  });
}

function handleRestart() {
  $('.js-final').on('click', '.js-final-button', function() {
    resetQuizState();
    renderPage('start');
  });
}

/* Renders the page based on the quizState
and the page type passed to it. Always builds score */
function renderPage(page) {
  buildScore();

  switch (page) {
    case 'start':
      renderStart();
      break;
    case 'question':
      renderQuestion();
      break;
    case 'feedback':
      renderFeedback();
      break;
    case 'final':
      renderFinal();
      break;
    default: // Do Nothing
  }

  function buildScore() {
    $('.js-score').html(`
      <h2>Question ${quizState.currentQuestionNum}/${quizState.numOfQuestions}</h3>
      <h3>Score: ${quizState.score}</h3>
  `);
  }

  function renderStart() {
    $('.js-hide').addClass('hidden');
    $('.js-start').removeClass('hidden');
    $('.js-start-button').focus();
  }

  function renderQuestion() {
    $('.js-hide').addClass('hidden');
    buildQuestion();
    $('.js-score, .js-question').removeClass('hidden');
  }

  function renderFeedback() {
    $('.js-hide').addClass('hidden');
    buildFeedback();
    $('.js-score, .js-feedback').removeClass('hidden');
    $('.js-next-button').focus();
  }

  function renderFinal() {
    $('.js-hide').addClass('hidden');
    buildFinal();
    $('.js-final').removeClass('hidden');
    $('.js-final-button').focus();
  }

  function buildQuestion() {
    $('.js-question').html(`

      <form id="js-quiz-form">
        <fieldset>
          <div class="row">
            <legend>
              <h2 class="js-current-question">${quizState.currentQuestionData.question}</h2>
            </legend>
          </div>
          <div class="row">
            <input type="radio" name="option" id="option1" value="option1" required>
            <label for="option1">${quizState.currentQuestionData.options.option1}</label>
          </div>

          <div class="row">
            <input type="radio" name="option" id="option2" value="option2" required>
            <label for="option2">${quizState.currentQuestionData.options.option2}</label>
          </div>

          <div class="row">
            <input type="radio" name="option" id="option3" value="option3" required>
            <label for="option3">${quizState.currentQuestionData.options.option3}</label>
          </div>

          <div class="row">
            <input type="radio" name="option" id="option4" value="option4" required>
            <label for="option4">${quizState.currentQuestionData.options.option4}</label>
          </div>
        </fieldset>
        <div class="row button-row">
          <button type="submit" class="js-submit-button">Submit</button>
        </div>
      </form>
    `);
  }

  function buildFeedback() {
    let result = 'Incorrect';
    if (quizState.isCorrect) {
      result = 'Nailed it!';
    }
    $('.js-feedback').html(`
      <div class="row">
        <h2>${result}</h3>
        <h3>It was ${quizState.currentQuestionData.answer}</h3>
      </div>
      <div class="row button-row">
        <button class="js-next-button">Next</button>
      </div>
    `);
  }

  function buildFinal() {
    let resultText = determineResultText();

    $('.js-final').html(`
    <h2>You Scored ${quizState.score} out of ${quizState.numOfQuestions}</h2>
    <h3>${resultText}</h1>
    <div class="row">
      <button class="js-final-button">Try Again?</button>
    </div>
  `);
  }

  function determineResultText() {
    let resultText;
    switch (quizState.score) {
      case 0:
      case 1:
        resultText = 'Not So Good';
        break;
      case 2:
      case 3:
        resultText = 'Not Bad';
        break;
      case 4:
        resultText = 'Excellent';
        break;
      case 5:
        resultText = 'Perfect';
        break;
      default: //Do Nothing
    }
    return resultText;
  }
}