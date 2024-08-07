import { Books, NewBook } from "../data/books";
import { Categories } from "../data/categories";
import { Tags } from "../data/tags";
import { Book } from "../types/book";
import { DIALOG_ITEM, ListItem } from "../types/shared";
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
  snackbarMsg: "",
  currentDialog: null,
  currentEditInd: 0,
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
    snackbarMsg: (state): string => state.snackbarMsg,
    currentDialog: (state): DIALOG_ITEM | null => state.currentDialog,
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
    currentEditBook: (state): Book => {
      const foundBook = state.books.find(
        (book) => book.id === state.currentEditInd
      );
      if (!foundBook) {
        return NewBook;
      }
      return foundBook;
    },
  },
  reducers: {
    updateBook: (state, action: PayloadAction<Book>) => {
      // if new book, update the ID
      if (action.payload.id === 0) {
        const nextBookInd =
          Math.max(...state.books.map((book) => book.id), 0) + 1;
        action.payload.id = nextBookInd;
      }
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
    openSnackbar: (state, action: PayloadAction<string>) => {
      state.snackbarMsg = action.payload;
    },
    setCurrentDialog: (state, action: PayloadAction<DIALOG_ITEM | null>) => {
      state.currentDialog = action.payload;
    },
    setCurrentEditInd: (state, action: PayloadAction<number>) => {
      state.currentEditInd = action.payload;
    },
  },
});

export const {
  categories,
  filteredCategories,
  tags,
  snackbarMsg,
  currentDialog,
  filteredTags,
  filteredBooks,
  unremovableCats,
  unremovableTags,
  currentEditBook,
} = bookSlice.selectors;
// Action creators are generated for each case reducer function
export const {
  updateBook,
  deleteBook,
  setCats,
  setTags,
  setFilterCats,
  setFilterTags,
  openSnackbar,
  setCurrentDialog,
  setCurrentEditInd,
} = bookSlice.actions;
// You must export the reducer as follows for it to be able to be read by the store.
export default bookSlice.reducer;
