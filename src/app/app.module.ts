import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { OnlineStatusModule } from 'ngx-online-status';
import { NgbdSortableHeader } from '../app/common/directives/sortable.directive';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { JwtModule } from "@auth0/angular-jwt";
import { NgxDatatableModule } from '@tusharghoshbd/ngx-datatable';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { QRCodeModule } from 'angularx-qrcode';

import { TokenInterceptor } from './services/auth/token.interceptor'
import { ThemeService } from './services/theme.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';
import { HeaderLayoutComponent } from './core/layouts/header-layout/header-layout.component';
import { AdminLayoutComponent } from './core/layouts/admin-layout/admin-layout.component';


import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ResetComponent } from './components/reset/reset.component';
import { AdministratorComponent } from './components/administrator/administrator.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StructureComponent } from './components/structure/structure.component';
import { NotificationComponent } from './components/notification/notification.component';
import { NotificationService } from './services/notification.service';
import { PermissionsComponent } from './components/structure/permissions/permissions.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ForgotComponent } from './components/forgot/forgot.component';
import { TranslationService } from './services/translate.service';
import { ChartsModule } from 'ng2-charts';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { InventoryComponent } from './components/structure/inventory/inventory.component';
import { ScannerComponent } from './components/scanner/scanner.component';
import { UsersComponent } from './components/structure/users/users.component';
import { EmployeesComponent } from './components/structure/employees/employees.component';
import { CarouselComponent } from './components/layouts/carousel/carousel.component';
import { SportsComponent } from './core/main/sports/sports.component';
import { ESportsComponent } from './core/main/e-sports/e-sports.component';
import { LiveWagerComponent } from './core/main/live-wager/live-wager.component';
import { CasinoComponent } from './core/main/casino/casino.component';
import { PropsBuilderComponent } from './core/main/props-builder/props-builder.component';
import { RacebookComponent } from './core/main/racebook/racebook.component';
import { ContestComponent } from './core/main/contest/contest.component';
import { CockfightComponent } from './core/main/cockfight/cockfight.component';
import { VirtualSportsComponent } from './core/main/virtual-sports/virtual-sports.component';
import { PokerComponent } from './core/main/poker/poker.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { PermissionsService } from './services/permissions.service';
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function tokenGetter() {
  return sessionStorage.getItem("token");
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MainLayoutComponent,
    HeaderLayoutComponent,
    LoginComponent,
    NotFoundComponent,
    ResetComponent,
    AdministratorComponent,
    ProfileComponent,
    SideNavComponent,
    ToolbarComponent,
    StructureComponent,
    AdminLayoutComponent,
    NotificationComponent,
    PermissionsComponent,
    ForgotComponent,
    NgbdSortableHeader,
    ConfigurationComponent,
    InventoryComponent,
    ScannerComponent,
    UsersComponent,
    EmployeesComponent,
    CarouselComponent,
    SportsComponent,
    ESportsComponent,
    LiveWagerComponent,
    CasinoComponent,
    PropsBuilderComponent,
    RacebookComponent,
    ContestComponent,
    CockfightComponent,
    VirtualSportsComponent,
    PokerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxDatatableModule,
    NgHttpLoaderModule.forRoot(),
    TranslateModule.forRoot({
      defaultLanguage: localStorage.getItem('lang')!,
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:3001", "foo.com", "bar.com"],
        disallowedRoutes: ["http://example.com/examplebadroute/"],
      },
    }),
    BrowserAnimationsModule,
    OnlineStatusModule,
    NgbModule,
    ChartsModule,
    ZXingScannerModule,
    QRCodeModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],

  providers: [
    ThemeService,
    NotificationService,
    PermissionsService,
    TranslationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
