import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuHambuger } from './menu-hambuger';

describe('MenuHambuger', () => {
  let component: MenuHambuger;
  let fixture: ComponentFixture<MenuHambuger>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuHambuger]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuHambuger);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
