import pgPromise from 'pg-promise'

const pgp = pgPromise()
const connection = {
  host: 'localhost',
  port: '5432',
  database: 'mayfly',
  user: 'sgp',
  password: 'mayfly'
};
const db = pgp(connection)

export async function insertBackendFailure() {
  const service_id = 1
  const launch_success = false
  const tableName = 'backends'
  const values = {
    service_id,
    launch_success
  }
  const insertQuery = pgp.helpers.insert(values, null, tableName)
  
  db.none(insertQuery)
  .then(() => console.log('insert success'))
  .catch(() => console.log('insert failure'))
}

export async function insertBackendSuccess(data) {
  const plane_id = data.backendId
  const service_id = 1
  const url = data.url
  const launch_success = true
  const tableName = 'backends'
  const values = {
    plane_id,
    service_id,
    url,
    launch_success
  }
  const insertQuery = pgp.helpers.insert(values, null, tableName)
  db.none(insertQuery)
  .then(() => console.log('insert success'))
  .catch(() => console.log('insert failure'))
}