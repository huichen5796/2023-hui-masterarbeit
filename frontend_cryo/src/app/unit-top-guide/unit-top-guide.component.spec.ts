import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitTopGuideComponent } from './unit-top-guide.component';

describe('UnitTopGuideComponent', () => {
  let component: UnitTopGuideComponent;
  let fixture: ComponentFixture<UnitTopGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitTopGuideComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitTopGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
