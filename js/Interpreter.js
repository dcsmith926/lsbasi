const Token = require('./Token');
const NodeVisitor = require('./NodeVisitor');

const VISIT_METHODS = {
  
  __visit_CompoundNode(node) {
    let results = node.children.map(childNode => this.__visit(childNode));
    return results;
  },
  
  __visit_AssignmentNode(node) {
    // left node is an ID Token w/ a value for name
    let varName = node.left.value;
    this.symbolTable.set(varName, this.__visit(node.right));
  },
  
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
  },
  
  __visit_UnaryOpNode(node) {
    switch (node.token.type) {
      case Token.PLUS:
        return this.__visit(node.expr);
      case Token.MINUS:
        return -this.__visit(node.expr);
    }
  },
  
  __visit_VarNode(node) {
    let varName = node.value;
    let value = this.symbolTable.get(varName, null);
    if (value === null) {
      throw new ReferenceError(varName + ' is not defined');
    }
    return value;
  },
  
  __visit_IntegerNode(node) {
    return node.value;
  },
  
  __visit_NoOpNode(node) {
    return void 0;
  }

};

class SymbolTable {
  
  constructor() {
    this.table = {};
  }
  
  get(varName, defaultValue) {
    return this.table.hasOwnProperty(varName) ? this.table[varName] : defaultValue;
  }
  
  set(varName, value) {
    this.table[varName] = value;
  }
}

/**
 * Our interpreter interprets an abstract syntax tree
 * by visiting the nodes of the tree.
 */
class Interpreter extends NodeVisitor {

  constructor(parser) {
    
    super();
    
    this.parser = parser;
    this.symbolTable = new SymbolTable();
    
    Object.keys(VISIT_METHODS).forEach(methodName => {
      this[methodName] = VISIT_METHODS[methodName].bind(this);
    });
  }
  
  interpret() {
    let ast = this.parser.parse();
    return this.__visit(ast);
  }
  
}

module.exports = Interpreter;
