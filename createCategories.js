require("dotenv").config();
const mongoose = require("mongoose");
const CategoryModel = require("./src/Models/Admin/Category");

// Connect to MongoDB
mongoose.connect(process.env.DB_STR, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("DB Connected"))
.catch(err => console.error("DB Error:", err));

// Create default categories
const createCategories = async () => {
  try {
    // Check if categories already exist
    const existingCategories = await CategoryModel.find({});
    
    if (existingCategories.length > 0) {
      console.log("Categories already exist!");
      console.log("Existing categories:");
      existingCategories.forEach(cat => {
        console.log(`- ${cat.catName}`);
      });
      process.exit(0);
    }

    // Create default categories
    const categories = [
      { catName: "Car", catImage: "car.png" },
      { catName: "Bike", catImage: "bike.png" },
      { catName: "Scooter", catImage: "scooter.png" },
      { catName: "Auto", catImage: "auto.png" },
      { catName: "Truck", catImage: "truck.png" },
    ];

    await CategoryModel.insertMany(categories);
    
    console.log("✅ Categories created successfully!");
    console.log("\nAvailable vehicle types:");
    categories.forEach(cat => {
      console.log(`- ${cat.catName}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error("Error creating categories:", error);
    process.exit(1);
  }
};

createCategories();
