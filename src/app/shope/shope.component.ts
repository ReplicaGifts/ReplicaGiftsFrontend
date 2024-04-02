import { Component, OnDestroy, SimpleChanges } from '@angular/core';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../service/category.service';
import { ProductService } from '../service/product.service';
import { WishService } from '../service/wish.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, debounceTime } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { UserAuthService } from '../service/user-auth.service';
import { GuestService } from '../service/guest.service';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-shope',
  standalone: true,
  imports: [StarRatingComponent, CommonModule, FormsModule, SpinnerComponent],
  templateUrl: './shope.component.html',
  styleUrl: './shope.component.css'
})
export class ShopeComponent implements OnDestroy {

  constructor(
    private categoryService: CategoryService,
    private product: ProductService,
    private guest: GuestService,
    private router: Router,
    private route: ActivatedRoute,
    private wish: WishService,
    private user: UserAuthService
  ) { }

  isAuth = this.user.isAuthenticated();

  subscribetion: any[] = [];

  count: number = 0;

  spinner: boolean = false;

  selectedFilters: any = {
    search: '',
    page: 1,
    sort: "noOfPerchases",
    order: -1
  };
  categories: any[] = [];
  ranges: number[] = [];
  discounts: number[] = [10, 20, 30, 40, 50];
  products: any[] = [];

  selectedSort: number = 0;

  sort = [{ name: "Papularity", order: -1, q: "noOfPerchases" }, { name: "What's new", order: -1, q: "createdAt" }, { name: "Price: low to high", order: 1, q: "amount" }, { name: "Price: high to low", order: -1, q: "amount" }, { name: "A to Z", order: 1, q: "title" }, { name: "Z to A", order: -1, q: "title" }, { name: "Customer Rating", order: -1, q: "totalrating" }]

  private filterSubject = new BehaviorSubject<any>(this.selectedFilters);

  check = false;
  pageNo: any[] = [];
  ngOnInit(): void {

    this.spinner = true;
    window.scrollTo({ top: 0, behavior: "instant" })
    // Subscribe to filter changes and debounce the input
    this.subscribetion.push(this.filterSubject.pipe(

      debounceTime(300) // Debounce input to avoid rapid API requests

    ).subscribe((filters: any) => {
      this.spinner = true;
      this.getFilteredProduct(filters);
    }))

    this.subscribetion.push(this.route.queryParams.subscribe(params => {
      let id = params['category'];

      if (id) {

        this.check = id;
        this.filterCategory(id);
      }
    }));

    this.loadInitialData();

    this.subscribetion.push(this.product.priceRange().subscribe((price: any) => {
      if (price.success) {
        this.ranges = price.ranges;
        // Update discounts array based on fetched data
      }
    }));

    this.subscribetion.push(this.categoryService.getCategory().subscribe((category: any) => this.categories = category));
  }




  filterCategory(category: any) {
    if (category) {

      this.selectedFilters.category = category;
    }
    this.selectedFilters.page = 1;


    this.filterSubject.next(this.selectedFilters); // Trigger filter update
  }

  applyPriceRange(e: any, minPrice: number, maxPrice: number) {
    if (e.target.checked) {
      this.selectedFilters.min = minPrice;
      this.selectedFilters.max = maxPrice;
    } else {
      this.selectedFilters.min = '';
      this.selectedFilters.max = '';
    }
    this.selectedFilters.page = 1;

    this.filterSubject.next(this.selectedFilters); // Trigger filter update
  }

  applyDiscount(e: any, discount: number) {
    if (e.target.checked) {
      this.selectedFilters.discount = discount;
    } else {
      this.selectedFilters.discount = '';
    }
    this.selectedFilters.page = 1;

    this.filterSubject.next(this.selectedFilters); // Trigger filter update
  }

  applyRating(e: any, rating: number) {
    if (e.target.checked) {
      this.selectedFilters.rating = rating;

    } else {
      this.selectedFilters.rating = '';
    }
    this.filterSubject.next(this.selectedFilters); // Trigger filter update
  }
  applySearch() {
    this.filterSubject.next(this.selectedFilters); // Trigger filter update
  }
  applySort(sort: any) {
    console.log(sort);
    this.selectedFilters.sort = this.sort[sort].q;
    this.selectedFilters.order = this.sort[sort].order;

    this.filterSubject.next(this.selectedFilters); // Trigger filter update
  }



  loadInitialData() {
    // Load initial data when the component initializes
    this.getFilteredProduct(this.selectedFilters);
  }


  nav(id: any) {

    this.router.navigateByUrl(`/product/${id}`)
  }

  addWish(id: any) {
    if (this.isAuth)
      this.subscribetion.push(this.wish.addWish(id._id).subscribe((wish: any) => { console.log(wish); this.wish.checkWish() }));
    else {

      this.guest.addToWish(id)
      this.wish.noOfWish.next(this.guest.getWish().length)
    }
  }


  getFilteredProduct(selected: any) {
    this.subscribetion.push(this.product.limitedProduct(selected).subscribe((products: any) => {
      this.products = products.product;
      console.log(this.products);
      this.pageNo = [];
      for (let i = 0; i < products.total; i++) {
        this.pageNo[i] = i + 1;
      }

      this.spinner = false;
      this.count = products.count;
    }));
  }

  ngOnDestroy() {
    this.subscribetion.forEach((s) => {
      s.unsubscribe();
    })
  }

}
