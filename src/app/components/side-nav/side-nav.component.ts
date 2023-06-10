import { Component, EventEmitter, Input, Output, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/services/auth/auth.service";
import { MediaResponse, MediaService } from "src/app/services/media.service";
import { NotificationService } from "src/app/services/notification.service";
import { AUTO_STYLE, animate, state, style, transition, trigger } from '@angular/animations';
import { NAVIGATION } from "src/app/common/constants";
import Swal from 'sweetalert2';
import packageJson from '../../../../package.json';

const DEFAULT_DURATION = 200;

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  animations: [
    trigger('collapse', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-in')),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-out'))
    ])
  ]
})

export class SideNavComponent {
  public version: string = packageJson.version;
  @Input() isExpanded: boolean = false;
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();
  handleSidebarToggle = () => this.toggleSidebar.emit(!this.isExpanded);
  output: boolean;
  openAccordion:any = [];
  Media: MediaResponse;
  navigation: any = NAVIGATION;
  idUser: any;
  loading: boolean = false;
  actualRouter:any;
  hasSub:any = [];
  changeDetected: any;
  nameUser: any;
  hidebackdrop: any;

  private mediaSubscription: Subscription



  showSubmenu(itemEl: HTMLElement) {
    itemEl.classList.toggle("showMenu");
  }



  constructor(private el: ElementRef, private _authService: AuthService, private _media: MediaService, private _notificationService: NotificationService, private router: Router) {
    this.idUser = this._authService.getUserIdLocal();
    this.nameUser = this._authService.getUserNameLocal();
    this.actualRouter = this._authService.getRouterLink();
    this.mediaSubscription = this._media.subscribeMedia().subscribe(media => {
      this.Media = media;
    });

    console.log(this.navigation)

    setInterval(() => {
      this.getActualRoute();
    }, 1000)
  }

  toggle(i:any){
    this.openAccordion[i] = !this.openAccordion[i];
  }

  getActualRoute(){
    this.actualRouter = this._authService.getRouterLink();
  }

  logout(){
    this._authService.logout();
  }

  checkRoute(navigation:any){
    const foundRouter =  navigation.map((val:any, index:any) => {
      if(navigation[index].EISubMenu.length>0){
        this.hasSub = navigation[index].EISubMenu.map((item: any) => {
          return item.routerLink == this.actualRouter;
        })
      }
      return ( this.hasSub.length > 0 )? this.hasSub: val.routerLink == this.actualRouter;
    });
    if(foundRouter.length == 0){
      if(this.actualRouter != '/profile' && this.actualRouter != '/configuration'){
        this.router.navigate([this.navigation[0].routerLink]);
      }
    }
    this._authService.setPermissionByMenu(true);
  }

  goTo(route:any){
    this.changeDetected = (this._authService.getDetectionChanges() == 'true')? true: false;
    if(this.changeDetected){
      Swal.fire({
        title: 'Estás seguro?',
        text: "Los cambios no se guardarán y no podrás revertir esto.!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, salir!',
        cancelButtonText: 'Cancelar!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.actualRouter = route;
          this.router.navigate([route]);
          this._authService.changedetected(false);
        }
      })
    }else{
      this.actualRouter = encodeURIComponent(route);
      this.router.navigate([route]);
    }
  }

}
