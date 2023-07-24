"use strict";
// import axios from "axios";
// import { config } from "dotenv";
// export default class KoraPay {
//     private readonly SECRET_KEY: string;
//     private readonly BASE_URL: string;
//     constructor(){
//         config();
//         this.BASE_URL = "https://api.korapay.com/merchant/api/v1";
//         this.SECRET_KEY = process.env.KORAPAY_SECRET_KEY as string;
//         this.initiate = this.initiate.bind(this);
//     }
//     async initiate( payload: KoraPayInitiateTransaction ){
//         const headers = {
//             Authorization: `Bearer ${this.SECRET_KEY}`
//         }
//         payload.amount /= 100;
//         const transaction = await axios.post(`${this.BASE_URL}/charges/initialize`, payload, {
//             headers
//         })
//         console.log(transaction.data);
//         return transaction.data.data as KoraPayTransactionInitialized;
//     }
// }
// export interface KoraPayInitiateTransaction {
//     amount: number
//     redirect_url: string,
//     currency: "NGN",
//     reference: string;
//     notification_url: string;
//     customer: {
//         email: string,
//         name: string
//     }
// }
// interface KoraPayTransactionInitialized {
//     reference: string,
//     checkout_url: string;
// }
