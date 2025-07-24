import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Section7P } from './section7-p';

describe('Section7P', () => {
  let component: Section7P;
  let fixture: ComponentFixture<Section7P>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Section7P]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Section7P);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
