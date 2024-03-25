import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor(private http: HttpClient, private router: Router) { }

  _options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  reg(user: any) {
    return this.http.post('https://replicagiftsbackend.onrender.com/api/users/signup', user, this._options)
  }
  login(user: any) {
    return this.http.post('https://replicagiftsbackend.onrender.com/api/users/login', user, this._options)
  }
  getUser() {
    const token: string | null = localStorage.getItem('user');
    let _options = { headers: new HttpHeaders({ 'Authorization': `Bearer ${token ? JSON.parse(token).token : ""}` }) };
    return this.http.get('https://replicagiftsbackend.onrender.com/api/users/me', _options);
  }

  isAuthenticatedValue = new BehaviorSubject<boolean>(false);
  private auth: boolean = false;

  isAuthenticated() {
    const token = localStorage.getItem('user');
    this.isAuthenticatedValue.next(!!token);
    this.auth = !!token;
    return this.auth;
  }

  logOut() {
    localStorage.removeItem('user');
    this.isAuthenticatedValue.next(false);
    this.router.navigate(['/']);
  }


  contact(data: any) {
    return this.http.post('https://replicagiftsbackend.onrender.com/api/admin/contact', data, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

}
