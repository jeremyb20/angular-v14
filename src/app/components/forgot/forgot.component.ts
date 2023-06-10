import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
})
export class ForgotComponent implements OnInit {

  
  public showPassword: boolean;
  loginForm: FormGroup;
  submitted = false;
  loading: boolean = false;
  hideMsg: boolean = false;
  ShowMsg: string;
  constructor( private _authService: AuthService, private formBuilder: FormBuilder,private router: Router) { }
 
    ngOnInit() {
      this.loginForm =  this.formBuilder.group({
        email: ['', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      });
    }
    get f() { return this.loginForm.controls; }
    
    onSubmit() {
      this.submitted = true;
      if (this.loginForm.invalid) {
        return;
      }
      const user = {
        email: this.f.email.value,
        password: this.f.password.value
      }

      this._authService.authenticateUser(user);
    }

}
