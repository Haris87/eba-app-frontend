import { Component, OnInit, ViewChild } from '@angular/core';
import { NzTableQueryParams, NzTableSize } from 'ng-zorro-antd/table';
import { MonoTypeOperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Entity } from '../models/entity.model';
import { EntityService } from '../services/entity.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  private _unsbubscribeAll$ = new Subject<null>();

  options: string[] = [];
  @ViewChild('searchInput') searchInput: any;

  initialEntities: Entity[] = [];
  entities: Entity[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  total = 200;
  searchTerm: string | null = null;

  filterGender = [
    { text: 'male', value: 'male' },
    { text: 'female', value: 'female' },
  ];

  constructor(private _entityService: EntityService) {}

  ngOnInit(): void {
    this.loadEntities(this.pageIndex, this.pageSize, null, null);
  }

  ngOnDestroy() {
    this._unsbubscribeAll$.next();
    this._unsbubscribeAll$.complete();
  }

  loadEntities(
    page: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null
  ): void {
    this.loading = true;

    this._entityService
      .getEntities(this.searchTerm, page, pageSize, sortField, sortOrder)
      .pipe(takeUntil(this._unsbubscribeAll$))
      .subscribe((page) => {
        this.loading = false;
        this.total = page.count;
        this.entities = page.entities;
      });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    this.loadEntities(pageIndex, pageSize, sortField, sortOrder);
  }

  search() {
    this.loadEntities(this.pageIndex, this.pageSize, null, null);
  }

  /**
   * Search
   */

  ngAfterViewInit() {
    this.searchInput.valueChanges
      .pipe(debounceTime(200))
      .pipe(distinctUntilChanged())
      .subscribe((value: string) => {
        this.searchTerm = value;

        this.fetchAutocompleteResults(this.searchTerm);
      });
  }

  fetchAutocompleteResults(term: string): void {
    if (!term) return;
    if (term.length < 3) return;
    this._entityService
      .autocomplete(term)
      .pipe(takeUntil(this._unsbubscribeAll$))
      .subscribe((results) => {
        this.options = results;
      });
  }
}
