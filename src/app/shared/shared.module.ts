// src/app/shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { DataTableComponent } from './components/data-table/data-table.component';
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';
import { ModalComponent } from './components/modal/modal.component';
import { SkeletonLoaderComponent } from './components/skeleton-loader/skeleton-loader.component';
import { DarkModeToggleComponent } from './components/dark-mode-toggle/dark-mode-toggle.component';
import { StatusLabelPipe } from './pipes/status.pipe';
import { LoadingComponent } from './components/loading/loading.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RouterModule } from '@angular/router';
import { LockComponent } from './components/lock/lock.component';
import { UnauthComponent } from './components/unauth/unauth.component';




@NgModule({
  declarations: [
    DataTableComponent,
    StatusBadgeComponent,
    SearchFilterComponent,
    ModalComponent,
    SkeletonLoaderComponent,
    DarkModeToggleComponent,
    LoadingComponent,
    NotFoundComponent,
    LockComponent,
    UnauthComponent,
    LoadingComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    StatusLabelPipe,
    RouterModule,
  ],
  exports: [
    DataTableComponent,
    StatusBadgeComponent,
    SearchFilterComponent,
    ModalComponent,
    CommonModule,
    FormsModule,
    StatusLabelPipe,
    LoadingComponent,
  ]
})
export class SharedModule { }
