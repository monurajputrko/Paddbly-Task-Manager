import mongoose from "mongoose";
import "dotenv/config";

const connection = async () => {
  try {
    mongoose.connect(process.env.REACT_API);
  } catch (err) {
    console.log(err);
  }
};

export default connection;
