import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  photoUrl: string;

  constructor(public authService: AuthService, private alerify: AlertifyService, private router: Router) { }

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }

  login() {
      this.authService.login(this.model).subscribe(next => {
        this.alerify.success('Login Successfully!');
      }, error => {
        this.alerify.error(error);
      }, () => {
        this.router.navigate(['/members']);
      });
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('uesr');
    this.authService.decodedToken = null;
    this.authService.currentUser = null;
    console.log('logged out!');
    this.alerify.message('Logout');
    this.router.navigate(['/home']);
  }
}
