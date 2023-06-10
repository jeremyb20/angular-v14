import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { ThemeService } from 'src/app/services/theme.service';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MediaResponse, MediaService } from "src/app/services/media.service";
import { AuthService } from 'src/app/services/auth/auth.service';
import { Spinkit } from 'ng-http-loader';
import { NAVIGATION_ADMIN } from "src/app/common/constants";

declare let bootstrap: any;

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent implements OnInit {
  Media: MediaResponse;
  private mediaSubscription: Subscription;
  navigation_admin: any = NAVIGATION_ADMIN;
  title: string;
  sidebarExpanded : boolean;
  routeState: any;
  user:any;
  username:any;
  selectTheme =  new FormControl('theme-default');
  currentTheme:any;
  public spinkit = Spinkit;
  opacity: any = 0.9;

  constructor(private router: Router, private themeService: ThemeService, private _media: MediaService, private _authService: AuthService) {
    this.user = this._authService.getUserRole();
    this.username = this._authService.getUserNameLocal();

    this.mediaSubscription = this._media.subscribeMedia().subscribe(media => {
      this.Media = media;
      this.sidebarExpanded = media.IsMobile ? false: true;
    })

    let currentUser = this.themeService.getThemeSelected();
    if(currentUser){
      this.themeService.setTheme(currentUser);
      this.selectTheme =  new FormControl(currentUser);
    }else{
      this.themeService.setTheme('theme-default');
      this.currentTheme = this.selectTheme.value;
    }
    this.selectTheme.valueChanges.subscribe((value) => {
      console.log(value)
      this.themeService.setTheme(value);
    });
  }
  

  ngOnInit(){
    //oninit
  }

  logout(){
    this._authService.logout();
  }

  ngOnDestroy () {
    if(this.mediaSubscription){
      this.mediaSubscription.unsubscribe();
    }
  }

  close() {
    const navLinks = document.querySelectorAll('.nav-item')
    const menuToggle = document.getElementById('offcanvasExample')
    const bsCollapse = new bootstrap.Collapse(menuToggle)
    navLinks.forEach((l) => {
        l.addEventListener('click', () => { bsCollapse.toggle() })
    })
  }

}
