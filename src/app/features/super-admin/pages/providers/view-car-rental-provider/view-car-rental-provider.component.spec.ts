import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCarRentalProviderComponent } from './view-car-rental-provider.component';

describe('ViewCarRentalProviderComponent', () => {
  let component: ViewCarRentalProviderComponent;
  let fixture: ComponentFixture<ViewCarRentalProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewCarRentalProviderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCarRentalProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
