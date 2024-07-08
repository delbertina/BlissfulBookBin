export interface ListItem {
    id: number,
    name: string
}

export const enum DIALOG_ITEM {
    BOOK_EDIT = "book_edit",
    TAG_EDIT = "tag_edit",
    CATEGORY_EDIT = "category_edit",
    BOOK_EXPLORE = "book_explore"
  }