import "./EditBookDialog.scss";
import {
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  Box,
  OutlinedInput,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import IndexedChip from "../IndexedChip/IndexedChip";
import { Book } from "../../types/book";
import { ListItem } from "../../types/shared";
import { Delete } from "@mui/icons-material";

export interface EditBookDialogProps {
  book: Book;
  categories: ListItem[];
  tags: ListItem[];
  isDialogOpen: boolean;
  handleDeleteBook: (book: Book) => void;
  handleDialogClose: (book?: Book) => void;
}

function EditBookDialog(props: EditBookDialogProps) {
  const [categories, setCategories] = useState<number[]>([]);
  const [tags, setTags] = useState<number[]>([]);

  useEffect(() => {
    setCategories(props.book.categories);
    setTags(props.book.tags);
  }, [props.book]);

  const handleCategoriesChange = (
    event: SelectChangeEvent<typeof categories>
  ) => {
    const {
      target: { value },
    } = event;
    setCategories(
      typeof value === "string"
        ? value.split(",").map((item) => parseInt(item))
        : value
    );
  };

  const handleTagsChange = (event: SelectChangeEvent<typeof categories>) => {
    const {
      target: { value },
    } = event;
    setTags(
      typeof value === "string"
        ? value.split(",").map((item) => parseInt(item))
        : value
    );
  };

  const sanitizeFormData = (inputData: { [k: string]: any }): Book => {
    const returnBook: Book = {
      id: props.book.id,
      title: inputData.title,
      author: inputData.author,
      genre: inputData.genre,
      rating: parseInt(inputData.rating) ?? 0,
      // If there's anything in the string, handle it. Else, empty array.
      categories: inputData.categories
        ? inputData.categories.split(",").map((item: any) => parseInt(item))
        : [],
      tags: inputData.tags
        ? inputData.tags.split(",").map((item: any) => parseInt(item))
        : [],
    };
    return returnBook;
  };

  return (
    <Dialog
      open={props.isDialogOpen}
      onClose={() => props.handleDialogClose()}
      fullWidth={true}
      maxWidth={"sm"}
      scroll="paper"
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          const sanitizedBook = sanitizeFormData(formJson);
          props.handleDialogClose(sanitizedBook);
        },
      }}
      aria-labelledby="book-edit-dialog-title"
      aria-describedby="book-edit-dialog-description"
    >
      {/* header toolbar */}
      <DialogTitle id="book-edit-dialog-header">
        <div id="book-edit-dialog-title-column">
          <Typography
            gutterBottom
            id="book-edit-dialog-title"
            variant="h5"
            component="div"
          >
            Edit book
          </Typography>
          <Typography
            gutterBottom
            id="book-edit-dialog-description"
            variant="body1"
            component="div"
          >
            Update the information about a book.
          </Typography>
        </div>
        {props.book.id !== 0 && (
          <div>
            <Tooltip title="Delete Book">
            <IconButton
              aria-label="delete book"
              color="error"
              onClick={() => props.handleDeleteBook(props.book)}
            >
              <Delete />
            </IconButton>
            </Tooltip>
          </div>
        )}
      </DialogTitle>
      <DialogContent dividers={true} id="book-edit-dialog-content">
        <TextField
          fullWidth
          required
          style={{ margin: "5px" }}
          type="text"
          label="Title"
          name="title"
          variant="outlined"
          defaultValue={props.book.title}
        />
        <br />
        <TextField
          fullWidth
          required
          style={{ margin: "5px" }}
          type="text"
          label="Author"
          name="author"
          variant="outlined"
          defaultValue={props.book.author}
        />
        <br />
        <TextField
          fullWidth
          required
          style={{ margin: "5px" }}
          type="text"
          label="Genre"
          name="genre"
          variant="outlined"
          defaultValue={props.book.genre}
        />
        <br />
        {/* Maybe make this use the rating component to select */}
        <TextField
          fullWidth
          required
          InputProps={{ inputProps: { min: 0, max: 5 } }}
          style={{ margin: "5px" }}
          type="number"
          label="Rating"
          name="rating"
          variant="outlined"
          defaultValue={props.book.rating}
        />
        <br />
        {/* Maybe cheange this to use the autocomplete component with option to add new */}
        <FormControl fullWidth style={{ margin: "5px" }}>
          <InputLabel>Categories</InputLabel>
          <Select
            name="categories"
            variant="outlined"
            multiple
            value={categories}
            onChange={handleCategoriesChange}
            input={<OutlinedInput label="Categories" />}
            renderValue={(selected: number[]) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value: number) => (
                  <IndexedChip
                    key={value}
                    index={value}
                    list={props.categories}
                  />
                ))}
              </Box>
            )}
          >
            {props.categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <br />
        <FormControl fullWidth style={{ margin: "5px" }}>
          <InputLabel>Tags</InputLabel>
          <Select
            name="tags"
            variant="outlined"
            multiple
            value={tags}
            onChange={handleTagsChange}
            input={<OutlinedInput label="Tags" />}
            renderValue={(selected: number[]) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value: number) => (
                  <IndexedChip key={value} index={value} list={props.tags} />
                ))}
              </Box>
            )}
          >
            {props.tags.map((tag) => (
              <MenuItem key={tag.id} value={tag.id}>
                {tag.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.handleDialogClose()}>Cancel</Button>
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditBookDialog;
