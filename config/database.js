const mongoose = require("mongoose");

async function runDB(dbUrl) {
  await mongoose.connect(dbUrl);
}

module.exports = {
  runDB,
};
