import { Edit } from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Box,
  MenuItem,
  SelectChangeEvent,
  Rating,
} from "@mui/material";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import IndexedChip from "../IndexedChip/IndexedChip";
import { useDispatch, useSelector } from "react-redux";
import {
  categories,
  filteredBooks,
  filteredCategories,
  filteredTags,
  setFilterCats,
  setFilterTags,
  tags,
} from "../../store/book";

export interface BookTableProps {
  setIsEditCatDialogOpen: () => void;
  setIsEditTagDialogOpen: () => void;
  handleEditBookOpen: (id: number) => void;
}

function BookTable(props: BookTableProps) {
  const dispatch = useDispatch();

  const storeBooks = useSelector(filteredBooks);
  const storeCats = useSelector(categories);
  const storeTags = useSelector(tags);
  const storeFilCats = useSelector(filteredCategories);
  const storeFilTags = useSelector(filteredTags);

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

  const handleEditCatOpen = (): void => {
    props.setIsEditCatDialogOpen();
  };

  const handleEditTagOpen = (): void => {
    props.setIsEditTagDialogOpen();
  };

  return (
    <>
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
                      <IndexedChip key={value} index={value} list={storeCats} />
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
                      <IndexedChip key={value} index={value} list={storeTags} />
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
            props.handleEditBookOpen(event.row.id)
          }
          sx={{ backgroundColor: "lightgrey" }}
          columns={columns}
          rows={storeBooks}
        />
      </div>
    </>
  );
}

export default BookTable;
