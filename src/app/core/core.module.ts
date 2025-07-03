import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../core/layout/navbar/navbar.component';

import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './layout/footer/footer.component';
import { HomeComponent } from './layout/home/home.component';
import {CoreRoutingModule} from './core-routing-module';


@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
     MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    RouterModule,
    CoreRoutingModule


  ],
  exports: [
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    NavbarComponent,
    FooterComponent,
    HomeComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }

  ]


})
export class CoreModule { }
