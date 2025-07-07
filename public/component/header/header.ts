import { Component } from '@angular/core';
import { Logo } from "../logo/logo";
import { HamburgerMenu} from "../../component/menu-hambuger/menu-hamburger"
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-header',
  imports: [Logo, HamburgerMenu, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

}
