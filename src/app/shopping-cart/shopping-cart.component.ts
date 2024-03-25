import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../service/cart.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent {
  constructor(public cart: CartService, private router: Router) { }

  cartList: any[] = [];

  total: any = 0;



  ngOnInit() {
    this.total = 0;
    window.scrollTo({ top: 0, behavior: "instant" })

    this.get();
  }

  get(isDelet: boolean = false) {
    this.cart.getCart().subscribe((cart: any) => {
      console.log(cart);
      this.cartList = cart;
      if (isDelet) {
        this.total = 0
      }
      this.cartList.map((cart) => {
        this.total = this.total + cart.userWant.totalAmount;
      })
      console.log(this.cartList);
      this.cart.NoOFCartItem.next(this.cartList.length);

    });
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
        this.cart.remove(id).subscribe((wish: any) => {
          console.log(wish);
          this.get(true)
          Swal.fire({
            title: "Deleted!",
            text: "Your cart item has been deleted.",
            icon: "success"
          });
        });
      }
    });
  }

  navToProduct(id: any) {
    this.router.navigateByUrl(`/product?id=${id}`)
  }

  checkout() {
    this.router.navigate(['/check-out'])
  }

  updateQt(id: any, q: any) {
    this.cart.editQuantity(id, q).subscribe((wish: any) => { console.log(wish); this.get(true) });
  }

}
