@file:Suppress("ktlint:standard:no-wildcard-imports")

package com.calculator.demo

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
class CalculatorController(
    val calculatorService: CalculatorService,
) {
    @PostMapping("/calculate")
    fun calculate(
        @RequestBody request: CalculationRequest,
    ): ResponseEntity<String> =
        try {
            val result = calculatorService.calculate(request)
            ResponseEntity.ok(result)
        } catch (e: Exception) {
            ResponseEntity.badRequest().body("failed. " + e.message)
        }

    @GetMapping("/history")
    fun getHistory(): ResponseEntity<List<CalculationResult>> {
        val history = calculatorService.getHistory()
        return ResponseEntity.ok(history)
    }

    @GetMapping("/history/{id}")
    fun getCalculationById(
        @PathVariable id: Long,
    ): ResponseEntity<String> =
        try {
            val result = calculatorService.getCalculationById(id)
            ResponseEntity.ok(result.toString())
        } catch (e: Exception) {
            ResponseEntity.badRequest().body("Ошибка: ${e.message}")
        }

    @DeleteMapping("/history")
    fun deleteHistory(): ResponseEntity<String> {
        calculatorService.deleteHistory()
        return ResponseEntity.ok("История успешно удалена")
    }
}
