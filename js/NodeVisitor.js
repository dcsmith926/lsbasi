/**
 * Abstract class for processing an abstract syntax tree
 * using the visitor pattern.
 * 
 * Subclasses may process the AST in whatever way they see fit,
 * this class merely handles the dispatching of the relevant
 * "__visit" methods for each type of node encountered in the tree.
 */
class NodeVisitor {
  
  constructor() {
    
  }
  
  __visit(node) {
    let methodName = `__visit_${node.constructor.name}`;
    let visitor = this[methodName];
    return visitor ? visitor(node) : this.__genericVisit(node);
  }
  
  __genericVisit(node) {
    throw new Error(`No __visit_${node.constructor.name} method`);
  }
  
}

module.exports = NodeVisitor;
