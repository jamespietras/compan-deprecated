import * as mongoose from 'mongoose';

const exampleSchema = new mongoose.Schema({
  title: { type: String, trim: true, required: true }
});

export default exampleSchema;
