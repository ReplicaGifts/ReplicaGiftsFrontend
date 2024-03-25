import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {

  constructor(private http: HttpClient, private router: Router) { }

  _options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  reg(user: any) {
    return this.http.post('http://localhost:3000/api/admin/signup', user, this._options)
  }
  login(user: any) {
    return this.http.post('http://localhost:3000/api/admin/login', user, this._options)
  }
  getUser() {
    const token: string | null = localStorage.getItem('token');
    let _options = { headers: new HttpHeaders({ 'Authorization': `Bearer ${token ? JSON.parse(token).token : ""}` }) };
    return this.http.get('http://localhost:3000/api/users/me', _options);
  }

  private isAuthenticatedValue: boolean = false;


  isAuthenticated(): boolean {
    const token = sessionStorage.getItem('admin');
    this.isAuthenticatedValue = !!token;
    return this.isAuthenticatedValue;
  }

  logOut() {
    sessionStorage.removeItem('admin');
    this.isAuthenticatedValue = false;
    this.router.navigate(['/']);
  }


}
