export interface Card {
    _id: number;
    question: string;
    response: string;
    userId: { userId: string };
    folderId: { folderId: string };
}