/**
 * Abstract base class for an abstract syntax tree.
 */
class AST {
  constructor() {
  }
}

class CompoundNode extends AST {
  constructor() {
    super();
    this.children = [];
  }
}

class AssignmentNode extends AST {
  constructor(token, left, right) {
    super();
    this.token = token;
    this.left = left;
    this.right = right;
  }
}

class BinOpNode extends AST {
  constructor(token, left, right) {
    super();
    this.token = token;
    this.left = left;
    this.right = right;
  }
}

class UnaryOpNode extends AST {
  constructor(token, expr) {
    super();
    this.token = token;
    this.expr = expr;
  }
}

class VarNode extends AST {
  constructor(token) {
    super();
    this.token = token;
    this.value = token.value; // easy access to value
  }
}

class IntegerNode extends AST {
  constructor(token) {
    super();
    this.token = token;
    this.value = token.value; // easy access to value
  }
}

class NoOpNode extends AST {
  constructor() {
    super();
  }
}

module.exports = {
  AST: AST,
  CompoundNode: CompoundNode,
  AssignmentNode: AssignmentNode,
  BinOpNode: BinOpNode,
  UnaryOpNode: UnaryOpNode,
  VarNode: VarNode,
  IntegerNode: IntegerNode,
  NoOpNode: NoOpNode
};
