/* ─── Database + Start ─── */
const mongoose = require("mongoose");
async function connectDB(){
     try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");
    }catch (err){
        console.log("Database connection error", err);
    }
}
module.exports = connectDB;
  /*.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });*/