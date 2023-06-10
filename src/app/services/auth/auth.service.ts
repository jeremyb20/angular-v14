import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  })

  theme: any;
  token: any;
  url: any;
  idUser: any;

  constructor(private route: Router, private _http: HttpClient, private _jwtHelperService: JwtHelperService) {}
  public getToken(): any {
    return localStorage.getItem('token');
  }

  public isUserLogged(): any {
    return (sessionStorage.getItem('token')) ? true: false;
  }

  authenticateUser(data: any) {
    return this._http.post(`${environment.ws}/users/login`, data);
  }

  getAllUsers() {
    return this._http.get<any>(`${environment.ws}/users/getEmployees`);
  }

  getProfile() {
    return this._http.get<any>(`${environment.ws}/UserProfile`);
  }


  getProducInfo(IdInventario:any):Observable<any>{
    return this._http.get<any>(`${environment.ws}/inventory/getInventoryById?id=${IdInventario}`);
  }

  // INVENTORY START
  getAllInventory() {
    return this._http.get<any>(`${environment.ws}/inventory/getAllInventory`);
  }

  postCreateOrEditInventory(isNew:boolean, data:any, photo:any):Observable<any>  {
    this.url = (isNew) ? '/inventory/createInventory': '/inventory/editInventory';

    const fd = new FormData();
    fd.append('nombreProducto', data.nombreProducto);
    fd.append('id', data.id);
    fd.append('marca', data.marca);
    fd.append('tamanno', data.tamanno);
    fd.append('peso', data.peso);
    fd.append('precio', data.precio);
    fd.append('cantidadInventario', data.cantidadInventario);
    fd.append('descripcion', data.descripcion);
    fd.append('image', photo);
    fd.append('folder', 'inventory');

    return this._http.post(`${environment.ws}`+this.url, fd);
  }

  deleteInventory(IdInventario:any):Observable<any>  {
    return this._http.delete(`${environment.ws}/inventory/deleteInventory?id=${IdInventario}`);
  }


  // INVENTORY END





//USERS START

  getUserAll() {
    return this._http.get<any>(`${environment.ws}/users/getUsers`);
  }

  getAllEmployees() {
    return this._http.get<any>(`${environment.ws}/users/getEmployees`);
  }

  getBrandsByCompany(IdCompania:any){
    return this._http.get<any>(`${environment.ws}/Marcas/Get_Marcas_Por_Compania?IdCompania=${IdCompania}`);
  }

  getBrandsByCompanyAssigned(data:any){
    return this._http.get<any>(`${environment.ws}/Marcas/Get_Marcas_Compania?IdCompania=${data.IdCompania}&IdEstructuraOrg=${data.IdEstructuraOrg}`);
  }

  postAssingBrandsByCompany(data:any):Observable<any>  {
    return this._http.post(`${environment.ws}/Marcas/Add_Marcas_Compania`, data,{headers:this.headers});
  }

  postCreateOrEditUser(isNew:boolean, data:any):Observable<any>  {
    this.url = (isNew) ? '/users/registerUser': '/users/editUser';
    return this._http.post(`${environment.ws}`+this.url, data, {headers:this.headers});
  }

  deleteUser(data:any):Observable<any>  {
    return this._http.post(`${environment.ws}/users/deleteUser`, data,{headers:this.headers});
  }

  deleteInventoryByCompany(data:any):Observable<any>  {
    return this._http.post(`${environment.ws}/Marcas/Remove_Marcas_Compania`, data,{headers:this.headers});
  }

  setTranslateUser(lang:any):Observable<any>  {
    const data = {
      lang: lang,
      userId: this.getUserIdLocal()
    }
    return this._http.post(`${environment.ws}/users/setTranslateUser`, data,{headers:this.headers});
  }

  setThemeUser(theme:any):Observable<any>  {
    const data = {
      theme: theme,
      userId: this.getUserIdLocal()
    }
    return this._http.post(`${environment.ws}/users/setThemeUser`, data,{headers:this.headers});
  }

// USERS end


  postModifyPassword(data:any):Observable<any>  {
    return this._http.post(`${environment.ws}/Users/ModifyPassword`, data,{headers:this.headers});
  }

  getRolesById( idUser:any ):Observable<any>  {
    return this._http.get<any>(`${environment.ws}/Users/GetUsersById/${idUser}`);
  }

  getUserRole() {
    return localStorage.getItem('userRol');
  }

  getCompanyDefault() {
    return localStorage.getItem('empresaDefault');
  }

  setTabSelected(tab:any){
    localStorage.setItem('tab', tab);
  }

  getTabSelected() {
    return localStorage.getItem('tab');
  }

  getUserNameLocal(){
    return localStorage.getItem('username');
  }

  loadToken() {
    this.token = localStorage.getItem('token');
  }

	loggedIn() {
    this.token = localStorage.getItem('token');
    return this.token != null && !this._jwtHelperService.isTokenExpired(this.token);
  }

//Local methods

  authenticateUserLocal(data: any, token:any) {
    localStorage.setItem('userRol',data.userRol);
    localStorage.setItem('lang', data.lang);
    localStorage.setItem('theme', data.theme);
    localStorage.setItem('idUser', data.id);
    localStorage.setItem('username', data.username);
    localStorage.setItem('isDetected', 'false');
    localStorage.setItem('permissionByMenu', 'true');
    sessionStorage.setItem('token', token);
  }

  setRouterLink(router:any) {
    localStorage.setItem('route', router);
  }

  getRouterLink() {
    return localStorage.getItem('route');
  }

  setPermissionByMenu(permission: any) {
    localStorage.setItem('permissionByMenu', permission);
  }
  getPermissionByMenu() {
    return localStorage.getItem('permissionByMenu');
  }

  changedetected(isDetected: any) {
    localStorage.setItem('isDetected', isDetected);
  }

  getDetectionChanges() {
    return localStorage.getItem('isDetected');
  }

  setUserIdLocal(id:any) {
    localStorage.setItem('idUser',id);
  }

  getUserIdLocal() {
    return localStorage.getItem('idUser');
  }

  logout() {
    const bodyElement = document.body;
    this.theme = localStorage.getItem('theme');
    if (bodyElement) {
      bodyElement.classList.remove(this.theme);
    }
    localStorage.clear();
    sessionStorage.clear();
    this.route.navigate(['/login']);
  }
}
