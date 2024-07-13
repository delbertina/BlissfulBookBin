import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Tooltip,
  Snackbar,
} from "@mui/material";
import "./App.scss";
import { Add, Explore } from "@mui/icons-material";
import EditBookDialog from "./components/EditBookDialog/EditBookDialog";
import { Book, ExploreBook, ImportExploreBook } from "./types/book";
import { DIALOG_ITEM, ListItem } from "./types/shared";
import EditListItemDialog from "./components/EditListItemDialog/EditListItemDialog";
import ExploreBooksDialog from "./components/ExploreBooksDialog/ExploreBooksDialog";
import { useDispatch, useSelector } from "react-redux";
import {
  categories,
  currentDialog,
  deleteBook,
  filteredBooks,
  openSnackbar,
  setCats,
  setCurrentDialog,
  setCurrentEditInd,
  setTags,
  snackbarMsg,
  tags,
  unremovableCats,
  unremovableTags,
  updateBook,
} from "./store/book";
import BookTable from "./components/BookTable/BookTable";

function App() {
  const dispatch = useDispatch();

  const storeBooks = useSelector(filteredBooks);
  const storeCats = useSelector(categories);
  const storeTags = useSelector(tags);
  const storeSnackbar = useSelector(snackbarMsg);
  const storeDialog = useSelector(currentDialog);
  const storeUnremCats = useSelector(unremovableCats);
  const storeUnremTags = useSelector(unremovableTags);

  const handleEditBookOpen = (id?: number): void => {
    dispatch(setCurrentEditInd(id ?? 0))
    dispatch(setCurrentDialog(DIALOG_ITEM.BOOK_EDIT));
  };

  const handleEditBookClose = (book?: Book): void => {
    if (!!book) {
      // if new book
      if (book.id === 0) {
        // to keep the books in order by id should add it to the back
        // then the book maybe wouldn't show up on page 1 after adding
        // that wouldn't be user intuative
        dispatch(updateBook(book));
        handleSnackbarOpen("New book successfully added!");
      } else {
        // Could find the book edited instead of filtering it out
        // If the book never existed, it'll still add it which is what we want
        dispatch(updateBook(book));
        handleSnackbarOpen("Book successfully updated!");
      }
    }
    dispatch(setCurrentDialog(null));
    // If there's always a book here, don't have to check if undefined
    dispatch(setCurrentEditInd(0));
  };

  const handleBookDelete = (book: Book): void => {
    const foundIndex = storeBooks.findIndex((item) => item.id === book.id);
    if (foundIndex === -1) {
      // error deleting book
      handleSnackbarOpen("Error! Book not found!");
    } else {
      dispatch(deleteBook(book));
      handleSnackbarOpen("Book successfully deleted");
    }
  };

  const handleEditCatClose = (returnList?: ListItem[]): void => {
    if (!!returnList) {
      dispatch(setCats(returnList));
      handleSnackbarOpen("Category list successfully updated!");
    }
    dispatch(setCurrentDialog(null));
  };

  const handleEditTagClose = (returnList?: ListItem[]): void => {
    if (!!returnList) {
      dispatch(setTags(returnList));
      handleSnackbarOpen("Tag list successfully updated!");
    }
    dispatch(setCurrentDialog(null));
  };

  const handleExploreBookOpen = (): void => {
    dispatch(setCurrentDialog(DIALOG_ITEM.BOOK_EXPLORE));
  };

  const handleExploreBookClose = (): void => {
    dispatch(setCurrentDialog(null));
  };

  const handleExploreBookAdd = (newBook: ExploreBook): void => {
    dispatch(updateBook(ImportExploreBook(newBook)));
  };

  const handleSnackbarOpen = (message: string) => {
    dispatch(openSnackbar(message));
  };

  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch(openSnackbar(""));
  };

  return (
    <div>
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Blissful Book Bin
            </Typography>
            <IconButton color="warning" onClick={() => handleExploreBookOpen()}>
              <Explore />
            </IconButton>
            <Tooltip title="Add Book">
              <IconButton color="inherit" onClick={() => handleEditBookOpen()}>
                <Add />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
      </div>
      <div className="app-content">
        <BookTable
          handleEditBookOpen={(id: number) => handleEditBookOpen(id)}
          setIsEditCatDialogOpen={() =>
            setCurrentDialog(DIALOG_ITEM.CATEGORY_EDIT)
          }
          setIsEditTagDialogOpen={() => setCurrentDialog(DIALOG_ITEM.TAG_EDIT)}
        />
      </div>
      {/* Edit Book */}
      <EditBookDialog
        categories={storeCats}
        tags={storeTags}
        isDialogOpen={storeDialog === DIALOG_ITEM.BOOK_EDIT}
        handleDialogClose={(book?: Book) => handleEditBookClose(book)}
        handleDeleteBook={(book: Book) => handleBookDelete(book)}
      />
      {/* Edit Categories */}
      <EditListItemDialog
        list={storeCats}
        unremovableItems={storeUnremCats}
        isDialogOpen={storeDialog === DIALOG_ITEM.CATEGORY_EDIT}
        dialogTitle="Edit Categories"
        dialogDescription="Add, update, and delete categories."
        handleDialogClose={(returnList?: ListItem[]) =>
          handleEditCatClose(returnList)
        }
      />
      {/* Edit Tags */}
      <EditListItemDialog
        list={storeTags}
        unremovableItems={storeUnremTags}
        isDialogOpen={storeDialog === DIALOG_ITEM.TAG_EDIT}
        dialogTitle="Edit Tags"
        dialogDescription="Add, update, and delete tags."
        handleDialogClose={(returnList?: ListItem[]) =>
          handleEditTagClose(returnList)
        }
      />
      {/* Explore Books */}
      <ExploreBooksDialog
        handleAddBook={(book: ExploreBook) => handleExploreBookAdd(book)}
        isDialogOpen={storeDialog === DIALOG_ITEM.BOOK_EXPLORE}
        handleDialogClose={() => handleExploreBookClose()}
      />
      {/* Snackbar */}
      <Snackbar
        open={storeSnackbar !== ""}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        message={storeSnackbar}
      />
    </div>
  );
}

export default App;
