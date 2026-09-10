import Book from "../models/Book.js";

// GET /api/books
export const getBooks = async (req, res) => {
  try {
    const { search, genre, available } = req.query;
    const filter = {};

    if (genre && genre !== "All") {
      filter.genre = genre;
    }

    if (available !== undefined && available !== "") {
      filter.available = available === "true";
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [{ title: regex }, { author: regex }, { genre: regex }, { description: regex }];
    }

    const books = await Book.find(filter).sort({ title: 1 });
    const genres = await Book.distinct("genre");

    return res.status(200).json({
      success: true,
      count: books.length,
      genres,
      books,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error fetching books.", error: err.message });
  }
};

// POST /api/admin/books (Admin only)
export const addBook = async (req, res) => {
  try {
    const { title, author, genre, coverImageUrl, available, description, isbn } = req.body;

    if (!title || !author || !genre) {
      return res.status(400).json({
        success: false,
        message: "Title, author, and genre are required.",
      });
    }

    const book = await Book.create({
      title: title.trim(),
      author: author.trim(),
      genre: genre.trim(),
      coverImageUrl: coverImageUrl?.trim() || "",
      available: available !== undefined ? Boolean(available) : true,
      description: description?.trim() || "",
      isbn: isbn?.trim() || "",
    });

    return res.status(201).json({
      success: true,
      message: "Book added to collection.",
      book,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error adding book.", error: err.message });
  }
};

// DELETE /api/admin/books/:id (Admin only)
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: "Book not found." });

    return res.status(200).json({ success: true, message: "Book removed successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error deleting book.", error: err.message });
  }
};

// POST /api/contact (Public inquiry form)
export const submitContactInquiry = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Name, email, and message are required." });
    }

    console.log(`📩 [INQUIRY RECEIVED] From: ${name} (${email}, ${phone || "No phone"})`);
    console.log(`💬 Message: ${message}`);

    return res.status(200).json({
      success: true,
      message: "Thank you for reaching out to Shivaji Library! Our team will contact you shortly.",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error submitting inquiry.", error: err.message });
  }
};
