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
exports.squish = exports.spawn = void 0;
const nats_connection_1 = __importDefault(require("./nats-connection"));
const spawn = (image) => __awaiter(void 0, void 0, void 0, function* () {
    const message = {
        cluster: "taishan.website",
        max_idle_secs: 120,
        metadata: {},
        executable: {
            'image': image,
            env: {},
        }
    };
    try {
        const nc = yield (0, nats_connection_1.default)();
        const reply = yield nc.request('cluster.taishan_website.schedule', JSON.stringify(message));
        const responseData = JSON.parse(reply.data.toString());
        const url = `http://${responseData.Scheduled.backend_id}.taishan.website:8080/`;
        const result = {
            url,
            error: null
        };
        return result;
    }
    catch (e) {
        let errorMessage = null;
        if (e instanceof Error && typeof e.message === 'string') {
            errorMessage = e.message;
        }
        else {
            errorMessage = "An error occurred";
        }
        const result = {
            url: null,
            error: errorMessage
        };
        console.error(result);
        return result;
    }
});
exports.spawn = spawn;
const squish = (backend_id) => __awaiter(void 0, void 0, void 0, function* () {
    const message = {
        cluster_id: "taishan.website",
        'backend_id': backend_id,
    };
    try {
        const nc = yield (0, nats_connection_1.default)();
        yield nc.request(`cluster.taishan_website.backend.${backend_id}.terminate`, JSON.stringify(message));
        return `Successfully squished backend ${backend_id} in cluster ${"taishan.website"}`;
    }
    catch (e) {
        console.error(e);
        return null;
    }
});
exports.squish = squish;
