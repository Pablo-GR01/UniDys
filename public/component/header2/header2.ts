import { Component } from '@angular/core';
import { Logo } from '../logo/logo'
import { HamburgerMenu } from '../menu-hambuger/menu-hamburger';
@Component({
  selector: 'app-header2',
  imports: [Logo, HamburgerMenu],
  templateUrl: './header2.html',
  styleUrl: './header2.css'
})
export class Header2 {

}
