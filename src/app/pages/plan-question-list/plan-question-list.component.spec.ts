import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanQuestionListComponent } from './plan-question-list.component';

describe('PlanQuestionListComponent', () => {
  let component: PlanQuestionListComponent;
  let fixture: ComponentFixture<PlanQuestionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanQuestionListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanQuestionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
