import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanMenuComponent } from './plan-menu.component';

describe('PlanMenuComponent', () => {
  let component: PlanMenuComponent;
  let fixture: ComponentFixture<PlanMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
