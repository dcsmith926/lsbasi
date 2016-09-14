# -*- coding: UTF-8 -*-
# an arithmetic expression interpreter following the grammar outlined in grammar.txt

"""
Context-free grammar to source code:

    1. Each rule R becomes a method, and references to that rule become a method call R().
       The body of the method follows the body of the rule, using the very same guidelines.
       
    2. Alternatives (a1 | a2 | ... | aN) become an if - elif - else statement.
    
    3. An optional grouping (...)* becomes a while statement that loops over 0 or more times.
    
    4. Each token reference T becomes a call to the method eat: eat(T).
       The way the eat method works is that it consumes the token T if it matches the current
       lookahead token, then it gets a new token from the lexer and assigns that token to the
       current_token internal variable.
"""


# Token types
#
# EOF (end-of-file) token is used to indicate that
# there is no more input left for lexical analysis
INTEGER, MUL, DIV, PLUS, MINUS, EOF = 'INTEGER', 'MUL', 'DIV', 'PLUS', 'MINUS', 'EOF'


class Interpreter(object):
    
    def __init__(self, lexer):
        self.lexer = lexer
        self.current_token = self.lexer.get_next_token()
        
    def error(self):
        raise Exception('Invalid syntax')
        
    def eat(self, type):
        """
        Consume a token of type type
        """
        if self.current_token.type == type:
            self.current_token = self.lexer.get_next_token()
        else:
            self.error()
    
    def factor(self):
        """
        factor : INTEGER
        """
        token = self.current_token
        self.eat(INTEGER)
        return token.value
        
    def term(self):
        """
        term: factor ((MUL | DIV) factor)*
        """
        
        result = self.factor()
        
        while self.current_token.type in (MUL, DIV):
            token = self.current_token
            if token.type == MUL:
                self.eat(MUL)
                result = result * self.factor()
            elif token.type == DIV:
                self.eat(DIV)
                result = result / self.factor()
                
        return result
        
    def expr(self):
        """
        expr: term ((PLUS | MINUS) term)*
        """
        
        result = self.term()
        
        while self.current_token.type in (PLUS, MINUS):
            token = self.current_token
            if token.type == PLUS:
                self.eat(PLUS)
                result = result + self.term()
            elif token.type == MINUS:
                self.eat(MINUS)
                result = result - self.term()
        
        return result


class Token(object):
    
    def __init__(self, type, value):
        self.type = type
        self.value = value
        
    def __str__(self):
        return 'Token({type}, {value})'.format(
            type=self.type,
            value=self.value
        )
    
    def __repr__(self):
        return self.__str__()
    

class Lexer(object):
    
    def __init__(self, text):
        self.text = text
        self.pos = 0
        self.current_char = self.text[self.pos]
    
    def error(self):
        raise Exception('Invalid character')
    
    def advance(self):
        self.pos += 1
        if self.pos > len(self.text) - 1:
            self.current_char = None  # Indicates end of input
        else:
            self.current_char = self.text[self.pos]

    def skip_whitespace(self):
        while self.current_char is not None and self.current_char.isspace():
            self.advance()

    def integer(self):
        result = ''
        while self.current_char is not None and self.current_char.isdigit():
            result += self.current_char
            self.advance()
        return int(result)
    
    def get_next_token(self):
        """
        Lexical analyzer (also known as scanner or tokenizer)

        This method is responsible for breaking a sentence
        apart into tokens. One token at a time.
        """
        
        while self.current_char is not None:

            if self.current_char.isspace():
                self.skip_whitespace()
                continue

            if self.current_char.isdigit():
                return Token(INTEGER, self.integer())
            
            if self.current_char == '+':
                self.advance()
                return Token(PLUS, '+')
                
            if self.current_char == '-':
                self.advance()
                return Token(MINUS, '-')

            if self.current_char == '*':
                self.advance()
                return Token(MUL, '*')

            if self.current_char == '/':
                self.advance()
                return Token(DIV, '/')

            self.error()

        return Token(EOF, None)


def main():
    while True:
        try:
            try:
                text = raw_input('calc> ')
            except NameError:  # Python3
                text = input('calc> ')
        except EOFError:
            break
        if not text:
            continue
        lexer = Lexer(text)
        interpreter = Interpreter(lexer)
        result = interpreter.expr()
        print(result)


if __name__ == '__main__':
    main()
