const Token = require('./Token');
const AST = require('./AST');
const BinOpNode = AST.BinOpNode;
const UnaryOpNode = AST.UnaryOpNode;
const IntegerNode = AST.IntegerNode;

class Parser {
  
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
    
    let node = this.term();
    
    while ([Token.PLUS, Token.MINUS].indexOf(this.currentToken.type) > -1) {
      let token = this.currentToken;
      this.eat(token.type);
      node = new BinOpNode(token, node, this.term());
    }
    
    return node;
  }
  
  term() {
    
    // term : factor [[MUL | DIV] factor]*
    
    let node = this.factor();
    
    while ([Token.MUL, Token.DIV].indexOf(this.currentToken.type) > -1) {
      let token = this.currentToken;
      this.eat(token.type);
      node = new BinOpNode(token, node, this.factor());
    }
    
    return node;
  }
  
  factor() {
    
    // factor : [PLUS | MINUS] factor | INTEGER | LPAREN expr RPAREN
    
    let token = this.currentToken;
    
    if (token.type === Token.PLUS || token.type === Token.MINUS) {
      this.eat(token.type);
      return new UnaryOpNode(token, this.factor());
    }
    
    if (token.type === Token.INTEGER) {
      this.eat(Token.INTEGER);
      return new IntegerNode(token);
    }
    
    if (token.type === Token.LPAREN) {
      this.eat(Token.LPAREN);
      let node = this.expr();
      this.eat(Token.RPAREN);
      return node;
    }
    
  }
  
  parse() {
    return this.expr();
  }
  
}

module.exports = Parser;
