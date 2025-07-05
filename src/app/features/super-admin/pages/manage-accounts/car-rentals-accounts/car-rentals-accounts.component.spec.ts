import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarRentalsAccountsComponent } from './car-rentals-accounts.component';

describe('CarRentalsAccountsComponent', () => {
  let component: CarRentalsAccountsComponent;
  let fixture: ComponentFixture<CarRentalsAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarRentalsAccountsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarRentalsAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
