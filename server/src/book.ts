import * as mongodb from "mongodb";
import { Review } from "./review";

export interface Book {
    _id?: mongodb.ObjectId;
    title: string;
    author: string;
    rating: number;
    pages: number;
    genres: string[];
    reviews: Review[];
}