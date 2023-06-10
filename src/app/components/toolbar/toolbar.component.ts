import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MediaResponse, MediaService } from 'src/app/services/media.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NAVIGATION } from "src/app/common/constants";

import Validation from 'src/app/common/confirm-password.validator';
declare const bootstrap :any;

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html'
})

export class ToolbarComponent {
  private mediaSubscription: Subscription;
  form: FormGroup = new FormGroup({
    fullname: new FormControl(''),
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
    acceptTerms: new FormControl(false),
  });
  navigation: any = NAVIGATION;
  submitted = false;
  userName: any = '';
  companyName: any;
  idUser: any;
  Media: MediaResponse;
  passwordModal: any;

  constructor(private _media: MediaService, private _authService: AuthService, private formBuilder: FormBuilder,private router: Router, private _notificationService: NotificationService) {
    this.companyName = this._authService.getCompanyDefault();
    this.idUser = this._authService.getUserIdLocal();
    this.userName = this._authService.getUserNameLocal();
    this.mediaSubscription = this._media.subscribeMedia().subscribe(media => {
      this.Media = media;
    });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        fullname: ['', Validators.required],
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40),
          ],
        ],
        confirmPassword: ['', Validators.required],
        acceptTerms: [false, Validators.requiredTrue],
      },
      {
        validators: [Validation.match('password', 'confirmPassword')],
      }
    );

    this.getModalInit();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  openModal() {
    this.passwordModal.show();
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    console.log(JSON.stringify(this.form.value, null, 2));
  }

  logout(){
    this._authService.logout();
  }

  getModalInit() {
    this.passwordModal = new bootstrap.Modal((<HTMLInputElement>document.getElementById("passwordModal")), {
      keyboard: false
    });
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }
}
