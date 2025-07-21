import { Component } from '@angular/core';
import { Logo } from "../logo/logo";
import { Icon } from '../icon/icon';
import { MenuHamburgerE } from '../menu-hambuger-e/menu-hambuger-e';

@Component({
  selector: 'app-header-e',
  imports: [Logo, Icon,MenuHamburgerE],
  templateUrl: './header-e.html',
  styleUrl: './header-e.css'
})
export class HeaderE {

}
