import mongoose, { Schema } from "mongoose";

const UnitSchema = new Schema({
    unitName: {
        type: String,
        required: true
    },
    carpetArea: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['Sold', 'Unsold', 'Booked'],
    },
    agreementDate: {
        type: Date,
    },
    agreementValue: {
        type: Number,
    },
    buyerName: {
        type: String,
    },
    advanceReceived_2020_2021: {
        type: Number,
        default: 0
    },
    advanceReceived_2021_2022: {
        type: Number,
        default: 0
    },
    advanceReceived_2022_2023: {
        type: Number,
        default: 0
    },
    advanceReceived_2023_2024: {
        type: Number,
        default: 0
    },
    totalReceived: {
        type: Number,
        default: function () {
            return (this.advanceReceived_2020_2021 || 0) +
                (this.advanceReceived_2021_2022 || 0) +
                (this.advanceReceived_2022_2023 || 0) +
                (this.advanceReceived_2023_2024 || 0);
        }
    },
    balance: {
        type: Number,
        default: function () {
            return (this.agreementValue || 0) - ((this.advanceReceived_2020_2021 || 0) +
                (this.advanceReceived_2021_2022 || 0) +
                (this.advanceReceived_2022_2023 || 0) +
                (this.advanceReceived_2023_2024 || 0));
        }
    }
}, { timestamps: true });

const Unit = mongoose.model('Unit', UnitSchema);
export default Unit;
