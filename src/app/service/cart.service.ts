import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../model/product.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private http: HttpClient) { }

  NoOFCartItem = new BehaviorSubject<number>(0);

  CheckItems() {
    this.getCart().subscribe((data: any) => {
      this.NoOFCartItem.next(data.length);
    });
  }

  addToCart(id: any, quantity: any, frameId: any) {

    console.log(quantity)




    const token: string | null = localStorage.getItem('user');
    let _options = { headers: new HttpHeaders({ 'Authorization': `Bearer ${token ? JSON.parse(token).token : ""}`, 'Content-Type': 'application/json' }) };


    return this.http.post("https://replicagiftsbackend.onrender.com/api/carts/add-cart/" + id, { quantity, frameId }, _options)

  }




  addFrame(frameDeatails: any, gifts: any, id: any) {


    const formData = new FormData();

    formData.append('quantity', frameDeatails.quantity);
    formData.append('printType', frameDeatails.printType);
    formData.append('userImage', frameDeatails.userImage);
    if (frameDeatails.frame)
      formData.append('userImageModel', frameDeatails.frame, 'userImageModel.png');
    formData.append('size', frameDeatails.size);
    formData.append('product', id);


    formData.append('gifts', JSON.stringify(gifts));

    const token: string | null = localStorage.getItem('user');
    let _options = { headers: new HttpHeaders({ 'Authorization': `Bearer ${token ? JSON.parse(token).token : ""}` }) };


    return this.http.post("http://localhost:3000/api/frame/add-frame", formData, _options)

  }

  getFrame(id: any) {
    const token: string | null = localStorage.getItem('user');
    let _options = { headers: new HttpHeaders({ 'Authorization': `Bearer ${token ? JSON.parse(token).token : ""}` }) };


    return this.http.get<any>("https://replicagiftsbackend.onrender.com/api/frame/get/" + id, _options)
  }
  frameData(id: any) {
    const token: string | null = localStorage.getItem('user');
    let _options = { headers: new HttpHeaders({ 'Authorization': `Bearer ${token ? JSON.parse(token).token : ""}` }) };


    return this.http.get<any>("https://replicagiftsbackend.onrender.com/api/frame/get-frame/" + id, _options)
  }

  getAllFrames() {
    const token: string | null = sessionStorage.getItem('admin');
    let _options = { headers: new HttpHeaders({ 'Authorization': `Bearer ${token ? JSON.parse(token).token : ""}` }) };


    return this.http.get<any>("https://replicagiftsbackend.onrender.com/api/frame/orders", _options)
  }

  getCart() {
    const token: string | null = localStorage.getItem('user');
    let _options = { headers: new HttpHeaders({ 'Authorization': `Bearer ${token ? JSON.parse(token).token : ""}` }) };


    return this.http.get("https://replicagiftsbackend.onrender.com/api/carts/get-cart/", _options)
  }

  remove(id: any) {
    const token: string | null = localStorage.getItem('user');
    let _options = { headers: new HttpHeaders({ 'Authorization': `Bearer ${token ? JSON.parse(token).token : ""}` }) };


    return this.http.delete("https://replicagiftsbackend.onrender.com/api/carts/remove-item/" + id, _options)
  }

  editQuantity(id: any, quantity: any) {
    const token: string | null = localStorage.getItem('user');
    let _options = { headers: new HttpHeaders({ 'Authorization': `Bearer ${token ? JSON.parse(token).token : ""}`, 'Content-Type': 'application/json' }) };

    return this.http.post("https://replicagiftsbackend.onrender.com/api/carts/edit-quantity/" + id, { quantity }, _options)

  }

}
