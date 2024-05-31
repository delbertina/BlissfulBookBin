import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Tooltip,
  Rating,
} from "@mui/material";
import "./App.scss";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import EditBookDialog from "./components/EditBookModal/EditBookDialog";

const columns: GridColDef[] = [{
  field: 'title',
  headerName: 'Title',
  flex: 2
}, {
  field: 'author',
  headerName: 'Author',
  flex: 1
}, {
  field: 'genre',
  headerName: 'Genre',
  flex: 1
}, {
  field: 'rating',
  headerName: 'Rating',
  renderCell: (params) => {
    return <Rating name="hover-feedback" value={params.value} readOnly />;
  },
  width: 160,
  align: 'left',
  headerAlign: 'left',
  type: 'number',
}, {
  field: 'catagories',
  headerName: 'Catagories',
  flex: 1
}, {
  field: 'tags',
  headerName: 'Tags',
  flex: 1
}];

const rows = [
  {id: 0, title: "Test Title", author: "Test Author", genre: "Genre Test", rating: 1, catagories: "Test1, test2, test3", tags: "tag1, tag2, tag3"},
  {id: 1, title: "Test Title", author: "Test Author", genre: "Genre Test", rating: 1, catagories: "Test1, test2, test3", tags: "tag1, tag2, tag3"},
  {id: 2, title: "Test Title", author: "Test Author", genre: "Genre Test", rating: 1, catagories: "Test1, test2, test3", tags: "tag1, tag2, tag3"},
  {id: 3, title: "Test Title", author: "Test Author", genre: "Genre Test", rating: 1, catagories: "Test1, test2, test3", tags: "tag1, tag2, tag3"},
  {id: 4, title: "Test Title", author: "Test Author", genre: "Genre Test", rating: 1, catagories: "Test1, test2, test3", tags: "tag1, tag2, tag3"},
  {id: 5, title: "Test Title", author: "Test Author", genre: "Genre Test", rating: 1, catagories: "Test1, test2, test3", tags: "tag1, tag2, tag3"},
  {id: 6, title: "Test Title", author: "Test Author", genre: "Genre Test", rating: 1, catagories: "Test1, test2, test3", tags: "tag1, tag2, tag3"},
  {id: 7, title: "Test Title", author: "Test Author", genre: "Genre Test", rating: 1, catagories: "Test1, test2, test3", tags: "tag1, tag2, tag3"},
  {id: 8, title: "Test Title", author: "Test Author", genre: "Genre Test", rating: 1, catagories: "Test1, test2, test3", tags: "tag1, tag2, tag3"},
  {id: 9, title: "Test Title", author: "Test Author", genre: "Genre Test", rating: 1, catagories: "Test1, test2, test3", tags: "tag1, tag2, tag3"},
  {id: 10, title: "Test Title", author: "Test Author", genre: "Genre Test", rating: 1, catagories: "Test1, test2, test3", tags: "tag1, tag2, tag3"},
]

function App() {
  const [isEditBookDialogOpen, setIsEditBookDialogOpen] =
    useState<boolean>(false);

  const handleEditBookOpen = (): void => {
    setIsEditBookDialogOpen(true);
  };

  const handleEditBookClose = (): void => {
    setIsEditBookDialogOpen(false);
  };


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
        <div style={{ height: "80vh", width: "100%" }}>
          <DataGrid
            sx={{ backgroundColor: "lightgrey" }}
            columns={columns}
            rows={rows}
          />
        </div>
      </div>
      <EditBookDialog
        isNew={false}
        isDialogOpen={isEditBookDialogOpen}
        handleDialogClose={() => handleEditBookClose()}
      />
    </div>
  );
}

export default App;
