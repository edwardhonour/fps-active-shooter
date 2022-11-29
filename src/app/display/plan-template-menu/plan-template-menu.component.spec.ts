import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanTemplateMenuComponent } from './plan-template-menu.component';

describe('PlanTemplateMenuComponent', () => {
  let component: PlanTemplateMenuComponent;
  let fixture: ComponentFixture<PlanTemplateMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanTemplateMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanTemplateMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
