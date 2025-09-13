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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const razorpay_1 = __importDefault(require("razorpay"));
const crypto = require('crypto');
const app = (0, express_1.default)();
app.use(express_1.default.json());
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
// app.use(cors({
//   origin: FRONTEND_URL, // allow frontend URL
//   credentials: true
// }));
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || origin === FRONTEND_URL) {
            callback(null, true);
        }
        else {
            console.warn("Blocked CORS request from origin:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));
dotenv_1.default.config();
app.use((0, cookie_parser_1.default)());
app.get("/api/hello", (req, res) => {
    res.json({ message: "Hello from backend!" });
});
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const parsedData = validation_1.userSchema.safeParse(req.body);
    try {
        if (!((_a = parsedData.data) === null || _a === void 0 ? void 0 : _a.name) || !((_b = parsedData.data) === null || _b === void 0 ? void 0 : _b.password)) {
            throw new Error("Username and password are not as per requirement");
        }
        const response = yield prisma_1.prisma.user.create({
            data: { name: (_c = parsedData.data) === null || _c === void 0 ? void 0 : _c.name,
                email: req.body.email,
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
        if (!((_a = parsedData.data) === null || _a === void 0 ? void 0 : _a.name) || !((_b = parsedData.data) === null || _b === void 0 ? void 0 : _b.password)) {
            throw new Error("Username and password are not as per requirement");
        }
        const response = yield prisma_1.prisma.user.findFirst({
            where: {
                name: (_c = parsedData.data) === null || _c === void 0 ? void 0 : _c.name,
                password: (_d = parsedData.data) === null || _d === void 0 ? void 0 : _d.password
            }
        });
        if (response && response.id) {
            const token = jsonwebtoken_1.default.sign({ userId: response.id }, process.env.JWT_key);
            res.cookie("token", token, {
                httpOnly: true, // ✅ cannot be accessed via JS
                secure: false, // ✅ set to true only if you have HTTPS (you can change later)
                sameSite: "lax" // ✅ prevents CSRF
            });
            res.status(200).json({
                message: token
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
            message: "Not able to signIn"
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
app.post("/social-site-signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield prisma_1.prisma.user.findFirst({
            where: {
                name: req.body.name,
                email: req.body.email,
                provider: req.body.provider
            }
        });
        //@ts-ignore
        const token = jsonwebtoken_1.default.sign({ userId: response.id }, process.env.JWT_SECRET);
        res.cookie("token", token, {
            httpOnly: true, // ✅ cannot be accessed via JS
            secure: false, // ✅ set to true only if you have HTTPS (you can change later)
            sameSite: "strict" // ✅ prevents CSRF
        });
        res.status(200).json({
            token
        });
    }
    catch (err) {
        res.status(404).json({
            Error: err
        });
    }
}));
app.post("/hotel-booked", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { hotel_id, tripDuration, checkIn, checkOut, amount } = req.body;
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
        console.log(existingBooking);
        if (existingBooking != null) {
            return res.status(400).json({ message: "Hotel is already booked on selected dates" });
        }
        console.log("Reached here 1");
        const razorpay = yield new razorpay_1.default({
            key_id: process.env.RAZORPAY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        const options = {
            amount: tripDuration * 1000, // amount in paisa
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };
        const order = yield razorpay.orders.create(options);
        const { currency, id, status } = order;
        const receipt = (_a = order.receipt) !== null && _a !== void 0 ? _a : "default-receipt";
        const response = yield prisma_1.prisma.booking.create({
            data: {
                hotel_id: Number(hotel_id),
                checkIn: new Date(checkIn),
                checkOut: new Date(checkOut),
                //@ts-ignore
                userId: req.id,
                time: tripDuration,
                currency: currency,
                booking_id: id,
                receipt,
                //@ts-ignore
                amount: amount
            }, include: {
                Hotels: true, // optional, to fetch hotel info with booking
                users: true // optional, to fetch user info with booking
            }
        });
        console.log("hotels", response);
        if (response) {
            res.status(200).json({
                response
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
app.post("/verify-payment", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId, status } = req.body;
        console.log(razorpay_order_id);
        console.log(orderId);
        // 🔐 Create the signature to compare with Razorpay’s
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        console.log("control reachere in verify payment");
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");
        console.log("Generated Signature:", expectedSignature);
        console.log("Received Signature:", razorpay_signature);
        if (expectedSignature === razorpay_signature) {
            console.log("✅ Payment Verified");
            const payment = yield prisma_1.prisma.payments.create({
                data: {
                    // coming from frontend
                    razorpay_order_id: razorpay_order_id,
                    razorpay_payment_id: razorpay_payment_id,
                    razorpay_signature: razorpay_signature,
                    status: "success", // from your enum Status (SUCCESS, REFUNDED, FAILED)
                    paymentDate: new Date(),
                    order: {
                        connect: { booking_id: orderId }
                    },
                    UserInfo: {
                        connect: {
                            //@ts-ignore
                            id: req.id
                        }
                    }
                },
            });
            console.log(payment);
            // 👉 Here you can update DB to mark the order as PAID
            return res.status(200).json({ success: true });
        }
        else {
            console.log("❌ Signature mismatch! Possible fraud");
            return res.status(400).json({ success: false });
        }
    }
    catch (error) {
        console.error("❌ Verification Error:", error);
        return res.status(500).json({ success: false });
    }
}));
app.get("/hotels/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hotel_id = Number(req.params.id);
    try {
        console.log(hotel_id);
        const response = yield prisma_1.prisma.booking.findFirst({
            where: { hotel_id: hotel_id }
        });
        console.log("hotel booking", response);
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
app.post("/get-hotel-booking", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.body;
    try {
        const book = yield prisma_1.prisma.booking.findUnique({
            where: {
                id: Number(orderId)
            },
            include: {
                Payments: true
            },
        });
        console.log(book);
        if (book) {
            res.status(200).json({ book });
        }
        else {
            res.status(411).json({
                Message: "Not able to send orderId"
            });
        }
    }
    catch (err) {
        res.status(503).json(err);
    }
}));
// app.listen(8000,()=>{ console.log("server is running at 8000")})
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
});
