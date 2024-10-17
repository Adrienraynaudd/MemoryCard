export interface Folder {
    _id: number;
    title: string;
    tags: [string];
    userId: { userId: string };
}