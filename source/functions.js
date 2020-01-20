module.exports = {
    add: function(args, logger) {
        var message = 'Must add 2 numbers (Ex: "!add 1 2)"';
        if (args.length === 2) {
            const num1 = Number(args[0]);
            const num2 = Number(args[1]);
            logger.debug(`1: [${num1}], 2: [${num2}]`)
    
            if (isNaN(num1) || isNaN(num2)) { // if either is not NotANumber
                message = 'Arguments must be numbers'; // Should really throw an error which is caught in bots.js
            } else {
                message = num1 + num2;
            }
        }
        return message
    },

    isNKUStudent: function(firstName, lastName) {
        // Check directory.nku.edu/student and check if the last/name combo returns any students
    }
}