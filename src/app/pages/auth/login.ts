import { Component } from '@angular/core';
import { Login as LocalLogin } from '../../auth/login/login';

@Component({
    selector: 'app-pages-login',
    standalone: true,
    imports: [LocalLogin],
    template: `<app-login></app-login>`
})
export class Login {}
