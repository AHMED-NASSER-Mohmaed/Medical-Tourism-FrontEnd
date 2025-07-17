import { Component, OnInit } from '@angular/core';
import { SuperAdminService } from '../../../services/super-admin.service';

@Component({
  selector: 'app-training-model',
  standalone: false,
  templateUrl: './training-model.component.html',
  styleUrls: ['./training-model.component.css']
})
export class TrainingModelComponent implements OnInit {
   loading :boolean =false;
  statusMessage:string=""
   success : boolean= false;
  constructor(private superadminservice:SuperAdminService ) {}
  ngOnInit(): void {
    console.log("Training component")
  }



  startTraining(){
   this.loading=true
    
    
  this.superadminservice.TrainModel().subscribe({

    next:(data)=>{
       this.loading=false;
       this.success=true
       this.statusMessage="Model Trained Successfuly"
    },
    error:(error)=>{
      console.log(error);
       this.loading=false
       this.statusMessage=error.error;
    }
  })

    
    
  }
}