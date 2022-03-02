const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: true,
    },
    tagLine: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
      lowercase: true,
    },
    logo: {
      type: String,
      required: true,
      default: "https://icon-library.com/icon/icon-image-file-29.html.html",
    },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "mySignedUpBusinessTable",
    },
  },
  {
    timestamps: true,
  }
);

const newStore = mongoose.model("Store", storeSchema);

module.exports = newStore;
