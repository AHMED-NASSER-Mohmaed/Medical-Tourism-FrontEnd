import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProvidersComponent } from './manage-providers.component';

describe('ManageProvidersComponent', () => {
  let component: ManageProvidersComponent;
  let fixture: ComponentFixture<ManageProvidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageProvidersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
