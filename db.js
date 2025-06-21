// database.js
const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect('mongodb+srv://bangngo1509a:4UK4DPHho34cHtZX@botmine.hxb0qdi.mongodb.net/minebot?retryWrites=true&w=majority&appName=BotMine', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Kết nối MongoDB thành công');
  } catch (error) {
    console.error('❌ Lỗi kết nối MongoDB:', error);
    process.exit(1);
  }
}

module.exports = connectDB;
