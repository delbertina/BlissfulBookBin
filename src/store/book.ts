import { Books } from "../data/books";
import { Categories } from "../data/categories";
import { Tags } from "../data/tags";
import { Book } from "../types/book";
import { ListItem } from "../types/shared";
import InitialState, { LOCAL_DATA } from "./types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: InitialState = {
  books:
    JSON.parse(
      localStorage.getItem(LOCAL_DATA.BOOK) ?? JSON.stringify(Books)
    ) ?? Books,
  categories:
    JSON.parse(
      localStorage.getItem(LOCAL_DATA.CATEGORY) ?? JSON.stringify(Categories)
    ) ?? Categories,
  tags:
    JSON.parse(localStorage.getItem(LOCAL_DATA.TAG) ?? JSON.stringify(Tags)) ??
    Tags,
  filterTags: [],
  filterCats: [],
};

const setLocalBooks = (books: Book[]) => {
  localStorage.setItem(LOCAL_DATA.BOOK, JSON.stringify(books));
};

const setLocalCats = (categories: ListItem[]) => {
  localStorage.setItem(LOCAL_DATA.CATEGORY, JSON.stringify(categories));
};

const setLocalTags = (tags: ListItem[]) => {
  localStorage.setItem(LOCAL_DATA.TAG, JSON.stringify(tags));
};

export const bookSlice = createSlice({
  name: "book",
  initialState: initialState,
  selectors: {
    categories: (state): ListItem[] => state.categories,
    filteredCategories: (state): number[] => state.filterCats,
    tags: (state): ListItem[] => state.tags,
    nextBookInd: (state): number =>
      Math.max(...state.books.map((book) => book.id), 0) + 1,
    filteredTags: (state): number[] => state.filterTags,
    filteredBooks: (state): Book[] =>
      state.books.filter(
        (book) =>
          (state.filterTags.length === 0 ||
            book.tags.find((tag) => state.filterTags.indexOf(tag) > -1)) &&
          (state.filterCats.length === 0 ||
            book.categories.find((cat) => state.filterCats.indexOf(cat) > -1))
      ),
    unremovableCats: (state): ListItem[] => {
      const inUseCats = new Set(state.books.flatMap((item) => item.categories));
      const filteredCats = state.categories.filter((item) =>
        inUseCats.has(item.id)
      );
      return filteredCats;
    },
    unremovableTags: (state): ListItem[] => {
      const inUseTag = new Set(state.books.flatMap((item) => item.tags));
      const filteredTags = state.tags.filter((item) => inUseTag.has(item.id));
      return filteredTags;
    },
  },
  reducers: {
    addBook: (state, action: PayloadAction<Book>) => {
      setLocalBooks([...state.books, action.payload]);
      state.books.push(action.payload);
    },
    updateBook: (state, action: PayloadAction<Book>) => {
      const filteredBooks = state.books.filter(
        (oldBook) => oldBook.id !== action.payload.id
      );
      state.books = [action.payload, ...filteredBooks];
      setLocalBooks([action.payload, ...filteredBooks]);
    },
    deleteBook: (state, action: PayloadAction<Book>) => {
      const tempBooks = state.books.filter(
        (item) => item.id !== action.payload.id
      );
      state.books = [...tempBooks];
      setLocalBooks(tempBooks);
    },
    setCats: (state, action: PayloadAction<Array<ListItem>>) => {
      state.categories = [...action.payload];
      setLocalCats(action.payload);
    },
    setTags: (state, action: PayloadAction<Array<ListItem>>) => {
      state.categories = [...action.payload];
      setLocalTags(action.payload);
    },
    setFilterCats: (state, action: PayloadAction<Array<number>>) => {
      state.filterCats = [...action.payload];
    },
    setFilterTags: (state, action: PayloadAction<Array<number>>) => {
      state.filterTags = [...action.payload];
    },
  },
});

export const {
  categories,
  filteredCategories,
  tags,
  nextBookInd,
  filteredTags,
  filteredBooks,
  unremovableCats,
  unremovableTags,
} = bookSlice.selectors;
// Action creators are generated for each case reducer function
export const {
  addBook,
  updateBook,
  deleteBook,
  setCats,
  setTags,
  setFilterCats,
  setFilterTags,
} = bookSlice.actions;
// You must export the reducer as follows for it to be able to be read by the store.
export default bookSlice.reducer;
