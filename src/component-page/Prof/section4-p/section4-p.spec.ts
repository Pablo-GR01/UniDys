import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Section4P } from './section4-p';

describe('Section4P', () => {
  let component: Section4P;
  let fixture: ComponentFixture<Section4P>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Section4P]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Section4P);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
