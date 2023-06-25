import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitHighchartsGraphComponent } from './unit-highcharts-graph.component';

describe('UnitHighchartsGraphComponent', () => {
  let component: UnitHighchartsGraphComponent;
  let fixture: ComponentFixture<UnitHighchartsGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitHighchartsGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitHighchartsGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
