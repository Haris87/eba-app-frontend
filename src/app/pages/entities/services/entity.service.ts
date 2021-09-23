import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EntityPage } from '../models/entity-page.model';
import { Entity } from '../models/entity.model';

@Injectable({
  providedIn: 'root',
})
export class EntityService {
  API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getEntities(
    searchTerm: string | null,
    page: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null
  ): Observable<EntityPage> {
    let params = new HttpParams();
    params = params.append('page', `${page - 1}`);
    params = params.append('pageSize', `${pageSize}`);
    if (searchTerm) params = params.append('term', `${searchTerm}`);
    if (sortField) params = params.append('sortField', `${sortField}`);
    if (sortOrder) params = params.append('sortOrder', `${sortOrder}`);
    return this.http.get<EntityPage>(`${this.API_URL}/entities`, {
      params,
    });
  }

  getEntity(id: string): Observable<Entity> {
    return this.http.get<Entity>(`${this.API_URL}/entities/${id}`);
  }

  addEntity(entity: Entity): Observable<Entity> {
    return this.http.post<Entity>(`${this.API_URL}/entities`, entity);
  }

  editEntity(entity: Entity): Observable<Entity> {
    return this.http.put<Entity>(
      `${this.API_URL}/entities/${entity._id}`,
      entity
    );
  }

  autocomplete(term: string): Observable<string[]> {
    let params = new HttpParams();
    params = params.append('term', term);
    return this.http.get<string[]>(`${this.API_URL}/entities/autocomplete`, {
      params,
    });
  }

  addComment(entityId: string, comment: any): Observable<Entity> {
    return this.http.post<Entity>(
      `${this.API_URL}/entities/${entityId}/comments`,
      { comment }
    );
  }
}
