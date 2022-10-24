import { config } from "dotenv";
import axios from "axios";
config();

export class Flutterwave {
  private readonly API_SECRET: string;
  private readonly endpoints: FlutterwaveEndpoints;
  private readonly reqConfg: Object;

  constructor() {
    this.API_SECRET = process.env.FLUTTERWAVE_SECRET_KEY as string;

    this.endpoints = {
      INITIALIZE: "https://api.flutterwave.com/v3/payments",
      VERIFY:
        "https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=",
    };

    this.reqConfg = {
      headers: {
        "Authorization" : `${this.API_SECRET}`,
        "Content-Type" : "application/json",
      },
    };
   console.log("initialized flutterwave class") 
  }

  async initializeTransaction(transactionRequest: FlutterWaveTransactionInit) {
    const res = await axios.post(
      this.endpoints.INITIALIZE,

      transactionRequest,

      this.reqConfg
    );

    return (await res.data) as FlutterwaveCheckout;
  }

  async verifyTransaction(ref: string) {
    const res = await axios.get(`${this.endpoints.VERIFY}${ref}`);

    const verification = res.data;

    return verification as FlutterwaveVerification;
  }
}

interface FlutterWaveTransaction {
  email: string;
  amount: string;
}

interface FlutterwaveCheckout {
  message: string;
  status: string;
  data: {
    link: string;
  };
}

interface FlutterwaveEndpoints {
  INITIALIZE: string;
  VERIFY: string;
}

interface FlutterwaveVerification {
  data: {
    status: string;
    tx_ref: string;
  };
}

export interface FlutterWaveTransactionInit {
    tx_ref: string,
    amount: string;
    currency: string;
    redirect_url: string;
    customer: {
        email: string;
        name: string;
    }
}
