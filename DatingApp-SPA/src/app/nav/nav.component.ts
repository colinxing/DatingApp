import { Component, OnInit, DoCheck, Injectable, OnDestroy } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';
import { User } from '../_models/user';
import { HomeComponent } from '../home/home.component';
import { AttrAst } from '@angular/compiler';
import { UserService } from '../_services/user.service';
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  providers: [HomeComponent],
  animations: [ // 动画的内容
    trigger('visibilityChanged', [
      // state 控制不同的状态下对应的不同的样式
      state('shown' , style({ opacity: 1, transform: 'scale(25,25)' })),
      state('hidden', style({ opacity: 0, fontSize: '1px' })),
      // transition 控制状态到状态以什么样的方式来进行转换
      transition('shown => hidden', animate('1000ms')),
      transition('hidden => shown', animate('1000ms')),
    ])
  ]
})

@Injectable({
  providedIn: 'root'
})
export class NavComponent implements OnInit, OnDestroy {
  visibility = 'hidden';
  model: any = {};
  photoUrl: string;
  private alerify;
  AA: boolean;
  inter: any;

  constructor(public home: HomeComponent, public authService: AuthService, alertify: AlertifyService,
              private router: Router, public userService: UserService) {
    this.alerify = alertify;
  }

  ngOnInit() {
    this.authService.photoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
    // this.photoUrl = this.authService.photoUrl;

    // this.userService.U.subscribe((res: any) => {
    //   console.log('res.knownAs');
    // }, error => {
    //   console.log(error);
    // });

    let i = 0;
    this.inter = setInterval(() => {
      if (i % 2 === 0) {
        this.visibility = 'hidden';
      }
      if (i % 2 === 1) {
        this.visibility = 'shown';
      }
      i++;
      console.log(i);
      }, 1000);

    this.home.about.subscribe((res: boolean) => {
      this.AA = res;
      console.log('AA:' + this.AA);
    });
  }

  ngOnDestroy() {
    if (this.inter) {
      clearInterval(this.inter);
    }
  }

  A() {
    // return this.authService.T();
    // return this.AA;
    // console.log(this.home.aboutMode);
    // this.userService.get();
    // return this.home.ab();

    // this.home.aboutMode = !this.home.aboutMode;
    // console.log(this.home.aboutMode);

    // return this.home.aboutMode;
    // const a = this.home.ab();
    // console.log(a);
    // return a;
  }
  B() {
    this.home.about.next(true);
  }

  login() {
      this.authService.login(this.model).subscribe((res: any) => {
        // this.alerify.success(res.user.city);
        this.alerify.success('Login Successfully!');
        // alert('successfully');
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
    localStorage.removeItem('user');
    localStorage.removeItem('tempParams');
    this.authService.decodedToken = null;
    this.authService.currentUser = null;
    this.authService.tempParams = {gender:  'all', minAge: 18, maxAge: 99, orderBy: 'lastactive'};
    console.log('logged out!');
    this.alerify.message('Logout');
    this.router.navigate(['/home']);
  }
}
