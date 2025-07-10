
import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { HttpClient } from '@angular/common/http';
import {  FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faShieldAlt, faUsersCog, faUserInjured, faHospital,
  faHotel, faCar, faListAlt, faEdit, faHeadset,
  faChevronLeft, faChevronRight, faEye, faCheck,
  faTimes, faSearch, faUser, faUserCheck, faUserClock,
  faArrowUp, faArrowDown,
  faUserCircle
} from '@fortawesome/free-solid-svg-icons';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

import { FormsModule } from '@angular/forms';




export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardModule } from './dashboard/dashboard.module';
import { SharedModule } from './shared/shared.module';
import { SuperAdminModule } from './features/super-admin/super-admin.module';





@NgModule({
  declarations: [
    AppComponent,
    ],

  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    FormsModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    HttpClientModule,

    DashboardModule,
    SuperAdminModule,


    RouterModule,
    SharedModule
],
  providers: [DatePipe],

  bootstrap: [AppComponent]

})

export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faShieldAlt, faUsersCog, faUserInjured, faHospital,
      faHotel, faCar, faListAlt, faEdit, faHeadset,
      faChevronLeft, faChevronRight, faEye, faCheck,
      faTimes, faSearch, faUser, faUserCheck, faUserClock,
      faArrowUp, faArrowDown,faUserCircle
    );
  }
}
