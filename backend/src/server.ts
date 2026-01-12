import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// Import routes
import buildingRoutes from "./routes/buildings";
import floorRoutes from "./routes/floors";
import roomRoutes from "./routes/rooms";
import navigationRoutes from "./routes/navigation";
import beaconRoutes from "./routes/beacons";
import adminRoutes from "./routes/admin";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware - Allow multiple origins from environment variable
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000", "http://localhost:8081"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Allow any origin in development, or check allowed list
      if (
        process.env.NODE_ENV === "production" &&
        !allowedOrigins.includes(origin)
      ) {
        return callback(new Error("Not allowed by CORS"), false);
      }

      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images, etc.)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Serve admin panel
app.get("/panel", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../admin-panel.html"));
});

// Serve coordinate calculator
app.get("/coordinate-calculator", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../coordinate-calculator.html"));
});

// API Routes
app.use("/api/buildings", buildingRoutes);
app.use("/api/floors", floorRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/navigation", navigationRoutes);
app.use("/api/beacons", beaconRoutes);
app.use("/api/auth", adminRoutes);

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "Pai Dee API is running" });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Pai Dee API server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;
