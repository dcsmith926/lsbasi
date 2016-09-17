class Token {
  
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
  
  toString() {
    return `Token(${this.type}, ${this.value})`;
  }
  
}

Object.assign(Token, {
  PLUS: 'PLUS',
  MINUS: 'MINUS',
  MUL: 'MUL',
  DIV: 'DIV',
  LPAREN: 'LPAREN',
  RPAREN: 'RPAREN',
  INTEGER: 'INTEGER',
  EOF: 'EOF'
});

module.exports = Token;