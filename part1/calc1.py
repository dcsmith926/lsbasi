# Token types
#
# EOF (end-of-file) token is used to indicate that
# there is no more input left for lexical analysis
INTEGER, PLUS, MINUS, EOF = 'INTEGER', 'PLUS', 'MINUS', 'EOF'

# Part 1 exercises:
# 1. Modify the code to allow multiple-digit integers in the input, for example “12+3”
# 2. Add a method that skips whitespace characters so that your calculator can handle inputs with whitespace characters like ” 12 + 3”
# 3. Modify the code and instead of ‘+’ handle ‘-‘ to evaluate subtractions like “7-5”

class Token(object):
    def __init__(self, type, value):
        # token type: INTEGER, PLUS, or EOF
        self.type = type
        # token value: 0, 1, 2. 3, 4, 5, 6, 7, 8, 9, '+', or None
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
        # client string input, e.g. "3+5"
        self.text = text
        # self.pos is an index into self.text
        self.pos = 0
        # current token instance
        self.current_token = None

    def error(self):
        raise Exception('Error parsing input')

    def get_next_token(self):
        """Lexical analyzer (also known as scanner or tokenizer)

        This method is responsible for breaking a sentence
        apart into tokens. One token at a time.
        """
        text = self.text
        
        # return EOF token if we're past the end of the input text
        if self.pos >= len(text):
            return Token(EOF, None)
        
        # if current char is a space, skip to the next char
        if text[self.pos] == ' ':
            self.pos += 1
            return self.get_next_token()

        # if the current char is a digit, get all the next digits (if any)
        # and return an INTEGER token with the int value of the resulting number
        if text[self.pos].isdigit():
            number = text[self.pos]
            self.pos += 1
            while self.pos < len(text) and text[self.pos].isdigit():
                number += text[self.pos]
                self.pos += 1
            return Token(INTEGER, int(number))

        # if the current char is a plus sign, return our PLUS token
        if text[self.pos] == '+':
            self.pos += 1
            return Token(PLUS, '+')
            
        if text[self.pos] == '-':
            self.pos += 1
            return Token(MINUS, '-')

        # otherwise, throw a parse error
        self.error()

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
        """expr -> INTEGER PLUS INTEGER"""
        # set current token to the first token taken from the input
        self.current_token = self.get_next_token()

        # we expect the current token to be a single-digit integer
        left = self.current_token
        self.eat([INTEGER])

        # we expect the current token to be a '+' or '-' token
        op = self.current_token
        self.eat([PLUS, MINUS])

        # we expect the current token to be a single-digit integer
        right = self.current_token
        self.eat([INTEGER])
        # after the above call the self.current_token is set to
        # EOF token

        # at this point INTEGER PLUS INTEGER or INTEGER MINUS INTEGER sequence of tokens
        # has been successfully found and the method can just
        # return the result of adding two integers, thus
        # effectively interpreting client input
        result = left.value + right.value if op.type == PLUS else left.value - right.value
        return result


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
