import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NiveauE } from './niveau-p';

describe('NiveauE', () => {
  let component: NiveauE;
  let fixture: ComponentFixture<NiveauE>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NiveauE]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NiveauE);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
