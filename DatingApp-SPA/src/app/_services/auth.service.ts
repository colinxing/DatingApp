import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable()
export class AuthService {
  baseurl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: User;
  photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  about = new BehaviorSubject<boolean>(false);
  tempParams: any = {gender: 'all', minAge: 18, maxAge: 99, orderBy: 'lastactive'};
  // TT = false;
  currentPhotoUrl: string;
  // a = this.photoUrl.asObservable();

  constructor(private http: HttpClient) { }

  changeMemberPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }

  // 好几个类型的时候用pipe map，单个数据类型的时候用subscribe！subscribe是终结，没必要return！
  login(model: any) {
    // observe body即为observe response.body!
    return this.http.post(this.baseurl + 'login', model, {observe: 'body'}).pipe(
      map((response: any) => {
        // alert(response.user);
        const user = response;
        // if (user) {
        //   alert(user.token);
        // }
        if (user) {
          localStorage.setItem('token', user.token);
          localStorage.setItem('user', JSON.stringify(user.user));
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
          this.currentUser = user.user;
          this.changeMemberPhoto(this.currentUser.photoUrl);
          this.currentPhotoUrl = this.currentUser.photoUrl;
        }
        return user;
      })
    );
  }

  register(user: User) {
    return this.http.post(this.baseurl + 'register', user);
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    if (this.jwtHelper.isTokenExpired(token)) {
      localStorage.removeItem('tempParams');
      this.tempParams = {gender:  'all', minAge: 18, maxAge: 99, orderBy: 'lastactive'};
      return false;
    } else {
      return true;
    }
  }

  // T() {
  //   return this.TT;
  // }
}
