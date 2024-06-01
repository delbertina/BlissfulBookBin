export interface Book {
    id: number,
    title: string,
    author: string,
    genre: string,
    rating: number,
    categories: number[],
    tags: number[]
}