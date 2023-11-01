import express from 'express'
import pgPromise from 'pg-promise'
import axios from 'axios'

const router = express.Router()
const pgp = pgPromise();
const gcn = 'postgres://zacharykerner:mayfly@localhost:5432/mayfly_global'
const ucn = 'postgres://zacharykerner:mayfly@localhost:5432/mayfly_user'
const gdb = pgp(gcn);
const udb = pgp(ucn);

//opportunity for caching
router.get('/:user/servicesUser', (req, res) => {
  const userId = req.params['user']
  udb.many('SELECT id, name FROM SERVICES WHERE user_id=$1', userId)
    .then(services => {
      res.send(services)
    })
    .catch(error => {
      res.send("zacherror", error)
    })
})

router.get("/:user/services", (req, res) => {
  const userId = req.params.user;
  gdb.many('SELECT id, name FROM services WHERE user_id = $1', userId)
    .then(services => {
      res.send(services)
    })
    .catch(error => {
      console.log(error);
    });
});

router.get("/:user/servicesUser/:service", (req, res) => {
  const service = req.params.service
  udb.one("SELECT id from services WHERE name=$1", service)
  .then(response => {
    const id = response["id"]
    udb.many("SELECT url, launch_success, created_at, terminated_at FROM backends WHERE service_id=$1 ORDER BY created_at DESC", id)
    .then(backends => {
      const convertedBackends = backends.map(backend => {
        return {
          url: backend.url,
          launchSuccess: backend.launch_success,
          hatchedAt: backend.created_at,
          squishedAt: backend.terminated_at
        }
      })
        res.send(convertedBackends);
    })
  })
  
});

router.get('/:user/services/:service', (req, res) => {
  const user = req.params.user;
  const service = req.params.service;
  gdb.one('SELECT id FROM services WHERE name = $1', [service])
    .then (response => {
      gdb.many('SELECT url, launch_success, created_at, terminated_at FROM backends AS b JOIN users_backends AS ub ON b.id = ub.backend_id WHERE ub.user_id = $1 AND b.service_id = $2 ORDER BY b.created_at DESC', [user, response.id])
      .then(backends => {
        const convertedBackends = backends.map(backend => {
          return {
            url: backend.url,
            launchSuccess: backend.launch_success,
            hatchedAt: backend.created_at,
            squishedAt: backend.terminated_at
          }
        });

        res.send(convertedBackends);
        })
      .catch(error => console.log('Error on 2nd call', error))
    })
    .catch(error => console.log('Error on 1st call', error));
});

router.get('/:user/services/:service/hatch', (req, res) => {
  //1 send a hatch request to Nate's EC2
  //2 update the database
  //cache the name = service_id relationship, user; cache in session

  const serviceToImage = {
    "drop4": "ghcr.io/drifting-in-space/demo-image-drop-four:latest",
    "jupyter-notebook": 'ghcr.io/drifting-in-space/jamsocket-jupyter-notebook:sha-fa92787'
  }
  
  const planeIP = '54.144.171.127'
  const port = '3001'
  const image = serviceToImage[req.params.service]
  const userId = Number(req.params.user);
  const serviceName = req.params.service

  // const address = `http://${planeIP}:${port}/?image=${image}`
  const address = 'http://localhost:3000/testPlane'

  axios.get(address)
    .then((response) => {
      const data = response.data
      gdb.one('SELECT id FROM services WHERE name = $1', [serviceName])
        .then(serviceResponse => {
          const service_id = Number(serviceResponse.id)
          const success = data.error === null ? true : false;
          const url = data.url === null ? "launch failure" :  data.url;
          const info = {url: url, launchSuccess: success, service_id: service_id, error: data.error};
          console.log('url', url, 'launch_success', success, 'service_id', service_id)
          gdb.one("INSERT INTO backends (url, launch_success, service_id) VALUES ($1, $2, $3) RETURNING *", [url, success, service_id])
            .then(newBackend => {
              console.log("userId", userId, "newBackend", newBackend)
              gdb.none('INSERT INTO users_backends (user_id, backend_id) VALUES ($1, $2)', [userId, newBackend.id])
                .then(result => console.log(result))
                .catch(e => console.log("noneError", e));
            })
            .catch(err => console.log('insert backend error:', err));
      
          res.json(data);
        })
        .catch(e => {
          console.log("query name to id error")
        })

    })
    .catch(error => {
      console.log(error);
    })
})


router.get("/testPlane", (req, res) => {
  const roll = Math.random()
  const url = Math.floor(Math.random() * 1000)
  setTimeout(() => {
    if (roll < .5) {
      res.json({url: `www.workingBackend.com/${url}`, error: null})
    } else {
      res.json({url: null, error: "Plane error"})
    }
  }, 1200)
  
})

// global db insert
// const service_id = gdb.one('SELECT id FROM services where name = $1', [service]);
// const success = responseError ? false : true;
// const timestamp = new Date();
// const data = [{url: 'responseUrl', launch_success: success, created_at: timestamp; service_id: 1}];
// const columns = ['url', 'launch_success', 'created_at', 'service_id'];
// const table = 'backends';
// pgp.helpers.insert(data, columns, table);

router.get("/testNametoId", (req, res) => {
  gdb.one('SELECT id FROM services WHERE name = $1', ["drop4"])
  .then(response => console.log(response))
})

router.get("/testInsertInto", (req, res) => {
  const url = "www.www.com"
  const launch_success = 
  gdb.none("INSERT INTO services (url, launch_success, created_at, service_id) VALUES ($1, $2, $3)", [url, launch_success, date, service_id])
  .then(r => console.log("insert success"))
  .catch(e => console.log('insert error'))
})

router.post("/addService", (req, res) => {
  //security
  //post route with json object
  //req.name - string; req.image - string
  //sent as a post to Nate
  const data = req.data

  axios.post("/testAddService", data)
    .then(response => {

      res.send(response.status)
    })
    .catch(error => {
      console.log('nate add service error')
    })
})


router.post('testAddService', (req, res) => {

})
export default router