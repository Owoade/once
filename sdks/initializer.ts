import { Paystack } from "paystack-sdk";
import { Flutterwave } from "./flutterwave";
import { config } from "dotenv";
import { Once } from "./once";
import KoraPay from "./korapay";

config();

export const flutterwave = new Flutterwave();

export const paystack = new Paystack( process.env.PAYSTACK_SECRET_KEY as string );

export const once = new Once();

export const korapay = new KoraPay();


