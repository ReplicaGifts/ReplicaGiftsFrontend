import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  addAddress(address: any, pic: any) {

    const formData = new FormData();

    formData.append('pic', pic);
    formData.append('name', address.name);
    formData.append('email', address.email);
    formData.append('phone', address.phone);
    formData.append('address', address.address);
    formData.append('city', address.city);
    formData.append('country', address.country);
    formData.append('postcode', address.postcode);
    formData.append('state', address.state);
    formData.append('country', address.country);


    const token: string | null = localStorage.getItem('user');
    let _options = { headers: new HttpHeaders({ 'Authorization': `Bearer ${token ? JSON.parse(token).token : ""}` }) };

    return this.http.post("http://localhost:3000/api/profile/add-address", formData, _options);
  }
  getAddress() {

    const token: string | null = localStorage.getItem('user');
    let _options = { headers: new HttpHeaders({ 'Authorization': `Bearer ${token ? JSON.parse(token).token : ""}`, 'Content-Type': 'application/json' }) };

    return this.http.get("https://replicagiftsbackend.onrender.com/api/profile/get-address", _options);
  }

  getOrder() {
    const token: string | null = localStorage.getItem('user');
    let _options = { headers: new HttpHeaders({ 'Authorization': `Bearer ${token ? JSON.parse(token).token : ""}`, 'Content-Type': 'application/json' }) };

    return this.http.get("https://replicagiftsbackend.onrender.com/api/frame/user-orders", _options);
  }

}
