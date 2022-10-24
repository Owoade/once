import { flutterwave, paystack } from "./sdks/initializer";
import crypto from "node:crypto";

(async function () {
//   const data = await flutterwave.initializeTransaction({
//     tx_ref: crypto.randomUUID(),
//     amount: "20000",
//     currency: "NGN",
//     redirect_url: "https://hamkaze-api.herokuapp.com/payment-webhook",
//     customer: { name: "Owoade", email: "owoadeanu@pyvot.com" },
//   });
  const data = await paystack.transaction.initialize( { amount: "30000", reference: crypto.randomUUID(), email: "hello@hooli.com", callback_url: "https://hamkaze-api.herokuapp.com/payment-webhook" } );
  const verification= await paystack.transaction.verify("5c54d401-5c32-4797-8c71-32775846c86b")
  console.log(data);
})();
