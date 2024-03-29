import { Schema, model } from 'mongoose';

const schema = new Schema({
  user: { type: String, required: true, max: 100 },
  message: { type: String, required: true, max: 100 },
});

export const ChatModel = model('chat', schema);