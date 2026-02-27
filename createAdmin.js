const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Import admin model
const adminModel = require("./src/Models/Admin/admin");

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DB_STR, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB CONNECTED...");

    // Admin credentials
    const adminData = {
      name: "Admin",
      email: "admin@learngaadi.com",
      password: "Admin@123",
    };

    // Check if admin already exists
    const existingAdmin = await adminModel.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log("Admin already exists with this email!");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Create admin
    const admin = await adminModel.create({
      name: adminData.name,
      email: adminData.email,
      password: hashedPassword,
      adminType: "Admin",
    });

    console.log("\n✅ Admin created successfully!");
    console.log("==========================================");
    console.log("Email:", adminData.email);
    console.log("Password:", adminData.password);
    console.log("==========================================");
    console.log("\nPlease save these credentials securely!");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
