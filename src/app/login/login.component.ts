import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserAuthService } from '../service/user-auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  show: boolean = false;

  constructor(private auth: UserAuthService, private router: Router, private formBuilder: FormBuilder) { }

  myForm!: FormGroup;

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: "instant" })
    this.myForm = this.formBuilder.group({

      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  err: boolean | string = false;


  login() {
    if (this.myForm.valid) {
      this.auth.login(this.myForm.value).subscribe((user: any) => {
        console.log('login:', user);
        if (user.success) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Login successed",
            showConfirmButton: false,
            timer: 1500
          });
          localStorage.setItem('user', JSON.stringify(user));
          this.auth.isAuthenticated();

          this.router.navigate(['']);
        } else {
          this.err = user.message;
        }
      }, error => {

        console.log(error);
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Fill required fields",
      });
    }
  }


  logout() {
    // Clear user session
    localStorage.removeItem('user');
    // Redirect to login page
    this.router.navigate(['/login']);
  }
}
