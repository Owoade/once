import { Paystack } from "paystack-sdk";
import { Flutterwave } from "./flutterwave";
import { config } from "dotenv";

config();

export const flutterwave = new Flutterwave();

export const paystack = new Paystack( process.env.PAYSTACK_SECRET_KEY as string );


