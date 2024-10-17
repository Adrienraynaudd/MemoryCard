export interface Folder {
    _id: number;
    title: string;
    tags: [string];
    isFavorite: boolean;
    userId: number;
}