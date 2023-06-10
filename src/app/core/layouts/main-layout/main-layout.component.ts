import { Component, OnInit, OnDestroy  } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/services/theme.service';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MediaResponse, MediaService } from "src/app/services/media.service";
import { AuthService } from 'src/app/services/auth/auth.service';
import { Spinkit } from 'ng-http-loader';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  Media: MediaResponse;
  private mediaSubscription: Subscription;
  title: string;
  sidebarExpanded : boolean;
  routeState: any;
  user:any;
  selectTheme =  new FormControl('theme-default');

  public spinkit = Spinkit;
  opacity: any = 0.9;

  constructor(private router: Router, private themeService: ThemeService, private _media: MediaService, private _authService: AuthService) {
    this.mediaSubscription = this._media.subscribeMedia().subscribe(media => {
      this.Media = media;
      this.sidebarExpanded = media.IsMobile ? false: true;
    });

    let currentUser = this.themeService.getThemeSelected();
    if(currentUser){
      this.themeService.setTheme(currentUser);
      this.selectTheme =  new FormControl(currentUser);
    }else{
      this.themeService.setTheme('theme-default');
    }
    this.selectTheme.valueChanges.subscribe((value) => {
      this.themeService.setTheme(value);
    });
  }
  

  ngOnInit(){
    //oninit
  }

  ngOnDestroy () {
    if(this.mediaSubscription){
      this.mediaSubscription.unsubscribe();
    }
  }
}
