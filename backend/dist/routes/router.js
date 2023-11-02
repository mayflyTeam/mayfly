"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const pg_promise_1 = __importDefault(require("pg-promise"));
const axios_1 = __importDefault(require("axios"));
const router = express_1.default.Router();
exports.router = router;
const pgp = (0, pg_promise_1.default)();
const cn = 'postgres://mayfly:mayfly@localhost:5432/mayfly';
const db = pgp(cn);
//opportunity for caching
router.get("/:user/services", (req, res) => {
    const userId = req.params.user;
    db.many('SELECT id, name FROM services WHERE user_id = $1', userId)
        .then(services => {
        res.send(services);
    })
        .catch(error => {
        console.log(error);
    });
});
router.get('/:user/services/:service', (req, res) => {
    const user = req.params.user;
    const service = req.params.service;
    db.one('SELECT id FROM services WHERE name = $1', [service])
        .then(response => {
        db.many('SELECT url, launch_success, created_at, terminated_at FROM backends AS b JOIN users_backends AS ub ON b.id = ub.backend_id WHERE ub.user_id = $1 AND b.service_id = $2 ORDER BY b.created_at DESC', [user, response.id])
            .then(backends => {
            const convertedBackends = backends.map(backend => {
                return {
                    url: backend.url,
                    launchSuccess: backend.launch_success,
                    hatchedAt: backend.created_at,
                    squishedAt: backend.terminated_at
                };
            });
            res.send(convertedBackends);
        })
            .catch(error => console.log('Error on 2nd call', error));
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
    };
    const planeIP = '34.237.126.241';
    const port = '3001';
    const image = serviceToImage[req.params.service];
    const userId = Number(req.params.user);
    const serviceName = req.params.service;
    const address = `http://${planeIP}:${port}/?image=${image}`;
    // const address: string = 'http://localhost:3000/testPlane'
    axios_1.default.get(address)
        .then((response) => {
        const data = response.data;
        db.one('SELECT id FROM services WHERE name = $1', [serviceName])
            .then(serviceResponse => {
            const service_id = Number(serviceResponse.id);
            const success = data.error === null ? true : false;
            const url = data.url === null ? "launch failure" : data.url;
            const info = { url: url, launchSuccess: success, service_id: service_id, error: data.error };
            console.log('url', url, 'launch_success', success, 'service_id', service_id);
            db.one("INSERT INTO backends (url, launch_success, service_id) VALUES ($1, $2, $3) RETURNING *", [url, success, service_id])
                .then(newBackend => {
                console.log("userId", userId, "newBackend", newBackend);
                db.none('INSERT INTO users_backends (user_id, backend_id) VALUES ($1, $2)', [userId, newBackend.id])
                    .then(result => console.log(result))
                    .catch(e => console.log("noneError", e));
            })
                .catch(err => console.log('insert backend error:', err));
            res.json(data);
        })
            .catch(e => {
            console.log("query name to id error");
        });
    })
        .catch(error => {
        console.log(error);
    });
});
router.get("/testPlane", (req, res) => {
    const roll = Math.random();
    const url = Math.floor(Math.random() * 1000);
    setTimeout(() => {
        if (roll < .5) {
            res.json({ url: `www.workingBackend.com/${url}`, error: null });
        }
        else {
            res.json({ url: null, error: "Plane error" });
        }
    }, 1200);
});
router.get("/testNametoId", (req, res) => {
    db.one('SELECT id FROM services WHERE name = $1', ["drop4"])
        .then(response => console.log(response));
});
router.post("/addService", (req, res) => {
    //security
    //post route with json object
    //req.name - string; req.image - string
    //sent as a post to Nate
    const data = req.body;
    axios_1.default.post("/testAddService", data)
        .then(response => {
        res.send(response.status);
    })
        .catch(error => {
        console.log('nate add service error');
    });
});
router.post('testAddService', (req, res) => {
});
