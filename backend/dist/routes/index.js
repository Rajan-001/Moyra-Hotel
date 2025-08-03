"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const src_1 = require("../lib/prisma/src");
const validation_1 = require("../lib/validation");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const middleware_1 = require("./middleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/signup", (req, res) => {
    var _a, _b;
    const parsedData = validation_1.userSchema.safeParse(req.body);
    try {
        const response = src_1.prisma.user.create({
            userName: (_a = parsedData.data) === null || _a === void 0 ? void 0 : _a.name,
            password: (_b = parsedData.data) === null || _b === void 0 ? void 0 : _b.password
        });
        if (response) {
            res.status(200).json({
                message: "Able to Sign Up"
            });
        }
        else {
            res.status(400).json({
                message: "Not able to create user in Db"
            });
        }
    }
    catch (err) {
        res.status(503).json({
            message: "Not able to signup"
        });
    }
});
app.post("/signin", (req, res) => {
    var _a, _b;
    const parsedData = validation_1.userSchema.safeParse(req.body);
    try {
        const response = src_1.prisma.user.findfirst({
            userName: (_a = parsedData.data) === null || _a === void 0 ? void 0 : _a.name,
            password: (_b = parsedData.data) === null || _b === void 0 ? void 0 : _b.password
        });
        const token = jsonwebtoken_1.default.sign(response, process.env.JWT_key);
        if (response) {
            res.status(200).json({
                token
            });
        }
        else {
            res.status(400).json({
                message: "Not able to create user in Db"
            });
        }
    }
    catch (err) {
        res.status(503).json({
            message: "Not able to signup"
        });
    }
});
app.get("/checked", (req, res) => {
    const { hotel_id } = req.body;
    try {
        const response = src_1.prisma.booking.findfirst({
            hotel_id: hotel_id,
        });
        if (response) {
            res.status(200).json({
                message: "Able to book"
            });
        }
        else {
            res.status(400).json({
                message: "Not Booked"
            });
        }
    }
    catch (err) {
        res.status(503).json({
            message: "Not able to book now"
        });
    }
});
app.post("/booked", middleware_1.middleware, (req, res) => {
    const { hotel_id, checkIn, checkOut } = req.body;
    try {
        const data = src_1.prisma.hotels.findfirst({
            hotel_id: hotel_id
        });
        const response = src_1.prisma.booking.create({
            hotel_id: data.hotel_id,
            checkIn: checkIn,
            checkOut: checkOut,
            userId: req.id
        });
        if (response) {
            res.status(200).json({
                message: "Able to book"
            });
        }
        else {
            res.status(400).json({
                message: "Not Booked"
            });
        }
    }
    catch (err) {
        res.status(503).json({
            message: "Not able to book now"
        });
    }
});
app.get("/hotel-booking", (req, res) => {
    const { hotel_id } = req.body;
    try {
        const response = src_1.prisma.booking.findfirst({
            hotel_id: hotel_id,
        });
        if (response) {
            res.status(200).json({
                message: "Able to book"
            });
        }
        else {
            res.status(400).json({
                message: "Not Booked"
            });
        }
    }
    catch (err) {
        res.status(503).json({
            message: "Not able to book now"
        });
    }
});
app.get("/user-booking", middleware_1.middleware, (req, res) => {
    try {
        const response = src_1.prisma.booking.findfirst({
            userId: req.id,
        });
        if (response) {
            res.status(200).json({
                message: "Able to book"
            });
        }
        else {
            res.status(400).json({
                message: "Not Booked"
            });
        }
    }
    catch (err) {
        res.status(503).json({
            message: "Not able to book now"
        });
    }
});
app.listen(8001, () => { console.log("server is running at 8001"); });
