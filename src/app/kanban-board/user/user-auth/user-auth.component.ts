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
}
