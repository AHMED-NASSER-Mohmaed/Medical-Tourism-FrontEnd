import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelsAccountsComponent } from './hotels-accounts.component';

describe('HotelsAccountsComponent', () => {
  let component: HotelsAccountsComponent;
  let fixture: ComponentFixture<HotelsAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HotelsAccountsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelsAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
