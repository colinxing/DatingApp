import { Message } from './message';

export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

export class PaginatedResult<T> {
    result: T;
    pagination: Pagination;
}

export interface PaginatedResultMes {
    result: Message[];
    pagination: Pagination;
}
