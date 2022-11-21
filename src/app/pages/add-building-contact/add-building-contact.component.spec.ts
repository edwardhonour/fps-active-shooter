import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBuildingContactComponent } from './add-building-contact.component';

describe('AddBuildingContactComponent', () => {
  let component: AddBuildingContactComponent;
  let fixture: ComponentFixture<AddBuildingContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBuildingContactComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBuildingContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
