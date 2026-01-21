require("dotenv/config");
const { connectDB } = require("./db");
const express = require("express");

const { isAuthenticated } = require("./middleware/jwt.middleware");


const app = express();
require("./config")(app);


// Each time a request is made, ensure DB is connected
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (e) {
        next(e);
    }
});


// 👇 Start handling routes here
const allRoutes = require("./routes");
app.use("/api", allRoutes);

const projectRouter = require("./routes/project.routes");
app.use("/api", isAuthenticated, projectRouter);

const taskRouter = require("./routes/task.routes");
app.use("/api", isAuthenticated, taskRouter);

const authRouter = require("./routes/auth.routes");
app.use("/auth", authRouter);

require("./error-handling")(app);

module.exports = app;
