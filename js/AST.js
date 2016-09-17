/**
 * Abstract base class for an abstract syntax tree.
 * Each node has a token.
 */
class AST {
  constructor(token) {
    this.token = token;
  }
}

class BinOpNode extends AST {
  constructor(token, left, right) {
    super(token);
    this.left = left;
    this.right = right;
  }
}

class UnaryOpNode extends AST {
  constructor(token, expr) {
    super(token);
    this.expr = expr;
  }
}

class IntegerNode extends AST {
  constructor(token) {
    super(token);
    this.value = token.value; // easy access to value
  }
}

module.exports = {
  AST: AST,
  BinOpNode: BinOpNode,
  UnaryOpNode: UnaryOpNode,
  IntegerNode: IntegerNode
};
