import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterHospitalComponent } from './register-hospital.component';

describe('RegisterHospitalComponent', () => {
  let component: RegisterHospitalComponent;
  let fixture: ComponentFixture<RegisterHospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterHospitalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
