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

function isSuccessHistoryRecord(record) {
  return record.status === "success"
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
    const recordList = [...data].reverse().filter(isSuccessHistoryRecord);
    return (
      <ul>
        {recordList.map((record) => (
          <HistEquation
              key={record.id}
              expression={record.expression}
              result={record.result}
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