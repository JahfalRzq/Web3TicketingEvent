import { Request } from "express";

export interface QueryOptions {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: "ASC" | "DESC";
  search: string;
}

export const buildQueryOptions = (req: Request): QueryOptions => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const sortBy = (req.query.sortBy as string) || "createdAt";
  const sortOrder =
    (req.query.sortOrder as string)?.toUpperCase() === "ASC" ? "ASC" : "DESC";

  const search = (req.query.search as string) || "";

  return { page, limit, skip, sortBy, sortOrder, search };
};
