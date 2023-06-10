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
declare let bootstrap :any;

interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget
}

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html'
})
export class InventoryComponent implements OnInit {
  private mediaSubscription: Subscription;
  Media: MediaResponse;
  @ViewChild('actionEditAndDelete', { static: true }) actionEditAndDelete: TemplateRef<any>;
  @ViewChild('actionBorrar', { static: true }) actionBorrar: TemplateRef<any>;
  @ViewChild('seeImage', { static: true }) seeImage: TemplateRef<any>;
  @ViewChild('seeQrCode', { static: true }) seeQrCode: TemplateRef<any>;

  public AngularxQrCode: string = '';

  columns:any
  columnsListByCompany:any;
  data: any = [];
  options: any = Options;
  inventoryForm: FormGroup;
  currentTheme: any;
  submitted: boolean = false;
  hideMsg: boolean = false;
  showUserCard: boolean = false;
  showCardRightBrands: boolean = false;
  ShowMsg: string = '';
  newInventoryModal: any;
  seeImageInfo: any;
  seeQrCodeInfo: any;
  title: any =  '';
  buttonText: any = '';
  editOrNewOption: boolean;
  file : File;
  photoSelected: any;
  idInventario: any;
  productInfoSelected:any;
  qrCodeInfoSelected: any;

  constructor(private _media: MediaService, private titleService: Title, private formBuilder: FormBuilder, private themeService: ThemeService, private http: HttpClient, private _authService: AuthService, private _notificationService: NotificationService) {
    this.titleService.setTitle('Inventario  | Smart Shop');
    this.currentTheme = this.themeService.getThemeSelected();

    this.mediaSubscription = this._media.subscribeMedia().subscribe(media => {
      this.Media = media;
      if(this.Media.IsMobile){
        this.showUserCard = false;
        this.showCardRightBrands = false;
      }
    });
  }

  get f() { return this.inventoryForm.controls; }

  ngOnInit() {
    this.inventoryForm = this.formBuilder.group(
      {
        nombreProducto: ['',Validators.required],
        tamanno: ['',Validators.required],
        marca: ['',Validators.required],
        peso: ['',Validators.required],
        precio: ['',Validators.required],
        cantidadInventario: ['',Validators.required],
        descripcion: ['',Validators.required],
      }
    );

    this.columns = [
      { key: 'nombreProducto', title: (this.Media.IsMobile)? 'Producto': 'Nombre del Producto', width: 100,pinned: false },
      { key: 'marca', title: 'Marca', align: { head: 'center', body: 'center'  }, width: 100, sorting: true },
      { key: 'tamanno', title: 'Tamaño', align: { head: 'center', body: 'center'  }, width: 100, sorting: true },
      { key: 'peso', title: 'Peso', align: { head: 'center', body: 'center'  }, width: 100, sorting: true },
      { key: 'precio', title: 'Precio', align: { head: 'center', body: 'center'  }, width: 100, sorting: true },
      { key: 'cantidadInventario', title:(this.Media.IsMobile)?  'Cantidad': 'Cantidad disponible', align: { head: 'center', body: 'center'  }, width: 100, sorting: true },
      { key: 'verImagen', title: '<div class="blue">Ver Imagen</div>', align: { head: 'center', body:  'center' }, sorting: false, width: 80, cellTemplate: this.seeImage },
      { key: 'verQRcode', title: '<div class="blue">Ver QR</div>', align: { head: 'center', body:  'center' }, sorting: false, width: 80, cellTemplate: this.seeQrCode },
      { key: 'accion', title: '<div class="blue">Acción</div>', align: { head: 'center', body:  'center' }, sorting: false, width: 80, cellTemplate: this.actionEditAndDelete }
    ];

    this.getModalInit();
    this.getAllInventoryList();
  }

  getAllInventoryList(){
    this._authService.getAllInventory().subscribe({
      next: (result: any) => {
        if(result.success) {
          this.data = result.listaInventarios;
        }else{
          this.data = [];
          this.options = {
            emptyDataMessage :result.message
          }
        }
      },
      error: (error: any) => {
        this._notificationService.warning('Información de sistema nº: '+ error.status  , 'Mensaje: ' + error.error.message, 'bg-warning', 'animate__backInUp', 6000);
      }
    });
  }

