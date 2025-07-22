import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccompagnementP } from './accompagnement-p';

describe('AccompagnementP', () => {
  let component: AccompagnementP;
  let fixture: ComponentFixture<AccompagnementP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccompagnementP]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccompagnementP);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
