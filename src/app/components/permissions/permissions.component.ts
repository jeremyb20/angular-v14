import { Component, QueryList, ViewChildren } from '@angular/core';
import { Observable} from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { Country } from 'src/app/common/constants';
import { NgbdSortableHeader } from '../../common/directives/sortable.directive'
import { ThemeService } from 'src/app/services/theme.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NotificationService } from 'src/app/services/notification.service';


@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  providers: [ DecimalPipe]
})

export class PermissionsComponent {
  countries$: Observable<Country[]>;
  total$: Observable<number>;
  getCountries: any;
  currentTheme: any;
  data: any;
  filteredData: any;
  query: string;
  navigation: any;
  isExpanded: boolean = true;

  constructor( private themeService: ThemeService, private http: HttpClient, private _authService: AuthService, private _notificationService: NotificationService) {
    this.currentTheme = this.themeService.getThemeSelected();
     this.getAllUsers();
   }

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;


  getAllUsers() {
    this._authService.getAllUsers().subscribe((data:any) => {
    
       if(data) {
         this.data = data;
         console.log(this.data);
       }
     },
     error => {
       this._notificationService.warning('Error de conexión: Status nº: '+ error.status , 'Lo sentimos, error de conexión: ' + error.statusText, 'bg-warning', 'animate__backInUp', 6000);
     });
 }

  getRolesByIdUser() {
    this._authService.getRolesById(4)
    .subscribe(data => {
      console.log(data);
    },
    error => {
       
    });
  }

  userSelected(item: any){
    console.log(item);
  }

  filterData(query:any): any[] {
    if (!query) {
      this.filteredData = this.data;
    }
    
    if(this.filteredData != undefined){
        this.filteredData = this.filteredData.filter((obj:any) => {
            if (!query) {
                return obj;
            }
            return obj.NombreUsuario.toLowerCase().indexOf(query.toLowerCase()) !== -1;
        });
    }
    return this.filteredData;
  }

  sortDir = 1;//1= 'ASE' -1= DSC

  onSortClick(event:any, sorter: string) {
    let target = event.currentTarget,
      classList = target.classList;

    if (classList.contains('fa-chevron-up')) {
      classList.remove('fa-chevron-up');
      classList.add('fa-chevron-down');
      this.sortDir=-1;
    } else {
      classList.add('fa-chevron-up');
      classList.remove('fa-chevron-down');
      this.sortDir=1;
    }
    this.sortArr(sorter);
  }

  sortArr(colName:any){
    if(this.filteredData){
      if(colName){
        this.filteredData.sort((a:any, b:any) => {
          a = a[colName].toLowerCase();
          b = b[colName].toLowerCase();
          return a.localeCompare(b) * this.sortDir;
        });
      }
      
    }
  }

}
