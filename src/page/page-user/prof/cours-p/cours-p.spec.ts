import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursP } from './cours-p';

describe('CoursP', () => {
  let component: CoursP;
  let fixture: ComponentFixture<CoursP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursP]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursP);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
