import { Component } from '@angular/core';
import { HeaderA } from '../../../../component/header-a/header-a';
import { DashboardA } from '../../../../component-page/Admin/dashboard-a/dashboard-a';

@Component({
  selector: 'app-accueil-a',
  imports: [HeaderA,DashboardA],
  templateUrl: './accueil-a.html',
  styleUrl: './accueil-a.css'
})
export class AccueilA {

}
