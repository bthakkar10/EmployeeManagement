import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export abstract class BaseService<T> {
  protected constructor(
    protected http: HttpClient,
    protected baseUrl: string
  ) { }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(`${this.baseUrl}`).pipe(
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<T> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<T>(url).pipe(
      catchError(this.handleError)
    );
  }

  update(id: number, data: T): Observable<T> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<T>(url, data).pipe(
      catchError(this.handleError)
    );
  }

  add(data: T): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}`, data).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError('Something went wrong. Please try again later.');
  }
}
