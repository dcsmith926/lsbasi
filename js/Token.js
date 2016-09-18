class Token {
  
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
  
  toString() {
    return `Token(${this.type}, ${this.value})`;
  }
  
}

// the types of tokens
Object.assign(Token, {
  BEGIN: 'BEGIN',
  END: 'END',
  PLUS: 'PLUS',
  MINUS: 'MINUS',
  MUL: 'MUL',
  DIV: 'DIV',
  LPAREN: 'LPAREN',
  RPAREN: 'RPAREN',
  INTEGER: 'INTEGER',
  ID: 'ID',
  SEMI: 'SEMI',
  ASSIGN: 'ASSIGN',
  DOT: 'DOT',
  EOF: 'EOF'
});

module.exports = Token;