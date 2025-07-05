import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHotelProviderComponent } from './add-hotel-provider.component';

describe('AddHotelProviderComponent', () => {
  let component: AddHotelProviderComponent;
  let fixture: ComponentFixture<AddHotelProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddHotelProviderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddHotelProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
