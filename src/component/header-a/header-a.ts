import { Component } from '@angular/core';
import { MenuHambugerA } from '../menu-hambuger-a/menu-hambuger-a';
import { Logo } from '../logo/logo';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-header-a',
  imports: [MenuHambugerA, Logo, Icon],
  templateUrl: './header-a.html',
  styleUrl: './header-a.css'
})
export class HeaderA {

}
