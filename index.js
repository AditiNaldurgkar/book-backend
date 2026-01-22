import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import Book from "./models/Book.js";
import bcrypt from "bcryptjs";
import User from "./models/User.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://book-frontend-xwe8.onrender.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));
app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.status(200).send(books);
  
});

app.post("/books", async (req, res) => {
  const { name, author, price, imglink, description } = req.body;

  const newBook = new Book({
    name,
    author,
    price,
    imglink,
    description
  });
console.log(newBook);
  await newBook.save();

  res.status(201).send({
    success: true,
    msg: "Book added successfully",
    data: newBook
  });
});
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({
      $or: [{ name }, { email }]
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        msg: "User with this name or email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      msg: "Signup successful"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});
app.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    const user = await User.findOne({ name });
    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        msg: "Invalid credentials"
      });
    }

    res.status(200).json({
  success: true,
  msg: "Login successful",
  user: {
    id: user._id,
    name: user.name,
    role: user.role
  }
});

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

app.get("/books/:name", async (req, res) => {
  const { name } = req.params;

  const book = await Book.findOne({ name });

  if (!book) {
    return res.status(404).send({
      success: false,
      msg: "Book not found"
    });
  }

  res.status(200).send({
    success: true,
    msg: "Book fetched successfully",
    data: book
  });
});

app.delete("/books/:name", async (req, res) => {
  const name = decodeURIComponent(req.params.name);

  const deletedBook = await Book.findOneAndDelete({ name });

  if (!deletedBook) {
    return res.status(404).send({
      success: false,
      msg: "Book not found"
    });
  }

  res.status(200).send({
    success: true,
    msg: "Book deleted successfully",
    data: deletedBook
  });
});

app.put("/books/:name", async (req, res) => {
  const { role } = req.body;

  if (role !== "admin") {
    return res.status(403).json({
      success: false,
      msg: "Access denied. Admin only."
    });
  }

  const updatedBook = await Book.findOneAndUpdate(
    { name: req.params.name },
    { price: req.body.price },
    { new: true }
  );

  res.json({
    success: true,
    data: updatedBook
  });
});


app.patch("/bookprice/:name", async (req, res) => {
  const { name } = req.params;
  const { price } = req.body;

  const book = await Book.findOne({ name });

  if (!book) {
    return res.status(404).send({
      success: false,
      msg: "Book not found"
    });
  }

  book.price = price;
  await book.save();

  res.status(200).send({
    success: true,
    msg: "Book price updated",
    data: book
  });
});

app.get("/health", (req, res) => {
  res.send("Server is up and running");
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
app.post("/logout", (req, res) => {
  res.status(200).json({
    success: true,
    msg: "Logout successful"
  });
});

