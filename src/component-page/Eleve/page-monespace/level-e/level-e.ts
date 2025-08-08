import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-level-e',
  templateUrl: './level-e.html',
  styleUrls: ['./level-e.css'] // correction : styleUrls au pluriel
})
export class LevelE implements OnInit {

  xp: number = 0;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
      this.xp = user.xp;
    });
  }
}
