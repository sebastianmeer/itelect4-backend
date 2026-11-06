import { model, Schema } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
}, { timestamps: true });

const promptSchema = new Schema({
  question: { type: String, required: true, minlength: 10, maxlength: 280 },
  category: { type: String, required: true, enum: ["gaming", "music", "movies", "food", "tech", "deep-talks"] },
}, { timestamps: true });

const responseSchema = new Schema({
  promptId: { type: Schema.Types.ObjectId, ref: "ExplorePrompt", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  body: { type: String, required: true, minlength: 10, maxlength: 280, trim: true },
  authorName: { type: String, maxlength: 40, trim: true },
}, { timestamps: true });

export const UserModel = model("User", userSchema);
export const ExplorePromptModel = model("ExplorePrompt", promptSchema);
export const ExploreResponseModel = model("ExploreResponse", responseSchema);
