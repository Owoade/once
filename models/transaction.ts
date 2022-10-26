import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    host: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    email:{
        type: String
    },
    status: {
        type: String,
        required: true
    }, 
    ref: {
        type: String,
        required: true
    },
    access_code:{
        type: String
    }
}, { timestamps: true } )

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;