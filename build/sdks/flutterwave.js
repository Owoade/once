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
exports.Flutterwave = void 0;
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
(0, dotenv_1.config)();
class Flutterwave {
    constructor() {
        this.API_SECRET = process.env.FLUTTERWAVE_SECRET_KEY;
        this.endpoints = {
            INITIALIZE: "https://api.flutterwave.com/v3/payments",
            VERIFY: "https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=",
        };
        this.reqConfg = {
            headers: {
                "Authorization": `${this.API_SECRET}`,
                "Content-Type": "application/json",
            },
        };
        console.log("initialized flutterwave class");
    }
    initializeTransaction(transactionRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield axios_1.default.post(this.endpoints.INITIALIZE, transactionRequest, this.reqConfg);
            return (yield res.data);
        });
    }
    verifyTransaction(ref) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield axios_1.default.get(`${this.endpoints.VERIFY}${ref}`);
            const verification = res.data;
            return verification;
        });
    }
}
exports.Flutterwave = Flutterwave;
