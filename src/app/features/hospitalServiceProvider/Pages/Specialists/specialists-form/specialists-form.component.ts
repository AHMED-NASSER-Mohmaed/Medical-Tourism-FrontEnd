import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-specialists-form',
  standalone: false,
  templateUrl: './specialists-form.component.html',
  styleUrl: './specialists-form.component.css'
})
export class SpecialistsFormComponent {
specialistForm: FormGroup;
  isEditMode: boolean = false;
  specialistId: number | null = null;

  constructor(
    private fb: FormBuilder,
    // private specialistService: SpecialistService,
    private route: ActivatedRoute,
    private router: Router,
    //private messageService: MessageService
  ) {
    this.specialistForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      status: ['Active']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.specialistId = +params['id'];
        this.loadSpecialist(this.specialistId);
      }
    });
  }

  loadSpecialist(id: number) {
    // this.specialistService.getSpecialistById(id).subscribe({
    //   next: (data) => {
    //     this.specialistForm.patchValue(data);
    //   },
    //   error: (err) => {
    //     console.error('Failed to load specialist', err);
    //   }
    // });
  }

  onSubmit() {
    if (this.specialistForm.invalid) {
      return;
    }

    const specialistData = this.specialistForm.value;

    if (this.isEditMode && this.specialistId) {
      // this.specialistService.updateSpecialist(this.specialistId, specialistData).subscribe({
      //   next: () => {
      //     this.messageService.add({severity:'success', summary:'Success', detail:'Specialist updated successfully'});
      //     this.router.navigate(['/specialists']);
      //   },
      //   error: (err) => {
      //     this.messageService.add({severity:'error', summary:'Error', detail:'Failed to update specialist'});
      //   }
      // });
    } else {
      // this.specialistService.createSpecialist(specialistData).subscribe({
      //   next: () => {
      //     this.messageService.add({severity:'success', summary:'Success', detail:'Specialist created successfully'});
      //     this.router.navigate(['/specialists']);
      //   },
      //   error: (err) => {
      //     this.messageService.add({severity:'error', summary:'Error', detail:'Failed to create specialist'});
      //   }
      // });
    }
  }
}
