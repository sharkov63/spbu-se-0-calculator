import { useQuery } from "@tanstack/react-query";

import "./History.css";
import HistorySign from "./HistorySign";
import HistEquation from "./HistEquation";
import setCalc from "../../App"

async function fetchHistory() {
  const response = await fetch(
    "http://localhost:8080/api/history"
  )
  if (!response.ok)
    throw new Error('Failed to fetch history: ' + response.body)
  return response.json()
}

function History() {
  const { isPending, isError, error, data } = useQuery({
    queryKey: ["historyList"],
    queryFn: fetchHistory
  })

  function historyBody() {
    if (isPending)
      return "Fetching..."
    if (isError)
      return "Error: " + error.message
    return (
      <ul>
        {[...data].reverse().map((record) => (
          <HistEquation
            value={`${record.num1} ${record.operator} ${record.num2} = ${record.result}`}
          />
        ))}
      </ul>
    )
  }

  return (
    <div className="history">
      {historyBody()}
    </div>
  )
}

export default History;