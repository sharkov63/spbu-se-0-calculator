import React, { useState } from "react";
import { QueryClient, QueryClientProvider, useMutation, useQuery } from "@tanstack/react-query";

import Wrapper from "./components/Wrapper";
import Screen from "./components/calculator_components/Screen";
import ButtonBox from "./components/calculator_components/ButtonBox";
import Button from "./components/calculator_components/Button";
import History from "./components/history_components/History";
import CalcWrapper from "./components/calculator_components/CalcWrapper";
import HistWrapper from "./components/history_components/HistWrapper";
import HistorySign from "./components/history_components/HistorySign";
import HistEquation from "./components/history_components/HistEquation";

const queryClient = new QueryClient();

const btnValues = [
  ["(", ")", "^", "Del"],
  ["C", "+-", "%", "/"],
  [7, 8, 9, "X"],
  [4, 5, 6, "-"],
  [1, 2, 3, "+"],
  [0, ".", "="],
];

const calcRules = {
  "0": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "+", "-", "^", "X", "/", "%", "+-", "=", ")"],
  "1": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "+", "-", "^", "X", "/", "%", "+-", "=", ")"],
  "2": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "+", "-", "^", "X", "/", "%", "+-", "=", ")"],
  "3": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "+", "-", "^", "X", "/", "%", "+-", "=", ")"],
  "4": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "+", "-", "^", "X", "/", "%", "+-", "=", ")"],
  "5": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "+", "-", "^", "X", "/", "%", "+-", "=", ")"],
  "6": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "+", "-", "^", "X", "/", "%", "+-", "=", ")"],
  "7": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "+", "-", "^", "X", "/", "%", "+-", "=", ")"],
  "8": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "+", "-", "^", "X", "/", "%", "+-", "=", ")"],
  "9": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "+", "-", "^", "X", "/", "%", "+-", "=", ")"],
  ".": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "-", "X", "^", "/", "%", "+-", "=", ")"], 
  "+": ["0", "1", "2", "3", "4", "5", "6", "7", "8", ".", "9", "("], 
  "-": ["0", "1", "2", "3", "4", "5", "6", "7", "8", ".", "9", "("],
  "X": ["0", "1", "2", "3", "4", "5", "6", "7", "8", ".", "9", "("],
  "/": ["0", "1", "2", "3", "4", "5", "6", "7", "8", ".", "9", "("],
  "(": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "+", "-", "X", "/", "=", "("],
  ")": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "+", "-", "^", "X", "/", "=", "(", ")"],
  "^": ["0", "1", "2", "3", "4", "5", "6", "7", "8", ".", "9", "(", ")"],
  "empty": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "-", "(", ")"]
};

const leadingZeroesRule = ["+", "-", "(", ")", "^", "X", "/", "%", "+-", "="];

const toLocaleString = (num) =>
  String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");

const removeSpaces = (num) => num.toString().replace(/\s/g, "");

