import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import AuthenticationRequest from '../models/authentication-request.dto';
import { UserService } from '../services/user.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

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
    const { usernameOrEmail, password } = this.userForm.value;
    if (this.isInLoginView) {
      const authenticationRequest: AuthenticationRequest = {
        usernameOrEmail: usernameOrEmail!!,
        password: password!!
      };
      // this.userService.loginUser(authenticationRequest);
    } else {

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