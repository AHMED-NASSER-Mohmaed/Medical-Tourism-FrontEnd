import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListHospitalProvidersComponent } from './list-hospital-providers.component';

describe('ListHospitalProvidersComponent', () => {
  let component: ListHospitalProvidersComponent;
  let fixture: ComponentFixture<ListHospitalProvidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListHospitalProvidersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListHospitalProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
