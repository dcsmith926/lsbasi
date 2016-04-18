'use strict';

class Token {
  
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
  
  toString() {
    return `Token(${this.type}, ${this.value})`;
  }
  
}

class Interpreter {
  
  constructor() {
    this.clear();
  }
  
  clear() {
    this.pos = 0;
    this.maxPos = null;
    this.currentChar = null;
    this.currentToken = null;
    this.currentValue = 0;
  }
  
  initialize(source) {
    this.maxPos = source.length - 1;
    this.currentChar = source[0];
    this.source = source;
  }
  
  eat(expectedTypes) {
    if (expectedTypes.indexOf(this.currentToken.type) !== -1) {
      this.currentToken = this.getNextToken();
    }
    else {
      let typeStr = expectedTypes.shift();
      while (expectedTypes.length) {
        typeStr += ` or ${expectedTypes.shift()}`;
      }
      throw new SyntaxError(`Expected a token of type ${typeStr}, instead got: ${this.currentToken.toString()}`);
    }
  }
  
  advance() {
    this.currentChar = this.pos < this.maxPos ? this.source[++this.pos] : null;
  }
  
  skipWhiteSpace() {
    while (this.currentChar === ' ')
      this.advance();
  }
  
  getInt() {
    let int = this.currentChar;
    this.advance();
    while (/\d/.test(this.currentChar)) {
      int += this.currentChar;
      this.advance();
    }
    return Number(int);
  }
  
  getNextToken() {
    
    while (this.currentChar !== null) {
      
      if (this.currentChar === ' ') {
        this.skipWhiteSpace();
        continue;
      }
      
      if (/\d/.test(this.currentChar)) {
        let value = this.getInt();
        return new Token('INTEGER', value);
      }
      
      if (this.currentChar === '+') {
        this.advance();
        return new Token('PLUS', '+');
      }
      
      if (this.currentChar === '-') {
        this.advance();
        return new Token('MINUS', '-');
      }
      
      throw new SyntaxError(`Unexpected character: ${this.currentChar}`);
    }
    
    return new Token('EOF');
  }
  
  interpret(source) {
    
    this.clear();
    this.initialize(source);
    
    // expect an INTEGER to start of
    this.currentToken = this.getNextToken();
    
    this.currentValue = this.currentToken.value;
    this.eat(['INTEGER']);
    
    // now expect a PLUS or MINUS followed by and INTEGER, any number of times
    while (this.currentToken.type !== 'EOF') {
      
      let op = this.currentToken.value;
      this.eat(['PLUS', 'MINUS']);
      
      let nextValue = this.currentToken.value;
      this.eat(['INTEGER']);
      
      this.currentValue = op === '+' ? this.currentValue + nextValue : this.currentValue - nextValue;
    }
    
    return this.currentValue;
  }
}