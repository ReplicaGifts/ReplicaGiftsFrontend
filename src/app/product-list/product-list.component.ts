import { Component } from '@angular/core';
import { CategoryService } from '../service/category.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../service/product.service';
import { WishService } from '../service/wish.service';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { HeaderComponent } from '../partials/header/header.component';
import { FormsModule } from '@angular/forms';
import { UserAuthService } from '../service/user-auth.service';
import { GuestService } from '../service/guest.service';
import Swal from 'sweetalert2';
import '../../../node_modules/aos/dist/aos.css'

declare global {
  interface Window {
    imgGallery: () => void;
    productContainer: () => void;
    // Declare other functions here...
  }
}


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, StarRatingComponent, HeaderComponent, FormsModule],
  templateUrl: './product-list.component.html',

  styleUrl: './product-list.component.css'
})
export class ProductListComponent {

  constructor(private category: CategoryService, private user: UserAuthService,
    private product: ProductService, private router: Router, private wish: WishService,
    private guest: GuestService
  ) { }

  categories: any[] = [];

  trending: any[] = [];

  newProduct: any[] = [];

  wishList: any[] = [];

  isAuth = this.user.isAuthenticated();

  ngOnInit() {

    window.productContainer();
    window.scrollTo({ top: 0, behavior: "instant" })
    this.category.getCategory().subscribe((category: any) => this.categories = category);
    this.product.getTrending().subscribe((trending: any) => {
      this.trending = trending
      this.get(trending);
    });
    this.product.getNew().subscribe((trending: any) => {
      this.newProduct = trending
      this.get(trending);
    });



  }

  get(product: any) {
    if (this.isAuth) {
      this.wish.getWishList().subscribe((wishList: any) => {
        this.wishList = wishList;
        this.setLike(wishList.map((wish: any) => wish._id), product);

      })
    } else {
      this.wishList = this.guest.getWish()
      this.setLike(this.wishList.map((wish: any) => wish._id), product);
    }
  }

  setLike(wish: any[], product: any[]) {
    product.forEach(((product: any) => {
      if ('_id' in product) {
        if (wish.includes(product._id.toString())) {
          product['like'] = true;
        } else {
          product['like'] = false;
        }
      }
    }))
  }

  nav(id: any) {
    this.router.navigateByUrl(`/product/${id}`)
  }

  navToShop() {
    this.router.navigateByUrl(`/shop`)
  }

  addWish(id: any) {
    id.like = !id.like;

    if (this.isAuth) {
      this.wish.addWish(id._id).subscribe((wish: any) => { console.log(wish); this.wish.checkWish() });
    }

    else {
      this.guest.addToWish(id)
      this.wish.noOfWish.next(this.guest.getWish().length);
    }

    if (id.like) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Item Added to Wishlist",
        showConfirmButton: false,
        timer: 500
      });
    }
    else {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Item Removed from Wishlist",
        showConfirmButton: false,
        timer: 500
      });
    }
  }

  navToCategory(id: any) {
    this.router.navigateByUrl(`/shop?category=${id}`)

  }

  contact = {
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: ''
  }

  err!: string;

  check() {
    this.err = ''
  }

  contactAdmin() {

    if (this.contact.name === '' || this.contact.email === '' || this.contact.subject === '' || this.contact.message === '' || this.contact.phone === '') {
      this.err = "please fill all the fields"
      return;
    }

    this.user.contact(this.contact).subscribe(contact => {
      console.log(contact)
      this.contact = {
        name: '',
        email: '',
        subject: '',
        message: '',
        phone: '',
      }
    })

  }

}