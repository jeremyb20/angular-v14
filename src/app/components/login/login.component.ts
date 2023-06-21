import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  public showPassword: boolean;
  loginForm: FormGroup;
  submitted = false;
  loading: boolean = false;
  hideMsg: boolean = false;
  ShowMsg: string;
  user: string= '';

  constructor(public translate: TranslateService, private titleService: Title, private _authService: AuthService, private _notificationService: NotificationService, private formBuilder: FormBuilder,private router: Router) {
    this.titleService.setTitle('Developer Mode');
  }

    ngOnInit() {
      this.loginForm =  this.formBuilder.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required]]
      });
    }
    get f() { return this.loginForm.controls; }

    onSubmit() {
      this.submitted = true;
      if (this.loginForm.invalid) {
        return;
      }
      const user = {
        username: this.f.username.value,
        password: this.f.password.value
      }

      this.loading = true;

      this._authService.authenticateUser(user).subscribe({
        next: (result: any) => {
          if (result.success) {
            this.translate.use(result.user.lang);
            this._authService.authenticateUserLocal(result.user, result.token);
            if(result.user.userRol == 'Usuario'){
              this.router.navigate(['/dashboard']);
            }else{
              this.router.navigate(['/admin']);
            }
            
            this.loading = false;
          } else {
            this.loading = false;
            this.getResponseByService(true, result.message); 
          }
        },
        error: (err: any) => {
          this.loading = false;
          this.getResponseByService(true, 'Servicio en mantenimiento, favor de iniciar sesión más tarde'); 
          console.log(err);
        }
      });
    }

    getResponseByService(hideMsg:any, responseMsg:any){
      this.hideMsg = hideMsg;
      this.ShowMsg = responseMsg;
      this.submitted = false;
      if(this.hideMsg){
        setTimeout(() => { this.hideMsg = false }, 6000);
      }
    }
}
