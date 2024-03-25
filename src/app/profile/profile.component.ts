import { Component } from '@angular/core';
import { UserAuthService } from '../service/user-auth.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../service/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  constructor(private userService: UserAuthService, private profile: ProfileService, private auth: UserAuthService, private router: Router) { }

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

  ngOnInit() {
    this.get()
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
    this.profile.addAddress(this.billingDetails).subscribe(response => {

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


  // logout() {
  //   // Clear user session
  //   localStorage.removeItem('user');
  //   // Redirect to login page
  //   this.router.navigate(['/login']);
  // }

}
