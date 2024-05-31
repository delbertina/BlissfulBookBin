import { Dialog, DialogTitle, Typography, DialogContent, DialogActions, Button, TextField } from "@mui/material";

export interface EditBookDialogProps {
    isNew: boolean;
    isDialogOpen: boolean;
    handleDialogClose: () => void;
  }

function EditBookDialog(props: EditBookDialogProps) {

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
            //   const formData = new FormData(event.currentTarget);
            //   const formJson = Object.fromEntries((formData as any).entries());
            //   props.handleDialogClose(formJson);
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
        </DialogTitle>
        <DialogContent dividers={true} id="book-edit-dialog-content">
        <TextField
        fullWidth
          style={{ margin: "5px" }}
          type="text"
          label="Title"
          variant="outlined"
        />
        <br />
        <TextField
        fullWidth
          style={{ margin: "5px" }}
          type="text"
          label="Author"
          variant="outlined"
        />
        <br />
        <TextField
        fullWidth
          style={{ margin: "5px" }}
          type="text"
          label="Genre"
          variant="outlined"
        />
        <br />
        <TextField
        fullWidth
          style={{ margin: "5px" }}
          type="text"
          label="Rating"
          variant="outlined"
        />
        <br />
        <TextField
        fullWidth
          style={{ margin: "5px" }}
          type="text"
          label="Categories"
          variant="outlined"
        />
        <br />
        <TextField
        fullWidth
          style={{ margin: "5px" }}
          type="text"
          label="Tags"
          variant="outlined"
        />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.handleDialogClose()}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => console.log()}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    )

}

export default EditBookDialog;