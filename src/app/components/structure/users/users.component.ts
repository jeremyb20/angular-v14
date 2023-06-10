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
import { Options } from 'src/app/common/constants';
declare const bootstrap :any;


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  private mediaSubscription: Subscription;
  Media: MediaResponse;
  @ViewChild('actionEditAndDelete', { static: true }) actionEditAndDelete: TemplateRef<any>;
  @ViewChild('actionBorrar', { static: true }) actionBorrar: TemplateRef<any>;

  columns:any
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
  title: any =  '';
  buttonText: any = '';
  editOrNewOption: boolean;

  constructor(private _media: MediaService, private titleService: Title, private formBuilder: FormBuilder, private themeService: ThemeService, private http: HttpClient, private _authService: AuthService, private _notificationService: NotificationService) {
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
        idUser: ['0',Validators.required],
        username: ['',Validators.required],
        email: ['',Validators.required],
        userRol: ['',Validators.required],
        password: ['',Validators.required],
        theme: ['',Validators.required]

      }
    );

    this.columns = [
      { key: 'username', title: 'Nombre', width: 100,pinned: false, sorting: true },
      { key: 'email', title: 'Correo', align: { head: 'center', body: 'center' }, width: 100, sorting: true },
      { key: 'userRol', title: 'Rol de usuario', align: { head: 'center', body: 'center' }, width: 100, sorting: true },
      { key: 'theme', title: 'Color del Tema', align: { head: 'center', body: 'center' }, width: 100, sorting: true },
      { key: 'createdAt', title: 'Fecha Creación', align: { head: 'center', body: 'center' }, width: 100, sorting: true },
      { key: 'updatedAt', title: 'Fecha actualización', align: { head: 'center', body: 'center' }, width: 100, sorting: true },
      { key: 'accion', title: '<div class="blue">Acción</div>', align: { head: 'center', body:  'center' }, sorting: false, width: 80, cellTemplate: this.actionEditAndDelete }
    ];

    this.getModalInit();
  }

  getUserByCatalog(){
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

    setTimeout(() =>{
      const search_marcas = document.getElementById("search_marcas") as HTMLInputElement;
      if(search_marcas){
       search_marcas.setAttribute('placeholder',"Buscar"); 
      }
      
    },1);
  }
}
