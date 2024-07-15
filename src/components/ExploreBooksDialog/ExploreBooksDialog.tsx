import "./ExploreBooksDialog.scss";
import { Add, Delete, Refresh } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ExploreBook } from "../../types/book";
import axios from "axios";
import { useSelector } from "react-redux";
import { currentDialog } from "../../store/book";
import { DIALOG_ITEM } from "../../types/shared";

export interface ExploreBooksDialogProps {
  handleAddBook: (book: ExploreBook) => void;
  handleDialogClose: () => void;
}

function ExploreBooksDialog(props: ExploreBooksDialogProps) {
  const storeDialog = useSelector(currentDialog);
  const [newBooks, setNewBooks] = useState<Array<ExploreBook>>([]);

  const handleAddBook = (book: ExploreBook): void => {
    props.handleAddBook(book);
    const tempBooks = newBooks.filter((item) => item.title !== book.title);
    setNewBooks([...tempBooks]);
  };

  const handleRefreshBooks = (): void => {
    // call the api to add new books
    axios
      .get("https://fakerapi.it/api/v1/books?_quantity=10")
      .then((res) => {
        if (
          !!res &&
          !!res.data &&
          !!res.data.data &&
          Array.isArray(res.data.data)
        ) {
          setNewBooks(res.data.data);
        }
      })
      .catch((error) =>
        // make error toast
        console.log("Error while fetching new books: ", error)
      );
  };

  const handleDeleteNewBook = (index: number): void => {
    const tempBooks = newBooks.filter((book, i) => i !== index);
    setNewBooks([...tempBooks]);
  };

  useEffect(() => {
    handleRefreshBooks();
  }, []);

  return (
    <Dialog
      open={storeDialog === DIALOG_ITEM.BOOK_EXPLORE}
      fullWidth={true}
      maxWidth={"md"}
      aria-labelledby="explore-dialog-title"
      aria-describedby="explore-dialog-description"
    >
      <DialogTitle id="explore-dialog-header">
        <Typography
          gutterBottom
          id="explore-dialog-title"
          variant="h5"
          component="div"
        >
          Explore Books
        </Typography>
        <div>
          <IconButton
            aria-label="add to book list"
            color="success"
            onClick={() => handleRefreshBooks()}
          >
            <Refresh />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent id="explore-dialog-content">
        {/* list of items */}
        <div className="export-dialog-content-list">
          {!!newBooks &&
            newBooks.map((book, index) => (
              <div key={index}>
                <div className="explore-dialog-content-row row">
                  <div className="explore-dialog-content-row-start-actions row">
                    <IconButton
                      aria-label="add book"
                      color="success"
                      onClick={() => handleAddBook(book)}
                    >
                      <Add />
                    </IconButton>
                    <Typography
                      className="explore-dialog-content-row-text"
                      variant="body1"
                      component="div"
                    >
                      {book.title} - By: {book.author}
                    </Typography>
                  </div>
                  <div className="explore-dialog-content-row-end-actions">
                    <IconButton
                      aria-label="delete new book"
                      color="error"
                      onClick={() => handleDeleteNewBook(index)}
                    >
                      <Delete />
                    </IconButton>
                  </div>
                </div>
                <Divider />
              </div>
            ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.handleDialogClose()}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ExploreBooksDialog;
