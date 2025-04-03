import {PaginationResultsInterface} from "../modules/user/interfaces/pagination-result.interface";

export class PaginationService<T> {
    public results: Array<T>;
    public total: number;

    constructor(paginationResults: PaginationResultsInterface<T>) {
        this.results = paginationResults.results;
        this.total = paginationResults.total;
    }
}