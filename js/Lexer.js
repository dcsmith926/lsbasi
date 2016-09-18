const Token = require('./Token');

const WHITESPACE_CHAR_REGEXP = /^\s$/;
const DIGIT_CHAR_REGEXP = /^\d$/;
const ALPHA_CHAR_REGEXP = /^[A-Za-z]$/;
const ALPHA_NUM_CHAR_REGEXP = /^[A-Za-z\d]$/;

const isWhitespace = char => WHITESPACE_CHAR_REGEXP.test(char);
const isDigit = char => DIGIT_CHAR_REGEXP.test(char);
const isAlpha = char => ALPHA_CHAR_REGEXP.test(char);
const isAlphaNum = char => ALPHA_NUM_CHAR_REGEXP.test(char);

class Lexer {
  
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
    while (isWhitespace(this.currentChar)) {
      this.advance();
    }
  }
  
  getInteger() {
    let integer = '';
    while (isDigit(this.currentChar)) {
      integer += this.currentChar;
      this.advance();
    }
    return parseInt(integer);
  }
  
  id() {
    
    // handle identifiers and reserved words
    
    let id = '';
    while (isAlphaNum(this.currentChar)) {
      id += this.currentChar;
      this.advance();
    }
    
    if (id === 'BEGIN') {
      return new Token(Token.BEGIN, id);
    }
    
    if (id === 'END') {
      return new Token(Token.END, id);
    }
    
    return new Token(Token.ID, id);
  }
  
  peek() {
    let peekPos = this.pos + 1;
    return peekPos > this.maxPos ? null : this.text[peekPos];
  }
  
  getNextToken() {
    
    while (this.currentChar !== null) {
      
      let c = this.currentChar;
      
      if (isWhitespace(c)) {
        this.skipWhitespace();
        continue;
      }
      
      if (isAlpha(c)) {
        return this.id();
      }
      
      if (isDigit(c)) {
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
      
      if (c === ':' && this.peek() === '=') {
        this.advance();
        this.advance();
        return new Token(Token.ASSIGN, ':=');
      }
      
      if (c === ';') {
        this.advance();
        return new Token(Token.SEMI, c);
      }
      
      if (c === '.') {
        this.advance();
        return new Token(Token.DOT, c);
      }
      
      this.error();
    }
    
    return new Token(Token.EOF, null);
  }
  
}

module.exports = Lexer;
