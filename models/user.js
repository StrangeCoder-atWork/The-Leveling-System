import { Schema, model , models } from "mongoose";

const UserSchema = new Schema({
	email: {
		type: String,
		unique: true,
		required: true,
	},
	username: {
		type: String,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		required: false, // Not required for Google users
	},
	xp: {
		type: Number,
		default: 0,
	},
	money: {
		type: Number,
		default: 0,
	},
	level: {
		type: Number,
		default: 1,
	},
	rank: {
		type: String,
		default: "E",
	},
	tasks: {
		type: Object,
		default: {},
	},
	flashCards: {
		type: Object,
		default: {},
	},
	personalData: {
		type: Object,
		default: {},
	},
	profession: {
		type: String,
		default: "Student",
	},
	emailVerified: {
		type: Boolean,
		default: false,
	},
	verificationToken: {
		type: String,
		required: false,
	},
	verificationExpires: {
		type: Date,
		required: false,
	},
	provider: {
		type: String,
		required: false,
	},
	isSetupComplete: {
		type: Boolean,
		default: false,
	},
});


export default models.User || model("User", UserSchema);