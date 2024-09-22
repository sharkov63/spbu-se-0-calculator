package com.calculator.demo

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import org.springframework.data.jpa.repository.JpaRepository

interface CalculationResultRepository : JpaRepository<CalculationResult, Long>

data class CalculationRequest(
    val num1: Double,
    val operator: Char,
    val num2: Double,
)

@Entity
data class CalculationResult(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    val num1: Double = 0.0,
    val operator: Char = '+',
    val num2: Double = 0.0,
    val result: Double = 0.0,
)
