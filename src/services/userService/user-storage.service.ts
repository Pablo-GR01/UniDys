import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserStorageService {
  private key = 'utilisateur';

  save(user: any) {
    localStorage.setItem(this.key, JSON.stringify(user));
  }

  get(): any | null {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : null;
  }

  clear() {
    localStorage.removeItem(this.key);
  }
}
