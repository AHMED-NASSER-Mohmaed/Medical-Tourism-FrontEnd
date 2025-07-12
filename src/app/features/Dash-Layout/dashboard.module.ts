import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { RouterModule } from '@angular/router';
import { DashboardCardComponent } from './dashboard-card/dashboard-card.component';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { DashboardSidebarComponent } from './dashboard-sidebar/dashboard-sidebar.component';
import { DashboardHeaderComponent } from './dashboard-header/dashboard-header.component';



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
