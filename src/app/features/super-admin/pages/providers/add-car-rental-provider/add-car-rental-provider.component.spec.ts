import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCarRentalProviderComponent } from './add-car-rental-provider.component';

describe('AddCarRentalProviderComponent', () => {
  let component: AddCarRentalProviderComponent;
  let fixture: ComponentFixture<AddCarRentalProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddCarRentalProviderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCarRentalProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
