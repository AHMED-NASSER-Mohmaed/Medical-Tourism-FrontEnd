import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHospitalProviderComponent } from './add-hospital-provider.component';

describe('AddHospitalProviderComponent', () => {
  let component: AddHospitalProviderComponent;
  let fixture: ComponentFixture<AddHospitalProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddHospitalProviderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddHospitalProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
