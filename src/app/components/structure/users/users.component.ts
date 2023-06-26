import { Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MediaResponse, MediaService } from 'src/app/services/media.service';
import { Options } from 'src/app/common/constants';
import { PermissionsService } from 'src/app/services/permissions.service';
import Swal from 'sweetalert2';
declare const bootstrap :any;


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: [
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
export class UsersComponent implements OnInit {
  private mediaSubscription: Subscription;
  Media: MediaResponse;
  @ViewChild('actionEditAndDelete', { static: true }) actionEditAndDelete: TemplateRef<any>;
  @ViewChild('actionBorrar', { static: true }) actionBorrar: TemplateRef<any>;
  @ViewChild('navRef', { static: true }) navRef: TemplateRef<any>;

  @ViewChild('iconRef', { static: true }) iconRef: TemplateRef<any>;
  @ViewChild('tranlateRef', { static: true }) tranlateRef: TemplateRef<any>;
  @ViewChild('hasSubRef', { static: true }) hasSubRef: TemplateRef<any>;
  @ViewChild('actionEditAndDeleteSub', { static: true }) actionEditAndDeleteSub: TemplateRef<any>;


  columns:any
  navColumns:any;
  data: any = [];
  options: any = Options;
  navigation: any = [];
  navigationData: any = [];
  userForm: FormGroup;
  userNavForm: FormGroup;
  currentTheme: any;
  submitted: boolean = false;
  submittedNav: boolean = false;
  hideMsg: boolean = false;
  showUserCard: boolean = false;
  showUserRightCard: boolean = false;

  showUserNavCard: boolean = false;
  showUserNavRightCard: boolean = false;

  ShowMsg: string = '';
  newUserModal: any;
  navigationModal: any;
  title: any =  '';
  buttonText: any = '';
  editOrNewOption: boolean;
  editOrNewOptionNav: boolean;
  navOptions: any;
  idParental: string = '';
  isSubRoute: boolean = false

  constructor(
    private _media: MediaService,
    private titleService: Title,
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
    private _authService: AuthService,
    private _notificationService: NotificationService,
    private _permissionService: PermissionsService,
  ) {
    this.titleService.setTitle('Lista de Usuarios  | Smart Shop');
    this.currentTheme = this.themeService.getThemeSelected();

    this.mediaSubscription = this._media.subscribeMedia().subscribe(media => {
      this.Media = media;
      if(this.Media.IsMobile){
        this.showUserCard = false;
        this.showUserRightCard = false;
      }
    });
  }

  get f() { return this.userForm.controls; }
  get j() { return this.userNavForm.controls; }

  ngOnInit() {
    this.userForm = this.formBuilder.group(
      {
        idUser: ['0',Validators.required],
        username: ['',Validators.required],
        email: ['',Validators.required],
        userRol: ['',Validators.required],
        password: ['',Validators.required],
        theme: ['',Validators.required]

      }
    );

    this.userNavForm  = this.formBuilder.group(
      {
        Id: ['0', Validators.required],
        routerLink: ['', Validators.required],
        iconClass: ['', Validators.required],
        userRol: ['', Validators.required],
        translate: ['', Validators.required],
        hasPermission: [true, Validators.required],
        showInToolbar: [true, Validators.required],
        showInSideNav: [true, Validators.required],
        isNewRoute: [true, Validators.required]
      }
    );

    this.columns = [
      { key: 'username', title: 'Nombre', width: 100,pinned: false, sorting: true },
      { key: 'email', title: 'Correo', align: { head: 'center', body: 'center' }, width: 100, sorting: true },
      { key: 'userRol', title: 'Rol de usuario', align: { head: 'center', body: 'center' }, width: 100, sorting: true },
      { key: 'theme', title: 'Color del Tema', align: { head: 'center', body: 'center' }, width: 100, sorting: true },
      { key: 'createdAt', title: 'Fecha Creación', align: { head: 'center', body: 'center' }, width: 100, sorting: true },
      { key: 'updatedAt', title: 'Fecha actualización', align: { head: 'center', body: 'center' }, width: 100, sorting: true },
      { key: 'navRef', title: '<div class="blue">Navegación</div>', align: { head: 'center', body: 'center' }, sorting: false, width: 80, cellTemplate: this.navRef },
      { key: 'accion', title: '<div class="blue">Acción</div>', align: { head: 'center', body:  'center' }, sorting: false, width: 80, cellTemplate: this.actionEditAndDelete }
    ];

    this.navColumns = [
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
    this.getUserByCatalog();
    this.getAllNavigationInfo();
  }

  getUserByCatalog() {
    this.data = [];
    this._authService.getUserAll().subscribe({
      next: (result: any) => {
        if(result.success) {
          this.data = result.listaUsuarios;
        }else{
          this.options.emptyDataMessage = result.message;
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

  getAllNavigationInfo() { 
    this.navigation = [];
    this._permissionService.getAllNavigation().subscribe({
      next: (result: any) => {
        if (result.success) {
          this.navigation = result.listaNavegación;
        }
      },
      error: (error: any) => {
        this._notificationService.warning('Información de sistema nº: ' + error.status, 'Mensaje: ' + error.error.message, 'bg-warning', 'animate__backInUp', 6000);
      }
    });
  }

  createOrEditModalUser(item:any,title:any, isNewBrand:boolean){
    this.title = title;
    this.buttonText = (isNewBrand)? 'Crear Usuario': 'Editar Usuario';
    this.editOrNewOption = isNewBrand;
    this.hideMsg = false;
    this.userForm = this.formBuilder.group(
      {
        idUser : [(isNewBrand)? '0': item._id ,Validators.required],
        username : [(isNewBrand)? '': item.username, Validators.required],
        email: [(isNewBrand)? '': item.email, Validators.required],
        userRol: [(isNewBrand)? '': item.userRol, Validators.required],
        password: [(isNewBrand)? '': item.password, Validators.required],
        theme: [(isNewBrand)? '': item.theme, Validators.required]
      }
    );

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



  deleteUser(item: any){
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
          _id: item._id
        }
        this._authService.deleteUser(user).subscribe({
          next: (result: any) => {
            if (result.success) {
              this.swalMessageResponseByservice('Eliminado!',result.message,'success');
              this.getUserByCatalog();
              this._notificationService.success('Información de sistema'  , result.message, 'bg-success', 'animate__backInUp', 6000);
            } else {
              this.swalMessageResponseByservice('Cancelado!',result.message ,'error');
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
    })
  }

  onSubmit() {
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    }

    const userSelect = {
      _id: this.editOrNewOption ? 0: this.f.idUser.value,
      username: this.f.username.value,
      email: this.f.email.value,
      userRol: this.f.userRol.value,
      password: this.f.password.value,
      theme: this.f.theme.value,
      isNew: this.editOrNewOption,
      lang: 'es'
    }
    this._authService.postCreateOrEditUser(this.editOrNewOption, userSelect).subscribe({
      next: (result: any) => {
        if (result.success) {
          this.submitted = false;
          this.getResponseByService(false, '');
          this.getUserByCatalog();
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

    this.navigationModal = new bootstrap.Modal((<HTMLInputElement>document.getElementById("navigationModal")), {
      keyboard: false
    });

    setTimeout(() =>{
      const search_marcas = document.getElementById("search_marcas") as HTMLInputElement;
      if(search_marcas){
       search_marcas.setAttribute('placeholder',"Buscar"); 
      }
      
    },1);
  }


//navigation start
  
  configNavigation(item: any, isNew: boolean) {
    if (isNew) {
      Swal.fire({
        title: 'Estas seguro?',
        text: "Deseas asignar una navegacion a este usuario?!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Si, agregar!'
      }).then((res: any) => {
        if (res.isConfirmed) {
          let user = {
            _id: item._id,
            navigation: this.navigation
          }
          this._authService.addUserNavigation(user).subscribe({
            next: (result: any) => {
              if (result.success) {
                this.getUserByCatalog();
                this._notificationService.success('Información de sistema', result.message, 'bg-success', 'animate__backInUp', 6000);
              } else {
                this.swalMessageResponseByservice('Cancelado!', result.message, 'error');
              }
            },
            error: (error: any) => {
              this._notificationService.warning('Información de sistema nº: ' + error.status, 'Mensaje: ' + error.error.message, 'bg-warning', 'animate__backInUp', 6000);
            }
          });
        }
      })
    } else {
      this.idParental = item._id;
      this.navigationData = item.navigation;
      this.navigationModal.show();
    }
  }

  createOrEditModalNavigationUser(item: any, title: any, isNewBrand: boolean, isSubRoute: boolean) {
    this.title = title;
    this.buttonText = (isNewBrand) ? 'Crear Ruta' : 'Editar Ruta';
    this.editOrNewOptionNav = isNewBrand;
    this.hideMsg = false;
    this.isSubRoute = isSubRoute;

    if (!isSubRoute) {
      this.userNavForm = this.formBuilder.group(
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
      this.userNavForm = this.formBuilder.group(
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

    if (!this.Media.IsMobile) {
      this.showUserNavCard = true;
      if (this.showUserNavCard) {
        setTimeout(() => {
          this.showUserNavRightCard = true;
        }, 510);
      } else {
        this.showUserNavCard = false;
        this.showUserNavRightCard = false;
      }
    }
  }

  onSubmitNavigation() { 
    this.submittedNav = true;
    if (this.userNavForm.invalid) {
      return;
    }

    const userSelect = {
      Id: this.j._id.value,
      routerLink: this.j.routerLink.value,
      iconClass: this.j.iconClass.value,
      translate: this.j.translate.value.toUpperCase(),
      hasPermission: this.j.hasPermission.value,
      showInToolbar: this.j.showInToolbar.value,
      showInSideNav: this.j.showInSideNav.value,
      isNewRoute: this.j.isNewRoute.value,
      isSubRoute: this.isSubRoute,
      idParental: this.idParental
    }


    this._permissionService.postCreateOrEditNavigation(this.editOrNewOptionNav, userSelect, this.isSubRoute).subscribe({
      next: (result: any) => {
        if (result.success) {
          this.submitted = false;
          this.getUserByCatalog();
          this.getResponseByService(false, '');
          this.close();
          this._notificationService.success('Información de sistema', result.message, 'bg-success', 'animate__backInUp', 6000);
        } else {
          this.getResponseByService(true, result.message);
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

  hideCardNav() {
    this.showUserNavCard = false;
    this.showUserNavRightCard = false;
  }


}
