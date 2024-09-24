package com.calculator.demo

import org.springframework.stereotype.Service
import java.text.DecimalFormat

@Service
class CalculatorService(
    val repository: CalculationResultRepository,
) {
    fun calculate(request: CalculationRequest): String {
        try {
            val result = CalculatorEngine(request.expression).evaluate()
            val roundedResult = DecimalFormat("#.######").format(result)
            val status = "success"
            val calculationResult =
                CalculationResult(
                    expression = request.expression,
                    status = status,
                    result = roundedResult,
                )
            repository.save(calculationResult)
            return roundedResult
        } catch (e: Exception) {
            throw e
        }
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
