import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursE } from './cours-e';

describe('CoursE', () => {
  let component: CoursE;
  let fixture: ComponentFixture<CoursE>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursE]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursE);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
