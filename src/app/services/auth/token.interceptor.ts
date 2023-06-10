import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable({
    providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {
  clonedReq: any;
  constructor(public _authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>  {
    if(sessionStorage.getItem('token')!= null ){
      this.clonedReq = request.clone({
        headers: request.headers.set('Authorization', 'Bearer '+ sessionStorage.getItem('token'))
      });

      return next.handle(this.clonedReq).pipe(
        tap(
          {
            next: (result: any) => {
              //console.log(result); //magic should work
            },
            error: (error) => {
              if(error.status == 401){
                this._authService.logout();
              }
            }
          }
        )
      )
    }else{
      this._authService.logout();
      return next.handle(request.clone())
    }

  }
}
