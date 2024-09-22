import { useQuery } from "@tanstack/react-query";

import "./History.css";

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
        {data.map((record) => (
          <li key={record.id}>
            ID{record.id}: {record.num1} {record.operator} {record.num2} = {record.result}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="history">
      <h1>The history:</h1>
      {historyBody()}
    </div>
  )
}

export default History;