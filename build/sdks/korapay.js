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
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = require("dotenv");
class KoraPay {
    constructor() {
        (0, dotenv_1.config)();
        this.BASE_URL = "https://api.korapay.com/merchant/api/v1";
        this.SECRET_KEY = process.env.KORAPAY_SECRET_KEY;
        this.initiate = this.initiate.bind(this);
    }
    initiate(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = {
                Authorization: `Bearer ${this.SECRET_KEY}`
            };
            payload.amount /= 100;
            const transaction = yield axios_1.default.post(`${this.BASE_URL}/charges/initialize`, payload, {
                headers
            });
            return transaction.data;
        });
    }
}
exports.default = KoraPay;
