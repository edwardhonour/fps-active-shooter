import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSectionFormComponent } from './add-section-form.component';

describe('AddSectionFormComponent', () => {
  let component: AddSectionFormComponent;
  let fixture: ComponentFixture<AddSectionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSectionFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
