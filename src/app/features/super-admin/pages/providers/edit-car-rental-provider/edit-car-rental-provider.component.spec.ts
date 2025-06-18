import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCarRentalProviderComponent } from './edit-car-rental-provider.component';

describe('EditCarRentalProviderComponent', () => {
  let component: EditCarRentalProviderComponent;
  let fixture: ComponentFixture<EditCarRentalProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditCarRentalProviderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCarRentalProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
