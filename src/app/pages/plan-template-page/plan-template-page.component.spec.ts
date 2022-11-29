import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanTemplatePageComponent } from './plan-template-page.component';

describe('PlanTemplatePageComponent', () => {
  let component: PlanTemplatePageComponent;
  let fixture: ComponentFixture<PlanTemplatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanTemplatePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanTemplatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
