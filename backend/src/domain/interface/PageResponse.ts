export class PageResponse {
  constructor(
    public currentPage: number,
    public allPageCount: number,
    public allDataCount: number,
    public perPage: number,
  ) {}
}
