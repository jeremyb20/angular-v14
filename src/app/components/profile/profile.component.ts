import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MediaResponse, MediaService } from 'src/app/services/media.service';
import { NotificationService } from 'src/app/services/notification.service';
import { objectsAreEqual } from '../../common/equal-objects';

export type Credentials = { PhoneNumber: number, UserName: string };

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit, OnDestroy {
  private mediaSubscription: Subscription;
  Media: MediaResponse;
  profile:any;
  profileForm: FormGroup;
  submitted = false;
  loading: boolean = false;
  userName: any = '';
  empresaDefault: any = '';
  detectChanges: any = [];

  @Output() credentials = new EventEmitter<Credentials>();

  constructor(private _authService: AuthService, private _notificationService: NotificationService, private formBuilder: FormBuilder, private _media: MediaService) {
    this.mediaSubscription = this._media.subscribeMedia().subscribe(media => {
      this.Media = media;
    });


    this.userName = this._authService.getUserNameLocal();
    this.empresaDefault = this._authService.getCompanyDefault();
  }


  get f() { 
    return this.profileForm.controls; 
  }

  ngOnInit(): void {
    this.profileForm =  this.formBuilder.group({
      Email: ['', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      CodigoUsuario: ['', [Validators.required]],
      FullName: ['', [Validators.required]],
      UserName: ['', [Validators.required]],
      SurName: ['', [Validators.required]],
      PhoneNumber: ['', [Validators.required]],
      Address: ['', [Validators.required]],
      SecondAddress: ['', [Validators.required]],
      PostalCode: ['', [Validators.required]],
      Country: ['', [Validators.required]],
      State: ['', [Validators.required]],
      CompanyDefault: ['', [Validators.required]],
      RolUser: ['', [Validators.required]]

     });
     this.detectChanges = this.profileForm.value;
    this._authService.changedetected(false);
  }

  getProfile() {
    // this._authService.getProfile()
    // .subscribe(data => {
    //   this.profile = data;
    // },
    // error => {
    //    
    //   if(error.status == 401 )
    //     this._notificationService.warning('Información de sistema', 'Lo sentimos el token ya expiró o no tienes permisos para esta vista', 6000);

    // });
  }
  
  modelChange(e:any) {
    const areDifferent = objectsAreEqual(this.profileForm.value, this.detectChanges);
    this._authService.changedetected(areDifferent);
  }

  onSaveProfile() {
    console.log(this.f);
    this.submitted = true;

    if (this.profileForm.invalid) {
      return;
    }
  }

  ngOnDestroy() {
      if(this.mediaSubscription)
        this.mediaSubscription.unsubscribe();
  }

}
