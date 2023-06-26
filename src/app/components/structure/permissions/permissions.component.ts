import { Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { MediaResponse, MediaService } from 'src/app/services/media.service';
import { NAVIGATION, Options } from 'src/app/common/constants';
import { PermissionsService } from 'src/app/services/permissions.service';
declare const bootstrap :any;


@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styles:[
    `
    .switchToggle input[type=checkbox]{height: 0; width: 0; visibility: hidden; position: absolute; }
    .switchToggle label {cursor: pointer; text-indent: -9999px; width: 70px; max-width: 70px; height: 30px; background: #d1d1d1; display: block; border-radius: 100px; position: relative; }
    .switchToggle label:after {content: ''; position: absolute; top: 2px; left: 2px; width: 26px; height: 26px; background: #fff; border-radius: 90px; transition: 0.3s; }
    .switchToggle input:checked + label, .switchToggle input:checked + input + label  {background: #3e98d3; }
    .switchToggle input + label:before, .switchToggle input + input + label:before {content: 'No'; position: absolute; top: 5px; left: 35px; width: 26px; height: 26px; border-radius: 90px; transition: 0.3s; text-indent: 0; color: #fff; }
    .switchToggle input:checked + label:before, .switchToggle input:checked + input + label:before {content: 'Si'; position: absolute; top: 5px; left: 10px; width: 26px; height: 26px; border-radius: 90px; transition: 0.3s; text-indent: 0; color: #fff; }
    .switchToggle input:checked + label:after, .switchToggle input:checked + input + label:after {left: calc(100% - 2px); transform: translateX(-100%); }
    .switchToggle label:active:after {width: 60px; } 
    .toggle-switchArea { margin: 10px 0 10px 0; }

    #offcanvasWithBackdrop{
      z-index: 10000;
      position: fixed;
      background: #fff;
    }

    `
  ]
})

export class PermissionsComponent implements OnInit {
  private mediaSubscription: Subscription;
  Media: MediaResponse;
  @ViewChild('actionEditAndDelete', { static: true }) actionEditAndDelete: TemplateRef<any>;
  @ViewChild('actionEditAndDeleteSub', { static: true }) actionEditAndDeleteSub: TemplateRef<any>;
  @ViewChild('actionBorrar', { static: true }) actionBorrar: TemplateRef<any>;
  @ViewChild('iconRef', { static: true }) iconRef: TemplateRef<any>;
  @ViewChild('tranlateRef', { static: true }) tranlateRef: TemplateRef<any>;
  @ViewChild('hasSubRef', { static: true }) hasSubRef: TemplateRef<any>;

  columns: any;
  subcolumns: any;
  columnsListByCompany:any;
  data: any = [];
  options: any = Options;

  userForm: FormGroup;
  currentTheme: any;
  submitted: boolean = false;
  hideMsg: boolean = false;
  showUserCard: boolean = false;
  showUserRightCard: boolean = false;
  ShowMsg: string = '';
  newUserModal: any;
  subMenudata: any;
  title: any =  '';
  buttonText: any = '';
  editOrNewOption: boolean;
  navigation: any = NAVIGATION;
  isSubRoute: boolean;
  idParental: string = '';
  subRouteData: any = [];

  constructor(private _media: MediaService, private titleService: Title, private formBuilder: FormBuilder, private themeService: ThemeService, private http: HttpClient, private _permissionService: PermissionsService, private _notificationService: NotificationService) {
    this.titleService.setTitle('Lista de Usuarios  | Smart Shop');
    this.currentTheme = this.themeService.getThemeSelected();
    this.getUserByCatalog();

    this.mediaSubscription = this._media.subscribeMedia().subscribe(media => {
      this.Media = media;
      if(this.Media.IsMobile){
        this.showUserCard = false;
        this.showUserRightCard = false;
      }
    });
  }

  get f() { return this.userForm.controls; }

