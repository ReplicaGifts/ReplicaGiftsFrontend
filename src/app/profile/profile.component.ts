import { Component } from '@angular/core';
import { UserAuthService } from '../service/user-auth.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../service/profile.service';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../service/cart.service';
import Swal from 'sweetalert2';
import { WishListComponent } from '../wish-list/wish-list.component';
import { WishService } from '../service/wish.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  constructor(private userService: UserAuthService, private profile: ProfileService, private auth: UserAuthService, private router: Router, private cart: CartService, private wish: WishService) { }

  user: any;

  edit: boolean = false;

  display: any = "dashboard";

  changeDisplay(name: any) {
    this.display = name;
  }

  orders: any[] = [];
  address: any[] = [];

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

  proPic: any;

  addPic(e: any) {
    this.proPic = e.target.files[0];
  }

  ngOnInit() {
    this.get()
    this.getCart()
    this.getW()
    window.scrollTo({ top: 0, behavior: "instant" })

  }

  get() {
    this.edit = false
    this.userService.getUser().subscribe((user: any) => {
      this.orders = user.orders
      if (user.billingDetails) {

        this.billingDetails = user.billingDetails;
      } else {
        this.edit = true
      }

      this.user = user;
      this.getOrders()

    })
  }

  addAddress() {
    console.log(this.proPic)
    this.profile.addAddress(this.billingDetails, this.proPic).subscribe(response => {

      console.log(response);
    });
  }

  getOrders() {
    this.profile.getOrder().subscribe((response: any) => {
      this.orders = response;
      console.log(response);
    });
  }

  logout() {
    this.auth.logOut();
    console.log("sd")
    this.router.navigate(['/']);

  }

  home() {
    this.router.navigate(['/']);
  }

  navtoorder(id: any) {
    this.router.navigateByUrl('/order-view/' + id)
  }

  updateQt(id: any, q: any) {
    this.cart.editQuantity(id, q).subscribe((wish: any) => { console.log(wish); this.getCart(true) });
  }

  cartList: any[] = [];
  total: number = 0;

  getCart(isDelet: boolean = false) {
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
          this.getCart(true)
          Swal.fire({
            title: "Deleted!",
            text: "Your cart item has been deleted.",
            icon: "success"
          });
        });
      }
    });
  }


  wishList: any[] = [];
  getW() {
    this.wish.getWishList().subscribe((wishList: any) => {
      console.log(wishList);
      this.wishList = wishList;
      this.wish.noOfWish.next(wishList.length);
    });
  }
  removeWish(id: any) {
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
        this.wish.removeWish(id).subscribe((wish: any) => {
          console.log(wish); this.getW();
          Swal.fire({
            title: "Deleted!",
            text: "Your Wish item has been deleted.",
            icon: "success"
          });
        });
      }
    });
  }


  navToProduct(id: any) {
    this.router.navigateByUrl(`/product?id=${id}`)
  }

  // logout() {
  //   // Clear user session
  //   localStorage.removeItem('user');
  //   // Redirect to login page
  //   this.router.navigate(['/login']);
  // }

}
