export interface Folder {
    _id: string;
    title: string;
    tags: [string];
    isFavorite: boolean;
    userId: number;
}