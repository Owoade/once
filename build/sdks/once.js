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
exports.Once = void 0;
const crypto_1 = __importDefault(require("crypto"));
const transaction_1 = __importDefault(require("../models/transaction"));
const initializer_1 = require("./initializer");
// import { KoraPayInitiateTransaction } from "./korapay";
class Once {
    constructor() {
        this.apiBaseUrl = "https://once-checkout-api.hamkazefoods.com";
        this.clientSideUrl = "https://once-checkout.vercel.app";
        this.redirectUrl = `${this.clientSideUrl}/done`;
    }
    initialize(amount, host) {
        return __awaiter(this, void 0, void 0, function* () {
            const transactionReference = crypto_1.default.randomUUID();
            const data = {
                ref: transactionReference,
                amount,
                status: "pending",
                host
            };
            const transaction = new transaction_1.default(data);
            const savedTransaction = yield transaction.save();
            //  Send checkout url
            const checkoutDetails = {
                message: "checkout link created",
                transaction_ref: transactionReference,
                url: `${this.clientSideUrl}/?${savedTransaction.id}==${transactionReference}==${host}`,
            };
            return checkoutDetails;
        });
    }
    getProviderCheckout(providerKey, id) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield transaction_1.default.findById(id);
            if (providerKey === "FLW") {
                const flutterwavePayload = {
                    tx_ref: transaction === null || transaction === void 0 ? void 0 : transaction.ref,
                    amount: ((transaction === null || transaction === void 0 ? void 0 : transaction.amount) / 100).toString(),
                    currency: "NGN",
                    redirect_url: this.redirectUrl,
                    customer: {
                        name: transaction === null || transaction === void 0 ? void 0 : transaction.name,
                        email: transaction === null || transaction === void 0 ? void 0 : transaction.email,
                    },
                };
                const flutterwaveCheckout = yield initializer_1.flutterwave.initializeTransaction(flutterwavePayload);
                const flutterwaveCheckoutObject = {
                    provider: this.getProvider(providerKey),
                    provider_url: flutterwaveCheckout.data.link,
                    provider_ref: transaction === null || transaction === void 0 ? void 0 : transaction.ref,
                };
                return flutterwaveCheckoutObject;
            }
            if (providerKey === "KRP") {
                const korapayPayload = {
                    reference: transaction === null || transaction === void 0 ? void 0 : transaction.ref,
                    notification_url: `${this.apiBaseUrl}/payment-webhook-kp`,
                    customer: {
                        email: transaction === null || transaction === void 0 ? void 0 : transaction.email,
                        name: transaction.name
                    },
                    amount: (transaction === null || transaction === void 0 ? void 0 : transaction.amount) / 100,
                    currency: "NGN",
                    redirect_url: this.redirectUrl,
                    narration: "Charge"
                };
                const korapayCheckout = yield initializer_1.korapay.charge.initialize(korapayPayload);
                const korapayCheckoutObject = {
                    provider: "KRP",
                    provider_ref: transaction === null || transaction === void 0 ? void 0 : transaction.ref,
                    provider_url: korapayCheckout.data.checkout_url
                };
                return korapayCheckoutObject;
            }
            const paystackPayload = {
                amount: transaction === null || transaction === void 0 ? void 0 : transaction.amount.toString(),
                email: transaction === null || transaction === void 0 ? void 0 : transaction.email,
                currency: "NGN",
                callback_url: this.redirectUrl,
                reference: transaction === null || transaction === void 0 ? void 0 : transaction.ref,
            };
            const paystackCheckout = yield initializer_1.paystack.transaction.initialize(paystackPayload);
            const paystackCheckoutObject = {
                provider: this.getProvider(providerKey),
                provider_url: (_a = paystackCheckout.data) === null || _a === void 0 ? void 0 : _a.authorization_url,
                provider_ref: (_b = paystackCheckout.data) === null || _b === void 0 ? void 0 : _b.reference,
            };
            if (!paystackCheckout.status) {
                paystackCheckoutObject.provider_url = `https://checkout.paystack.com/${transaction === null || transaction === void 0 ? void 0 : transaction.access_code}`;
                paystackCheckoutObject.provider_ref = transaction === null || transaction === void 0 ? void 0 : transaction.ref;
            }
            yield transaction_1.default.findByIdAndUpdate(transaction === null || transaction === void 0 ? void 0 : transaction.id, {
                access_code: (_c = paystackCheckout.data) === null || _c === void 0 ? void 0 : _c.access_code,
            });
            return paystackCheckoutObject;
        });
    }
    getProvider(provderKey) {
        const provider = {
            FLW: "flutterwave",
            PST: "paystack",
            KRP: "korapay"
        };
        return provider[provderKey];
    }
}
exports.Once = Once;
