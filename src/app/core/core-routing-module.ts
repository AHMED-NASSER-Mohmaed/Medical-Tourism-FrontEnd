import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './layout/home/home.component';
import { FaqComponent } from './layout/faq/faq.component';





const routes: Routes = [
  { path: '', component: HomeComponent },
  {path:'faq', component:FaqComponent},



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule {}
