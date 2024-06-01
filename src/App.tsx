import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Tooltip,
  Rating,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  Box,
  MenuItem,
  SelectChangeEvent,
  Snackbar,
} from "@mui/material";
import "./App.scss";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { Add, Edit } from "@mui/icons-material";
import { useEffect, useState } from "react";
import EditBookDialog from "./components/EditBookDialog/EditBookDialog";
import { Books, NewBook } from "./data/books";
import { Book } from "./types/book";
import IndexedChip from "./components/IndexedChip/IndexedChip";
import { Categories } from "./data/categories";
import { ListItem } from "./types/shared";
import { Tags } from "./data/tags";
import EditListItemDialog from "./components/EditListItemDialog/EditListItemDialog";

function App() {
  const [books, setBooks] = useState<Array<Book>>(Books);
  const [filteredBooks, setFilteredBooks] = useState<Array<Book>>(Books);
  const [categories, setCategories] = useState<Array<ListItem>>(Categories);
  const [tags, setTags] = useState<Array<ListItem>>(Tags);
  const [filteredCategories, setFilteredCategories] = useState<Array<number>>(
    []
  );
  const [filteredTags, setFilteredTags] = useState<Array<number>>([]);
  const [unremovableCats, setUnremovableCats] = useState<Array<ListItem>>([]);
  const [unremovableTags, setUnremovableTags] = useState<Array<ListItem>>([]);
  const [currentEditBook, setCurrentEditBook] = useState<Book>(NewBook);
  const [isEditBookDialogOpen, setIsEditBookDialogOpen] =
    useState<boolean>(false);
  const [isEditCatDialogOpen, setIsEditCatDialogOpen] =
    useState<boolean>(false);
  const [isEditTagDialogOpen, setIsEditTagDialogOpen] =
    useState<boolean>(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarMsg, setSnackbarMsg] = useState<string>("");

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      flex: 2,
    },
    {
      field: "author",
      headerName: "Author",
      flex: 1,
    },
    {
      field: "genre",
      headerName: "Genre",
      flex: 1,
    },
    {
      field: "rating",
      headerName: "Rating",
      renderCell: (params) => {
        return <Rating name="hover-feedback" value={params.value} readOnly />;
      },
      width: 160,
      align: "left",
      headerAlign: "left",
      type: "number",
    },
    {
      field: "categories",
      headerName: "Categories",
      filterable: false,
      renderCell: (params) => {
        return (
          <>
            {params.value.map((value: number) => (
              <IndexedChip key={value} index={value} list={categories} />
            ))}
          </>
        );
      },
      flex: 1,
    },
    {
      field: "tags",
      headerName: "Tags",
      filterable: false,
      renderCell: (params) => {
        return (
          <>
            {params.value.map((value: number) => (
              <IndexedChip key={value} index={value} list={tags} />
            ))}
          </>
        );
      },
      flex: 1,
    },
  ];

  const handleFilteredCategoriesChange = (
    event: SelectChangeEvent<typeof filteredCategories>
  ) => {
    const {
      target: { value },
    } = event;
    const selectedCategories =
      typeof value === "string"
        ? value.split(",").map((item) => parseInt(item))
        : value;
    // updateFilteredBooks(selectedCategories, filteredTags);
    setFilteredCategories(selectedCategories);
  };

  const handleFilteredTagsChange = (
    event: SelectChangeEvent<typeof filteredTags>
  ) => {
    const {
      target: { value },
    } = event;
    const selectedTags =
      typeof value === "string"
        ? value.split(",").map((item) => parseInt(item))
        : value;
    // updateFilteredBooks(filteredCategories, selectedTags);
    setFilteredTags(selectedTags);
  };

  const updateFilteredBooks = (fCats: number[], fTags: number[]): void => {
    setFilteredBooks(
      books.filter(
        (book) =>
          (fTags.length === 0 ||
            book.tags.find((tag) => fTags.indexOf(tag) > -1)) &&
          (fCats.length === 0 ||
            book.categories.find((cat) => fCats.indexOf(cat) > -1))
      )
    );
  };

  const handleEditBookOpen = (id?: number): void => {
    // If the id is falsey (including 0) handle as a new book
    if (!id) {
      setCurrentEditBook(NewBook);
    } else {
      const foundBook: Book | undefined = books.find((book) => book.id === id);
      if (!foundBook) {
        // If a truthy id was passed but it doesnt exist, display an error
        handleSnackbarOpen("Error! Existing book not found!");
        return;
      }
      setCurrentEditBook(foundBook);
    }
    setIsEditBookDialogOpen(true);
  };

  const handleEditBookClose = (book?: Book): void => {
    if (!!book) {
      // if new book
      if (book.id === 0) {
        const newBook = { ...book };
        newBook.id = getNextBookIndex();
        // to keep the books in order by id should add it to the back
        // then the book maybe wouldn't show up on page 1 after adding
        // that wouldn't be user intuative
        setBooks([newBook, ...books]);
        handleSnackbarOpen("New book successfully added!");
      } else {
        // Could find the book edited instead of filtering it out
        // If the book never existed, it'll still add it which is what we want
        const filteredBooks = books.filter((oldBook) => oldBook.id !== book.id);
        setBooks([book, ...filteredBooks]);
        handleSnackbarOpen("Book successfully updated!");
      }
    }
    setIsEditBookDialogOpen(false);
    // If there's always a book here, don't have to check if undefined
    setCurrentEditBook(NewBook);
  };

  const handleBookDelete = (book: Book): void => {
    const foundIndex = books.findIndex(item => item.id === book.id);
    if (foundIndex === -1) {
      // error deleting book
      handleSnackbarOpen("Error! Book not found!");
    } else {
      const tempBooks = books.filter(item => item.id !== book.id);
      setBooks([...tempBooks]);
      handleSnackbarOpen("Book successfully deleted");
    }
  }

  const handleEditCatOpen = (): void => {
    const inUseCats = new Set(books.flatMap((item) => item.categories));
    const filteredCats = categories.filter((item) => inUseCats.has(item.id));
    setUnremovableCats(filteredCats);
    setIsEditCatDialogOpen(true);
  };

  const handleEditCatClose = (returnList?: ListItem[]): void => {
    if (!!returnList) {
      setCategories(returnList);
      handleSnackbarOpen("Category list successfully updated!");
    }
    setIsEditCatDialogOpen(false);
  };

  const handleEditTagOpen = (): void => {
    const inUseTags = new Set(books.flatMap((item) => item.tags));
    const filteredTags = tags.filter((item) => inUseTags.has(item.id));
    setUnremovableTags(filteredTags);
    setIsEditTagDialogOpen(true);
  };

  const handleEditTagClose = (returnList?: ListItem[]): void => {
    if (!!returnList) {
      setTags(returnList);
      handleSnackbarOpen("Tag list successfully updated!");
    }
    setIsEditTagDialogOpen(false);
  };

  const getNextBookIndex = (): number => {
    const maxInd = Math.max(...books.map((book) => book.id), 0);
    return maxInd + 1;
  };

  const handleSnackbarOpen = (message: string) => {
    setSnackbarMsg(message);
    setIsSnackbarOpen(true);
  };

  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarMsg("");
    setIsSnackbarOpen(false);
  };

  useEffect(() => {
    updateFilteredBooks(filteredCategories, filteredTags);
  }, [books, filteredCategories, filteredTags])

  return (
    <div>
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Blissful Book Bin
            </Typography>
            <Tooltip title="Add Book">
              <IconButton color="inherit" onClick={() => handleEditBookOpen()}>
                <Add />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
      </div>
      <div className="app-content">
        <AppBar position="static">
          <Toolbar>
            <div className="grid-toolbar-field-row">
              <div className="grid-toolbar-field-row-inner">
                <Typography variant="h6">Categories</Typography>
              </div>
              <div className="grid-toolbar-field-row-inner">
                <IconButton color="warning" onClick={() => handleEditCatOpen()}>
                  <Edit />
                </IconButton>
              </div>
              <FormControl style={{ flexGrow: 1 }}>
                <InputLabel>Filter Categories</InputLabel>
                <Select
                  name="categories"
                  variant="outlined"
                  multiple
                  value={filteredCategories}
                  onChange={handleFilteredCategoriesChange}
                  input={
                    <OutlinedInput
                      sx={{ background: "white" }}
                      label="Filter Categories"
                    />
                  }
                  renderValue={(selected: number[]) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value: number) => (
                        <IndexedChip
                          key={value}
                          index={value}
                          list={categories}
                        />
                      ))}
                    </Box>
                  )}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className="grid-toolbar-field-row-inner">
                <Typography variant="h6">Tags</Typography>
              </div>
              <div className="grid-toolbar-field-row-inner">
                <IconButton color="warning" onClick={() => handleEditTagOpen()}>
                  <Edit />
                </IconButton>
              </div>
              <FormControl style={{ flexGrow: 1 }}>
                <InputLabel>Filter Tags</InputLabel>
                <Select
                  name="tags"
                  variant="outlined"
                  multiple
                  value={filteredTags}
                  onChange={handleFilteredTagsChange}
                  input={
                    <OutlinedInput
                      sx={{ background: "white" }}
                      label="Filter Tags"
                    />
                  }
                  renderValue={(selected: number[]) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value: number) => (
                        <IndexedChip key={value} index={value} list={tags} />
                      ))}
                    </Box>
                  )}
                >
                  {tags.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </Toolbar>
        </AppBar>

        <div style={{ height: "80vh", width: "100%" }}>
          <DataGrid
            disableRowSelectionOnClick
            onRowClick={(event: GridRowParams) =>
              handleEditBookOpen(event.row.id)
            }
            sx={{ backgroundColor: "lightgrey" }}
            columns={columns}
            rows={filteredBooks}
          />
        </div>
      </div>
      {/* Edit Book */}
      <EditBookDialog
        book={currentEditBook}
        categories={categories}
        tags={tags}
        isDialogOpen={isEditBookDialogOpen}
        handleDialogClose={(book?: Book) => handleEditBookClose(book)}
        handleDeleteBook={(book: Book) => handleBookDelete(book)}
      />
      {/* Edit Categories */}
      <EditListItemDialog
        list={categories}
        unremovableItems={unremovableCats}
        isDialogOpen={isEditCatDialogOpen}
        dialogTitle="Edit Categories"
        dialogDescription="Add, update, and delete categories."
        handleDialogClose={(returnList?: ListItem[]) =>
          handleEditCatClose(returnList)
        }
      />
      {/* Edit Tags */}
      <EditListItemDialog
        list={tags}
        unremovableItems={unremovableTags}
        isDialogOpen={isEditTagDialogOpen}
        dialogTitle="Edit Tags"
        dialogDescription="Add, update, and delete tags."
        handleDialogClose={(returnList?: ListItem[]) =>
          handleEditTagClose(returnList)
        }
      />
      {/* Snackbar */}
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        message={snackbarMsg}
      />
    </div>
  );
}

export default App;
