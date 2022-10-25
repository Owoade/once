import { flutterwave, paystack, once } from "./sdks/initializer";
import crypto from "node:crypto";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import { OnceProvider } from "./sdks/once";
import Transaction from "./models/transaction";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

config(); 

const app = express();

const server = http.createServer(app);

const io = new Server( server );

const transactionNamspace = io.of("/transaction");

transactionNamspace.on("connection", ( socket )=>{
  console.log(" socket connected ")
  socket.on( "transaction-init", ( transactionRef: string )=>{
    socket.join(transactionRef)
  })
})



app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
  origin: "*"
}))

const PORT = process.env.PORT ?? 3000 ;

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

app.post("/payment-webhook-ps", async( req: Request, res: Response )=>{
  console.log( "Webhook sent from paystack")
  console.log( req.body )
  res.end();
})

app.post("/payment-webhook", async( req: Request, res: Response )=>{
  console.log( "Webhook sent from flutterwave");
  console.log(req.body)
  res.end();
})

// const promiseArr = [ mongoose.connect(process.env.MONGO_DB_URL as string), app.listen(PORT) ];

// Promise.all( promiseArr )
// .then( ()=> console.log("Server is up and running") )


mongoose.connect(process.env.MONGO_DB_URL as string)
.then( ()=> console.log("Mongo is live"));

app.listen(PORT, ()=> console.log("APP is live"))

