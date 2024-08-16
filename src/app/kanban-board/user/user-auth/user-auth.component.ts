import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import AuthenticationRequest from '../models/authentication-request.dto';
import { UserService } from '../services/user.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import UserDTO from '../models/user.dto';
import { availableUsernameAndEmailValidator } from '../validators/username-and-email.validator';
import { matchingPasswordsValidator } from '../validators/matching-passwords.validator';
import FormUtil from '../../utils/form.util';

@Component({
  selector: 'app-user-auth',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule],
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css', '../../common/form.styles.css'],
})
export class UserAuthComponent {

  private userService = inject(UserService);

  isInLoginView = false;
  errors = this.userService.errors;

  loginForm = new FormGroup({
    usernameOrEmail: new FormControl('', [
      Validators.required,
    ]),
    password: new FormControl('', [
      Validators.required,
    ])
  }
  );

  registerForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(100),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('', [
      Validators.required,
    ]),
    matchingPassword: new FormControl('', [
      Validators.required,
    ])
  }, {
    validators: [
      matchingPasswordsValidator(this.userService)
    ],
    asyncValidators: [
      availableUsernameAndEmailValidator(this.userService)
    ],
  }
  );

  changeAction(isInLogiView: boolean): void {
    const isClickingOnTheSameAction = isInLogiView && this.isInLoginView
      || !isInLogiView && !this.isInLoginView;
    if (isClickingOnTheSameAction) {
      return;
    }
    this.loginForm.reset();
    this.registerForm.reset();
    this.isInLoginView = !this.isInLoginView;
    this.userService.resetErrorMessages();
  };

  doAction(form: FormGroup): void {
    if (!form.valid) {
      return;
    }
    this.userService.resetErrorMessages();
    if (this.isInLoginView) {
      const { usernameOrEmail, password } = this.loginForm.value;
      const authenticationRequest: AuthenticationRequest = {
        usernameOrEmail: usernameOrEmail!!,
        password: password!!
      };
      this.userService.loginUser(authenticationRequest);
    } else {
      const { username, email, password } = this.registerForm.value;
      const userDTO: UserDTO = {
        username: username!!,
        email: email!!,
        password: password!!
      };
      this.userService.registerUser(userDTO);
    }
  }

  formErrors(formControl: FormControl, controlName: string, minLength = 0, maxLength = 0): string[] {
    return FormUtil.formErrors(formControl, controlName, minLength, maxLength);
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