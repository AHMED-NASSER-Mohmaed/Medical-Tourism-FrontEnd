import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DoctorDashboardRoutingModule } from './doctorDashboard-routing.module';
import { LayOutComponent } from './Components/lay-out/lay-out.component';
import { SchedulesComponent } from './Pages/schedules/schedules.component';

@NgModule({
  declarations: [

    
  
  
    SchedulesComponent
  ],
  imports: [

    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DoctorDashboardRoutingModule,
    LayOutComponent
    
  ]
})
export class doctorDashboardModule { }