async function postCalculate(calcRequest) {
  const response = await fetch(
    "http://localhost:8080/api/calculate",
    {
      method: "POST",
      body: JSON.stringify(calcRequest),
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error('Failed to calculate on server-side: ' + errorMessage)
  }
  return response.text()
}

const App = () => {
  const [calc, setCalc] = useState({
    expression: "",
    num: 0,
  });

  function setCalcToValue(value) {
    setCalc({
      expression: value,
      num: Math.abs(value)
    })
  }

  function makeCalcRequest() {
    const exp = calc.expression.replace(/X/g, `*`)
    return {
      expression: exp
    }
  }

  const mutation = useMutation({
    mutationFn: () => {
      return postCalculate(makeCalcRequest())
    },
    onSuccess: (data) => {
      setCalcToValue(data)
      queryClient.invalidateQueries()
      setCalc({
        ...calc,
        expression: (data - parseInt(data, 10) !== 0) ? data.toString() : parseInt(data, 10).toString(),
        num: Math.abs(data),
      });
    },
    onError: (error) => {
      alert(error.message)
    },
  })

  const canAppend = (symbol) => {
    const len = calc.expression.length
    const key = len > 0 ? calc.expression[len - 1] : "empty"
    if (!(key in calcRules))
      return
    return calcRules[key].includes(symbol)
  }

  const numClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;
    if (!canAppend(value))
      return

    if (removeSpaces(calc.num).length < 16) {
      const len = calc.expression.length
      if (len >= 1 && calc.expression[len - 1] == "0" 
        && (len == 1 || leadingZeroesRule.includes(calc.expression[len - 2]))) {
        const trimmedExpression = calc.expression.slice(0, len - 1)
        setCalc({
          ...calc,
          expression: removeSpaces(calc.num) % 1 === 0
          ? trimmedExpression + toLocaleString(Number(removeSpaces(value)))
          : trimmedExpression + toLocaleString(value),
          num: removeSpaces(calc.num) % 1 === 0
          ? toLocaleString(Number(removeSpaces(calc.num + value)))
          : toLocaleString(calc.num + value),
        })
        return
      }
      setCalc({
        ...calc,
        expression:
          calc.num === 0 && value === "0"
            ? calc.expression + "0"
            : removeSpaces(calc.num) % 1 === 0
              ? calc.expression + toLocaleString(Number(removeSpaces(value)))
              : calc.expression + toLocaleString(value),
        num:
          calc.num === 0 && value === "0"
            ? "0"
            : removeSpaces(calc.num) % 1 === 0
              ? toLocaleString(Number(removeSpaces(calc.num + value)))
              : toLocaleString(calc.num + value),
      });
    }
  };

  const commaClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;

    if (!canAppend(value))
      return

    setCalc({
      ...calc,
      expression: !calc.num.toString().includes(".") ? calc.expression + value : calc.expression,
      num: !calc.num.toString().includes(".") ? calc.num + value : calc.num,
    });
  };

  const signClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;

    if (!canAppend(value))
      return

    setCalc({
      ...calc,
      expression: calc.expression + value,
      num: 0,
    });
  };

  const equalsClickHandler = () => {
    if (!canAppend("="))
      return

    mutation.mutate()
  };

  const invertClickHandler = () => {
    if (!canAppend("+-"))
      return

    const matches = calc.expression.match(/[^0-9.]/g);
    const lastNonDigitOrDotIndex = matches ? calc.expression.lastIndexOf(matches[matches.length - 1]) : -1;
    
    setCalc({
      ...calc,
      expression: (lastNonDigitOrDotIndex !== -1 ? calc.expression.slice(0, lastNonDigitOrDotIndex + 1) : "") + (calc.num ? "(" + toLocaleString(removeSpaces(calc.num) * -1) + ")" : "0"),
      num: calc.num ? toLocaleString(removeSpaces(calc.num) * -1) : 0,
    });
  };

  const percentClickHandler = () => {
    if (!canAppend("%"))
      return

    const matches = calc.expression.match(/[^0-9.]/g);
    const lastNonDigitOrDotIndex = matches ? calc.expression.lastIndexOf(matches[matches.length - 1]) : -1;

    let num = calc.num ? parseFloat(removeSpaces(calc.num)) : 0;

    setCalc({
      ...calc,
      expression: (lastNonDigitOrDotIndex !== -1 ? calc.expression.slice(0, lastNonDigitOrDotIndex + 1) : "") + (num /= Math.pow(100, 1)).toString(),
      num: (num /= Math.pow(100, 1)),
    });
  };

  const resetClickHandler = () => {
    setCalc({
      ...calc,
      expression: "",
      num: 0,
    });
  };

  const bracketClickHandler = () => {
    if (!canAppend("("))
      return

    setCalc({
      ...calc,
      expression: calc.expression + "(",
      num: 0,
    });
  }

  const backBracketClickHandler = () => {
    if (!canAppend(")"))

    setCalc({
      ...calc,
      expression: calc.expression + ")",
      num: 0,
    });
  }

  const deleteClickHandler = () => {
    setCalc({
      ...calc,
      expression: calc.expression.length > 0 ? calc.expression.slice(0, calc.expression.length - 1) : "",
    });
  }

  return (
    <Wrapper>
      <CalcWrapper>
        <Screen value={calc.expression} />
        <ButtonBox>
          {btnValues.flat().map((btn, i) => {
            return (
              <Button
                key={i}
                className={btn === "=" ? "equals" : ""}
                value={btn}
                onClick={
                  btn === "C"
                    ? resetClickHandler
                    : btn === "+-"
                      ? invertClickHandler
                      : btn === "%"
                        ? percentClickHandler
                        : btn === "="
                          ? equalsClickHandler
                          : btn === "/" || btn === "X" || btn === "-" || btn === "+" || btn === "^"
                            ? signClickHandler
                            : btn === "."
                              ? commaClickHandler
                              : btn == "(" 
                                ? bracketClickHandler 
                                : btn == ")" 
                                  ? backBracketClickHandler 
                                  : btn == "Del" 
                                    ? deleteClickHandler 
                                    : numClickHandler
                }
              />
            );
          })}
        </ButtonBox>
      </CalcWrapper>
      <HistWrapper>
        <HistorySign/>
        <History setCalcToValue={setCalcToValue}/>
      </HistWrapper>
    </Wrapper>
  );
}

function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}

export default Root;
