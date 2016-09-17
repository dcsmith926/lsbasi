const Lexer = require('./Lexer');
const Parser = require('./Parser');
const Interpreter = require('./Interpreter');

const lexer = new Lexer(process.argv[2]);
const parser = new Parser(lexer);
const interpreter = new Interpreter(parser);

console.log(interpreter.interpret());