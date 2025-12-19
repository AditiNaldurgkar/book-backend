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
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));
app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.status(200).send(books);
});

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
