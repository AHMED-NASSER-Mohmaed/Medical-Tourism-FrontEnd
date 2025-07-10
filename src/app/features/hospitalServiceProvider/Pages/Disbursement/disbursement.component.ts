import { Component, OnInit } from '@angular/core';
import { DisbursementService } from '../../Services/Disbursement.service';
import { error } from 'jquery';
import { Disbursement } from '../../models/disbursement';
import { PaginationInstance } from 'ngx-pagination';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-disbursement',
  standalone: false,
  templateUrl: './disbursement.component.html',
  styleUrl: './disbursement.component.css',
  providers: [DatePipe]
})
export class DisbursementComponent implements OnInit {


  disbursements:Disbursement[] = [];
  filteredDisbursements: Disbursement[] = []; 
   paymentMethods: string[] = ['Cash', 'Bank Transfer', 'Credit Card', 'Other'];
  
  // Filter variables
  searchText: string = '';
  selectedPaymentMethod: string = '';
  selectedMonth: string = '';
  
  // Sorting variables
  sortColumn: string = 'disbursementDateMonth';
  isAsc: boolean = false;
  
  // Pagination config
  config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: 1
  };
  
  // Statistics
  totalCount: number = 0;
  totalAmount: number = 0;
  averageAmount: number = 0;


  maxSize: number = 5;
  constructor(private disbursementService:DisbursementService,private datePipe: DatePipe

  ){}

  ngOnInit(): void {
    this.loadDisbursements();
   
  }

  loadDisbursements(): void {
    this.disbursementService.getAllDisbursements().subscribe({
      next: (data) => {
        this.disbursements = data.items;
        this.filteredDisbursements = [...data.items];
        this.calculateStatistics();
        this.applySorting();
        console.log('Disbursements loaded:', this.disbursements);
      },
      error: (err) => {
        console.error('Error loading disbursements:', err);
      }
    });
     
  }

  gerDisbursementDetails(id: number): void 
  {
    this.disbursementService.getDisbursementById(1).subscribe({
          next: (data) => { 
            console.log('Disbursement with ID 1:', data);
          },
          error: (err) => { 
            console.error('Error fetching disbursement with ID 1:', err);
          }
      });
  }
  applyFilters(): void {
    this.filteredDisbursements = this.disbursements.filter(disbursement => {
      // Text search filter
      const matchesSearch = this.searchText === '' || 
        disbursement.assetName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        disbursement.paymentMethod.toLowerCase().includes(this.searchText.toLowerCase()) ||
        disbursement.totalAmount.toString().includes(this.searchText);
      
      // Payment method filter
      const matchesPaymentMethod = this.selectedPaymentMethod === '' || 
        disbursement.paymentMethod === this.selectedPaymentMethod;
      
      // Month filter
      let matchesMonth = true;
      if (this.selectedMonth) {
        const disbursementMonth = this.datePipe.transform(disbursement.disbursementDateMonth, 'yyyy-MM');
        matchesMonth = disbursementMonth === this.selectedMonth;
      }
      
      return matchesSearch && matchesPaymentMethod && matchesMonth;
    });
    
    this.calculateStatistics();
    this.config.currentPage = 1;
    this.applySorting();
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.isAsc = !this.isAsc;
    } else {
      this.sortColumn = column;
      this.isAsc = true;
    }
    this.applySorting();
  }

  applySorting(): void {
    this.filteredDisbursements.sort((a, b) => {
      let comparison = 0;
      
      switch (this.sortColumn) {
        case 'disbursementDateMonth':
          comparison = new Date(a.disbursementDateMonth).getTime() - new Date(b.disbursementDateMonth).getTime();
          break;
        case 'assetName':
          comparison = a.assetName.localeCompare(b.assetName);
          break;
        case 'totalAmount':
          comparison = a.totalAmount - b.totalAmount;
          break;
        case 'paymentMethod':
          comparison = a.paymentMethod.localeCompare(b.paymentMethod);
          break;
        default:
          break;
      }
      
      return this.isAsc ? comparison : -comparison;
    });
  }

  calculateStatistics(): void {
    this.totalCount = this.filteredDisbursements.length;
    this.totalAmount = this.filteredDisbursements.reduce((sum, item) => sum + item.totalAmount, 0);
    this.averageAmount = this.totalCount > 0 ? this.totalAmount / this.totalCount : 0;
  }

  pageChanged(page: number): void {
    this.config.currentPage = page;
  }

  get pageSize(): number {
    return this.config.itemsPerPage;
  }

  set pageSize(size: number) {
    this.config.itemsPerPage = size;
  }

  get currentPage(): number {
    return this.config.currentPage;
  }

  viewDetails(id: number): void {
    // Implement navigation to detail view
    this.disbursementService.getDisbursementById(1).subscribe({
      next: (data) => { 
        console.log('Disbursement with ID 1:', data);
      },
      error: (err) => { 
        console.error('Error fetching disbursement with ID 1:', err);
      }
    });
  }

  editDisbursement(id: number): void {
    // Implement navigation to edit form
    console.log('Edit disbursement:', id);
  }

  resetFilters(): void {
    this.searchText = '';
    this.selectedPaymentMethod = '';
    this.selectedMonth = '';
    this.applyFilters();
  }
}


