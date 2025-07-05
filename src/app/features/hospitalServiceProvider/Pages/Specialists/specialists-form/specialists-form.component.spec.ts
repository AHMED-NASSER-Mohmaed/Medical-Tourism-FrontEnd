import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialistsFormComponent } from './specialists-form.component';

describe('SpecialistsFormComponent', () => {
  let component: SpecialistsFormComponent;
  let fixture: ComponentFixture<SpecialistsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpecialistsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialistsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
