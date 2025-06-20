import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalDoctorsComponent } from './hospital-doctors.component';

describe('HospitalDoctorsComponent', () => {
  let component: HospitalDoctorsComponent;
  let fixture: ComponentFixture<HospitalDoctorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HospitalDoctorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalDoctorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
