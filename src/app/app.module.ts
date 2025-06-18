// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { 
  faShieldAlt, faUsersCog, faUserInjured, faHospital, 
  faHotel, faCar, faListAlt, faEdit, faHeadset,
  faChevronLeft, faChevronRight, faEye, faCheck, 
  faTimes, faSearch, faUser, faUserCheck, faUserClock,
  faArrowUp, faArrowDown
} from '@fortawesome/free-solid-svg-icons';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SharedModule } from './shared/shared.module';
import { SuperAdminModule } from './features/super-admin/super-admin.module';
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    CoreModule,
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faShieldAlt, faUsersCog, faUserInjured, faHospital,
      faHotel, faCar, faListAlt, faEdit, faHeadset,
      faChevronLeft, faChevronRight, faEye, faCheck,
      faTimes, faSearch, faUser, faUserCheck, faUserClock,
      faArrowUp, faArrowDown
    );
  }
}