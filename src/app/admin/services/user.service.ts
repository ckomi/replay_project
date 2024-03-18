import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

const baseUrl = 'http://localhost:8080/api/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }


  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(baseUrl);
  }
  deleteUser(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  validateUsername():boolean {
    const nameInput = document.getElementById('user_name') as HTMLInputElement;
    const name = nameInput.value.trim();
    const isNameFormatValid = /^[A-Z](?:[0-9]{1,2}){0,1}.{4,9}$/.test(name);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(name);
    if (isNameFormatValid && !hasSpecialChars) {
      nameInput.classList.remove('invalid');
      return true;
    } else if (name === ''){
      nameInput.classList.remove('invalid');
      return false;
    } else {
      nameInput.classList.add('invalid');
      return false;
    }
  }
  validatePassword():boolean {
    const passwordInput = document.getElementById('user_password') as HTMLInputElement;
    const password = passwordInput.value.trim();
    const isPasswordLengthValid = password.length >= 5 && password.length <= 20;
    const isPasswordFormatValid = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[.])[a-zA-Z0-9.]+$/.test(password);
    const hasSpaces = /\s/.test(password);
    if (isPasswordLengthValid && isPasswordFormatValid && !hasSpaces) {
      passwordInput.classList.remove('invalid');
      return true;
    } else if (password === ''){
      passwordInput.classList.remove('invalid');
      return false;
    } else {
      passwordInput.classList.add('invalid');
      return false;
    }
  }
}
