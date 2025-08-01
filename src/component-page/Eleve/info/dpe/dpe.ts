import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dpe',
  imports: [CommonModule, FormsModule],
  templateUrl: './dpe.html',
  styleUrl: './dpe.css'
})
export class DPE {
  showModal1 = false;
  showModal2 = false;
}