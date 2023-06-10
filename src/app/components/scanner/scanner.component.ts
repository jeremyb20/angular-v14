import { Component, OnInit } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import Swal from 'sweetalert2';
declare const bootstrap :any;

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
})
export class ScannerComponent implements OnInit {

  availableDevices: MediaDeviceInfo[];
  currentDevice: any = MediaDeviceInfo;

  formatsEnabled: BarcodeFormat[] = [
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX,
    BarcodeFormat.EAN_13,
    BarcodeFormat.QR_CODE,
  ];

  hasDevices: boolean;
  hasPermission: boolean;

  qrResultString: any;

  torchEnabled = false;
  torchAvailable$ = new BehaviorSubject<boolean>(false);
  tryHarder = false;
  data: any = [];
  productInfoSelected:any;
  seeImageInfo: any;


  constructor(private _authService: AuthService, private _notificationService: NotificationService) { }

  ngOnInit() {
    this.getModalInit();
  }

  clearResult(): void {
    this.qrResultString = null;
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
  }

  onCodeResult(resultString: string) {
    this.qrResultString = resultString;
    this._authService.getProducInfo(this.qrResultString).subscribe({
      next: (result: any) => {
        if(result.success) {
          this.productInfoSelected = result.productInfo;
          setTimeout(() =>{
            this.seeImageInfo.show();
          },100);
        }else{
          this.swalMessageResponseByservice('Lo sentimos!',result.message,'error');
          this.productInfoSelected = [];
        }
      },
      error: (error: any) => {
        this._notificationService.warning('Información de sistema nº: '+ error.status  , error.error.message, 'bg-warning', 'animate__backInUp', 6000);

      }
    });
  }

  onDeviceSelectChange(selected: string) {
    const device = this.availableDevices.find(x => x.deviceId === selected);
    this.currentDevice = device || null;
  }

  openFormatsDialog() {
    const data = {
      formatsEnabled: this.formatsEnabled,
    };

    debugger;

    // this._dialog
    //   .open(FormatsDialogComponent, { data })
    //   .afterClosed()
    //   .subscribe(x => { if (x) { this.formatsEnabled = x; } });
  }

  onHasPermission(has: boolean) {
    this.hasPermission = has;
  }

  openInfoDialog() {
    const data = {
      hasDevices: this.hasDevices,
      hasPermission: this.hasPermission,
    };

    debugger;

    // this._dialog.open(AppInfoDialogComponent, { data });
  }

  onTorchCompatible(isCompatible: boolean): void {
    this.torchAvailable$.next(isCompatible || false);
  }

  toggleTorch(): void {
    this.torchEnabled = !this.torchEnabled;
  }

  toggleTryHarder(): void {
    this.tryHarder = !this.tryHarder;
  }

  swalMessageResponseByservice(title:any, message:any, status:any){
    Swal.fire(title,message,status);
  }

  getModalInit(){
    this.seeImageInfo = new bootstrap.Modal((<HTMLInputElement>document.getElementById("seeImageInfo")), {
      keyboard: false
    });
  }

}
