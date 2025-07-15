import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Section9 } from './section9';

describe('Section9', () => {
  let component: Section9;
  let fixture: ComponentFixture<Section9>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Section9]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Section9);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
