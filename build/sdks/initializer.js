"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.korapay = exports.once = exports.paystack = exports.flutterwave = void 0;
const paystack_sdk_1 = require("paystack-sdk");
const flutterwave_1 = require("./flutterwave");
const dotenv_1 = require("dotenv");
const once_1 = require("./once");
const korapay_1 = __importDefault(require("./korapay"));
(0, dotenv_1.config)();
exports.flutterwave = new flutterwave_1.Flutterwave();
exports.paystack = new paystack_sdk_1.Paystack(process.env.PAYSTACK_SECRET_KEY);
exports.once = new once_1.Once();
exports.korapay = new korapay_1.default();
