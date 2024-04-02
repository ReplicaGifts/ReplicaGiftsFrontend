import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../model/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../service/cart.service';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../service/payment.service';
import { ProfileService } from '../service/profile.service';
import Swal from 'sweetalert2';
import { UserAuthService } from '../service/user-auth.service';
import { GuestService } from '../service/guest.service';
import { SpinnerComponent } from '../spinner/spinner.component';


@Component({
  selector: 'app-delevery-details',
  standalone: true,
  imports: [FormsModule, CommonModule, SpinnerComponent],
  templateUrl: './delevery-details.component.html',
  styleUrl: './delevery-details.component.css'
})
export class DeleveryDetailsComponent {

  constructor(private Profile: ProfileService, private router: Router, private route: ActivatedRoute,
    private cart: CartService, private payment: PaymentService, private user: UserAuthService, private guest: GuestService) { }
  private unsubscribe$: Subject<void> = new Subject<void>();

  isAuth = this.user.isAuthenticated();

  spinner: boolean = false;

  billingDetails = {
    name: '',
    email: '',
    city: '',
    country: '',
    address: '',
    postcode: '',
    phone: '',
    state: ''
  }


  totalPrice = 0;

  shoppingCart: any[] = [];

  product!: Product;

  quantity: number = 1;

  detailId: any;

  gifts: any[] = [];

  checkoutData: any;

  subTotal: number = 0;

  giftsTotal: number = 0;



  ngOnInit() {

    this.totalPrice = 0;
    this.route.params.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(params => {
      this.detailId = params['id'];
      console.log(this.detailId);
      if (this.detailId) {
        this.cart.getFrame(this.detailId).pipe(
          takeUntil(this.unsubscribe$)
        ).subscribe((res) => {
          if (res.success) {

            this.product = res.product;
            this.subTotal = this.product.amount ?? 1 * res.quantity;
            this.gifts = res.gifts;
            this.giftsTotal = this.giftTotal(res.gifts ?? []);


            this.totalPrice = res.total;
            console.log(this.product);
          } else {
            this.router.navigate([''])
          }
        });
      } else {
        if (this.isAuth) {
          this.cart.getCart().subscribe((res: any) => {
            this.shoppingCart = res;
            this.totalCalc(res);
          });
        } else {
          this.shoppingCart = this.guest.getCart();
          this.totalCalc(this.shoppingCart);

        }
      }
    });

    this.Profile.getAddress().subscribe((res: any) => {
      if (res.success) {
        this.billingDetails = res.data
      }
    });


  }



  checkout() {

    if (this.billingDetails.name === '' || this.billingDetails.email === '' || this.billingDetails.address === '' || this.billingDetails.state === '' || this.billingDetails.country === '' || this.billingDetails.city === '') {
      Swal.fire({
        icon: "error",
        title: "Missing billing details",
        text: "Please fill out the billing details",
        position: "center"
      });

      console.log(this.billingDetails)
      return;
    }

    if (this.detailId) {
      this.checkoutData = { data: this.billingDetails, frameId: [{ _id: this.detailId }], name: 'Replica Gifts', amount: this.totalPrice, description: "Replica gifts" };
      this.spinner = true;

    } else {
      this.checkoutData = { data: this.billingDetails, frameId: this.shoppingCart.map((cart: any) => cart.userWant), name: 'Replica Gifts', amount: this.totalPrice, description: "Replica gifts" }
      console.log(this.checkoutData)
      this.spinner = true;
    }


    if (this.isAuth) {
      this.spinner = true;
      this.payment.createOrder(this.checkoutData).subscribe(res => {
        this.spinner = false;
        if (res.success) {
          // Handle payment success
          console.log(res);
          let options = {
            "key": res.key_id,
            "amount": `${res.amount}`,
            "currency": "INR",
            "name": res.product_name,
            "description": res.description,
            "image": "https://dummyimage.com/600x400/000/fff",
            "order_id": res.order_id,
            "handler": (response: any) => {
              this.handlePaymentSuccess(response, res);
            },

            "prefill": {
              "contact": res.contact,
              "name": res.name,
              "email": res.email
            },
            "notes": {
              "description": res.description
            },
            "theme": {
              "color": "#2300a3"
            }
          };


          this.payment.initializeRazorpay(options);
          this.payment.openPayment()


        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: res.msg,
          });
        }
      },
        error => {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "An error occurred",
          });
        }
      );
    } else {
      this.spinner = true;
      this.guest.checkout(this.checkoutData).subscribe((res: any) => {
        this.spinner = false;
        if (res.success) {
          // Handle payment success
          console.log(res);
          let options = {
            "key": res.key_id,
            "amount": `${res.amount}`,
            "currency": "INR",
            "name": res.product_name,
            "description": res.description,
            "image": "https://dummyimage.com/600x400/000/fff",
            "order_id": res.order_id,
            "handler": (response: any) => {
              this.handlePaymentSuccess(response, res);
            },

            "prefill": {
              "contact": res.contact,
              "name": res.name,
              "email": res.email
            },
            "notes": {
              "description": res.description
            },
            "theme": {
              "color": "#2300a3"
            }
          };


          this.payment.initializeRazorpay(options);
          this.payment.openPayment()


        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: res.msg,
          });
        }
      },
        error => {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "An error occurred",
          });
        }
      );
    }


  }

  handlePaymentSuccess(response: any, paymentResponse: any) {
    // Payment succeeded
    console.log("Payment succeeded");
    console.log(response);
    this.spinner = true;
    console.log(paymentResponse)

    // Verify payment signature
    if (this.isAuth) {


      this.payment.verifySignature(response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature, paymentResponse.frameDetails).subscribe(payment => {
        this.spinner = false;
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Payment Successed",
          showConfirmButton: false,
          timer: 1000
        });

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000)
      })
    } else {
      this.guest.verify(response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature, paymentResponse.frameDetails).subscribe(payment => {
        this.spinner = false;

        Swal.fire({
          position: "center",
          icon: "success",
          title: "Payment Successed",
          showConfirmButton: false,
          timer: 1500
        });


        if (!this.detailId) {
          localStorage.removeItem('cart');
        }

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000)
      })

    }
  }

  giftTotal(gifts: any): number {
    let total = 0;
    gifts.forEach((element: any) => {
      total += element.total;
    });

    return total
  }

  totalCalc(order: any) {
    order.forEach((element: any) => {
      console.log(element);
      console.log(element.userWant.quantity ?? 1, element.productId.amount)
      this.subTotal += element.userWant.quantity * element.productId.amount;
      this.giftsTotal += this.giftTotal(element.userWant.gifts);
      this.totalPrice += element.userWant.totalAmount;
    })
  }


  ngOnDestroy() {
    this.spinner = false;
  }

}

