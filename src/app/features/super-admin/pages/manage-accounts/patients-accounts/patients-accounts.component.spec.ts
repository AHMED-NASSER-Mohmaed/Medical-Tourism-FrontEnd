import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsAccountsComponent } from './patients-accounts.component';

describe('PatientsAccountsComponent', () => {
  let component: PatientsAccountsComponent;
  let fixture: ComponentFixture<PatientsAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientsAccountsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientsAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
