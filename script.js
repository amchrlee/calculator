const buttons = document.getElementsByClassName("calc__buttons");
const operandDisplay = document.querySelector(".calc__display--operand");
const equationDisplay = document.querySelector(".calc__display--equation");
const backspaceBtn = document.getElementById("backspace");

let displayValue = 0;
let firstOperand = null;
let secondOperand = null;
let firstOperator = null;
let secondOperator = null;
let result = null;

function operate(a, operator, b) {
    if (operator === "+") {
        return a + b;
    } else if (operator === "-") {
        return a - b;
    } else if (operator === "*") {
        return a * b;
    } else if (operator === "/") {
        if (b === 0) {
            return "ERROR";
        } else {
            return a / b;;
        }
    }
}

function updateDisplay() {
    operandDisplay.innerText = displayValue;
    if (displayValue.length > 10) {
        operandDisplay.innerText = displayValue.substring(0, 10);
    }
}

updateDisplay();

function selectOperand(operand) {
    if (firstOperand === null) {
        if (displayValue === 0 || displayValue === "0") {
        // FIRST OPERAND -- first character of firstOperand
            displayValue = operand;
        } else if (displayValue === firstOperand) {
        // NEW FIRST OPERAND -- this starts a new operation after the equals button is pressed
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
    if (secondOperator !== null && displayValue === firstOperand) {
        // CHANGE SECOND OPERATOR
        secondOperator = operator;
    } else if (firstOperator !== null && displayValue === firstOperand) {
        // CHANGE FIRST OPERATOR
        firstOperator = operator;
    } else if (firstOperator !== null && secondOperator === null) {
        // SECOND OPERATOR
        secondOperator = operator;
        secondOperand = displayValue;
        result = operate(Number(firstOperand), firstOperator, Number(secondOperand));
        displayValue = roundToHundredth(result);
        firstOperand = displayValue;
        secondOperand = null;
        result = null;
    } else if (firstOperator !== null && secondOperator !== null) {
        // NEW SECOND OPERATOR 
        secondOperand = displayValue;
        result = operate(Number(firstOperand), secondOperator, Number(secondOperand));
        secondOperator = operator;
        displayValue = roundToHundredth(result);
        firstOperand = displayValue;
        secondOperand = null;
        result = null;
    } else {
        // FIRST OPERATOR -- selects the firstOperator and saves the displayValue of numbers to the firstOperand
        firstOperator = operator;
        firstOperand = displayValue;
    }
}

/*  SITUATIONS WHEN PRESSING EQUALS BUTTON: 
    1. When numbers are displayed on the screen but nothing is assigned to the operands or operators - this will evaluate to the numbers displayed on the screen
    2. When firstOperand and firstOperator are assigned but nothing else - this will evaluate to firstOperand
    3. When firstOperand and firstOperator are assigned, and numbers are displayed for the secondOperand - this will assign the numbers on the display to secondOperand, and call the operate() function.
    4. When firstOperand, firstOperator, secondOperand, and secondOperator are assigned - this will call the operate function and assign the displayValue to the firstOperand
*/
function selectEquals() {
    if (firstOperator === null) {
        // displays the displayValue if nothing is assigned to operands or operators
        displayValue = displayValue;
    } else if (secondOperator !== null) {
        // addresses any operation that happens after the first operation
        secondOperand = displayValue;
        result = operate(Number(firstOperand), secondOperator, Number(secondOperand));
        displayValue = roundToHundredth(result);
        firstOperand = displayValue;
        secondOperand = null;
        firstOperator = null;
        secondOperator = null;
        result = null;
    } else {
        // addresses the first operation
        secondOperand = displayValue;
        result = operate(Number(firstOperand), firstOperator, Number(secondOperand));
        displayValue = roundToHundredth(result);
        firstOperand = displayValue;
        secondOperand = null;
        firstOperator = null;
        secondOperator = null;
        result = null;
    }
}

function roundToHundredth(num) {
    return Math.round(num * 100) / 100;
}

/*  SITUATIONS WHEN DECIMAL IS USED: 
    1. WHEN THE ONES PLACE IS ASSUMED TO BE 0
    2. WHEN THE PERSON MANUALLY PRESSES THE 0 OR ANOTHER NUMBER FOR THE ONES PLACE BEFORE PRESSING DECIMAL BTN
    3. THERE SHOULD ONLY BE ONE DECIMAL ALLOWED
*/
function addDecimal(dec) {
    if (displayValue === "" || displayValue === firstOperand || displayValue === secondOperand) {
        displayValue = "0";
        displayValue += dec;
    } else if (displayValue === 0 || !displayValue.includes(dec)) {
        displayValue += dec;
    }
}

/*  SITUATIONS WHEN BACKSPACE IS USED:
    1. Beginning the first operand - after typing one number
    2. Typing the number for the first operand - 2nd and on
    3. After first operator is selected
    4. Beginning the second operand - after typing one number
    5. Typing the number for the second operand - 2nd and on
    6. After second operator is selected

    Backspace should not work if an operator was already selected and the next operand has not been started yet.
*/
function backspace() {
    let displayValueStr = (displayValue).toString();

    if (firstOperator === null) {
        if (firstOperand === null && displayValueStr.length > 1) {
            displayValue = displayValueStr.slice(0, -1);
        } else if (firstOperand === null && displayValueStr.length === 1) {
            displayValue = 0;
        }
    } else if (firstOperator !== null && secondOperator === null) {
        if (displayValue === firstOperand) {
            displayValue = displayValue;
        } else if (secondOperand === null && displayValueStr.length > 1) {
            displayValue = displayValueStr.slice(0, -1);
        } else if (secondOperand === null && displayValueStr.length === 1) {
            displayValue = 0;
        } 
    } else if (secondOperator !== null) {
        if (displayValue === firstOperand) {
            displayValue = displayValue;
        } else if (secondOperand === null && displayValueStr.length > 1) {
            displayValue = displayValueStr.slice(0, -1);
        } else if (secondOperand === null && displayValueStr.length === 1) {
            displayValue = 0;
        } 
    }
}

function clearEntry() {
    displayValue = 0;
}

function allClear() {
    displayValue = 0;
    firstOperand = null;
    secondOperand = null;
    firstOperator = null;
    secondOperator = null;
    result = null;
}

function clickButton() {
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function() {
            if (buttons[i].classList.contains("operand")) {
                selectOperand(buttons[i].value);
                updateDisplay();
            } else if (buttons[i].classList.contains("operator")) {
                selectOperator(buttons[i].value);
                updateDisplay();
            } else if (buttons[i].classList.contains("equals")){
                selectEquals();
                updateDisplay();
            } else if (buttons[i].classList.contains("decimal")) {
                addDecimal(buttons[i].value);
                updateDisplay();
            } else if (buttons[i].classList.contains("backspace")) {
                backspace();
                updateDisplay();
            } else if (buttons[i].classList.contains("clear-entry")){
                clearEntry();
                updateDisplay();
            } else if (buttons[i].classList.contains("all-clear")){
                allClear();
                updateDisplay();
            }
        });
    }
}

clickButton();