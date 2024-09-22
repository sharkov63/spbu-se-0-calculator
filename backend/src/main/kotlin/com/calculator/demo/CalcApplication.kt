package com.calculator.demo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class CalcApplication

fun main(args: Array<String>) {
    runApplication<CalcApplication>(*args)
}
