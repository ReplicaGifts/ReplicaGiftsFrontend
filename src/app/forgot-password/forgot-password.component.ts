import { Component } from '@angular/core';
import { UserAuthService } from '../service/user-auth.service';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { flatMap } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  constructor(private mailsService: UserAuthService, private router: Router) { }

  email = new FormControl('', [Validators.required, Validators.email]);

  showCodeInput: boolean = false;

  password: string = '';
  crpassword: string = '';

  otp!: number;

  err: any = false

  showPasswordInput: boolean = false;

  getOtp() {
    if (this.email.valid) {

      this.mailsService.otp(this.email.value ?? '').subscribe(data => {
        this.showCodeInput = true;
      }, err => { this.err = "User not found in record, please register first or check email" });
    } else {
      this.err = 'Please enter your registered email address'

    }
  }

  verifyCode() {
    if (this.email.valid && this.otp) {

      this.mailsService.verifyOtp(this.email.value ?? '', this.otp).subscribe((data: any) => {
        console.log(data);
        if (data.success) {
          this.showPasswordInput = true;
        }
      }, err => { this.err = 'Invalid OTP' });
    } else {
      this.err = 'Please enter otp'

    }
  }

  typing() {
    this.err = false;
  }

  setPassword() {

    if (this.password === this.crpassword) {
      if (this.password || this.crpassword)
        this.mailsService.resetPassword(this.email.value ?? '', this.password).subscribe((data: any) => { console.log(data); this.router.navigate(['/login']); });
      else
        this.err = 'Please enter password'
    }
    else
      this.err = 'Password mismatch';

  }

}
