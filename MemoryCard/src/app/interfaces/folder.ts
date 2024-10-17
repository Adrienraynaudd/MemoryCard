export interface Folder {
    _id: number;
    name: string;
    tags: [string];
    isFavorite: boolean;
    userId: number;
}