import { Book } from "../types/book";
import { DIALOG_ITEM, ListItem } from "../types/shared";

interface InitialState {
  books: Array<Book>;
  categories: Array<ListItem>;
  tags: Array<ListItem>;
  filterTags: Array<number>;
  filterCats: Array<number>;
  snackbarMsg: string;
  currentDialog: DIALOG_ITEM | null;
  currentEditInd: number;
}
const UpdateBookAction: string = "Book";

export default InitialState;
export { UpdateBookAction };

export const enum LOCAL_DATA {
  BOOK = "book_data",
  CATEGORY = "cat_data",
  TAG = "tag_data",
}
