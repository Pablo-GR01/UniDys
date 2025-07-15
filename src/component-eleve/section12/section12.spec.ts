import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Section12 } from './section12';

describe('Section12', () => {
  let component: Section12;
  let fixture: ComponentFixture<Section12>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Section12]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Section12);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
