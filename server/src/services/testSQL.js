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

export function addFakeServiceTest() {
  const name = "chess in the park"
  const container_registry_address = "ghrcio.fakeaddress.com"
  const tableName = "services"
  const data = {
    name,
    container_registry_address
  }
  const insertQuery = pgp.helpers.insert(data, null, tableName)
  db.none(insertQuery)
  .then(()=> {
    console.log('it worked')
  })
  .catch(() => {
    console.log('it failed')
  })
}

export async function retrieveAllServicesTest() {
  const retrieveAll = new Promise((res, rej) => {
    db.any('SELECT * FROM services')
    .then(data => {
      res(JSON.stringify(data))
    })
    .catch(error => {
      rej('was an error in retrieveAll')
    });
  })
  try {
    const dataFromCall = await retrieveAll
    return dataFromCall
  } catch{
    const fail = await retrieveAll
    return fail
  }
}

export async function retrieveBackendsByService(serviceId) {
  const retrieveAll = new Promise((res, rej) => {
    db.any('SELECT * FROM backends WHERE service_id = $1', [serviceId])
    .then(data => {
      console.log('success in retrieveBackendsByService')
      res(JSON.stringify(data))
    })
    .catch(error => {
      rej('was an error in retrieveBackendsByService')
    });
  })
  try {
    const dataFromCall = await retrieveAll
    return dataFromCall
  } catch(e) {
    const fail = await retrieveAll
    return fail
  }
}

