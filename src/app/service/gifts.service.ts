import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GiftsService {

  constructor(private http: HttpClient) { }


  adaGift(data: any) {

    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("discount", data.discount);
    formData.append("quantity", data.quantity);
    formData.append("thumbnail", data.thumbnail);
    formData.append("price", data.price);


    const admin: string | null = sessionStorage.getItem('admin');
    let _options = { headers: new HttpHeaders({ 'Authorization': `Bearer ${admin ? JSON.parse(admin).token : ""}` }) };


    return this.http.post("http://localhost:3000/api/gifts", formData, _options)

  }

  getGifts() {

    return this.http.get("http://localhost:3000/api/gifts");

  }


  updateGift(data: any, id: any) {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("discount", data.discount);
    formData.append("quantity", data.quantity);
    formData.append("thumbnail", data.thumbnail);
    formData.append("price", data.price);

    const admin: string | null = sessionStorage.getItem('admin');
    let _options = { headers: new HttpHeaders({ 'Authorization': `Bearer ${admin ? JSON.parse(admin).token : ""}` }) };


    return this.http.put("http://localhost:3000/api/gifts/update/" + id, formData, _options)

  }


  delete(id: string) {
    return this.http.delete("http://localhost:3000/api/gifts/delete/" + id);
  }


}
