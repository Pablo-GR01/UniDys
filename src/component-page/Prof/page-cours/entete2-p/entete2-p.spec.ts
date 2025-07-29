import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Entete2P } from './entete2-p';

describe('Entete2E', () => {
  let component: Entete2P;
  let fixture: ComponentFixture<Entete2P>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Entete2P]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Entete2P);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
