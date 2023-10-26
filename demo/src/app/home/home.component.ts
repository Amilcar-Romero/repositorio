import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  needsLogin: boolean | undefined;
  _userName: string = '';
  private userCredentials: { userName: string, password: string } | null = null;

  ngOnInit() {
    this.needsLogin = !!this.route.snapshot.params['needsLogin'];
  }

  get userName(): string {
    return this._userName;
  }

  register(): void {
    const userName = prompt('Crea un nombre de usuario:');
    const password = prompt('Crea una contraseña:');

    if (userName && password) {
      this.userCredentials = { userName, password };
    } else {
      alert('Debes proporcionar un nombre de usuario y una contraseña.');
    }
  }

  login(): void {
    if (this.userCredentials) {
      const enteredUserName = prompt('Ingresa tu nombre de usuario:');
      const enteredPassword = prompt('Ingresa tu contraseña:');

      if (enteredUserName === this.userCredentials.userName && enteredPassword === this.userCredentials.password) {
        this._userName = enteredUserName;
      } else {
        alert('Credenciales incorrectas. Inténtalo de nuevo.');
      }
    } else {
      alert('No tienes credenciales para iniciar sesión. Regístrate primero.');
    }
  }
}
