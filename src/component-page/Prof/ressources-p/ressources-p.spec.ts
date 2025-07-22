import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RessourcesP } from './ressources-p';

describe('RessourcesP', () => {
  let component: RessourcesP;
  let fixture: ComponentFixture<RessourcesP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RessourcesP]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RessourcesP);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
