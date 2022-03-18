const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    image: { type: String, required: [true, 'Please select an image'] },
    summary: {
      type: String,
      required: [true, 'Please enter a summary'],
    },
    steps: {
      type: Array,
      required: [true, 'Please enter steps'],
    },
    servings: {
      type: Number,
      required: [true, 'Please add a serving'],
    },
    readyInMinutes: {
      type: Number,
      required: [true, 'Please add a time of minutes'],
    },
    ingredients: {
      type: Array,
      required: [true, 'Please add recipe ingredients'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Recipe', recipeSchema);
