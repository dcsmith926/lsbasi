import readline from 'readline';
import Interpreter from './Interpreter';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '% '
});

const interpreter = new Interpreter();

rl.on('line', (input) => {
  let value = interpreter.interpret(input);
  rl.write(value + '\n');
  rl.prompt();
});

rl.on('close', () => process.exit(0));

rl.prompt();
