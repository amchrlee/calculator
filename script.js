const buttons = document.getElementsByClassName("calc__buttons");
const operandDisplay = document.querySelector(".calc__display--operand");
const operationDisplay = document.querySelector(".calc__display--operation");
const errorDisableBtns = document.getElementsByClassName("error-disable");

let displayValue = 0;
let firstOperand = null;
let secondOperand = null;
let firstOperator = null;
let secondOperator = null;
let result = null;
let equalsSelected = false;
let firstOperandCopy = null;
let OperatorCopy = null;
let secondOperandCopy = null;
let errorMessage = "ERROR";


function selectButton() {
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function() {
            if (buttons[i].classList.contains("operand")) {
                selectOperand(buttons[i].value);
                updateDisplay();
            } else if (buttons[i].classList.contains("decimal")) {
                addDecimal(buttons[i].value);
                updateDisplay();
            } else if (buttons[i].classList.contains("plus-minus")) {
                plusMinus();
                updateDisplay();
            } else if (buttons[i].classList.contains("backspace")) {
                backspace();
                updateDisplay();
            } else if (buttons[i].classList.contains("clear-entry")){
                clearEntry();
                updateDisplay();
            } else if (buttons[i].classList.contains("operator")) {
                selectOperator(buttons[i].value);
                updateDisplay();
            } else if (buttons[i].classList.contains("equals")){
                selectEquals();
                updateDisplay();
            } else if (buttons[i].classList.contains("all-clear")){
                allClear();
                updateDisplay();
            }
        });
    }
}

selectButton();

function updateDisplay() {
    operandDisplay.innerText = displayValue;
    if (displayValue.length > 10) {
        operandDisplay.innerText = displayValue.substring(0, 10);
    }

    if (firstOperand !== null && firstOperator !== null) {
        if (secondOperator === null) {
            operationDisplay.innerText = firstOperand + " " + firstOperator;
        } else if (secondOperator !== null) {
            operationDisplay.innerText = firstOperand + " " + secondOperator;
        }
    } else if (equalsSelected === true) {
        operationDisplay.innerText = firstOperandCopy + " " + OperatorCopy + " " + secondOperandCopy + " =";
    } else if (equalsSelected === false) {
        operationDisplay.innerText = "";
    }
}

updateDisplay();

function error() {
    displayValue = errorMessage;
    firstOperand = null;
    secondOperand = null;
    firstOperator = null;
    secondOperator = null;
    result = null;
    // disableBtns();
}

/*  Disable buttons when error message is shown as the displayValue:
        1. After pressing equals button
        2. After pressing operator button as secondOperator or any after the secondOperator
    Disabled buttons include the operators, decimal, and plus/minus.

    Enable buttons when starting a new operation after an error.
*/

/* function disableBtns() {
    errorDisableBtns.disabled = true;
}

function enableBtns() {
    errorDisableBtns.disabled = false;
} */

function copyOperation() {
    firstOperandCopy = firstOperand;
    secondOperandCopy = secondOperand;
    if (secondOperator === null) {
        OperatorCopy = firstOperator;
    } else {
        OperatorCopy = secondOperator;
    }
}

function operate(a, operator, b) {
    if (operator === "+") {
        return a + b;
    } else if (operator === "-") {
        return a - b;
    } else if (operator === "*") {
        return a * b;
    } else if (operator === "/") {
        if (b === 0 || b === "0") {
            return errorMessage;
        } else {
            return a / b;
        }
    }
}

function selectOperand(operand) {
    if (displayValue === errorMessage) {
        // FIRST OPERAND after error message -- clears the error and starts new operand
        allClear();
        displayValue = operand;
        // enableBtns();
    } else if (firstOperator === null) {
        if (displayValue === 0 || displayValue === "0") {
        // FIRST OPERAND -- first character of firstOperand
            allClear();
            displayValue = operand;
        } else if (displayValue === firstOperand) {
        // NEW FIRST OPERAND -- this starts a new operation after the equals button is pressed
            equalsSelected = false;
            displayValue = operand;
        } else {
        // FIRST OPERAND -- all other additional characters of firstOperand
            displayValue += operand;
        }
    } else {
        if (displayValue === firstOperand){
        // NEXT OPERAND -- first character of secondOperand
            displayValue = operand;
        } else if (displayValue === 0 || displayValue === "0") {
        // NEXT OPERAND -- first character of secondOperand after backspace changes displayValue to 0
            displayValue = operand;
        } else {
        // NEXT OPERAND -- all other additional characters of secondOperand 
            displayValue += operand;
        }
    }
}

