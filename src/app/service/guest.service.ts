import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import uniqid from 'uniqid';

@Injectable({
  providedIn: 'root'
})
export class GuestService {


  constructor(private http: HttpClient) {
    this.initData('cart');
    this.initData('wish');
    this.initUser()
  }

  private initUser(): string | null {
    if (!localStorage.getItem('id')) {
      localStorage.setItem('id', uniqid())
    }

    return localStorage.getItem('id');
  }

  private initData(key: string): void {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify([]));
    }
  }

  private setData(data: any, key: string): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  private getData(key: string): any {
    return JSON.parse(localStorage.getItem(key) ?? '[]');
  }

  addToCart(frameDeatails: any, product: any, gifts: any): boolean {
    try {
      const cart = this.getData('cart');

      if (!gifts) {
        console.log(gifts, "fdghf");
      }
      console.log(gifts);
      const formData = new FormData();

      formData.append('quantity', frameDeatails.quantity);
      formData.append('printType', frameDeatails.printType);
      formData.append('userImage', frameDeatails.userImage);
      formData.append('size', frameDeatails.size);
      formData.append('product', product._id);
      formData.append('user', this.initUser() ?? '');
      formData.append('gifts', JSON.stringify(gifts));


      this.http.post('https://replicagiftsbackend.onrender.com/api/guest/add-frame', formData).subscribe((frame: any) => {


        const newItem = { _id: uniqid(), productId: product, quantity: +frameDeatails.quantity, userWant: frame, total: +frameDeatails.quantity * +product.amount };
        cart.push(newItem);
        this.setData(cart, 'cart');
      })
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  }

  buyNow(frameDeatails: any, product: any, gifts: any) {

    const formData = new FormData();

    formData.append('quantity', frameDeatails.quantity);
    formData.append('printType', frameDeatails.printType);
    formData.append('userImage', frameDeatails.userImage);
    formData.append('size', frameDeatails.size);
    formData.append('product', product._id);

    formData.append('gifts', JSON.stringify(gifts));
    formData.append('user', this.initUser() ?? '');


    return this.http.post('https://replicagiftsbackend.onrender.com/api/guest/add-frame', formData);
  }
  getCart(): any {
    console.log(this.getData('cart'));
    return this.getData('cart');
  }

  deleteCartItem(id: any): boolean {
    try {
      let cart = this.getCart();
      let frame;
      cart = cart.filter((item: any) => {
        if (item._id !== id) {
          return true
        } else {
          frame = item.userWant._id;
          return false
        }
      });
      this.setData(cart, 'cart');
      if (frame) {

        this.http.delete('https://replicagiftsbackend.onrender.com/api/guest/remove/' + frame).subscribe(data => {
          console.log(data)
        })

      }

      return true;
    } catch (error) {
      console.error('Error deleting cart item:', error);
      return false;
    }
  }


  editQuantity(id: any, quantity: any, frame_id: any) {
    this.http.put('https://replicagiftsbackend.onrender.com/api/guest/frame-quantity/' + frame_id, { quantity }, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }).subscribe(async (data: any) => {
      console.log(data);

      let cart = this.getCart();
      cart = await Promise.all(cart.map((item: any) => {
        if (item._id === id) {
          item.quantity = data.frame.quantity;
          item.userWant = data.frame;

        }

        return item
      }));


      this.setData(cart, 'cart');
    })

  }

  addToWish(product: any): boolean {
    try {
      const wish = this.getData('wish');
      const newItem = { ...product };
      wish.push(newItem);
      this.setData(wish, 'wish');
      return true;
    } catch (error) {
      console.error('Error adding to wish list:', error);
      return false;
    }
  }

  getWish(): any {
    return this.getData('wish');
  }

  deleteWishItem(id: any): boolean {
    try {
      let wish = this.getWish();
      wish = wish.filter((item: any) => item._id !== id);
      this.setData(wish, 'wish');
      return true;
    } catch (error) {
      console.error('Error deleting wish list item:', error);
      return false;
    }
  }


  checkout(product: any) {
    return this.http.post('https://replicagiftsbackend.onrender.com/api/guest/createOrder', { user: this.initUser(), ...product }, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  verify(orderId: any, paymentId: any, signature: any, frameIds: any) {
    return this.http.post<any>('https://replicagiftsbackend.onrender.com/api/guest/verifyPayment', { frameIds, orderId, paymentId, signature, user: this.initUser() }, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });

  }


  orders() {
    return this.http.get<any>('https://replicagiftsbackend.onrender.com/api/guest/orders/' + this.initUser())
  }

}



