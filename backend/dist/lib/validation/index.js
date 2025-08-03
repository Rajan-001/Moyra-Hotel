"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hotelSchema = exports.userSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.userSchema = zod_1.default.object({
    username: zod_1.default.string().min(4),
    password: zod_1.default.string().min(4)
});
exports.hotelSchema = zod_1.default.object({
    name: zod_1.default.string().min(4)
});
