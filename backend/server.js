// const express = require("express");
// const cors = require("cors");
// require("dotenv").config()
// const authRoutes = require("./routes/authRoutes")
// const session = require("express-session")
// const dashboardUserRoute = require("./routes/dashboardUserRoute");
// const auth = require("./middleware/authMiddleware");
// const kegiatanUserRoute = require("./routes/kegiatanUserRoute");
// const path = require("path");
// const dokumentasiUserRoute = require("./routes/dokumentasiUserRoute");
// const indikatorUserRoute = require("./routes/indikatorUserRoute");
// const tindakLanjutUserRoute = require("./routes/tindakLanjutUserRoute");
// const userRouter = require("./routes/Userrouter");
// const tahunAdminRoute = require("./routes/tahunAdminRoute");
// const teknisAdminRoute = require("./routes/teknisAdminRoute");
// const KegiatanRouter = require("./routes/kegiatanAdminRoutes");
// const TujuanRouter = require("./routes/tujuanRoute");
// const sasaranAdminRoute = require("./routes/sasaranAdminRoute");
// const indikatorAdminRoute = require("./routes/indikatorAdminRoute");
// const dashboardAdminRoute = require("./routes/dashboardAdminRoute");
// const downloadAdminRoute = require("./routes/downloadAdminRoute");
// const laporanAdminRoute = require("./routes/laporanAdminRoute");

// const app = express();

// app.use(
//   cors({
//     origin: "http://127.0.0.1:5501",
//     credentials: true
//   }),
// );
// app.use(express.json());
// app.use(
//     session({
//         secret: "skala_session_secret",
//         resave: false,
//         saveUninitialized: false,
//         cookie: {
//             maxAge: 1000 * 60 * 60 * 8, // 8 jam
//         },
//     }),
// );
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static(path.join(__dirname, "../frontend")))

// app.use("/tailwind", express.static(path.join(__dirname, "tailwind")));

// //admin
// app.use("/api", userRouter);
// app.use("/api/admin/laporan", laporanAdminRoute);
// app.use("/api/dashboard/admin", dashboardAdminRoute);
// app.use("/master/tahun", tahunAdminRoute);
// app.use("/master/teknis", teknisAdminRoute);
// app.use("/master/kegiatan", KegiatanRouter);
// app.use("/master/komponen/tujuan", TujuanRouter);
// app.use("/master/komponen/sasaran", sasaranAdminRoute);
// app.use("/master/komponen/indikator", indikatorAdminRoute);
// app.use("/api/download", downloadAdminRoute);

// //user
// app.use("/api/dokumentasi", dokumentasiUserRoute);
// app.use("/api/rtl", tindakLanjutUserRoute);
// app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
// app.use("/api", authRoutes);
// app.use("/api/dashboard", dashboardUserRoute);
// app.use("/api/kegiatan", kegiatanUserRoute);
// app.use("/api/indikator", indikatorUserRoute);

// app.get("/profile", auth.isLogin, (req, res) => {
//   res.json({
//     success: true,
//     data: req.session.user,
//   });
// });

// //halaman awal
// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend/login.html"))
// });

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//     console.log(`Server berjalan di http://127.0.0.1:${PORT}`);
// });

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const path = require("path");

dotenv.config();

// ROUTES
const authRoutes = require("./routes/authRoutes");
const dashboardUserRoute = require("./routes/dashboardUserRoute");
const kegiatanUserRoute = require("./routes/kegiatanUserRoute");
const dokumentasiUserRoute = require("./routes/dokumentasiUserRoute");
const indikatorUserRoute = require("./routes/indikatorUserRoute");
const tindakLanjutUserRoute = require("./routes/tindakLanjutUserRoute");

// ADMIN
const userRouter = require("./routes/Userrouter");
const tahunAdminRoute = require("./routes/tahunAdminRoute");
const teknisAdminRoute = require("./routes/teknisAdminRoute");
const KegiatanRouter = require("./routes/kegiatanAdminRoutes");
const TujuanRouter = require("./routes/tujuanRoute");
const sasaranAdminRoute = require("./routes/sasaranAdminRoute");
const indikatorAdminRoute = require("./routes/indikatorAdminRoute");
const dashboardAdminRoute = require("./routes/dashboardAdminRoute");
const downloadAdminRoute = require("./routes/downloadAdminRoute");
const laporanAdminRoute = require("./routes/laporanAdminRoute");

const auth = require("./middleware/authMiddleware");

const app = express();

// =====================================
// TRUST PROXY
// Diperlukan untuk production Railway
// =====================================

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// =====================================
// CORS
// =====================================

const allowedOrigins = [
  "http://127.0.0.1:5501",
  "http://localhost:5501",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin tidak diizinkan oleh CORS"));
    },

    credentials: true,
  }),
);

// =====================================
// BODY PARSER
// =====================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// =====================================
// SESSION
// =====================================

app.use(
  session({
    secret: process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    cookie: {
      maxAge: 1000 * 60 * 60 * 8,

      secure: process.env.NODE_ENV === "production",

      httpOnly: true,

      sameSite: "lax",
    },
  }),
);

// =====================================
// STATIC FILE
// =====================================

// Folder public backend
app.use(express.static(path.join(__dirname, "public")));

// Folder frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Tailwind
app.use("/tailwind", express.static(path.join(__dirname, "tailwind")));

// =====================================
// UPLOADS
// =====================================

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// =====================================
// ADMIN ROUTES
// =====================================

app.use("/api", userRouter);

app.use("/api/admin/laporan", laporanAdminRoute);

app.use("/api/dashboard/admin", dashboardAdminRoute);

app.use("/master/tahun", tahunAdminRoute);

app.use("/master/teknis", teknisAdminRoute);

app.use("/master/kegiatan", KegiatanRouter);

app.use("/master/komponen/tujuan", TujuanRouter);

app.use("/master/komponen/sasaran", sasaranAdminRoute);

app.use("/master/komponen/indikator", indikatorAdminRoute);

app.use("/api/download", downloadAdminRoute);

// =====================================
// USER ROUTES
// =====================================

app.use("/api/dokumentasi", dokumentasiUserRoute);

app.use("/api/rtl", tindakLanjutUserRoute);

app.use("/api", authRoutes);

app.use("/api/dashboard", dashboardUserRoute);

app.use("/api/kegiatan", kegiatanUserRoute);

app.use("/api/indikator", indikatorUserRoute);

// =====================================
// PROFILE
// =====================================

app.get(
  "/profile",

  auth.isLogin,

  (req, res) => {
    res.json({
      success: true,
      data: req.session.user,
    });
  },
);

// =====================================
// HALAMAN AWAL
// =====================================

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

// =====================================
// HEALTH CHECK
// =====================================

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SKALA API berjalan",
  });
});

// =====================================
// SERVER
// =====================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server SKALA berjalan di port ${PORT}`);
});