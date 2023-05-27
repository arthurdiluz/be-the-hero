const mongoose = require("../index");

const ngoSchema = new mongoose.Schema({
  id: {
    type: String,
    index: true,
    unique: true,
    immutable: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  whatsapp: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    max: 2,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  incidents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Incident",
    },
  ],
});

// maps the database, transform into an object and exports it
module.exports = mongoose.model("Ngo", ngoSchema);
