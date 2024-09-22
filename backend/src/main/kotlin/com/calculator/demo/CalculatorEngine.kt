package com.calculator.demo

import kotlin.math.pow

class CalculatorEngine(private val input: String) {

    private var pos = 0

    private fun consumeWhitespace() {
        while (pos < input.length && input[pos].isWhitespace()) {
            pos++
        }
    }

    private fun consume(expected: Char): Char {
        consumeWhitespace()
        if (pos < input.length && input[pos] == expected) {
            pos++
            return expected
        } else if (pos < input.length) {
            throw RuntimeException("Unexpected character '${input[pos]}' at position $pos. Expected '$expected'")
        } else {
            throw RuntimeException("Expected '$expected' but found end of input")
        }
    }

    private fun parseNumber(): Double {
        consumeWhitespace()
        var negative = false
        if (pos < input.length && input[pos] == '-') {
            negative = true
            pos++
        }
        var number = ""
        while (pos < input.length && input[pos].isDigit()) {
            number += input[pos]
            pos++
        }
        if (pos < input.length && input[pos] == '.') {
            pos++
            var decimal = ""
            while (pos < input.length && input[pos].isDigit()) {
                decimal += input[pos]
                pos++
            }
            number += ".$decimal"
        }
        if (number.isEmpty()) {
            throw RuntimeException("Expected a number at position $pos")
        }
        val result = number.toDouble()
        return if (negative) -result else result
    }

    private fun parseFactor(): Double {
        consumeWhitespace()
        var result: Double
        if (pos < input.length && input[pos] == '(') {
            consume('(')
            result = parseExpression()
            if (pos < input.length && input[pos] == ')') {
                consume(')')
            } else {
                throw RuntimeException("Unbalanced parentheses at position $pos")
            }
        } else {
            result = parseNumber()
        }
        while (true) {
            consumeWhitespace()
            if (pos < input.length && input[pos] == '^') {
                consume('^')
                result = result.pow(parseFactor())
            } else {
                break
            }
        }
        return result
    }

    private fun parseTerm(): Double {
        var result = parseFactor()
        while (true) {
            consumeWhitespace()
            if (pos < input.length && input[pos] == '*') {
                consume('*')
                result *= parseFactor()
            } else if (pos < input.length && input[pos] == '/') {
                consume('/')
                result /= parseFactor()
            } else {
                break
            }
        }
        return result
    }

    private fun parseExpression(): Double {
        var result = parseTerm()
        while (true) {
            consumeWhitespace()
            if (pos < input.length && input[pos] == '+') {
                consume('+')
                result += parseTerm()
            } else if (pos < input.length && input[pos] == '-') {
                consume('-')
                result -= parseTerm()
            } else {
                break
            }
        }
        return result
    }

    fun evaluate(): Double {
        val result = parseExpression()
        consumeWhitespace()
        if (pos < input.length) {
            throw RuntimeException("Unexpected character '${input[pos]}' at position $pos")
        }
        return result
    }
}
