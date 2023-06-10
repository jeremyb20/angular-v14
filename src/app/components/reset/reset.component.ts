import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import Validation from "../../common/confirm-password.validator";

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html'
})
export class ResetComponent implements OnInit {
  public showPasswordEmailSent: boolean;
  public showNewPassword: boolean;
  public showConfirmPassword: boolean;
  addressForm: FormGroup;
  submitted = false;
  loading: boolean = false;
  hideMsg: boolean = false;
  ShowMsg: string;
  idUser: any;
  password: string;
  rolUser: any;
  isUserLogged: any;

  resetForm: FormGroup = new FormGroup({
    password: new FormControl(''),
    newPassword: new FormControl(''),
    confirmPassword: new FormControl('')
  });

  //timeSeconds: number =  6000;
  constructor( private _authService: AuthService,private route: ActivatedRoute , private formBuilder: FormBuilder,private router: Router, private _notificationService: NotificationService) { 
    this.route.params.subscribe(params => {
      this.idUser = params.idUser;
      this.password = params.ps;
    });

    this.rolUser = this._authService.getUserRole();
    this.isUserLogged = this._authService.isUserLogged();
  }

    ngOnInit() {
      this.resetForm = this.formBuilder.group(
        {
          password: ['', Validators.required],
          newPassword: [
            '',
            [
              Validators.required,
              Validators.minLength(6),
              Validators.maxLength(40),
            ],
          ],
          confirmPassword: ['', Validators.required],
        },
        {
          validators: [Validation.match('newPassword', 'confirmPassword')],
        }
      );
    }

    get f(): { [key: string]: AbstractControl } {
      return this.resetForm.controls;
    }

    onSubmit() {
      this.submitted = true;
      if (this.resetForm.invalid) {
        return;
      }

      if(this.f.password.value === this.f.newPassword.value) {
        this.hideMsg = true;
        this.ShowMsg = 'La contraseña anterior debe ser distinta a la nueva';
        setTimeout(() => { this.hideMsg = false }, 6000);
        return;
      }

      this.loading = true;
      const reset = {
        idUser: parseInt(this.idUser),
        claveActual: this.f.password.value,
        claveUsuario: this.f.newPassword.value,
        binCambiarClaveUsuario: 0,
      }

      this._authService.postModifyPassword(reset).subscribe({
        next: (data: { success: any; user: any; token: any; userRol: string; }) => {
          if (data.success) {
            this._authService.authenticateUserLocal(data.user, data.token);
            if(data.userRol == 'Usuario'){
              this.router.navigate(['/dashboard']);
            }else{
              this.router.navigate(['/admin']);
            }
            
            this.loading = false;
          } else {
            this.loading = false;
            this._notificationService.warning('Información del sistema ' , this.ShowMsg, 'bg-warning', 'animate__backInUp', 6000);
          }
        },
        error: (err: any) => {
          this.loading = false;
          this._notificationService.warning('Información del sistema ' , this.ShowMsg, 'bg-warning', 'animate__backInUp', 6000);
          console.log(err);
        }
      });





    }

    logout() {
      this._authService.logout();
    }

}
