import { Paystack } from "paystack-sdk";
import { Flutterwave } from "./flutterwave";
import { config } from "dotenv";
import { Once } from "./once";
// import KoraPay from "./korapay";
import { Korapay } from "korapay-node";

config();

export const flutterwave = new Flutterwave();

export const paystack = new Paystack( process.env.PAYSTACK_SECRET_KEY as string );

export const once = new Once();

export const korapay = new Korapay(  process.env.KORAPAY_SECRET_KEY as string, process.env.KORAPAY_PUBLIC_KEY as string );