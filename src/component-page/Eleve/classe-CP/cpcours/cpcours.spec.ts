import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CPCours } from './cpcours';

describe('CPCours', () => {
  let component: CPCours;
  let fixture: ComponentFixture<CPCours>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CPCours]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CPCours);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
