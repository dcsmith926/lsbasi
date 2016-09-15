const Token = require('./Token');

module.exports = class Interpreter {

  constructor(lexer) {
    this.lexer = lexer;
    this.currentToken = this.lexer.getNextToken();
  }
  
  error() {
    throw new SyntaxError(`Unexpected token: ${this.currentToken}`);
  }
  
  eat(tokenType) {
    if (this.currentToken.type !== tokenType)
      this.error();
    this.currentToken = this.lexer.getNextToken();
  }
  
  expr() {
    
    // expr : term [[PLUS | MINUS] term]*
    
    let result = this.term();
    
    while ([Token.PLUS, Token.MINUS].indexOf(this.currentToken.type) > -1) {
      let token = this.currentToken;
      if (token.type === Token.PLUS) {
        this.eat(Token.PLUS);
        result = result + this.term();
      }
      else if (token.type === Token.MINUS) {
        this.eat(Token.MINUS);
        result = result - this.term();
      }
    }
    
    return result;
  }
  
  term() {
    
    // term : factor [[MUL | DIV] factor]*
    
    let result = this.factor();
    
    while ([Token.MUL, Token.DIV].indexOf(this.currentToken.type) > -1) {
      let token = this.currentToken;
      if (token.type === Token.MUL) {
        this.eat(Token.MUL);
        result = result * this.factor();
      }
      else if (token.type === Token.DIV) {
        this.eat(Token.DIV);
        result = result / this.factor();
      }
    }
    
    return result;
  }
  
  factor() {
    
    // factor : INTEGER | LPAREN expr RPAREN
    
    if (this.currentToken.type === Token.INTEGER) {
      let token = this.currentToken;
      this.eat(Token.INTEGER);
      return token.value;
    }
    else if (this.currentToken.type === Token.LPAREN) {
      this.eat(Token.LPAREN);
      let result = this.expr();
      this.eat(Token.RPAREN);
      return result;
    }
  }

};