import { Component } from '@angular/core';


@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [], // ✅ Angular comprend maintenant ce que c’est
  templateUrl: './logo.html',
  styleUrls: ['./logo.css']
})
export class Logo {}
