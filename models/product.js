const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        title: String,
        price: String,
        quantity: String,
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
