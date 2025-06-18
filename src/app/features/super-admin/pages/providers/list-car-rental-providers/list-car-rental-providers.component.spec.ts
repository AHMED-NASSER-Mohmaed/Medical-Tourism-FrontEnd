import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCarRentalProvidersComponent } from './list-car-rental-providers.component';

describe('ListCarRentalProvidersComponent', () => {
  let component: ListCarRentalProvidersComponent;
  let fixture: ComponentFixture<ListCarRentalProvidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListCarRentalProvidersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCarRentalProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