  ngOnInit() {
    this.userForm = this.formBuilder.group(
      {
        Id: ['0',Validators.required],
        routerLink: ['',Validators.required],
        iconClass: ['',Validators.required],
        userRol: ['',Validators.required],
        translate: ['',Validators.required],
        hasPermission: [true, Validators.required],
        showInToolbar: [true, Validators.required],
        showInSideNav: [true, Validators.required],
        isNewRoute: [true, Validators.required]
      }
    );

    this.columns = [
      { key: '_id', title: 'Id', width: 200,pinned: false, sorting: true },
      { key: 'routerLink', title: 'Router Link', align: { head: 'center', body: 'center' }, width: 100, sorting: true },
      { key: 'iconClass', title: 'Icon Class', align: { head: 'center', body: 'center' }, width: 100, sorting: true, cellTemplate: this.iconRef },
      { key: 'translate', title: 'Translate', align: { head: 'center', body: 'center' }, width: 200, sorting: true, cellTemplate: this.tranlateRef },
      { key: 'hasPermission', title: 'Has Permissions', align: { head: 'center', body: 'center' }, width: 100, sorting: true },
      { key: 'showInToolbar', title: 'Show Toolbal', align: { head: 'center', body: 'center' }, width: 100, sorting: true },
      { key: 'showInSideNav', title: 'Show Sidenav', align: { head: 'center', body: 'center' }, width: 100, sorting: true },
      { key: 'isNewRoute', title: 'Is New', align: { head: 'center', body: 'center' }, width: 100, sorting: true },
      { key: 'EISubMenu', title: 'Has Sub Route', align: { head: 'center', body: 'center' }, width: 100, sorting: true, cellTemplate: this.hasSubRef },
      { key: 'accion', title: '<div class="blue">Acción</div>', align: { head: 'center', body:  'center' }, sorting: false, width: 80, cellTemplate: this.actionEditAndDelete }
    ];

    this.subcolumns = [
      { key: '_id', title: 'Id', width: 200, pinned: false, sorting: true },
      { key: 'routerLink', title: 'Router Link', align: { head: 'center', body: 'center' }, width: 100, sorting: true },
      { key: 'iconClass', title: 'Icon Class', align: { head: 'center', body: 'center' }, width: 100, sorting: true, cellTemplate: this.iconRef },
      { key: 'translate', title: 'Translate', align: { head: 'center', body: 'center' }, width: 200, sorting: true, cellTemplate: this.tranlateRef },
      { key: 'hasPermission', title: 'Has Permissions', align: { head: 'center', body: 'center' }, width: 100, sorting: true },
      { key: 'showInToolbar', title: 'Show Toolbal', align: { head: 'center', body: 'center' }, width: 100, sorting: true },
      { key: 'showInSideNav', title: 'Show Sidenav', align: { head: 'center', body: 'center' }, width: 100, sorting: true },
      { key: 'isNewRoute', title: 'Is New', align: { head: 'center', body: 'center' }, width: 100, sorting: true },
      { key: 'accion', title: '<div class="blue">Acción</div>', align: { head: 'center', body: 'center' }, sorting: false, width: 80, cellTemplate: this.actionEditAndDeleteSub }
    ]

    this.getModalInit();
  }

  getUserByCatalog() {
    this.data = [];
    this._permissionService.getAllNavigation().subscribe({
      next: (result: any) => {
        if (result.success) {
          this.data = result.listaNavegación;
        }else{
          this.options.emptyDataMessage = result.message;
        }
      },
      error: (error: any) => {
        this._notificationService.warning('Información de sistema nº: '+ error.status  , 'Mensaje: ' + error.error.message, 'bg-warning', 'animate__backInUp', 6000);
      }
    });
  }

  createOrEditModalUser(item:any,title:any, isNewBrand:boolean, isSubRoute: boolean){
    this.title = title;
    this.buttonText = (isNewBrand) ? 'Crear Navegación' : 'Editar Navegación';
    this.editOrNewOption = isNewBrand;
    this.hideMsg = false;
    this.isSubRoute = isSubRoute;

    if (!isSubRoute) {
      this.userForm = this.formBuilder.group(
        {
          _id: [(isNewBrand) ? '0' : item._id, Validators.required],
          routerLink: [(isNewBrand) ? '' : item.routerLink, Validators.required],
          iconClass: [(isNewBrand) ? '' : item.iconClass, Validators.required],
          translate: [(isNewBrand) ? '' : item.translate, Validators.required],
          hasPermission: [(isNewBrand) ? true : item.hasPermission, Validators.required],
          showInToolbar: [(isNewBrand) ? true : item.showInToolbar, Validators.required],
          showInSideNav: [(isNewBrand) ? true : item.showInSideNav, Validators.required],
          isNewRoute: [(isNewBrand) ? true : item.isNewRoute, Validators.required],
        }
      );
    } else {
      this.userForm = this.formBuilder.group(
        {
          _id: [item._id, Validators.required],
          routerLink: [(!isNewBrand && isSubRoute) ? '' : item.routerLink, Validators.required],
          iconClass: [(!isNewBrand && isSubRoute) ? '' : item.iconClass, Validators.required],
          translate: [(!isNewBrand && isSubRoute) ? '' : item.translate, Validators.required],
          hasPermission: [(!isNewBrand && isSubRoute) ? true : item.hasPermission, Validators.required],
          showInToolbar: [(!isNewBrand && isSubRoute) ? true : item.showInToolbar, Validators.required],
          showInSideNav: [(!isNewBrand && isSubRoute) ? true : item.showInSideNav, Validators.required],
          isNewRoute: [(!isNewBrand && isSubRoute) ? true : item.isNewRoute, Validators.required],
        }
      );
    }

    if(!this.Media.IsMobile){
      this.showUserCard = true;
      if(this.showUserCard){
        setTimeout(() => {
          this.showUserRightCard = true;
        }, 510);
      }else{
        this.showUserCard  = false;
        this.showUserRightCard = false;
      }
    }else{
      this.newUserModal.show();
    }
  }

