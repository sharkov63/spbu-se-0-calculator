import { useQuery } from "@tanstack/react-query";

import "./History.css";
import HistEquation from "./HistEquation";

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

function History({ setCalcToValue }) {
  const { isPending, isError, error, data } = useQuery({
    queryKey: ["historyList"],
    queryFn: fetchHistory
  })

  function historyBody() {
    if (isPending)
      return "Fetching..."
    if (isError)
      return "Error: " + error.message
    const recordList = data.toReversed().filter(isSuccessHistoryRecord);
    return (
      <ul>
        {recordList.map((record) => (
          <HistEquation
            value={`${record.expression} = ${record.result}`}
            onClick={() => { setCalcToValue(record.result) }}
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