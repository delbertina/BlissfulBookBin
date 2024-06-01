import "./EditTextDialog.scss";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

export interface EditTextDialogProps {
  isDialogOpen: boolean;
  dialogTitle: string;
  dialogDescription?: string;
  dialogFieldLabel: string;
  dialogFieldValue: string;
  handleDialogClose: (edited?: string) => void;
}

function EditTextDialog(props: EditTextDialogProps) {
  return (
    <Dialog
      open={props.isDialogOpen}
      fullWidth={true}
      maxWidth={"sm"}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          props.handleDialogClose(formJson.editedText);
        },
      }}
      aria-labelledby="edit-text-dialog-title"
      aria-describedby="edit-text-dialog-description"
    >
      <DialogTitle id="edit-text-dialog-header">
        {props.dialogTitle}
      </DialogTitle>
      <DialogContent>
        {!!props.dialogDescription && (
          <DialogContentText id="edit-text-dialog-description">
            {props.dialogDescription}
          </DialogContentText>
        )}
        <TextField
          autoFocus
          required
          margin="dense"
          id="editedText"
          name="editedText"
          label={props.dialogFieldLabel}
          type="text"
          fullWidth
          variant="standard"
          defaultValue={props.dialogFieldValue}
        />
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

export default EditTextDialog;