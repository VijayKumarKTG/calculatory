import React from 'react';
import './App.css';

let IDs = [
  { id: 'clear', symbol: 'AC' },
  { id: 'zero', symbol: '0' },
  { id: 'one', symbol: '1' },
  { id: 'two', symbol: '2' },
  { id: 'three', symbol: '3' },
  { id: 'four', symbol: '4' },
  { id: 'five', symbol: '5' },
  { id: 'six', symbol: '6' },
  { id: 'seven', symbol: '7' },
  { id: 'eight', symbol: '8' },
  { id: 'nine', symbol: '9' },
  { id: 'add', symbol: '.' },
  { id: 'subtract', symbol: '+' },
  { id: 'multiply', symbol: '-' },
  { id: 'divide', symbol: '*' },
  { id: 'decimal', symbol: '/' },
  { id: 'equals', symbol: '=' },
];
let buttons = [];
let expStrArr = [];

function keypadUI() {
  IDs.forEach((ele) => {
    buttons.push(
      <button id={ele.id} key={ele.id} onClick={eventHandlers}>
        {ele.symbol}
      </button>
    );
  });
}

function eventHandlers(e) {
  let display = e.target.parentNode.parentNode.firstChild;
  if (display.textContent.length > 13) {
    display.style.fontFamily = 'Arial';
    display.textContent = 'Digit limit encountered';
  } else {
    switch (e.target.textContent) {
      /**
       * Operator Input handling case
       */
      case '+':
      case '-':
      case '*':
      case '/':
        signsHandler(display, e);
        break;

      /**
       * Decimal point input handling case
       */
      case '.':
        decimalHandler(display);
        break;

      /**
       * AC handling (clear handling) case
       */
      case 'AC':
        clearHandler(display);
        break;

      /**
       * Equals handling case
       */
      case '=':
        equalsHandler(display);
        break;

      /**
       * Numbers input handling case
       */
      default:
        numbersHandler(display, e);
    }
  }
}

/**
 * @param {object} display
 * @param {object} e
 * @processing input the sign or operator as a string and
 * determine the sign. If the user input again one of
 * +,-,*,/ after inputing one of those operators, then
 * the last operator will be used as operator except
 * minus operator. In case of '-', the last minus will be
 * append to the next coming number as a negative number.
 * And also add each operands and operators to the @variable
 * expStrArr array.
 */
const signsHandler = (display, e) => {
  if (
    display.textContent === '+' ||
    display.textContent === '-' ||
    display.textContent === '*' ||
    display.textContent === '/'
  ) {
    display.textContent = e.target.textContent;
    if (e.target.textContent === '-') {
      expStrArr.push(display.textContent);
    } else {
      expStrArr.pop();
      expStrArr.push(display.textContent);
    }
  } else {
    let lastInd = expStrArr.length - 1;
    if (
      lastInd >= 1 &&
      (expStrArr[lastInd - 1] === '+' ||
        expStrArr[lastInd - 1] === '-' ||
        expStrArr[lastInd - 1] === '*' ||
        expStrArr[lastInd - 1] === '/') &&
      expStrArr[lastInd] === '-'
    ) {
      expStrArr[lastInd] = expStrArr[lastInd] + display.textContent;
    } else {
      expStrArr.push(display.textContent);
    }
    expStrArr.push(e.target.textContent);
    display.textContent = e.target.textContent;
  }
};

/**
 * @param {object} display (div element)
 * Input decimal point and determine
 * whether the input number containe
 * zero or one decimal point
 */
function decimalHandler(display) {
  if (
    display.textContent === '+' ||
    display.textContent === '-' ||
    display.textContent === '*' ||
    display.textContent === '/'
  ) {
    display.textContent = '0';
  }
  display.textContent =
    display.textContent.indexOf('.') > -1
      ? display.textContent
      : display.textContent + '.';
}

/**
 * @param {object} display
 * @processing Initialize the display's text
 * content to '0' and set expStrArr to empty array
 */
function clearHandler(display) {
  display.textContent = '0';
  expStrArr = [];
}

/**
 * @param {object} display
 * @processing this handler call another function called
 * calculateExp().This handler then set display's text
 * content to the function return value. After that, it initializes
 * expStrArr with an empty array.
 */
function equalsHandler(display) {
  expStrArr.push(display.textContent);
  console.log(expStrArr);
  display.textContent = calculateExp();
  expStrArr = [];
}

/**
 * @processing Calculate the formula and then set it to the display.
 * To calculate the expression or formula, this method calls
 * handleSignsCalculation twice each for ('*','/') and ('+','-')
 */
function calculateExp() {
  handleSignsCalculation('*', '/');
  handleSignsCalculation('+', '-');
  return Number(expStrArr[0]).toFixed(3).toString();
}

/**
 * @param {string} firstSign
 * @param {string} secondSign
 * Calculate the expression based on the operator precedence
 */
const handleSignsCalculation = (firstSign, secondSign) => {
  let x, y, z;
  for (let i = 0; i < expStrArr.length; i++) {
    z = 0;
    if (i >= 1 && i <= expStrArr.length - 2) {
      x = Number(expStrArr[i - 1]);
      y = Number(expStrArr[i + 1]);
    }
    if (firstSign === '*' && expStrArr[i] === '*') {
      z = x * y;
    } else if (secondSign === '/' && expStrArr[i] === '/') {
      z = x / y;
    } else if (firstSign === '+' && expStrArr[i] === '+') {
      z = x + y;
    } else if (secondSign === '-' && expStrArr[i] === '-') {
      z = x - y;
    }

    if (z) {
      expStrArr = [
        ...expStrArr.slice(0, i - 1),
        String(z),
        ...expStrArr.slice(i + 2),
      ];
      i -= 1;
    }
  }
};

/**
 * @param {object} display (div element)
 * @param {object} e (event object)
 * @processing Numbers input handler function accepts numbers input
 * display the enter number on the display
 */
const numbersHandler = (display, e) => {
  if (
    display.textContent === '+' ||
    display.textContent === '-' ||
    display.textContent === '*' ||
    display.textContent === '/' ||
    display.textContent === '0'
  ) {
    display.textContent = '';
  }
  display.textContent += e.target.textContent;
};

function App() {
  return (
    <div className="wrapper">
      <div id="display">0</div>
      <div id="keypad">
        {keypadUI()}
        {buttons}
      </div>
    </div>
  );
}

export default App;
