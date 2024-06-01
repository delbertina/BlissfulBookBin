import "./EditListItemDialog.scss";
import { useEffect, useState } from "react";
import { ListItem } from "../../types/shared";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import EditTextDialog from "../EditTextDialog/EditTextDialog";

export interface EditListItemDialogProps {
  list: ListItem[];
  // Maybe also add uneditableItems to make this more reusable
  unremovableItems: ListItem[];
  dialogTitle: string;
  dialogDescription?: string;
  isDialogOpen: boolean;
  handleDialogClose: (returnList?: ListItem[]) => void;
}

interface RemovableListItem extends ListItem {
  id: number;
  name: string;
  isRemovable: boolean;
}

const newListItem = { id: 0, name: "New List Item" };

function EditListItemDialog(props: EditListItemDialogProps) {
  const [list, setList] = useState<Array<RemovableListItem>>();
  const [isEditTextDialogOpen, setIsEditTextDialogOpen] =
    useState<boolean>(false);
  const [editItem, setEditItem] = useState<ListItem>(newListItem);

  const handleOpenEditTextDialog = (item: ListItem): void => {
    setEditItem(item);
    setIsEditTextDialogOpen(true);
  };

  const handleEditText = (editedText?: string): void => {
    setIsEditTextDialogOpen(false);
    const tempList = list ?? [];
    if (!!editedText) {
      if (editItem.id === 0) {
        handleAddListItem(editedText);
      } else {
        const foundInd = list?.findIndex((item) => item.id === editItem.id);
        const sameNames = list?.filter(
          (item) => item.name.toLowerCase() === editedText.toLowerCase()
        );
        // if there are results with the same name
        // and they're not the one the user is editing
        if (
          !!sameNames &&
          ((sameNames.length === 1 && sameNames[0].id !== editItem.id) ||
            sameNames.length > 1)
        ) {
          // display error and return
          return;
        }
        if (!!foundInd) {
          tempList[foundInd].name = editedText;
          setList([...tempList]);
        }
      }
    }
    setEditItem(newListItem);
  };

  const handleAddListItem = (text: string): void => {
    const sameNames = list?.filter(
      (item) => item.name.toLowerCase() === text.toLowerCase()
    );
    // if there are results with the same name
    if (!!sameNames && sameNames.length > 0) {
      // display error and return
      return;
    }

    const tempList = list ?? [];
    const maxIndex = Math.max(...tempList.map((item) => item.id), 0);
    tempList?.push({
      id: maxIndex + 1,
      name: text,
      isRemovable: true,
    });
    setList([...tempList]);
  };

  const handleDeleteListItem = (listItem: RemovableListItem): void => {
    if (!list) {
      return;
    }
    if (!listItem.isRemovable) {
      // display error
      return;
    }
    let tempList = list;
    tempList = tempList.filter((item) => item.id !== listItem.id);
    setList([...tempList]);
  };

  useEffect(() => {
    const tempList: RemovableListItem[] = props.list.map((item) => ({
      ...item,
      isRemovable:
        props.unremovableItems.findIndex(
          (innerItem) => innerItem.id === item.id
        ) === -1,
    }));
    setList(tempList);
  }, [props.list, props.unremovableItems]);

  return (
    <>
      <Dialog
        open={props.isDialogOpen}
        onClose={() => props.handleDialogClose()}
        fullWidth={true}
        maxWidth={"md"}
        scroll="paper"
        aria-labelledby="list-item-edit-dialog-title"
        aria-describedby="list-item-edit-dialog-description"
      >
        {/* header toolbar */}
        <DialogTitle id="list-item-edit-dialog-header">
          <div id="list-item-edit-dialog-title-column">
            <Typography
              gutterBottom
              id="list-item-edit-dialog-title"
              variant="h5"
              component="div"
            >
              {props.dialogTitle}
            </Typography>
            <Typography
              gutterBottom
              id="list-item-edit-dialog-description"
              variant="body1"
              component="div"
            >
              {props.dialogDescription}
            </Typography>
          </div>
          <div>
            <IconButton
              aria-label="add item"
              color="success"
              onClick={() => handleOpenEditTextDialog(newListItem)}
            >
              <Add />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers={true} id="list-item-edit-dialog-content">
          <Divider />
          {/* list of items */}
          <div className="list-item-dialog-content-list">
            {!!list &&
              list.map((item, index) => (
                <div key={index}>
                  <div
                    className="list-item-edit-dialog-content-item-row row"
                    //   key={index}
                  >
                    <Typography
                      className="list-item-edit-dialog-content-list-item-row-text"
                      variant="body1"
                      component="div"
                    >
                      {item.name}
                    </Typography>
                    <div className="list-item-edit-dialog-content-list-item-row-end-actions">
                      <IconButton
                        aria-label="edit text"
                        color="warning"
                        onClick={() => handleOpenEditTextDialog(item)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        aria-label="delete item"
                        color="error"
                        onClick={() => handleDeleteListItem(item)}
                      >
                        <Delete />
                      </IconButton>
                    </div>
                  </div>
                  <Divider />
                </div>
              ))}
          </div>
          {/* footer close & submit */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.handleDialogClose()}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() =>
              props.handleDialogClose(
                list?.map((item) => ({ id: item.id, name: item.name }))
              )
            }
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <EditTextDialog
        isDialogOpen={isEditTextDialogOpen}
        dialogTitle={editItem.id === 0 ? "Add New List Item" : "Edit List Item"}
        dialogDescription={
          editItem.id === 0
            ? "Set the display value of the new list item."
            : "Update the display value of a list item."
        }
        dialogFieldLabel="List Item Text"
        dialogFieldValue={editItem.name ?? ""}
        handleDialogClose={(edited?: string) => handleEditText(edited)}
      />
    </>
  );
}

export default EditListItemDialog;
