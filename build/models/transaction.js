"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const transactionSchema = new mongoose_1.default.Schema({
    amount: {
        type: Number,
        required: true
    },
    host: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    status: {
        type: String,
        required: true
    },
    ref: {
        type: String,
        required: true
    },
    access_code: {
        type: String
    }
}, { timestamps: true });
const Transaction = mongoose_1.default.model("Transaction", transactionSchema);
exports.default = Transaction;
