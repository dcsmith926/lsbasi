const Lexer = require('./Lexer');
const Interpreter = require('./Interpreter');

const lexer = new Lexer(process.argv[2]);
const interpreter = new Interpreter(lexer);

console.log(interpreter.expr());