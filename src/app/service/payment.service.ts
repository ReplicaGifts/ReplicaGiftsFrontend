import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }


  private rzp: any;


  initializeRazorpay(options: any): void {
    if ((window as any)['Razorpay']) {
      this.rzp = new (window as any)['Razorpay'](options);
    } else {
      console.error('Razorpay not available.');
    }
  }

  openPayment(): void {
    if (this.rzp) {
      this.rzp.open();
    } else {
      console.error('Razorpay not initialized.');
    }
  }

  createOrder(product: any): Observable<any> {

    const token: string | null = localStorage.getItem('user');
    let _options = { headers: new HttpHeaders({ 'Authorization': `Bearer ${token ? JSON.parse(token).token : ""}`, 'Content-Type': 'application/json' }) };


    return this.http.post<any>('https://replicagiftsbackend.onrender.com/api/payment/createOrder', product, _options);
  }

  verifySignature(orderId: any, paymentId: any, signature: any, frameIds: any) {
    console.log(frameIds, orderId)
    const token: string | null = localStorage.getItem('user');
    let _options = { headers: new HttpHeaders({ 'Authorization': `Bearer ${token ? JSON.parse(token).token : ""}`, 'Content-Type': 'application/json' }) };


    return this.http.post<any>('https://replicagiftsbackend.onrender.com/api/payment/verifyPayment', { frameIds, orderId, paymentId, signature }, _options);
  }

}
