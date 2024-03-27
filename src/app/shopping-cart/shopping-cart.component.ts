import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../service/cart.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserAuthService } from '../service/user-auth.service';
import { GuestService } from '../service/guest.service';
@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent {
  constructor(public cart: CartService, private router: Router, private user: UserAuthService, private guest: GuestService) { }

  cartList: any[] = [];

  total: any = 0;

  isAuth: Boolean = this.user.isAuthenticated();


  ngOnInit() {
    this.total = 0;
    window.scrollTo({ top: 0, behavior: "instant" })

    this.get();
  }

  get(isDelet: boolean = false) {
    if (this.isAuth) {

      this.cart.getCart().subscribe((cart: any) => {
        this.cartList = cart;
        if (isDelet) {
          this.total = 0
        }
        this.cartList.map((cart) => {
          this.total = this.total + cart.userWant.totalAmount;
        })
        this.cart.NoOFCartItem.next(this.cartList.length);

      });
    } else {
      this.cart.NoOFCartItem.next(this.guest.getCart().length);

      if (isDelet) {
        this.total = 0
        console.log(this.total)
      }
      this.cartList = this.guest.getCart();
      this.cartList.map((cart) => {
        this.total = this.total + cart.userWant.totalAmount;
      })
    }

  }
  remove(id: any) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Remove it!"
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.isAuth) {
          this.cart.remove(id).subscribe((wish: any) => {
            console.log(wish);
            this.get(true)
            Swal.fire({
              title: "Deleted!",
              text: "Your cart item has been deleted.",
              icon: "success"
            });
          });
        } else {
          this.guest.deleteCartItem(id) ?
            Swal.fire({
              title: "Deleted!",
              text: "Your cart item has been deleted.",
              icon: "success"
            })
            : console.error("Cart item deleted");
          this.get(true)

        }
      }
    });
  }

  navToProduct(id: any) {
    this.router.navigateByUrl(`/product?id=${id}`)
  }

  checkout() {
    this.router.navigate(['/check-out'])
  }

  updateQt(id: any, q: any, f_id: any) {
    if (this.isAuth) {

      this.cart.editQuantity(id, q).subscribe((wish: any) => { console.log(wish); this.get(true) });
    } else {
      this.guest.editQuantity(id, q, f_id)

      setTimeout(() => {
        this.get(true)
      }, 2000)

    }
  }

}
