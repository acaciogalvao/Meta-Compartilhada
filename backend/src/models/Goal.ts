import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  paymentId: string;
  amount: number;
  payerId: string;
  date: Date;
}

export interface IGoal extends Document {
  itemName: string;
  totalValue: number;
  months: number;
  contributionP1: number;
  nameP1: string;
  nameP2: string;
  savedP1: number;
  savedP2: number;
  payments: IPayment[];
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>({
  paymentId: { type: String, required: true },
  amount: { type: Number, required: true },
  payerId: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const goalSchema = new Schema<IGoal>({
  itemName: { type: String, required: true },
  totalValue: { type: Number, required: true },
  months: { type: Number, required: true },
  contributionP1: { type: Number, required: true },
  nameP1: { type: String, required: true },
  nameP2: { type: String, required: true },
  savedP1: { type: Number, default: 0 },
  savedP2: { type: Number, default: 0 },
  payments: [paymentSchema]
}, { timestamps: true });

export const Goal = mongoose.model<IGoal>('Goal', goalSchema);
export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
