import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MediaResponse, MediaService } from 'src/app/services/media.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ThemeService } from 'src/app/services/theme.service';
import { TranslationService } from 'src/app/services/translate.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html'
})
export class ConfigurationComponent implements OnInit {
  private mediaSubscription: Subscription;
  Media: MediaResponse;
  selectTheme =  new FormControl('theme-default-dark');
  currentTheme: any;
  currentLang: any;
  public data = {};

  themes: any = [
    {
      themeText: 'HOME.THEME.DEFAULT',
      themeClass: 'theme-default'
    },
    {
      themeText: 'HOME.THEME.DARK',
      themeClass: 'theme-default-dark'
    },
    {
      themeText: 'HOME.THEME.PREMIUM',
      themeClass: 'theme-premium'
    },
    {
      themeText: 'HOME.THEME.GRADIENT',
      themeClass: 'theme-gradient',
    },
    {
      themeText: 'HOME.THEME.IBETSPORT',
      themeClass: 'theme-ibetsport-light',
    }
  ]


  constructor(private titleService: Title, private _authService: AuthService, private themeService: ThemeService, private _notificationService: NotificationService,public _translate: TranslationService, private _media: MediaService) {
    this.titleService.setTitle('Configuration | Jazzgsdemo');
    this.currentTheme = this.themeService.getThemeSelected();
    if(this.currentTheme){
      this.themeService.setTheme(this.currentTheme);
      this.selectTheme =  new FormControl(this.currentTheme);
    }else{
      this.themeService.setTheme('theme-default-dark');
    }
    this.selectTheme.valueChanges.subscribe((value) => {
      this.currentTheme = value;
      this.themeService.setTheme(value);
    });

    this.mediaSubscription = this._media.subscribeMedia().subscribe(media => {
      this.Media = media;
    });
  }

  ngOnInit() {
    console.log('config');
  }

  showtoast() {
    this._notificationService.success('Hola', 'sucess', 'bg-success', 'animate__backInUp', 6000);
  }

  changetranslator(val: any) {
    this._translate.setTranslate(val);

    this._authService.setTranslateUser(val).subscribe({
      next: (data: any) => {
        if (data.success) {
          console.log(data.message);
          this._notificationService.success('Hola', data.message, 'bg-success', 'animate__backInUp', 6000);
        }  
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {
        console.log('complete');
      }
    });
  }

  setTheme(item: any) {
    Swal.fire({
      title: 'Estas seguro?',
      text: "El tema " +item + " quedara por defecto cuando vuelvas a iniciar sesion",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: "Cancelar",
      confirmButtonText: 'Si, usarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.currentTheme = item;
        this._authService.setThemeUser(this.currentTheme).subscribe({
          next: (data: any) => {
            if (data.success) {
              this.themeService.setTheme(this.currentTheme);
              Swal.fire(
                'Actualizado!',
                data.message,
                'success'
              )
            } else {
              Swal.fire(
                'Ups, ha ocurrido algo!',
                'Error en el sistema intentelo mas tarde.',
                'error'
              )
            }
          },
          error: (err: any) => {
            console.log(err);
          },
          complete: () => {
            console.log('complete');
          }
        });

        this.themeService.setTheme(item);
      }
    });
  }
}
