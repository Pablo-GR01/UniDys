import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Section13 } from './section13';

describe('Section13', () => {
  let component: Section13;
  let fixture: ComponentFixture<Section13>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Section13]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Section13);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
