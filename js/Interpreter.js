const Token = require('./Token');
const NodeVisitor = require('./NodeVisitor');

/**
 * Our interpreter interprets an abstract syntax tree
 * by visiting the nodes of the tree.
 */
class Interpreter extends NodeVisitor {

  constructor(parser) {
    
    super();
    
    this.parser = parser;
    
    // we gotta bind our visitors !!
    this.__visit_BinOpNode = this.__visit_BinOpNode.bind(this);
    this.__visit_UnaryOpNode = this.__visit_UnaryOpNode.bind(this);
    this.__visit_IntegerNode = this.__visit_IntegerNode.bind(this);
  }
  
  interpret() {
    let ast = this.parser.parse();
    return this.__visit(ast);
  }
  
  __visit_BinOpNode(node) {
    
    let left = this.__visit(node.left);
    let right = this.__visit(node.right);
    
    switch (node.token.type) {
      case Token.PLUS:
        return left + right;
      case Token.MINUS:
        return left - right;
      case Token.MUL:
        return left * right;
      case Token.DIV:
        return left / right;
    }
  }
  
  __visit_UnaryOpNode(node) {
    switch (node.token.type) {
      case Token.PLUS:
        return this.__visit(node.expr);
      case Token.MINUS:
        return -this.__visit(node.expr);
    }
  }
  
  __visit_IntegerNode(node) {
    return node.value;
  }
  
}

module.exports = Interpreter;
