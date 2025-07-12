import { Component } from '@angular/core';
import { DisbursementService } from '../../../Services/Disbursement.service';
import { ActivatedRoute } from '@angular/router';
import { DisbursementHospitalDTO } from '../../../models/disbursement';

@Component({
  selector: 'app-disbursement-details',
  standalone: false,
  templateUrl: './disbursement-details.component.html',
  styleUrl: './disbursement-details.component.css'
})
export class DisbursementDetailsComponent {

   disbursement: DisbursementHospitalDTO | null = null;
  isLoading = true;

  constructor(
    private disbursementService: DisbursementService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.disbursementService.getDisbursementById(id).subscribe({
      next: (data) => {
        this.disbursement = data;
        this.isLoading = false;
        console.log('Disbursement details fetched successfully', this.disbursement);
      },
      error: (error) => {
        console.error('Error fetching disbursement details', error);
        this.isLoading = false;
      }
    });
  }

  getStatusText(status: number): string {
  switch(status) {
    case 1: return 'Completed';
    case 2: return 'Pending';
    case 3: return 'Cancelled';
    case 4: return 'In Progress';
    default: return 'Unknown';
  }
  }
  printDisbursement() {
    if (this.disbursement) {
      this.disbursementService.PrintDisbursement(this.disbursement.id).subscribe({
        next: (blob) => {
          console.log('Disbursement printed successfully', blob);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `DisbursementReport.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Error printing disbursement', error);
        }
      });
    }
  }
}
