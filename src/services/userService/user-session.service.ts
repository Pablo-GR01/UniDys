import { Injectable } from '@angular/core';
import { UserStorageService } from './user-storage.service';

@Injectable({ providedIn: 'root' })
export class UserSessionService {
  constructor(private storage: UserStorageService) {}

  login(user: any) {
    this.storage.save(user);
  }

  logout() {
    this.storage.clear();
  }

  isLoggedIn(): boolean {
    return !!this.storage.get();
  }
}
