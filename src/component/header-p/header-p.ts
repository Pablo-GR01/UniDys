import { Component } from '@angular/core';
import { Logo } from '../logo/logo';
import { Icon } from '../icon/icon';
import { MenuHambugerP } from '../menu-hambuger-p/menu-hambuger-p';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-p',
  imports: [Logo, Icon, MenuHambugerP,RouterLink],
  templateUrl: './header-p.html',
  styleUrl: './header-p.css'
})
export class HeaderP {

}
