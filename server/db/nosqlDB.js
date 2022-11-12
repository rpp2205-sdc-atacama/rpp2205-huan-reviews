const mongoose = require('mongoose');
const {Schema, model} = mongoose;

let reviewSchema = new Schema({
  id: {
    type: Number,
    unique: true,
  },
  summary: String,
  body: String,
  rating: Number,
  date: {
    type: Date,
    default: Date.now
  },
  reviewer_name: String,
  reviewer_email: String,
  photos: [String],
  response: [String],
  recommended: Boolean,
  helpfulness: {
    type: Number,
    default: 0,
  },
  reported: {
    type: Boolean,
    default: false
  },
  product_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Product'
  }
})

let productSchema = new Schema({
  id: Number,
  name: String,
})


const Review = model('Review', reviewSchema);
const Product = model('Product', productSchema)
