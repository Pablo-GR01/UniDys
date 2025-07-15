import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Section10 } from './section10';

describe('Section10', () => {
  let component: Section10;
  let fixture: ComponentFixture<Section10>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Section10]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Section10);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
