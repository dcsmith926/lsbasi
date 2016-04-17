# -*- coding: UTF-8 -*-

# Token types
# EOF (end-of-file) token is used to indicate that
# there is no more input left for lexical analysis
INTEGER, PLUS, MINUS, EOF = 'INTEGER', 'PLUS', 'MINUS', 'EOF'

# Part 2 Exercises #3:
# Modify the code to interpret expressions containing an arbitrary number of additions and subtractions, for example “9 - 5 + 3 + 11”

class Token(object):

    def __init__(self, type, value):
        # token type: INTEGER, PLUS, MINUS, MULTIPLY, DIVIDE, or EOF
        self.type = type
        # token value: non-negative integer value, '+', '-', or None
        self.value = value

    def __str__(self):
        """String representation of the class instance.

        Examples:
            Token(INTEGER, 3)
            Token(PLUS '+')
        """
        return 'Token({type}, {value})'.format(
            type=self.type,
            value=repr(self.value)
        )

    def __repr__(self):
        return self.__str__()


class Interpreter(object):

    def __init__(self, text):
        
        # client string input, e.g. "3 + 5", "12 - 5", etc
        self.text = text
        
        # self.pos is an index into self.text
        self.pos = 0
        
        # current token instance
        self.current_token = None
        self.current_char = self.text[self.pos]
        
        # current value of evaluating the input
        self.current_value = 0;

    def error(self):
        raise Exception('Error parsing input')

    def advance(self):
        """Advance the 'pos' pointer and set the 'current_char' variable."""
        self.pos += 1
        if self.pos >= len(self.text):
            self.current_char = None  # Indicates end of input
        else:
            self.current_char = self.text[self.pos]

    def skip_whitespace(self):
        while self.current_char is not None and self.current_char.isspace():
            self.advance()

    def integer(self):
        """Return a (multidigit) integer consumed from the input."""
        result = ''
        while self.current_char is not None and self.current_char.isdigit():
            result += self.current_char
            self.advance()
        return int(result)

    def get_next_token(self):
        """Lexical analyzer (also known as scanner or tokenizer)

        This method is responsible for breaking a sentence
        apart into tokens.
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

            self.error()

        return Token(EOF, None)

    def eat(self, token_types):
        # compare the current token type with the passed token
        # type and if they match then "eat" the current token
        # and assign the next token to the self.current_token,
        # otherwise raise an exception.
        if self.current_token.type in token_types:
            self.current_token = self.get_next_token()
        else:
            self.error()

    def expr(self):
        """Parser / Interpreter

        expr -> INTEGER (PLUS | MINUS) INTEGER {(PLUS | MINUS) INTEGER}
        """
        
        left_value, right_value = None, None
        
        # if self.current_token isn't set, we're at beginning of input, so read in an integer
        if self.current_token == None:
            self.current_token = self.get_next_token()
            left_value = self.current_token.value
            self.eat([INTEGER])
        
        # if we've reached the end of the input, return our value (this is our base case for the recursion)
        elif self.current_token.type == 'EOF':
            return self.current_value
        
        # otherwise, we're in the middle of the input, so the current token should be a '+' or '-'
        # we'll use the current value as our left value
        else:
            left_value = self.current_value

        # we expect the current token to be a '+', or '-'
        op = self.current_token
        self.eat([PLUS, MINUS])

        # we expect the current token to be an integer
        right_value = self.current_token.value
        self.eat([INTEGER])
        
        if op.type == PLUS:
            self.current_value = left_value + right_value
        elif op.type == MINUS:
            self.current_value = left_value - right_value
        
        # recursively parse/interpret the rest of the passed expression
        return self.expr()


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
        interpreter = Interpreter(text)
        result = interpreter.expr()
        print(result)


if __name__ == '__main__':
    main()
