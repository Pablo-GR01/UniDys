import { Component } from '@angular/core';
import { Logo } from '../logo/logo'
import { HamburgerMenuP } from '../menu-hambugerP/menu-hamburgerP';

@Component({
  selector: 'app-header2',
  standalone: true,
  imports: [Logo, HamburgerMenuP],
  templateUrl: './header2.html',
  styleUrl: './header2.css'
})
export class Header2 {

}
