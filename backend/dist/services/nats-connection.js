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
Object.defineProperty(exports, "__esModule", { value: true });
const nats_1 = require("nats");
function connectNats() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const nc = yield (0, nats_1.connect)({
                servers: 'http://localhost:4222',
            });
            console.log('Connected to NATS');
            return nc;
        }
        catch (error) {
            console.error('Failed to connect to NATS', error);
            throw error;
        }
    });
}
exports.default = connectNats;
