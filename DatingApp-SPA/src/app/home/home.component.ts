import { Component, OnInit, Injectable, DoCheck} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../_services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { UserService } from '../_services/user.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  // animations: [ // 动画的内容
  //   trigger('visibilityChanged', [
  //     // state 控制不同的状态下对应的不同的样式
  //     state('shown' , style({ opacity: 1, transform: 'scale(1.0)' })),
  //     state('hidden', style({ opacity: 0, transform: 'scale(0.0)' })),
  //     // transition 控制状态到状态以什么样的方式来进行转换
  //     transition('shown => hidden', animate('600ms')),
  //     transition('hidden => shown', animate('300ms')),
  //   ])
  // ]
})

@Injectable({
  providedIn: 'root'
})
export class HomeComponent implements OnInit, DoCheck {
  // visibility = 'shown';
  registerMode = false;
  aboutMode = false;
  values: any;
  date: string;
  inter: any;
  about = new BehaviorSubject<boolean>(false);

  constructor(public authService: AuthService, public userService: UserService, private http: HttpClient) { }

  ngOnInit() {
    this.getValues();
    const d = new Date();
    this.date = d.toLocaleTimeString();
    console.log(this.date);
    // this.inter = setInterval(() => {
    //   const d = new Date();
    //   this.date = d.toLocaleTimeString();
    //   }, 1000);
  }
  ngDoCheck(): void {
    // const d = new Date();
    // this.date = d.toLocaleTimeString();
  }

  ab() {
    // this.aboutMode = !this.aboutMode;
    // return this.aboutMode;
    // console.log(this.aboutMode);
    // console.log(this.userService.T());
    // return this.userService.TT;
  }

  aboutToggle() {
    this.aboutMode = true;
    // console.log(this.aboutMode);
    this.userService.TT = true;

    // this.authService.TT = true;
    // this.about.next(true);
  }

  // AToggle() {
  //   const d = new Date();
  //   return  d.toLocaleTimeString();
  // }

  // tslint:disable-next-line:use-life-cycle-interface
  // ngOnDestroy() {
  //   if (this.inter) {
  //     clearInterval(this.inter);
  //   }
  // }

  // change() {
  //   let i = 0;
  //   const inter = setInterval(() => {
  //     if (i % 2 === 0) {
  //       this.visibility = 'hidden';
  //     }
  //     if (i % 2 === 1) {
  //       this.visibility = 'shown';
  //     }
  //     i++;
  //     console.log(i);
  //     }, 600);
  // }

  cancelAboutMode() {
    this.aboutMode = false;
    this.userService.TT = false;

    // this.authService.about.next(false);
    // this.authService.TT = false;
  }

  registerToggle() {
    this.registerMode = true;
  }

  cancelRegisterMode() {
    this.registerMode = false;
  }

  getValues () {
    this.http.get('http://localhost:5000/api/values').subscribe(response => {
      this.values = response;
      console.log(this.values);
    }, error => {
      console.log(error);
    });
  }

}
