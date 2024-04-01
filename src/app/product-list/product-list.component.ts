import { Component } from '@angular/core';
import { CategoryService } from '../service/category.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../service/product.service';
import { WishService } from '../service/wish.service';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { HeaderComponent } from '../partials/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserAuthService } from '../service/user-auth.service';
import { GuestService } from '../service/guest.service';
import Swal from 'sweetalert2';

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

  isAuth = this.user.isAuthenticated();

  ngOnInit() {
    window.productContainer()
    window.scrollTo({ top: 0, behavior: "instant" })

    this.category.getCategory().subscribe((category: any) => this.categories = category);
    this.product.getTrending().subscribe((trending: any) => this.trending = trending);
    this.product.getNew().subscribe((trending: any) => this.newProduct = trending);
  }

  nav(id: any) {
    this.router.navigateByUrl(`/product/${id}`)
  }

  navToShop() {
    this.router.navigateByUrl(`/shop`)

  }

  addWish(id: any) {
    if (this.isAuth) {
      this.wish.addWish(id._id).subscribe((wish: any) => { console.log(wish); this.wish.checkWish() });

          if (this.isAuth) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Item Added to Wishlist",
              showConfirmButton: false,
              timer: 1000
            });
            return;
          }

        
        }

     
    
    else {
      this.guest.addToWish(id)

      this.wish.noOfWish.next(this.guest.getWish().length);
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
