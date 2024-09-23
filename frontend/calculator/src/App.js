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
  ["C", "+-", "%", "/"],
  [7, 8, 9, "X"],
  [4, 5, 6, "-"],
  [1, 2, 3, "+"],
  [0, ".", "="],
];

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
    sign: "",
    num: 0,
    res: 0,
  });

  function setCalcToValue(value) {
    setCalc({
      ...calc,
      res: value,
      sign: "",
      num: 0,
    })
  }

  function makeCalcRequest() {
    const lhs = Number(removeSpaces(calc.res))
    const operator = calc.sign == 'X' ? '*' : calc.sign
    const rhs = Number(removeSpaces(calc.num))
    return {
      expression: `${lhs}${operator}${rhs}`
    }
  }

  const mutation = useMutation({
    mutationFn: () => {
      return postCalculate(makeCalcRequest())
    },
    onSuccess: (data) => {
      setCalcToValue(data)
      queryClient.invalidateQueries()
    },
    onError: (error) => {
      alert(error.message)
    },
  })

  const numClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;

    if (removeSpaces(calc.num).length < 16) {
      setCalc({
        ...calc,
        num:
          calc.num === 0 && value === "0"
            ? "0"
            : removeSpaces(calc.num) % 1 === 0
              ? toLocaleString(Number(removeSpaces(calc.num + value)))
              : toLocaleString(calc.num + value),
        res: !calc.sign ? 0 : calc.res,
      });
    }
  };

  const commaClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;

    setCalc({
      ...calc,
      num: !calc.num.toString().includes(".") ? calc.num + value : calc.num,
    });
  };

  const signClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;

    setCalc({
      ...calc,
      sign: value,
      res: !calc.res && calc.num ? calc.num : calc.res,
      num: 0,
    });
  };

  const equalsClickHandler = () => {
    if (calc.sign && calc.num) {
      mutation.mutate()
    }
  };

  const invertClickHandler = () => {
    setCalc({
      ...calc,
      num: calc.num ? toLocaleString(removeSpaces(calc.num) * -1) : 0,
      res: calc.res ? toLocaleString(removeSpaces(calc.res) * -1) : 0,
      sign: "",
    });
  };

  const percentClickHandler = () => {
    let num = calc.num ? parseFloat(removeSpaces(calc.num)) : 0;
    let res = calc.res ? parseFloat(removeSpaces(calc.res)) : 0;

    setCalc({
      ...calc,
      num: (num /= Math.pow(100, 1)),
      res: (res /= Math.pow(100, 1)),
      sign: "",
    });
  };

  const resetClickHandler = () => {
    setCalcToValue(0)
  };

  return (
    <Wrapper>
      <HistWrapper>
        <HistorySign />
        <History setCalcToValue={setCalcToValue}/>
      </HistWrapper>
      <CalcWrapper>
        <Screen value={calc.num ? calc.num : calc.res} />
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
                          : btn === "/" || btn === "X" || btn === "-" || btn === "+"
                            ? signClickHandler
                            : btn === "."
                              ? commaClickHandler
                              : numClickHandler
                }
              />
            );
          })}
        </ButtonBox>
      </CalcWrapper>
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
