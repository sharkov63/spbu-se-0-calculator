package com.calculator.demo

import org.springframework.stereotype.Service

@Service
class CalculatorService(
    val repository: CalculationResultRepository,
) {
    fun calculate(request: CalculationRequest): String {
        val expression = request.expression
        var status: String = "success"
        var result: Double = 0.0

        try {
            result = CalculatorEngine(request.expression).evaluate()
        } catch (e: Exception) {
            status = "failed. " + e.message
        }

        val calculationResult =
            CalculationResult(
                expression = expression,
                status = status,
                result = result,
            )
        repository.save(calculationResult)

        if (status != "success") return status
        return result.toString()
    }

    fun getCalculationById(id: Long): CalculationResult =
        repository.findById(id).orElseThrow {
            IllegalArgumentException("Результат не найден")
        }

    public fun getHistory(): List<CalculationResult> = repository.findAll()

    fun deleteHistory() {
        repository.deleteAll()
    }
}
