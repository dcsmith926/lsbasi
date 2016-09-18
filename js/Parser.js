const Token = require('./Token');
const AST = require('./AST');

class Parser {
  
  constructor(lexer) {
    this.lexer = lexer;
    this.currentToken = this.lexer.getNextToken();
  }
  
  error() {
    throw new SyntaxError(`Unexpected token: ${this.currentToken}`);
  }
  
  eat(tokenType) {
    if (this.currentToken.type !== tokenType) {
      this.error();
    }
    this.currentToken = this.lexer.getNextToken();
  }
  
  program() {
    
    // program : compount_statement DOT
    
    let node = this.compoundStatement();
    this.eat(Token.DOT);
    
    return node;
  }
  
  compoundStatement() {
    
    // compound_statement : BEGIN statement_list END
    
    this.eat(Token.BEGIN);
    let nodes = this.statementList();
    this.eat(Token.END);
    
    let root = new AST.CompoundNode();
    
    nodes.forEach(child => root.children.push(child));
    
    return root;
  }
  
  statementList() {
    
    /**
     * statement_list : statement
     *                | statement SEMI statement
     */
     
    let node = this.statement();
    
    let results = [node];
    
    while (this.currentToken.type === Token.SEMI) {
      this.eat(Token.SEMI);
      results.push(this.statement());
    }
    
    if (this.currentToken.type === Token.ID) {
      this.error();
    }
    
    return results;
  }
  
  statement() {
    
     /**
      * statement : compound_statement
      *           | assignment_statement
      *           | empty
      */
      
      if (this.currentToken.type === Token.BEGIN) {
        return this.compoundStatement();
      }
      
      if (this.currentToken.type === Token.ID) {
        return this.assignmentStatement();
      }
      
      return this.empty();
  }
  
  assignmentStatement() {
    
     // assignment_statement : variable ASSIGN expr
     
     let left = this.variable();
     let token = this.currentToken;
     this.eat(Token.ASSIGN);
     let right = this.expr();
     
     return new AST.AssignmentNode(token, left, right);
  }
  
  
  expr() {
    
    // expr : term ((PLUS | MINUS) term)*
    
    let node = this.term();
    
    while ([Token.PLUS, Token.MINUS].indexOf(this.currentToken.type) > -1) {
      let token = this.currentToken;
      this.eat(token.type);
      node = new AST.BinOpNode(token, node, this.term());
    }
    
    return node;
  }
  
  term() {
    
    // factor ((MUL | DIV) factor)*
    
    let node = this.factor();
    
    while ([Token.MUL, Token.DIV].indexOf(this.currentToken.type) > -1) {
      let token = this.currentToken;
      this.eat(token.type);
      node = new AST.BinOpNode(token, node, this.factor());
    }
    
    return node;
  }
  
  factor() {
    
    /**
     * factor : PLUS factor
     *        | MINUS factor
     *        | INTEGER
     *        | LPAREN expr RPAREN
     *        | variable
     */
    
    let token = this.currentToken;
    
    if (token.type === Token.PLUS) {
      this.eat(Token.PLUS);
      return new AST.UnaryOpNode(token, this.factor());
    }
    
    if (token.type === Token.MINUS) {
      this.eat(Token.MINUS);
      return new AST.UnaryOpNode(token, this.factor());
    }
    
    if (token.type === Token.INTEGER) {
      this.eat(Token.INTEGER);
      return new AST.IntegerNode(token);
    }
    
    if (token.type === Token.LPAREN) {
      this.eat(Token.LPAREN);
      let node = this.expr();
      this.eat(Token.RPAREN);
      return node;
    }
    
    if (token.type === Token.ID) {
      return this.variable();
    }
    
  }
  
  variable() {
    
    // variable : ID
    
    let token = this.currentToken;
    this.eat(Token.ID);
    
    return new AST.VarNode(token);
  }
  
  empty() {
    return new AST.NoOpNode();
  }
  
  parse() {
    let ast = this.program();
    if (this.currentToken.type !== Token.EOF) {
      this.error();
    }
    return ast;
  }
  
}

module.exports = Parser;
