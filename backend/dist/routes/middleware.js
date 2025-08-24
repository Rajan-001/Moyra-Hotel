"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = middleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function middleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.cookies.token;
            if (token != undefined) {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_key);
                if (decoded) {
                    //@ts-ignore
                    req.id = decoded.userId;
                    console.log(decoded);
                    next();
                }
                else {
                    res.status(411).json({
                        message: "Token is not validated"
                    });
                }
            }
            else {
                res.status(503).json({
                    message: "Token is undefined"
                });
            }
        }
        catch (err) {
            res.status(503).json({
                message: "Not able to get token"
            });
        }
    });
}
