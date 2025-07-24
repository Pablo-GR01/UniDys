import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Entete4P } from './entete4-p';

describe('Entete4P', () => {
  let component: Entete4P;
  let fixture: ComponentFixture<Entete4P>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Entete4P]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Entete4P);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
