import { Component } from '@angular/core';
import { UserAuthService } from '../service/user-auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {


  constructor(private auth: UserAuthService, private router: Router, private formBuilder: FormBuilder) { }

  myForm!: FormGroup;

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: "instant" })

    this.myForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  register() {
    if (this.myForm.valid) {
      this.auth.reg(this.myForm.value).subscribe(data => {
        console.log(data);
        localStorage.setItem('user', JSON.stringify(data));
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Register successfully",
          showConfirmButton: false,
          timer: 1500
        });
        this.auth.isAuthenticated();
        this.router.navigate(['/']);
      }, error => {
        console.log(error);
      })
      Swal.fire({
        icon: "error",
        title: "Fill required fields",
      });
    }
  }

}
