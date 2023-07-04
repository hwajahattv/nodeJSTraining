const mongoose = require("mongoose");

// Define Category schema
const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
    },
    { timestamps: true }
);

// Create Category model
const Category = mongoose.model("Category", categorySchema);

const subcategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
    },
    { timestamps: true }
);

const Subcategory = mongoose.model("Subcategory", subcategorySchema);

module.exports = { Category, Subcategory };
