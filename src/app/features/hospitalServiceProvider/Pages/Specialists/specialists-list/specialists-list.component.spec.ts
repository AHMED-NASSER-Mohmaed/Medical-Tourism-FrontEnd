import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialistsListComponent } from './specialists-list.component';

describe('SpecialistsListComponent', () => {
  let component: SpecialistsListComponent;
  let fixture: ComponentFixture<SpecialistsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpecialistsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialistsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