  watchSubRoutes(list:any) {
    this.idParental = list._id;
    this.subRouteData = list.EISubMenu;
    this.subMenudata.show();
  }


  onSubmit() {
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    }
    
    const userSelect = {
      Id: this.editOrNewOption ? 0 : this.f._id.value,
      routerLink: this.f.routerLink.value,
      iconClass: this.f.iconClass.value,
      translate: this.f.translate.value.toUpperCase(),
      hasPermission: this.f.hasPermission.value,
      showInToolbar: this.f.showInToolbar.value,
      showInSideNav: this.f.showInSideNav.value,
      isNewRoute: this.f.isNewRoute.value,
      EISubMenu: [],
      isSubRoute: this.isSubRoute
    }

    
    this._permissionService.postCreateOrEditNavigation(this.editOrNewOption, userSelect, this.isSubRoute).subscribe({
      next: (result: any) => {
        if (result.success) {
          this.submitted = false;
          this.getUserByCatalog();
          this.getResponseByService(false, '');
          this.close();
          this._notificationService.success('Información de sistema'  , result.message, 'bg-success', 'animate__backInUp', 6000);
        } else {
          this.getResponseByService(true, result.message);
        }
      },
      error: (error: any) => {
        this._notificationService.warning('Información de sistema nº: '+ error.status  , 'Mensaje: ' + error.error.message, 'bg-warning', 'animate__backInUp', 6000);
      },
      complete: () => {
        console.log('complete');
      }
    });
  }

  deleteRoute(item: any, isSubRoute:boolean) {
    Swal.fire({
      title: 'Estas seguro?',
      text: "No serás capaz de revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, elimínelo!'
    }).then((res: any) => {
      if (res.isConfirmed) {
        let user = {
          idParental: this.idParental,
          isSubRoute: isSubRoute,
          _id: item._id
        }
        this._permissionService.deleteNavigation(user).subscribe({
          next: (result: any) => {
            if (result.success) {
              this._notificationService.success('Información de sistema', result.message, 'bg-success', 'animate__backInUp', 6000);
              this.getUserByCatalog();
              this.subMenudata.hide();
            } else {
              this.swalMessageResponseByservice('Cancelado!', result.message, 'error');
            }
          },
          error: (error: any) => {
            this._notificationService.warning('Información de sistema nº: ' + error.status, 'Mensaje: ' + error.error.message, 'bg-warning', 'animate__backInUp', 6000);
          },
          complete: () => {
            console.log('complete');
          }
        });
      }
    })
  }

  hideCard(){
    this.showUserCard = false;
    this.showUserRightCard = false;
  }

  close(){
    this.userForm.reset();
    for (let name in this.userForm.controls) {
      this.userForm.controls[name].setErrors(null);
    }
    this.newUserModal.hide();
    this.hideCard();
  }

  getResponseByService(hideMsg:any, responseMsg:any){
    this.hideMsg = hideMsg;
    this.ShowMsg = responseMsg;
    if(this.hideMsg){
      setTimeout(() => { this.hideMsg = false }, 6000);
    }
  }

  swalMessageResponseByservice(title:any, message:any, status:any){
    Swal.fire(title,message,status);
  }

  getModalInit(){
    this.newUserModal = new bootstrap.Modal((<HTMLInputElement>document.getElementById("newUserModal")), {
      keyboard: false
    });

    this.subMenudata = new bootstrap.Modal((<HTMLInputElement>document.getElementById("subMenudata")), {
      keyboard: false
    });

    setTimeout(() =>{
      const search_marcas = document.getElementById("search_marcas") as HTMLInputElement;
      if(search_marcas){
       search_marcas.setAttribute('placeholder',"Buscar"); 
      }
      
    },1);
  }
}
