import { Book } from "../types/book";

export const NewBook: Book = {
  id: 0, // ID of 0 = new book that needs an ID
  title: "",
  author: "",
  genre: "",
  rating: 0,
  categories: [],
  tags: [],
};

export const Books: Book[] = [
  {
    id: 1,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    rating: 5,
    categories: [2, 3],
    tags: [1, 2],
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    genre: "Science Fiction",
    rating: 4,
    categories: [1, 3],
    tags: [3, 4],
  },
  {
    id: 3,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Fiction",
    rating: 5,
    categories: [1, 2],
    tags: [1, 2],
  },
];
