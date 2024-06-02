import { Add, Delete } from "@mui/icons-material";
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

export interface ExploreBooksDialogProps {
  isDialogOpen: boolean;
  handleDialogClose: (newBooks?: ExploreBook[]) => void;
}

function ExploreBooksDialog(props: ExploreBooksDialogProps) {
  const [newBooks, setNewBooks] = useState<Array<ExploreBook>>([]);

  const handleAddNewBooks = () => {};

  const handleDeleteNewBook = (index: number) => {
    const tempBooks = newBooks.filter((book, i) => i !== index);
    setNewBooks([...tempBooks]);
  };

  useEffect(() => {
    handleAddNewBooks();
  }, []);

  return (
    <Dialog
      open={props.isDialogOpen}
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
            onClick={() => handleAddNewBooks()}
          >
            <Add />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        {/* list of items */}
        <div className="export-dialog-content-list">
          {!!newBooks &&
            newBooks.map((book, index) => (
              <div key={index}>
                <div className="explore-dialog-content-row row">
                  <Typography
                    className="explore-dialog-content-row-text"
                    variant="body1"
                    component="div"
                  >
                    {book.title} - By: {book.author}
                  </Typography>
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
        <Button onClick={() => props.handleDialogClose()}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => props.handleDialogClose(newBooks)}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ExploreBooksDialog;
