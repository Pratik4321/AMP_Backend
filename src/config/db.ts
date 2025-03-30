import mongoose from "mongoose";

export function DBConnection() {
  return mongoose.connect(
    "mongodb+srv://annasfurquan:Fsrxq13jTKVK8GXk@bac.6perr.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Bac"
  );
}
