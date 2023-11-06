"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const pg_promise_1 = __importDefault(require("pg-promise"));
const axios_1 = __importDefault(require("axios"));
const mayflyServices_1 = require("../services/mayflyServices");
const router = express_1.default.Router();
exports.router = router;
router.use(express_1.default.json());
const pgp = (0, pg_promise_1.default)();
const cn = 'postgres://mayfly:mayfly@localhost:5432/mayfly';
const db = pgp(cn);
router.post("/addService", (req, res) => {
    //security
    //post route with json object
    //req.name - string; req.image - string
    //sent as a post to Nate
    console.log('body:', req.body);
    const serviceName = req.body.serviceName;
    const image = req.body.image;
    const userId = req.body.userId;
    console.log('name:', serviceName, 'image:', image, 'user:', userId);
    (0, mayflyServices_1.insertIntoServices)(serviceName, image, userId);
    res.sendStatus(200);
});
router.get("/:user/services", (req, res) => {
    const userId = Number(req.params.user);
    (0, mayflyServices_1.getAllServicesByUser)(userId)
        .then((services) => {
        res.send(services);
    });
});
router.get('/:user/services/:service', (req, res) => {
    const user = req.params.user;
    const service = req.params.service;
    (0, mayflyServices_1.getServiceId)(service)
        .then(serviceId => {
        return (0, mayflyServices_1.getConvertedBackends)(user, serviceId);
    })
        .then(convertedBackends => {
        res.send(convertedBackends);
    })
        .catch(error => {
        console.log('Error:', error);
        res.status(500).send('Internal server error');
    });
});
router.get('/:user/services/:service/hatch', (req, res) => {
    //1 send a hatch request to Nate's EC2
    //2 update the database
    //cache the name = service_id relationship, user; cache in session
    const serviceToImage = {
        "drop4": "ghcr.io/drifting-in-space/demo-image-drop-four:latest",
        "jupyter-notebook": 'ghcr.io/drifting-in-space/jamsocket-jupyter-notebook:sha-fa92787',
        "whiteboard": 'rofl256/whiteboard'
    };
    const planeIP = 'mayfly.website';
    const port = '3001';
    const image = serviceToImage[req.params.service];
    const userId = Number(req.params.user);
    const serviceName = req.params.service;
    const address = `http://${planeIP}:${port}/?image=${image}`;
    // const address: string = 'http://localhost:3000/testPlane'
    console.log('address:', address);
    axios_1.default.get(address)
        .then((response) => {
        const data = response.data;
        (0, mayflyServices_1.getServiceId)(serviceName)
            .then(serviceId => {
            const success = data.error === null ? true : false;
            (0, mayflyServices_1.insertIntoBackends)(data.url, success, serviceId)
                .then(newBackend => {
                (0, mayflyServices_1.insertIntoUserBackends)(userId, newBackend.id)
                    .then(result => console.log(result))
                    .catch(e => console.log("insert into join table error", e));
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
router.get("/testUrl", (req, res) => {
    const roll = Math.random();
    //const url: number = Math.floor(Math.random() * 1000)
    if (roll < .5) {
        res.json({ url: `http://localhost:5173/home`, error: null });
    }
    else {
        res.json({ url: `http://localhost:5173/services`, error: null });
    }
});
router.get("/testNametoId", (req, res) => {
    db.one('SELECT id FROM services WHERE name = $1', ["drop4"])
        .then(response => console.log(response));
});
router.get("/testDemoLaunch/:name", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const services = {
        "Drop4": "ghcr.io/drifting-in-space/demo-image-drop-four:latest",
        "jupyter-notebook": 'ghcr.io/drifting-in-space/jamsocket-jupyter-notebook:sha-fa92787',
        "whiteboard": "rofl256/whiteboard"
    };
    const service = req.params.name;
    const planeIP = 'mayfly.website';
    const port = '3001';
    const image = services[service];
    const address = `http://${planeIP}:${port}/?image=${image}`;
    // const address = 'http://localhost:3000/testPlane'
    axios_1.default.get(address)
        .then((response) => {
        const data = response.data;
        const url = data.url;
        res.json({ url });
    });
}));
router.post("/fetchDemoUrl", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const url = req.params['url'];
    res.send(url);
}));
