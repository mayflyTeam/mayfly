function BackendDataRow({row}) {
  const url = row['url'] ? row['url'] : 'FAILED TO LAUNCH'
  return (
    <>
      <td>drop 4</td>
      <td>{url}</td>
      <td>{row['created_at']}</td>
    </>
  )
}

function Table({sqlData}) {
  console.log("hey were in table and sql data is a", sqlData)
  const rows = sqlData.map(row => {
    return (
      <tr key={row.id}>
        <BackendDataRow row={row}/>
      </tr>
    )
  })
  return (
    <div className="backendData">
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>url</th>
            <th>time created</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>

    </div>
  )
}

export default Table