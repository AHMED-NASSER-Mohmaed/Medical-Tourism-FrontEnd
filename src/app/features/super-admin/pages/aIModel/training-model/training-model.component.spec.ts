import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingModelComponent } from './training-model.component';

describe('TrainingModelComponent', () => {
  let component: TrainingModelComponent;
  let fixture: ComponentFixture<TrainingModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrainingModelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
