import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalClinicsComponent } from './hospital-clinics.component';

describe('HospitalClinicsComponent', () => {
  let component: HospitalClinicsComponent;
  let fixture: ComponentFixture<HospitalClinicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HospitalClinicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalClinicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
