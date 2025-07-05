import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterHotelComponent } from './register-hotel.component';

describe('RegisterHotelComponent', () => {
  let component: RegisterHotelComponent;
  let fixture: ComponentFixture<RegisterHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterHotelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