  createOrEditModalInventory(item:any,title:any, isNew:boolean){
    this.title = title;
    this.buttonText = (isNew)? 'Crear Inventario': 'Editar Inventario';
    this.editOrNewOption = isNew;
    this.hideMsg = false;
    this.idInventario = item._id;
    this.inventoryForm = this.formBuilder.group(
      {
        nombreProducto: [(isNew)? '': item.nombreProducto ,Validators.required],
        marca: [(isNew)? '': item.marca ,Validators.required],
        tamanno: [(isNew)? '': item.tamanno ,Validators.required],
        peso: [(isNew)? '': item.peso ,Validators.required],
        precio: [(isNew)? '': item.precio ,Validators.required],
        cantidadInventario: [(isNew)? '': item.cantidadInventario ,Validators.required],
        descripcion: [(isNew)? '': item.descripcion ,Validators.required],
      }
    );

    if(!this.Media.IsMobile){
      this.showUserCard = true;
      if(this.showUserCard){
        setTimeout(() => {
          this.showCardRightBrands = true;
        }, 510);
      }else{
        this.showUserCard  = false;
        this.showCardRightBrands = false;
      }
    }else{
      this.newInventoryModal.show();
    }
  }

  deleteInventory(item: any){
    Swal.fire({
      title: 'Estas seguro?',
      text: "No serás capaz de revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, elimínelo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this._authService.deleteInventory(item._id).subscribe({
          next: (result: any) => {
            if (result.success) {
              this.swalMessageResponseByservice('Eliminado!',result.message,'success');
              this.getAllInventoryList();
            } else {
              this.swalMessageResponseByservice('Cancelado!',result.message,'error');
             }
          },
          error: (error: any) => {
            this._notificationService.warning('Información de sistema nº: '+ error.status  , 'Mensaje: ' + error.error.message, 'bg-warning', 'animate__backInUp', 6000);
          }
        });
      }
    })
  }

  onSubmit() {
    this.submitted = true;

    if (this.inventoryForm.invalid) {
      return;
    }

    if(this.photoSelected == ''){
      this.getResponseByService(true, 'Seleccione una imagen');
      for (let name in this.inventoryForm.controls) {
        this.inventoryForm.controls[name].setErrors(null);
      }
      return;
    }

    if(!this.photoSelected){
      this.getResponseByService(true, 'Seleccione una imagen')
      return;
    }

    const inventory = {
      id: (this.editOrNewOption)? 0: this.idInventario,
      nombreProducto: this.f.nombreProducto.value,
      marca: this.f.marca.value,
      tamanno: this.f.tamanno.value,
      peso: this.f.peso.value,
      precio: this.f.precio.value,
      cantidadInventario: this.f.cantidadInventario.value,
      descripcion: this.f.descripcion.value,
    }

    this._authService.postCreateOrEditInventory(this.editOrNewOption, inventory, this.file).subscribe({
      next: (result: any) => {
        if (result.success) {
          this.submitted = false;
          this.getResponseByService(false, '');
          this.getAllInventoryList();
          this.close();
          this.hideCard();
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

  goToImage(item:any) {
    this.productInfoSelected = item;
    this.seeImageInfo.show();
  }

  goToQRcode(item:any){
    this.qrCodeInfoSelected = item;
    this.seeQrCodeInfo.show();
  }

  hideCard(){
    this.showUserCard = false;
    this.showCardRightBrands = false;
  }

  close(){
    this.inventoryForm.reset();
    for (let name in this.inventoryForm.controls) {
      this.inventoryForm.controls[name].setErrors(null);
    }
    this.photoSelected = '';
    this.newInventoryModal.hide();
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
    this.newInventoryModal = new bootstrap.Modal((<HTMLInputElement>document.getElementById("newInventoryModal")), {
      keyboard: false
    });

    this.seeImageInfo = new bootstrap.Modal((<HTMLInputElement>document.getElementById("seeImageInfo")), {
      keyboard: false
    });

    this.seeQrCodeInfo = new bootstrap.Modal((<HTMLInputElement>document.getElementById("seeQrCodeInfo")), {
      keyboard: false
    });

    setTimeout(() =>{
      const search_marcas = document.getElementById("search_marcas") as HTMLInputElement;
      search_marcas.setAttribute('placeholder',"Buscar");
    },1);
  }

  processFile(event: any): void {
    if(event.target.files && event.target.files[0]){
      this.file = <File>event.target.files[0];
      if(this.file.type == String('image/png') || this.file.type == String('image/jpg') || this.file.type == String('image/jpeg') ){
        const reader = new FileReader();

        reader.onload = e => this.photoSelected = reader.result;
        reader.readAsDataURL(this.file);
      }else{
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Oops...',
          text: 'Solo se permite formatos JPG, PNG, JPEG',
          confirmButtonText: 'OK',
        })
      }

    }
  }
}
