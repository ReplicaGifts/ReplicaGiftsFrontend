import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../model/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  constructor(private http: HttpClient) { }

  _options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };


  addProduct(data: any) {

    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("price", data.price);
    formData.append("userImage", data.userImage);
    formData.append("category", data.category);
    formData.append("discount", data.discount);
    formData.append("description", data.description);
    formData.append("additionalInfo", JSON.stringify(data.additionalInfo));
    formData.append("availablePrintSize", JSON.stringify(data.availablePrintSize));

    data.availablePrintType.forEach((d: any) => {

      formData.append("availablePrintType", d);
    })
    formData.append("quantity", data.quantity);
    formData.append("image", data.image)


    const admin: string | null = sessionStorage.getItem('admin');
    let _options = { headers: new HttpHeaders({ 'Authorization': `Bearer ${admin ? JSON.parse(admin).token : ""}` }) };


    return this.http.post("http://localhost:3000/api/products/add-product", formData, _options)


  }


  get() {
    return this.http.get<Product[]>("http://localhost:3000/api/products/all");
  }

  edit(data: any, id: any) {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("price", data.price);
    formData.append("userImage", data.userImage);
    formData.append("discount", data.discount);
    formData.append("category", data.category);

    formData.append("description", data.description);
    formData.append("additionalInfo", JSON.stringify(data.additionalInfo));
    formData.append("availablePrintSize", JSON.stringify(data.availablePrintSize));

    data.availablePrintType.forEach((d: any) => {

      formData.append("availablePrintType", d);
    })
    formData.append("quantity", data.quantity);

    formData.append("image", data.image);





    const admin: string | null = sessionStorage.getItem('admin');
    let _options = { headers: new HttpHeaders({ 'Authorization': `Bearer ${admin ? JSON.parse(admin).token : ""}` }) };


    return this.http.put("http://localhost:3000/api/products/update/" + id, formData, _options);

  }

  delete(id: any) {

    const admin: string | null = sessionStorage.getItem('admin');
    let _options = { headers: new HttpHeaders({ 'Authorization': `Bearer ${admin ? JSON.parse(admin).token : ""}` }) };



    return this.http.delete("http://localhost:3000/api/products/delete/" + id, _options);

  }


  getTrending() {
    return this.http.get("http://localhost:3000/api/products/trending-products");
  }
  getNew() {
    return this.http.get("http://localhost:3000/api/products/new-arrivals");
  }

  getProduct(id: any) {
    return this.http.get<Product>("http://localhost:3000/api/products/data/" + id);
  }


  getProductCategoryWise(id: any) {
    return this.http.get<Product[]>("http://localhost:3000/api/products/category/" + id);
  }

  fetchOutOfStock() {


    const admin: string | null = sessionStorage.getItem('admin');
    let _options = { headers: new HttpHeaders({ 'Authorization': `Bearer ${admin ? JSON.parse(admin).token : ""}` }) };

    return this.http.get<Product[]>("http://localhost:3000/api/products/out-of-stock", _options);

  }


  addreview(id: any, comment: any, rating: any) {


    const token: string | null = localStorage.getItem('user');
    let _options = { headers: new HttpHeaders({ 'Authorization': `Bearer ${token ? JSON.parse(token).token : ""}`, 'Content-Type': 'application/json' }) };

    return this.http.post("http://localhost:3000/api/products/add-review/" + id, { comment, rating }, _options);

  }



  limitedProduct(query: any) {
    // Create a shallow copy of the query object
    let q = { ...query };

    if (query.category) {
      // Convert the category property to a comma-separated string
      q.category = query.category.join(',');
    }

    // Make the HTTP request using the modified query object
    return this.http.get("http://localhost:3000/api/products/filter", { params: q });
  }




  priceRange() {
    return this.http.get<any[]>("http://localhost:3000/api/products/price-range");
  }

}
