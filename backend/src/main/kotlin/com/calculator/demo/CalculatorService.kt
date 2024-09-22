package com.calculator.demo

import org.springframework.stereotype.Service

@Service
class CalculatorService(
    val repository: CalculationResultRepository,
) {
    fun calculate(request: CalculationRequest): String {
        val num1 = request.num1
        val operator = request.operator
        val num2 = request.num2

        val result =
            when (operator) {
                '+' -> num1 + num2
                '-' -> num1 - num2
                '*' -> num1 * num2
                '/' -> if (num2 != 0.0) num1 / num2 else throw IllegalArgumentException("Деление на ноль")
                else -> throw IllegalArgumentException("Некорректный оператор. Поддерживаемые операторы: +, -, *, /")
            }

        val calculationResult =
            CalculationResult(
                num1 = num1,
                operator = operator,
                num2 = num2,
                result = result,
            )
        repository.save(calculationResult)

        return result.toString()
    }

    fun getCalculationById(id: Long): CalculationResult =
        repository.findById(id).orElseThrow {
            IllegalArgumentException("Результат не найден")
        }

    fun getHistory(): List<CalculationResult> = repository.findAll()

    fun deleteHistory() {
        repository.deleteAll()
    }
}
