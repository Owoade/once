import crypto from "crypto";
import {
  InitializeTransaction,
  TransactionInitialized,
} from "paystack-sdk/dist/transaction/interface";
import Transaction from "../models/transaction";
import { FlutterWaveTransactionInit } from "./flutterwave";
import { flutterwave, korapay, paystack } from "./initializer";
// import { KoraPayInitiateTransaction } from "./korapay";

export class Once {

  private apiBaseUrl = "https://once-checkout-api.hamkazefoods.com";

  private clientSideUrl = "https://once-checkout.vercel.app"

  private readonly redirectUrl = `${this.clientSideUrl}/done`;

  async initialize(amount: number, host: string) {
    
    const transactionReference = crypto.randomUUID();

    const data = {
      ref: transactionReference,
      amount,
      status: "pending",
      host
    };

    const transaction = new Transaction(data);

    const savedTransaction = await transaction.save();

    //  Send checkout url

    const checkoutDetails = {
      message: "checkout link created",
      transaction_ref: transactionReference,
      url: `${this.clientSideUrl}/?${savedTransaction.id}==${transactionReference}==${host}`,
    };

    return checkoutDetails as OnceInitialize;
  }

  async getProviderCheckout(providerKey: OnceProvider, id: string) {
    const transaction = await Transaction.findById(id);

    if (providerKey === "FLW") {

      const flutterwavePayload = {
        tx_ref: transaction?.ref,
        amount: (transaction?.amount!/100).toString(),
        currency: "NGN",
        redirect_url: this.redirectUrl,
        customer: {
          name: transaction?.name,
          email: transaction?.email,
        },
      };

      const flutterwaveCheckout = await flutterwave.initializeTransaction(
        flutterwavePayload as FlutterWaveTransactionInit
      );

      const flutterwaveCheckoutObject = {
        provider: this.getProvider(providerKey),
        provider_url: flutterwaveCheckout.data.link,
        provider_ref: transaction?.ref,
      };

      return flutterwaveCheckoutObject as OnceCheckout;
    }

    if( providerKey === "KRP" ){

      const korapayPayload = {
        reference: transaction?.ref as string,
        notification_url: `${this.apiBaseUrl}/payment-webhook-kp`,
        customer: {
          email: transaction?.email as string,
          name: transaction!.name as string
        },
        amount: (transaction?.amount!) / 100 as number,
        currency: "NGN",
        redirect_url: this.redirectUrl,
        narration: "Charge"
      } 

      const korapayCheckout = await korapay.charge.initialize(korapayPayload);

      const korapayCheckoutObject = {
        provider: "KRP",
        provider_ref: transaction?.ref,
        provider_url: korapayCheckout.data.checkout_url
      } 

      return korapayCheckoutObject as OnceCheckout;

    }

    const paystackPayload: InitializeTransaction = {
      amount: transaction?.amount!.toString() as string,
      email: transaction?.email as string,
      currency: "NGN",
      callback_url: this.redirectUrl,
      reference: transaction?.ref,
    };

    const paystackCheckout = await paystack.transaction.initialize(
      paystackPayload
    );

    const paystackCheckoutObject = {
      provider: this.getProvider(providerKey),
      provider_url: paystackCheckout.data?.authorization_url as string,
      provider_ref: paystackCheckout.data?.reference as string,
    };

    if (!paystackCheckout.status) {
      paystackCheckoutObject.provider_url = `https://checkout.paystack.com/${transaction?.access_code}`;

      paystackCheckoutObject.provider_ref = transaction?.ref as string;
    }

    await Transaction.findByIdAndUpdate(transaction?.id, {
      access_code: paystackCheckout.data?.access_code,
    });

    return paystackCheckoutObject as OnceCheckout;
  }

  getProvider(provderKey: OnceProvider) {

    const provider: Record<OnceProvider, string> = {
      FLW: "flutterwave",
      PST: "paystack",
      KRP: "korapay"
    };

    return provider[provderKey];
  }
  
}

export type OnceProvider = "FLW" | "PST" | "KRP";

interface OnceInitialize {
  message: string;
  transaction_ref: string;
  url: string;
}

interface OnceCheckout {
  provider: string;
  provider_url: string;
  provider_ref: string;
}