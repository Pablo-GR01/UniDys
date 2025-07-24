import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Section5P } from './section5-p';

describe('Section5P', () => {
  let component: Section5P;
  let fixture: ComponentFixture<Section5P>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Section5P]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Section5P);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
