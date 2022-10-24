import { flutterwave, paystack, once } from "./sdks/initializer";
import crypto from "node:crypto";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import { OnceProvider } from "./sdks/once";
import Transaction from "./models/transaction";

config(); 

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = 3000 ?? process.env.PORT;

app.post("/init", async( req: Request, res: Response )=>{
  const { amount } = req.body;
  const checkout = await once.initialize( parseInt(amount) );

  res.json( checkout )

})

app.get("/checkout", async( req: Request, res: Response )=>{
  const { provider, id } = req.query;

  const providerCheckout = await once.getProviderCheckout( provider as OnceProvider, id as string )

  res.json( providerCheckout );
})

app.patch( "/update-transaction", async( req: Request, res: Response )=>{
  const update = req.body?.update;
  const id = req.body.id;

  const updatedTransaction = await Transaction.findByIdAndUpdate( id, update, { new: true });
  res.json({ message: "successfull" })
})

const promiseArr = [ mongoose.connect(process.env.MONGO_DB_URL as string), app.listen(PORT) ];

Promise.all( promiseArr )
.then( ()=> console.log("Server is up and running") )



