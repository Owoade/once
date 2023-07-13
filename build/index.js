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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const initializer_1 = require("./sdks/initializer");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = require("dotenv");
const transaction_1 = __importDefault(require("./models/transaction"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const events_1 = __importDefault(require("events"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*"
    }
});
const transactionNamspace = io.of("/transaction");
const soccketInstance = new events_1.default();
transactionNamspace.on("connection", (socket) => {
    console.log("socket connected ");
    socket.on("transaction-init", (transactionRef) => {
        socket.join(transactionRef);
        console.log("joined transaction room");
    });
    socket.on("transaction-resolved", () => {
        console.log("Transaction reolved");
    });
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)({
    origin: "*"
}));
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
app.post("/init", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, host } = req.body;
    const checkout = yield initializer_1.once.initialize(parseInt(amount), host);
    res.json(checkout);
}));
app.get("/checkout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { provider, id } = req.query;
    const providerCheckout = yield initializer_1.once.getProviderCheckout(provider, id);
    res.json(providerCheckout);
}));
app.patch("/update-transaction", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const update = (_b = req.body) === null || _b === void 0 ? void 0 : _b.update;
    const id = req.body.id;
    try {
        const updatedTransaction = yield transaction_1.default.findByIdAndUpdate(id, update, { new: true });
        res.json({ message: "successfull" });
    }
    catch (e) {
        res.json({ message: "failed" });
    }
}));
app.post("/payment-webhook-ps", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Webhook sent from paystack");
    const ref = req.body.data.reference;
    transactionNamspace.to(ref).emit("transaction-resolved");
    console.log(req.body);
    res.end();
}));
app.post("/payment-webhook", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Webhook sent from flutterwave");
    const ref = req.body.txRef;
    transactionNamspace.to(ref).emit("transaction-resolved");
    console.log(req.body);
    res.end();
}));
app.post("/payment-webhook-kp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    if (payload.event === 'charge.success') {
        console.log(payload);
        transactionNamspace.to(payload.data.reference).emit("transaction-resolved");
    }
    res.end();
}));
// const promiseArr = [ mongoose.connect(process.env.MONGO_DB_URL as string), app.listen(PORT) ];
// Promise.all( promiseArr )
// .then( ()=> console.log("Server is up and running") )
mongoose_1.default.connect(process.env.MONGO_DB_URL)
    .then(() => console.log("Mongo is live"));
server.listen(PORT).on("listening", () => console.log("APP is live"));
