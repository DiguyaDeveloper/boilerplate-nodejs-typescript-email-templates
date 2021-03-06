import Pagination from './Pagination';

export interface PageableParams<T> {
  /**
   * Resultado da consulta no typeOrm (resultado da consulta junto com o count).
   */
  select: [T[], number];

  /**
   * Query Params com os parametros de paginação.
   */
  pageable: Pagination;
}

export class Page<T> {
  public content: T[];
  public page: number;
  public size: number;
  public totalPages: number;
  public totalElements: number;

  constructor({ select, pageable }: PageableParams<T>) {
    const [content, count] = select;
    this.content = content;
    this.page = pageable.page;
    this.size = pageable.size;
    this.totalPages = Math.ceil(count / pageable.size);
    this.totalElements = count;
  }
}
