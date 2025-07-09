import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Monespace } from './monespace';

describe('Monespace', () => {
  let component: Monespace;
  let fixture: ComponentFixture<Monespace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Monespace]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Monespace);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
