import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnteteP } from './entete-p';

describe('EnteteP', () => {
  let component: EnteteP;
  let fixture: ComponentFixture<EnteteP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnteteP]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnteteP);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
