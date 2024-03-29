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
exports.insertIntoUserBackends = exports.insertIntoBackends = exports.insertIntoServices = exports.getConvertedBackends = exports.getServiceId = exports.getAllServicesByUser = void 0;
const pg_promise_1 = __importDefault(require("pg-promise"));
const pgp = (0, pg_promise_1.default)();
const cn = 'postgres://mayfly:mayfly@localhost:5432/mayfly';
const db = pgp(cn);
const getAllServicesByUser = (userId) => {
    return db.many('SELECT id, name FROM services WHERE user_id = $1', userId)
        .then(services => {
        return services;
    })
        .catch(error => {
        console.log(error);
        return [];
    });
};
exports.getAllServicesByUser = getAllServicesByUser;
const getServiceId = (service) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield db.one('SELECT id FROM services WHERE name = $1', [service]);
    return response.id;
});
exports.getServiceId = getServiceId;
const getConvertedBackends = (user, serviceId) => __awaiter(void 0, void 0, void 0, function* () {
    const backends = yield db.many('SELECT url, launch_success, created_at, terminated_at FROM backends AS b JOIN users_backends AS ub ON b.id = ub.backend_id WHERE ub.user_id = $1 AND b.service_id = $2 ORDER BY b.created_at DESC', [user, serviceId]);
    const convertedBackends = backends.map(backend => {
        return {
            url: backend.url,
            launchSuccess: backend.launch_success,
            hatchedAt: backend.created_at,
            squishedAt: backend.terminated_at
        };
    });
    return convertedBackends;
});
exports.getConvertedBackends = getConvertedBackends;
const insertIntoServices = (serviceName, image, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = 'INSERT INTO services (name, image, user_id) VALUES (${name}, ${image}, ${user_id})';
    try {
        yield db.none(query, {
            name: serviceName,
            image: image,
            user_id: userId,
        });
        return 'Insertion successful';
    }
    catch (error) {
        console.error('Error inserting into services:', error);
        throw error;
    }
});
exports.insertIntoServices = insertIntoServices;
const insertIntoBackends = (url, success, serviceId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield db.one(`INSERT INTO backends (url, launch_success, service_id) VALUES ($1, $2, $3) 
       RETURNING *`, [url, success, serviceId]);
        return response;
    }
    catch (error) {
        // Handle the error, e.g., log it or throw a custom error.
        console.error('Error inserting into backends:', error);
        throw new Error('Failed to insert into backends');
    }
});
exports.insertIntoBackends = insertIntoBackends;
const insertIntoUserBackends = (userId, backendId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield db.none('INSERT INTO users_backends (user_id, backend_id) VALUES ($1, $2)', [userId, backendId]);
        return response;
    }
    catch (error) {
        // Handle the error, e.g., log it or throw a custom error.
        console.error('Error inserting into user backends:', error);
        throw new Error('Failed to insert into user backends');
    }
});
exports.insertIntoUserBackends = insertIntoUserBackends;
// export const insertIntoServices = async (serviceName: string, image: string, userId: number) => {
//   const response = await db.none(`INSERT INTO services (name, image, user_id) VALUES ($1, $2, $3)`, [serviceName, image, userId])
//   return response;
// }
// export const insertIntoBackends = async (url: string | null, success: boolean, serviceId: number) => {
//   const response = await db.one<Backend>(`INSERT INTO backends (url, launch_success, service_id) VALUES ($1, $2, $3) 
//                                          RETURNING *`, [url, success, serviceId])
//   return response;
// }
// export const insertIntoUserBackends = async (userId: number, backendId: number) => {
//   const response = await db.none('INSERT INTO users_backends (user_id, backend_id) VALUES ($1, $2)', [userId, backendId])
//   return response;
// }
