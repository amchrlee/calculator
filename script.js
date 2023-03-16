const methods = {
    add: function(a, b) {
        return a + b;
    },
    subtract: function(a, b) {
        return a - b;
    },
    multiply: function(a, b) {
        return a * b;
    },
    divide: function(a, b) {
    return a / b;
    }
};

let operate = (op, a, b) => {
    return methods[op](a, b);
};

// console.log(operate("multiply", 10, 6));