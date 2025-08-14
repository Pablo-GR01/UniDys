import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DernierQCM } from './dernier-qcm';

describe('DernierQCM', () => {
  let component: DernierQCM;
  let fixture: ComponentFixture<DernierQCM>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DernierQCM]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DernierQCM);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
