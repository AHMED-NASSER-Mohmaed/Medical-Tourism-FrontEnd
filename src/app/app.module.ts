
import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faShieldAlt, faUsersCog, faUserInjured, faHospital,
  faHotel, faCar, faListAlt, faEdit, faHeadset,
  faChevronLeft, faChevronRight, faEye, faCheck,
  faTimes, faSearch, faUser, faUserCheck, faUserClock,
  faArrowUp, faArrowDown,
  faUserCircle
} from '@fortawesome/free-solid-svg-icons';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';

import { FormsModule } from '@angular/forms';


import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DashboardModule } from './dashboard/dashboard.module';
import { SharedModule } from './shared/shared.module';
import { SuperAdminModule } from './features/super-admin/super-admin.module';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


@NgModule({
  declarations: [
    AppComponent,

  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    FormsModule,


    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),

    HttpClientModule,
    AppRoutingModule,
    DashboardModule,
    SharedModule,
    SuperAdminModule,
    FontAwesomeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })

  ],

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
