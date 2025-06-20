import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayAllHospitalsComponent } from './display-all-hospitals.component';

describe('DisplayAllHospitalsComponent', () => {
  let component: DisplayAllHospitalsComponent;
  let fixture: ComponentFixture<DisplayAllHospitalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplayAllHospitalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayAllHospitalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
