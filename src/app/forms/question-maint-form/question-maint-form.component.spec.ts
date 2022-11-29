import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionMaintFormComponent } from './question-maint-form.component';

describe('QuestionMaintFormComponent', () => {
  let component: QuestionMaintFormComponent;
  let fixture: ComponentFixture<QuestionMaintFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionMaintFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionMaintFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
