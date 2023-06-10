import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './common/guards/admin/admin-guard.guard';
import { AuthGuard } from './common/guards/auth/auth-guard.guard';
import { AdministratorComponent } from './components/administrator/administrator.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ForgotComponent } from './components/forgot/forgot.component';
import { InventoryComponent } from './components/structure/inventory/inventory.component';

import { AdminLayoutComponent } from './core/layouts/admin-layout/admin-layout.component';
import { HeaderLayoutComponent } from './core/layouts/header-layout/header-layout.component';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';

import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PermissionsComponent } from './components/permissions/permissions.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ResetComponent } from './components/reset/reset.component';
import { StructureComponent } from './components/structure/structure.component';
import { ScannerComponent } from './components/scanner/scanner.component';
import { UsersComponent } from './components/structure/users/users.component';
import { EmployeesComponent } from './components/structure/employees/employees.component';
import { ESportsComponent } from './core/main/e-sports/e-sports.component';
import { SportsComponent } from './core/main/sports/sports.component';
import { LiveWagerComponent } from './core/main/live-wager/live-wager.component';
import { CasinoComponent } from './core/main/casino/casino.component';
import { PropsBuilderComponent } from './core/main/props-builder/props-builder.component';
import { RacebookComponent } from './core/main/racebook/racebook.component';
import { ContestComponent } from './core/main/contest/contest.component';
import { CockfightComponent } from './core/main/cockfight/cockfight.component';
import { VirtualSportsComponent } from './core/main/virtual-sports/virtual-sports.component';
import { PokerComponent } from './core/main/poker/poker.component';

const routes: Routes = [
  {
    path:'',
    component: HeaderLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'reset', component: ResetComponent },
      { path: 'forgot', component: ForgotComponent }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: 'admin', pathMatch: 'full' },
      { path: 'admin', component: AdministratorComponent},
      { path: 'permissions', component: PermissionsComponent},
      { path: 'configuration-admin', component: ConfigurationComponent},
      { path: 'profile-admin', component: ProfileComponent },
      { path: 'structures', component: StructureComponent,
        children: [
          { path: 'inventory', component: InventoryComponent },
          { path: 'users', component: UsersComponent },
          { path: 'employees', component: EmployeesComponent },
          { path: 'permissions', component: PermissionsComponent},
        ]
      },
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'profile', component: ProfileComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'scanner', component: ScannerComponent },
      { path: 'configuration', component: ConfigurationComponent},

      { path: 'sports', component: SportsComponent},
      { path: 'e-sports', component: ESportsComponent},
      { path: 'live-wager', component: LiveWagerComponent},
      { path: 'casino', component: CasinoComponent},
      { path: 'props-builder', component: PropsBuilderComponent},
      { path: 'racebook', component: RacebookComponent},
      { path: 'contest', component: ContestComponent},
      { path: 'cockfight', component: CockfightComponent},
      { path: 'virtual-sports', component: VirtualSportsComponent},
      { path: 'poker', component: PokerComponent},
    ]
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404',  pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
