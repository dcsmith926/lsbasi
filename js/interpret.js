const Lexer = require('./Lexer');
const Parser = require('./Parser');
const Interpreter = require('./Interpreter');

const lexer = new Lexer(process.argv[2]);
const parser = new Parser(lexer);
const interpreter = new Interpreter(parser);

interpreter.interpret();

console.log('The symbol table is: ');

Object.keys(interpreter.symbolTable.table).forEach(name => {
  console.log(name + ': ' + interpreter.symbolTable.get(name, null));
});