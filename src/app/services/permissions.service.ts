import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  })

  url: any;

  constructor(private _http: HttpClient) { }

  getAllNavigation(): Observable<any> {
    return this._http.get<any>(`${environment.ws}/navigation/GetAllNavigationRoutes`);
  }

  postCreateOrEditNavigation(isNew: boolean, data: any, isSubRoute: boolean): Observable<any> {
    if (!isSubRoute) {
      this.url = (isNew) ? '/navigation/registerNavigation' : '/navigation/editNavigation';
    } else { 
      this.url = '/navigation/registerNavigation';
    }
    return this._http.post(`${environment.ws}` + this.url, data, { headers: this.headers });
  }

  deleteNavigation(data: any): Observable<any> {
    return this._http.post(`${environment.ws}/navigation/deleteNavigation`, data, { headers: this.headers });
  }
}
