import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Empresa } from './modelos/empresa';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  urlApi = 'https://apitest-bt.herokuapp.com/api/v1/empresas';
  constructor(private http: HttpClient) { }

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      "user": "User123",
      "password": "Password123"
    }),
  };
  
  CrearEmpresa(data: any): Observable<Empresa> {
    return this.http
      .post<Empresa>(
        this.urlApi,
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }
  
  ObtenerEmpresa(id:any): Observable<Empresa> {
    return this.http
      .get<Empresa>(
        this.urlApi + '/' + id,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }
  
  ObtenerEmpresas(): Observable<Empresa> {
    return this.http
      .get<Empresa>(
        this.urlApi,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }
  
  ActualizaEmpresa(id:any, data:any): Observable<Empresa> {
    return this.http
      .put<Empresa>(
        this.urlApi + '/' + id,
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }
  
  EliminaEmpresa(id:any) {
    return this.http
      .delete<Empresa>(this.urlApi + '/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl));
  }
  // Error handling
  errorHandl(error:any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
