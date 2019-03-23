import { Component, OnInit, ViewChild, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: FormGroup;
  @ViewChild('dd') dd: ElementRef;
  user: User;
  photoUrl: string;
  temp: string;
  c: boolean;
  d: any;

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(private route: ActivatedRoute, private alertify: AlertifyService, private userService: UserService,
    private authService: AuthService, private render2: Renderer2) {
      this.temp = 'wewewe';
     }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });
    // this.temp = null;
    // console.log(this.temp);
    this.authService.photoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
    // this.photoUrl = this.authService.currentPhotoUrl;
  }

  // A() {
  //   const p = this.dd.nativeElement.querySelector('h1');
  //   this.render2.setStyle(p, 'background', 'blue');
  // }

  // tslint:disable-next-line:use-life-cycle-interface
  // ngAfterViewInit() {
    // const p = this.dd.nativeElement.querySelector('h1');
    // this.render2.setStyle(p, 'background', 'blue');
  // }

  updateUser() {
    // if (this.user.introduction === '') {
    //   this.alertify.success('NONONO');
    //   this.c = true;
    //   return false;
    // } else {
    //   this.c = false;
    // }

    // console.log(this.editForm.value);

    this.userService.updateUser(this.authService.decodedToken.nameid, this.user)
    .pipe(
      map((res: any) => {
        console.log(res);
        return res;
    })
    ).subscribe((user: User) => {
      console.log(user);
      this.alertify.success('Updated successfully');
      // console.log(user);
      this.user = user;
      // console.log(this.user.introduction);
      // console.log(user.introduction);
      // console.log(this.editForm.value);
      // console.log(this.user.introdction);
      // console.log(this.user);
      // this.user.introdction = 'xsax';
      this.d = this.editForm.value;
      console.log(this.d.interests);
      this.editForm.reset(this.user);
    }, error => {
      this.alertify.error(error);
    });
  }

  updateMainPhoto(photoUrl) {
    this.user.photoUrl = photoUrl;
  }
}
