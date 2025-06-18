import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DashboardCardComponent } from './components/dashboard-card/dashboard-card.component';
import { DashboardLayoutComponent } from './components/dashboard-layout/dashboard-layout.component';
import { DashboardSidebarComponent } from './components/dashboard-sidebar/dashboard-sidebar.component';
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    DashboardCardComponent,
    DashboardLayoutComponent,
    DashboardSidebarComponent,
    DashboardHeaderComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule
  ],
  exports: [
    DashboardCardComponent,
    DashboardLayoutComponent,
    DashboardSidebarComponent,
    DashboardHeaderComponent
  ],
})
export class DashboardModule { }
