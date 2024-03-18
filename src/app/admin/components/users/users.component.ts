import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/admin/services/user.service';
import { User } from 'src/app/admin/models/user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  user: User = {
    for_city: '',
    user_name: '',
    user_password: ''
  };

  users: User[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getAllUsers()
      .subscribe(users => {
        this.users = users;
      });
  }

  saveUser(): void {
    const data = {
      for_city: this.user.for_city,
      user_name: this.user.user_name,
      user_password: this.user.user_password
    };
    console.log(data);
    this.userService.create(data)
      .subscribe({
        next: (res) => {
          console.log(res);
          window.location.reload();
        },
        error: (e) => console.error("Error during booking creation:", e)
      });
  }
  deleteUser(id: any): void {
    this.userService.deleteUser(id)
      .subscribe(() => {
        this.getUsers(); // Reload the user list after deletion
      });
  }


  // ================================= VALIDATE =================================
  validateUsername() {
    return this.userService.validateUsername();
  }
  validatePassword() {
    return this.userService.validatePassword();
  }
  isUserValid(): boolean {
    return this.userService.validateUsername() && this.userService.validatePassword();
  }
}
