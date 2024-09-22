package com.calculator.demo

import org.junit.jupiter.api.Test

import org.junit.jupiter.api.Assertions.*
import kotlin.math.abs

class CalculatorEngineTest {

    private val eps = 1e-9

    @Test
    fun evaluateSimple() {
        assertTrue(abs(CalculatorEngine("-2 + 3").evaluate() - 1) < eps)

        assertTrue(abs(CalculatorEngine("2 + 3 * 4").evaluate() - 14) < eps)

        assertTrue(abs(CalculatorEngine("2 + 3 * (4 + 1)").evaluate() - 17) < eps)

        assertTrue(abs(CalculatorEngine("2 + 3 * 4 ^ 2").evaluate() - 50) < eps)
    }

    @Test
    fun evaluateComplex() {
        assertTrue(abs(CalculatorEngine("(12 + 22*7) / (33 + (12*3 -8)) * 3").evaluate() - 8.16393442623) < eps)

        assertTrue(abs(CalculatorEngine("((10 - 8)^2 + 5 * (4 / 5))^(6 - 4)").evaluate() - 64) < eps)
    }

    @Test
    fun evaluateTricky() {
        assertTrue(abs(CalculatorEngine("0^0").evaluate() - 1) < eps)

        assertTrue(CalculatorEngine("1 / 0").evaluate().isInfinite())

        assertTrue(CalculatorEngine("2 ^ 100000").evaluate().isInfinite())

        assertTrue(CalculatorEngine("0 / 0").evaluate().isNaN())
    }

    @Test
    fun evaluateExceptions() {
        try {
            CalculatorEngine("2 + 3 * (4 + )").evaluate()
        } catch (e: RuntimeException) {
            e.message?.let { assertTrue(it.startsWith("Expected a number")) }
        }

        try {
            CalculatorEngine("2 + 3 * (4 + 1").evaluate()
        } catch (e: RuntimeException) {
            e.message?.let { assertTrue(it.startsWith("Unbalanced parentheses")) }
        }

        try {
            CalculatorEngine("2 + 3 * (4 + @)").evaluate()
        } catch (e: RuntimeException) {
            e.message?.let { assertTrue(it.startsWith("Expected a number")) }
        }
    }
}