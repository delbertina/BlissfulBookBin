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
import { Add, Edit, Explore } from "@mui/icons-material";
import { useState } from "react";
import EditBookDialog from "./components/EditBookDialog/EditBookDialog";
import { NewBook } from "./data/books";
import { Book, ExploreBook, ImportExploreBook } from "./types/book";
import IndexedChip from "./components/IndexedChip/IndexedChip";
import { ListItem } from "./types/shared";
import EditListItemDialog from "./components/EditListItemDialog/EditListItemDialog";
import ExploreBooksDialog from "./components/ExploreBooksDialog/ExploreBooksDialog";
import { useDispatch, useSelector } from "react-redux";
import {
  addBook,
  categories,
  deleteBook,
  filteredBooks,
  filteredCategories,
  filteredTags,
  nextBookInd,
  setCats,
  setFilterCats,
  setFilterTags,
  setTags,
  tags,
  unremovableCats,
  unremovableTags,
  updateBook,
} from "./store/book";

function App() {
  const dispatch = useDispatch();
  
  const storeBooks = useSelector(filteredBooks);
  const storeCats = useSelector(categories);
  const storeTags = useSelector(tags);
  const storeNextBookInd = useSelector(nextBookInd);
  const storeFilCats = useSelector(filteredCategories);
  const storeFilTags = useSelector(filteredTags);
  const storeUnremCats = useSelector(unremovableCats);
  const storeUnremTags = useSelector(unremovableTags);
  const [currentEditBook, setCurrentEditBook] = useState<Book>(NewBook);
  const [isEditBookDialogOpen, setIsEditBookDialogOpen] =
    useState<boolean>(false);
  const [isEditCatDialogOpen, setIsEditCatDialogOpen] =
    useState<boolean>(false);
  const [isEditTagDialogOpen, setIsEditTagDialogOpen] =
    useState<boolean>(false);
  const [isExploreBooksDialogOpen, setIsExploreBooksDialogOpen] =
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
              <IndexedChip key={value} index={value} list={storeCats} />
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
              <IndexedChip key={value} index={value} list={storeTags} />
            ))}
          </>
        );
      },
      flex: 1,
    },
  ];

  const handleFilteredCategoriesChange = (
    event: SelectChangeEvent<Array<number>>
  ) => {
    const {
      target: { value },
    } = event;
    const selectedCategories =
      typeof value === "string"
        ? value.split(",").map((item) => parseInt(item))
        : value;
    dispatch(setFilterCats(selectedCategories));
  };

  const handleFilteredTagsChange = (
    event: SelectChangeEvent<Array<number>>
  ) => {
    const {
      target: { value },
    } = event;
    const selectedTags =
      typeof value === "string"
        ? value.split(",").map((item) => parseInt(item))
        : value;
    dispatch(setFilterTags(selectedTags));
  };

  const handleEditBookOpen = (id?: number): void => {
    // If the id is falsey (including 0) handle as a new book
    if (!id) {
      setCurrentEditBook(NewBook);
    } else {
      const foundBook: Book | undefined = storeBooks.find(
        (book) => book.id === id
      );
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
        newBook.id = storeNextBookInd;
        // to keep the books in order by id should add it to the back
        // then the book maybe wouldn't show up on page 1 after adding
        // that wouldn't be user intuative
        dispatch(addBook(newBook));
        handleSnackbarOpen("New book successfully added!");
      } else {
        // Could find the book edited instead of filtering it out
        // If the book never existed, it'll still add it which is what we want
        dispatch(updateBook(book));
        handleSnackbarOpen("Book successfully updated!");
      }
    }
    setIsEditBookDialogOpen(false);
    // If there's always a book here, don't have to check if undefined
    setCurrentEditBook(NewBook);
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

  const handleEditCatOpen = (): void => {
    setIsEditCatDialogOpen(true);
  };

  const handleEditCatClose = (returnList?: ListItem[]): void => {
    if (!!returnList) {
      dispatch(setCats(returnList));
      handleSnackbarOpen("Category list successfully updated!");
    }
    setIsEditCatDialogOpen(false);
  };

  const handleEditTagOpen = (): void => {
    setIsEditTagDialogOpen(true);
  };

  const handleEditTagClose = (returnList?: ListItem[]): void => {
    if (!!returnList) {
      dispatch(setTags(returnList));
      handleSnackbarOpen("Tag list successfully updated!");
    }
    setIsEditTagDialogOpen(false);
  };

  const handleExploreBookOpen = (): void => {
    setIsExploreBooksDialogOpen(true);
  };

  const handleExploreBookClose = (): void => {
    setIsExploreBooksDialogOpen(false);
  };

  const handleExploreBookAdd = (newBook: ExploreBook): void => {
    dispatch(addBook(ImportExploreBook(newBook)));
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
                  value={storeFilCats}
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
                          list={storeCats}
                        />
                      ))}
                    </Box>
                  )}
                >
                  {storeCats.map((category) => (
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
                  value={storeFilTags}
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
                        <IndexedChip
                          key={value}
                          index={value}
                          list={storeTags}
                        />
                      ))}
                    </Box>
                  )}
                >
                  {storeTags.map((category) => (
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
            rows={storeBooks}
          />
        </div>
      </div>
      {/* Edit Book */}
      <EditBookDialog
        book={currentEditBook}
        categories={storeCats}
        tags={storeTags}
        isDialogOpen={isEditBookDialogOpen}
        handleDialogClose={(book?: Book) => handleEditBookClose(book)}
        handleDeleteBook={(book: Book) => handleBookDelete(book)}
      />
      {/* Edit Categories */}
      <EditListItemDialog
        list={storeCats}
        unremovableItems={storeUnremCats}
        isDialogOpen={isEditCatDialogOpen}
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
        isDialogOpen={isEditTagDialogOpen}
        dialogTitle="Edit Tags"
        dialogDescription="Add, update, and delete tags."
        handleDialogClose={(returnList?: ListItem[]) =>
          handleEditTagClose(returnList)
        }
      />
      {/* Explore Books */}
      <ExploreBooksDialog
        handleAddBook={(book: ExploreBook) => handleExploreBookAdd(book)}
        isDialogOpen={isExploreBooksDialogOpen}
        handleDialogClose={() => handleExploreBookClose()}
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
