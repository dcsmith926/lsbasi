# -*- coding: UTF-8 -*-
# Interpreter which, takes as input an arithmetic expression in infix notation,
# and returns as output the same expression in postfix notation.

from spi import INTEGER, PLUS, MINUS, MUL, DIV, LPAREN, RPAREN, EOF, Token, Lexer, BinOp, Num, Parser, NodeVisitor


class InfixToPostfixInterpreter(NodeVisitor):
    
    def __init__(self, parser):
        self.parser = parser
    
    def visit_BinOp(self, node):
        return '%s %s %s' % (self.visit(node.left), self.visit(node.right), node.op.value)
    
    def visit_Num(self, node):
        return str(node.value)
    
    def interpret(self):
        tree = self.parser.parse()
        return self.visit(tree)
        
def main():
    while True:
        try:
            try:
                text = raw_input('spi> ')
            except NameError:  # Python3
                text = input('spi> ')
        except EOFError:
            break
        if not text:
            continue

        lexer = Lexer(text)
        parser = Parser(lexer)
        interpreter = InfixToPostfixInterpreter(parser)
        result = interpreter.interpret()
        print(result)


if __name__ == '__main__':
    main()