function selectOperator(operator) {
    if (displayValue === errorMessage) {
        // ERROR MESSAGE -- NO OPERATOR CAN BE SELECTED
        error();
    } else if (secondOperator !== null && displayValue === firstOperand) {
        // CHANGE SECOND OPERATOR
        secondOperator = operator;
    } else if (firstOperator !== null && displayValue === firstOperand) {
        // CHANGE FIRST OPERATOR
        firstOperator = operator;
    } else if (firstOperator !== null && secondOperator === null) {
        // SECOND OPERATOR
        if (firstOperator === "/" && (displayValue === 0 || displayValue === "0")) {
            error();
        } else {
            secondOperator = operator;
            secondOperand = displayValue;
            result = operate(parseFloat(firstOperand), firstOperator, parseFloat(secondOperand));
            displayValue = roundAndChangeNotation(result);
            firstOperand = displayValue;
            secondOperand = null;
            result = null;
        }
    } else if (firstOperator !== null && secondOperator !== null) {
        // NEW SECOND OPERATOR -- any operator that is selected after the second
        if (secondOperator === "/" && (displayValue === 0 || displayValue === "0")) {
            error();
        } else {
            secondOperand = displayValue;
            result = operate(parseFloat(firstOperand), secondOperator, parseFloat(secondOperand));
            secondOperator = operator;
            displayValue = roundAndChangeNotation(result);
            firstOperand = displayValue;
            secondOperand = null;
            result = null;
        }
    } else {
        // FIRST OPERATOR -- selects the firstOperator and saves the displayValue of numbers to the firstOperand
        equalsSelected = false;
        firstOperator = operator;
        firstOperand = displayValue;
    }
}

function selectEquals() {
    if (firstOperator === null) {
        // displays the displayValue if nothing is assigned to operands or operators
        displayValue = displayValue;
    } else if (secondOperator !== null) {
        // addresses any operation that happens after the first operation
        secondOperand = displayValue;
        result = operate(parseFloat(firstOperand), secondOperator, parseFloat(secondOperand));
        if (isNaN(result)) {
            error();
        } else {
            displayValue = roundAndChangeNotation(result);
            copyOperation();
            firstOperand = displayValue;
            secondOperand = null;
            firstOperator = null;
            secondOperator = null;
            result = null;
            equalsSelected = true;
        }
    } else {
        // addresses the first operation
        secondOperand = displayValue;
        result = operate(parseFloat(firstOperand), firstOperator, parseFloat(secondOperand));
        if (isNaN(result)) {
            error();
        } else {
            displayValue = roundAndChangeNotation(result);
            copyOperation();
            firstOperand = displayValue;
            secondOperand = null;
            firstOperator = null;
            secondOperator = null;
            result = null;
            equalsSelected = true;
        }
    }
}

function roundAndChangeNotation(num) {
    if (num.toString().length > 10) {
        if (num % 1 != 0) {
            num = num.toFixed(2);
            num = parseFloat(num);
        }
        num = num.toExponential(4);
    }
    return num;
}

function addDecimal(dec) {
    if (displayValue === "" || displayValue === firstOperand || displayValue === secondOperand) {
        if (firstOperator === null) {
            equalsSelected = false;
        }
        
        displayValue = "0";
        displayValue += dec;
    } else if (displayValue === errorMessage) {
        error();
    } else if (displayValue === 0 || !displayValue.includes(dec)) {
        displayValue += dec;
    }
}

function backspace() {
    let displayValueStr = (displayValue).toString();

    if (displayValue === errorMessage) {
        error();
    } else if (firstOperator === null) {
        if (firstOperand === null && displayValueStr.length > 1) {
            displayValue = displayValueStr.slice(0, -1);
            displayValue = parseFloat(displayValue);
        } else if (firstOperand === null && displayValueStr.length === 1) {
            displayValue = 0;
        }
    } else if (firstOperator !== null && secondOperator === null) {
        if (displayValue === firstOperand) {
            displayValue = displayValue;
        } else if (secondOperand === null && displayValueStr.length > 1) {
            displayValue = displayValueStr.slice(0, -1);
            displayValue = parseFloat(displayValue);
        } else if (secondOperand === null && displayValueStr.length === 1) {
            displayValue = 0;
        } 
    } else if (secondOperator !== null) {
        if (displayValue === firstOperand) {
            displayValue = displayValue;
        } else if (secondOperand === null && displayValueStr.length > 1) {
            displayValue = displayValueStr.slice(0, -1);
            displayValue = parseFloat(displayValue);
        } else if (secondOperand === null && displayValueStr.length === 1) {
            displayValue = 0;
        } 
    }
}

function plusMinus() {
    if (displayValue === errorMessage) {
        error();
    } else if (displayValue === firstOperand || displayValue === secondOperand){
        displayValue;
    } else {
        displayValue = -displayValue;
    }
}

function clearEntry() {
    if (firstOperator === null && displayValue === firstOperand) {
        allClear();
    } else {
        displayValue = 0;
    }
}

function allClear() {
    displayValue = 0;
    operationDisplay.innerText = "";
    firstOperand = null;
    secondOperand = null;
    firstOperator = null;
    secondOperator = null;
    result = null;
    equalsSelected = false;
}
