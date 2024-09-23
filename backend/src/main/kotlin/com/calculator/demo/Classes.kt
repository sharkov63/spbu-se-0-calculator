package com.calculator.demo

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import org.springframework.data.jpa.repository.JpaRepository

interface CalculationResultRepository : JpaRepository<CalculationResult, Long>

data class CalculationRequest(
    val expression: String,
)

@Entity
data class CalculationResult(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    val expression: String = "",
    val status: String = "",
    val result: Double? = null,
)
