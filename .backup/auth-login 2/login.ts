// This is a backup of the original login.ts file
// Please ensure to keep this file safe.
// Original code starts below:
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent {
	constructor(private authService: AuthService) {}

	login() {
		// login logic here
	}
}

// End of backup
