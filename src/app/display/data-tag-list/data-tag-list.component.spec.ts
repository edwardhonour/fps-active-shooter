import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTagListComponent } from './data-tag-list.component';

describe('DataTagListComponent', () => {
  let component: DataTagListComponent;
  let fixture: ComponentFixture<DataTagListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataTagListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataTagListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
