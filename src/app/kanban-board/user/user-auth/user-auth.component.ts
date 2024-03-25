import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-user-auth',
  standalone: true,
  imports: [NgClass],
  templateUrl: './user-auth.component.html',
  styleUrl: './user-auth.component.css'
})
export class UserAuthComponent {

  isInLoginView = true;

  changeAction(): void {
    this.isInLoginView = !this.isInLoginView;
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
