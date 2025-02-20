import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
// import bcrypt from "bcrypt";
// import passport from "passport";
// import GoogleStrategy from "passport-google-oauth2";
// import { Strategy } from "passport-local";
// import session from "express-session";
import env from "dotenv";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
const port = 4000;
const saltRounds = 10;
env.config();




// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//   })
// );
// const corsOptions = { 
//     origin: 'http://localhost:3000',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true};

// app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(express.json());


app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());




// app.options("/auth/google", cors({
//     methods: ['GET', 'POST', 'PUT']}))



const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  });
  db.connect();


// app.get("/", (req, res) => {
//   res.render("home.ejs");
// });

app.post("/login",  async (req, res) => {
    const {username, email, password} = req.body;
    
    const result = await db.query("SELECT * FROM userlogin WHERE username = $1 ", [
      username,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];

    if (!user) return res.status(400).json({ error: "User not found" });
   
  
    const isValid = await bcrypt.compare(password, user.password);
    // const isValid =password === user.password;
    if (!isValid) return res.status(400).json({ error: "Invalid credentials" });
  
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {expiresIn:'2h'});
    res.json({ token, user });
  
}});






app.post("/signup",  async (req, res) => {
  const {username, email, password} = req.body;
  
  const result = await db.query("SELECT * FROM userlogin WHERE email = $1 ", [
    email,
  ]);
  if (result.rows.length > 0) {

    return res.status(400).json({ error: "User Already Exist" }); }

    else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          const result = await db.query(
            "INSERT INTO userlogin (email, username, password) VALUES ($1, $2, $3) RETURNING *",
            [email, username, hash]
          );
          return res.status(200).json({ message: "Account Successfully Created" }); 
          console.log("created")

        }})}
 

  // // const isValid = await bcrypt.compare(password, user.password);
  // const isValid =password === user.password;
  // if (!isValid) return res.status(400).json({ error: "Invalid credentials" });

  // const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
  // res.json({ token, user });

});

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ error: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.userId = decoded.userId;
    next();
  });
};


app.get("/notes", authMiddleware, async (req, res) => {
  const userID = req.userId;
  // console.log(userID);
  
  const result = await db.query("SELECT * FROM note WHERE user_id = $1 ", [
    userID]);
  if (result.rows.length > 0) {
    const note = result.rows;

  if (!note) return res.status(400).json({ error: "No Note Found" });
 

  else { return res.json(note)};


}});


app.get("/dashboard", authMiddleware, async (req, res) => {
  const userID = req.userId;
  // console.log(userID);
  
  const result = await db.query("SELECT * FROM note WHERE user_id = $1 ", [
    userID]);
  
    const note = result.rows;

  if (!note) return res.status(400).json({ error: "No Note Found" });
 

  else { return res.json(note)};


});

app.post("/delete/:id", authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  // console.log(id);
  
  const result = await db.query("DELETE FROM note WHERE id = ($1) ", [
    id]);
  
    const note = result.rows;

  if (!note) return res.status(400).json({ error: "No Note Found" });
 

  else { return res.json(note)};


});



app.post("/newnote", authMiddleware, async (req, res) => {

  const {title,content} = req.body[0];
  const userID = req.body[1];
  // console.log(userID)
  // console.log(content)

  try {
      await db.query("INSERT INTO note (title, content, user_id) VALUES (($1), ($2), ($3))", [title,  content,  userID]);
      
      return res.status(200).json({ message: "Note Created Successfully" }); 
      console.log("Note Created")
    } catch (err) {
      console.log(err);
    }
});


app.get("/logout", authMiddleware, async (req, res) => {
  const token = req.headers["authorization"];
  jwt.destroy(token)
    }
);


app.post("/updatenote", authMiddleware, async (req, res) => {

  const {title,content, id} = req.body[0];
  const tId = parseInt(id)
  const userID = req.body[1];
  console.log(userID)
  console.log(content)
  console.log(tId)

  try {
      await db.query("UPDATE note SET title=($1), content=($2) WHERE id=($3)", [title,  content, tId]);
      
      return res.status(200).json({ message: "Note Updated Successfully" }); 
      console.log("Note Created")
    } catch (err) {
      console.log(err);
    }
});

// app.get("/register", (req, res) => {
//   res.render("register.ejs");
// });

// app.get("/logout", (req, res) => {
//   req.logout(function (err) {
//     if (err) {
//       return next(err);
//     }
//     res.redirect("/");
//   });
// });

// app.get("/secrets", (req, res) => {
//   console.log(req.user);
//   if (req.isAuthenticated()) {
//     res.render("secrets.ejs");
//   } else {
//     res.redirect("/login");
//   }
// });

// app.get(
//   "/auth/google",  
//   passport.authenticate("google", {
//   scope: ["profile", "email"],
// })
// );
// app.get(
//   "/auth/google/secrets", 
//   passport.authenticate("google", {
//     successRedirect: "/dashboard",
//     failureRedirect: "/login",
// })
// );

// app.post(
//   "/login",
//   passport.authenticate("local", {failureRedirect: '/login'}),
//   (req, res) => {
//     console.log("sucesss");
//   }
// );



// passport.use("local",
//     new Strategy(async function verify(username, password, cb) {
//       try {
//         const result = await db.query("SELECT * FROM users WHERE email = $1 ", [
//           username
//         ]);
//         if (result.rows.length > 0) {
//           const user = result.rows[0];
//           //  const isValid = await bcrypt.compare(password, user.password);
//     const isValid = password === user.password;
//     if (!isValid) {
//       return cb(null, false);
            
//             } else if (isValid) {
//                 return cb(null, user);
//               } 
//             }
//           else {
//           return cb("User not found");
//         }
//       } catch (err) {
//         console.log(err);
//       }
//     })
//   );


// passport.use("google", new GoogleStrategy ({
// clientID: process.env.GOOGLE_CLIENT_ID,
// clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// callbackURL: "http://localhost:3000/auth/google/index",  
// userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
// }, 
// async (accessToken, refreshToken, profile, cb) => {
//   try {
//     console.log(profile);
//     const result = await db.query("SELECT * FROM users WHERE email = $1", [
//       profile.email,
//     ]);
//     if (result.rows.length === 0) {
//       const newUser = await db.query(
//         "INSERT INTO users (email, password) VALUES ($1, $2)",
//         [profile.email, "google"]
//       );
//       return cb(null, newUser.rows[0]);
//     } else {
//       return cb(null, result.rows[0]);
//     }
//   } catch (err) {
//     return cb(err);
//   }
// }

// ))

// passport.serializeUser((user, cb) => {
//   cb(null, user);
// });
// passport.deserializeUser((user, cb) => {
//   cb(null, user);
// });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
