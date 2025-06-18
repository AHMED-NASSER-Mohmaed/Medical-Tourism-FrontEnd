import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHotelProviderComponent } from './view-hotel-provider.component';

describe('ViewHotelProviderComponent', () => {
  let component: ViewHotelProviderComponent;
  let fixture: ComponentFixture<ViewHotelProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewHotelProviderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewHotelProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
