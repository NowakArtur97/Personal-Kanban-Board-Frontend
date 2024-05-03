import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import AuthenticationRequest from '../models/authentication-request.dto';
import { UserService } from '../services/user.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import UserDTO from '../models/user.dto';

@Component({
  selector: 'app-user-auth',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule],
  templateUrl: './user-auth.component.html',
  styleUrl: './user-auth.component.css'
})
export class UserAuthComponent {

  private userService = inject(UserService);

  isInLoginView = true;

  userForm = new FormGroup({
    email: new FormControl(''),
    usernameOrEmail: new FormControl(''),
    password: new FormControl(''),
  });

  changeAction(): void {
    this.isInLoginView = !this.isInLoginView;
  }

  doAction(userForm: any): void {
    if (!userForm.valid) {
      return;
    }
    if (this.isInLoginView) {
      const { usernameOrEmail, password } = this.userForm.value;
      const authenticationRequest: AuthenticationRequest = {
        usernameOrEmail: usernameOrEmail!!,
        password: password!!
      };
      this.userService.loginUser(authenticationRequest);
    } else {
      const { usernameOrEmail, email, password } = this.userForm.value;
      const userDTO: UserDTO = {
        username: usernameOrEmail!!,
        email: email!!,
        password: password!!
      };
      this.userService.registerUser(userDTO);
    }
  }

  setupHover(hoveredElement: HTMLButtonElement, inactiveElement: HTMLButtonElement): void {
    if ((hoveredElement.textContent?.includes("Sign in") && !this.isInLoginView) || (hoveredElement.textContent?.includes("Sign up") && this.isInLoginView)) {
      hoveredElement.classList.add("user_auth__action_button--active");
      inactiveElement.classList.remove("user_auth__action_button--active");
    }
  }

  setupUnhover(unhoveredElement: HTMLButtonElement, inactiveElement: HTMLButtonElement): void {
    if ((unhoveredElement.textContent?.includes("Sign in") && !this.isInLoginView) || (unhoveredElement.textContent?.includes("Sign up") && this.isInLoginView)) {
      unhoveredElement.classList.remove("user_auth__action_button--active");
      inactiveElement.classList.add("user_auth__action_button--active");
    }
  }
}