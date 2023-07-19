import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitAnalyseSelectListComponent } from './unit-analyse-select-list.component';

describe('UnitAnalyseSelectListComponent', () => {
  let component: UnitAnalyseSelectListComponent;
  let fixture: ComponentFixture<UnitAnalyseSelectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitAnalyseSelectListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitAnalyseSelectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
