const Token = require('./Token');

module.exports = class Lexer {
  
  constructor(text) {
    this.text = text;
    this.pos = 0;
    this.maxPos = this.text.length - 1;
    this.currentChar = this.text[this.pos];
  }
  
  error() {
    throw new Error(`Invalid character: ${this.currentChar}`);
  }
  
  advance() {
    this.pos++;
    if (this.pos > this.maxPos)
      this.currentChar = null; // signify EOF
    else
      this.currentChar = this.text[this.pos];
  }
  
  skipWhitespace() {
    while (this.currentChar === ' ')
      this.advance();
  }
  
  getInteger() {
    const intChars = [];
    while (/^\d$/.test(this.currentChar)) {
      intChars.push(this.currentChar);
      this.advance();
    }
    return parseInt(intChars.join(''), 10);
  }
  
  getNextToken() {
    
    while (this.currentChar !== null) {
      
      let c = this.currentChar;
      
      if (c === ' ') {
        this.skipWhitespace();
        continue;
      }
      
      if (/^\d$/.test(c)) {
        return new Token(Token.INTEGER, this.getInteger());
      }
      
      if (c === '+') {
        this.advance();
        return new Token(Token.PLUS, c);
      }
      
      if (c === '-') {
        this.advance();
        return new Token(Token.MINUS, c);
      }
      
      if (c === '*') {
        this.advance();
        return new Token(Token.MUL, c);
      }
      
      if (c === '/') {
        this.advance();
        return new Token(Token.DIV, c);
      }
      
      if (c === '(') {
        this.advance();
        return new Token(Token.LPAREN, c);
      }
      
      if (c === ')') {
        this.advance();
        return new Token(Token.RPAREN, c);
      }
      
      this.error();
    }
    
    return new Token(Token.EOF, null);
  }
  
};