import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Section11 } from './section11';

describe('Section11', () => {
  let component: Section11;
  let fixture: ComponentFixture<Section11>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Section11]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Section11);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
