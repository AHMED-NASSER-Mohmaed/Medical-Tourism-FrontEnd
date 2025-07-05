import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalsAccountsComponent } from './hospitals-accounts.component';

describe('HospitalsAccountsComponent', () => {
  let component: HospitalsAccountsComponent;
  let fixture: ComponentFixture<HospitalsAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HospitalsAccountsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalsAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
