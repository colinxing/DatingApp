import { Component, OnInit } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './_models/user';
// import { Card } from './_models/card';
import { UserService } from './_services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  jwtHelper = new JwtHelperService();
  // cards: Card[];

  constructor(private authService: AuthService, private userService: UserService) {}

  ngOnInit() {
    // console.log(this.authService.tempParams);
    const token = localStorage.getItem('token');
    const user: User = JSON.parse(localStorage.getItem('user'));
    const temp: any = JSON.parse(localStorage.getItem('tempParams'));
    if (token) {
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);
    }
    if (user) {
      this.authService.currentUser = user;
      this.authService.changeMemberPhoto(user.photoUrl);
      this.authService.currentPhotoUrl = this.authService.currentUser.photoUrl;
    }
    if (temp) {
      this.authService.tempParams = temp;
    }
    console.log(token);
    console.log(temp);
    console.log(user);

    // this.userService.getCard().subscribe(res => {
    //   this.cards = res;
    // });
  }
}
