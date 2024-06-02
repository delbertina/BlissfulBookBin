export interface Book {
    id: number,
    title: string,
    author: string,
    genre: string,
    rating: number,
    categories: number[],
    tags: number[]
}

export interface ExploreBook {
    title: string,
    author: string,
    genre: string,
}

export const ImportExploreBook = (newBook: ExploreBook, newIndex?: number): Book => {
    return {
        id: newIndex ?? 0, // Set new book index to 0 to indicate it needs one
        title: newBook.title,
        author: newBook.author,
        genre: newBook.genre,
        rating: 0,
        categories: [],
        tags: []
    }
}