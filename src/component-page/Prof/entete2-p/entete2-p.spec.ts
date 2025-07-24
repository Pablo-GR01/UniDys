import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Entete2E } from './entete2-p';

describe('Entete2E', () => {
  let component: Entete2E;
  let fixture: ComponentFixture<Entete2E>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Entete2E]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Entete2E);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
