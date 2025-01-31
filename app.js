require('dotenv').config()

const path = require('path');
const express = require('express');
const userRouter = require('./routes/user.route');
const { connectDB } = require('./connections');
const { urlencoded } = require('body-parser');
const cookieParser = require('cookie-parser')
// const flash = require('connect-flash');

const { checkForAuthentication } = require('./middlewares/authentication.middleware');
const blogRouter = require('./routes/blog.route');
const Blog = require('./models/blog.model');
const { getAllBlogs } = require('./controllers/blog.controller');


connectDB(process.env.MONGO_URL);

const app = express();

const PORT = process.env.PORT; 

app.set("view engine", "ejs");
app.set("views", path.resolve("./views" ));
app.use(express.urlencoded({extended : false}))

app.use(cookieParser());
app.use(checkForAuthentication("token"));
// app.use(flash());

app.use(express.static(path.resolve("./public"))) 
//by default express will not allow us to access static resourses 

app.use("/user", userRouter);
app.use("/blog", blogRouter);


app.get("/", getAllBlogs("createdAt", -1));



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});