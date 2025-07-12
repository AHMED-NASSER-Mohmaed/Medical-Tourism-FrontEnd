import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RoleGuard } from '../../shared/guards/role.guard';
import { LayOutComponent } from './Components/lay-out/lay-out.component';
import { ProfileComponent } from './Pages/profile/profile.component';
import { AppointementsComponent } from './Pages/appointements/appointements.component';
import { SchedulesComponent } from './Pages/schedules/schedules.component';




const routes :Routes=
[

    {
        path: '',
             component:LayOutComponent,
            canActivate: [AuthGuard, RoleGuard],
            data: {
              expectedRole: 'Doctor'
            },
            children: [
              {path: 'profile' ,component : ProfileComponent},
              {path : 'appointments', component:AppointementsComponent},
              {path : 'schedules', component:SchedulesComponent},
              { path: '', redirectTo: 'appointments', pathMatch: 'full' }
            ]
    }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorDashboardRoutingModule { }
