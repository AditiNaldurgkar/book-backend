import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import Book from "./models/Book.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


// ================== ROUTES ==================

// GET all books
app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.status(200).send(books);
});

// ADD book
app.post("/books", async (req, res) => {
  const { name, price, imglink, description } = req.body;

  const newBook = new Book({
    name,
    price,
    imglink,
    description
  });

  await newBook.save();

  res.status(201).send({
    success: true,
    msg: "Book added successfully",
    data: newBook
  });
});

// GET book by name
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

// DELETE book
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

// UPDATE price (PUT)
app.put("/books/:name", async (req, res) => {
  const name = decodeURIComponent(req.params.name);
  const { price } = req.body;

  const updatedBook = await Book.findOneAndUpdate(
    { name },
    { price },
    { new: true }
  );

  if (!updatedBook) {
    return res.status(404).send({
      success: false,
      msg: "Book not found"
    });
  }

  res.status(200).send({
    success: true,
    msg: "Book info updated",
    data: updatedBook
  });
});

// UPDATE price (PATCH)
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

// HEALTH CHECK
app.get("/health", (req, res) => {
  res.send("Server is up and running");
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
