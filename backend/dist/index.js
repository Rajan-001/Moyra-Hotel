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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("./lib/prisma");
const validation_1 = require("./lib/validation");
const middleware_1 = require("./routes/middleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000", // allow frontend URL
    methods: ["GET", "POST"],
    credentials: true
}));
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const parsedData = validation_1.userSchema.safeParse(req.body);
    try {
        if (!((_a = parsedData.data) === null || _a === void 0 ? void 0 : _a.username) || !((_b = parsedData.data) === null || _b === void 0 ? void 0 : _b.password)) {
            throw new Error("Username and password are not as per requirement");
        }
        const response = yield prisma_1.prisma.user.create({
            data: { username: (_c = parsedData.data) === null || _c === void 0 ? void 0 : _c.username,
                password: (_d = parsedData.data) === null || _d === void 0 ? void 0 : _d.password }
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
}));
app.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const parsedData = validation_1.userSchema.safeParse(req.body);
    try {
        if (!((_a = parsedData.data) === null || _a === void 0 ? void 0 : _a.username) || !((_b = parsedData.data) === null || _b === void 0 ? void 0 : _b.password)) {
            throw new Error("Username and password are not as per requirement");
        }
        const response = yield prisma_1.prisma.user.findFirst({
            where: {
                username: (_c = parsedData.data) === null || _c === void 0 ? void 0 : _c.username,
                password: (_d = parsedData.data) === null || _d === void 0 ? void 0 : _d.password
            }
        });
        if (response) {
            const token = yield jsonwebtoken_1.default.sign(response, process.env.JWT_key);
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
}));
app.get("/checked", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hotel_id } = req.body;
    try {
        const response = yield prisma_1.prisma.booking.findFirst({
            where: {
                hotel_id: hotel_id
            },
            include: { users: true }
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
}));
app.post("/hotel-booked", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hotel_id, checkIn, checkOut } = req.body;
    try {
        const existingBooking = yield prisma_1.prisma.booking.findFirst({
            where: {
                hotel_id,
                OR: [
                    {
                        checkIn: { lte: new Date(checkOut) },
                        checkOut: { gte: new Date(checkIn) },
                    },
                ],
            },
        });
        if (existingBooking) {
            return res.status(400).json({ message: "Hotel is already booked on selected dates" });
        }
        const response = yield prisma_1.prisma.booking.create({
            data: {
                hotel_id: hotel_id,
                checkIn: checkIn,
                checkOut: checkOut,
                //@ts-ignore
                userId: req.id
            }
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
}));
app.get("/hotels/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hotel_id = Number(req.params.id);
    try {
        console.log(hotel_id);
        const response = yield prisma_1.prisma.booking.findFirst({
            where: { hotel_id: hotel_id }
        });
        console.log(response);
        if (response) {
            res.status(200).json({
                message: "Able to book"
            });
        }
        else {
            res.status(207).json({
                message: "No Booking "
            });
        }
    }
    catch (err) {
        res.status(503).json({
            message: "Not able to book now"
        });
    }
}));
app.get("/user-booking", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield prisma_1.prisma.booking.findFirst({
            //@ts-ignore
            where: { userId: req.id },
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
}));
app.get("/get-hotels", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hotels = yield prisma_1.prisma.hotels.findMany({
            include: {
                place: true,
                booking: true
            }
        });
        res.json(hotels);
    }
    catch (err) {
        res.status(503).json({
            message: "Internal Server Error"
        });
    }
}));
app.listen(8000, () => { console.log("server is running at 8000"); });
