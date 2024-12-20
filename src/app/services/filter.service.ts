import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Filter } from '../models/filter.model';
import { carServiceApiUrl } from '../app.config';

@Injectable({
    providedIn: 'root',
})
export class FilterService {
    private apiUrl = `${carServiceApiUrl}/filters`; // Replace with your API URL

    constructor(private http: HttpClient) { }

    getFilters(): Observable<Filter[]> {
        return this.http.get<Filter[]>(this.apiUrl);
    }

    getFilterById(id: string): Observable<Filter> {
        return this.http.get<Filter>(`${this.apiUrl}/${id}`);
    }

    deleteFilter(id: string | null): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
