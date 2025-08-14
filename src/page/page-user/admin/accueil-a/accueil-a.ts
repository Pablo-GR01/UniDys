import { Component } from '@angular/core';
import { HeaderA } from '../../../../component/header-a/header-a';
import { User } from "../../../../component-page/Admin/user/user";


@Component({
  selector: 'app-accueil-a',
  imports: [HeaderA, User, ],
  templateUrl: './accueil-a.html',
  styleUrl: './accueil-a.css'
})
export class AccueilA {

}
