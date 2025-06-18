import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHotelProviderComponent } from './edit-hotel-provider.component';

describe('EditHotelProviderComponent', () => {
  let component: EditHotelProviderComponent;
  let fixture: ComponentFixture<EditHotelProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditHotelProviderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditHotelProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
