import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { User } from '../../_models/user';
import { ActivatedRoute } from '@angular/router';
import { subscribeOn } from 'rxjs/operators';
import { Pagination, PaginatedResult } from '../../_models/pagination';
import { RegisterComponent } from 'src/app/register/register.component';
import { registerContentQuery } from '@angular/core/src/render3/instructions';
import { AuthService } from 'src/app/_services/auth.service';
import { FormGroup, NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
  providers: [RegisterComponent]
})
export class MemberListComponent implements OnInit {
  @ViewChild('form') form: NgForm;

  users: User[];
  user: User = JSON.parse(localStorage.getItem('user'));
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}, {value: 'all', display: 'All'}];
  userParams: any = {};
  pagination: Pagination;
  c: boolean;
  colors: any;

  constructor(private authService: AuthService, private reg: RegisterComponent, private userService: UserService,
              private alertify: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });

    this.colors = [
      {name: 'Red', status: true, id: 'Red'},
      {name: 'Blue', status: false, id: 'Blue'},
      {name: 'Green', status: true, id: 'Green'}
    ];
    // this.colors[1].status = true;
    this.userParams.Red = true;
    this.userParams.Blue = false;
    this.userParams.Green = true;

    this.userParams.gender = this.authService.tempParams.gender;
    this.userParams.minAge = this.authService.tempParams.minAge;
    this.userParams.maxAge = this.authService.tempParams.maxAge;
    this.userParams.orderBy = this.authService.tempParams.orderBy;
    localStorage.setItem('tempParams', JSON.stringify(this.authService.tempParams));
    // this.authService.tempParams = this.userParams;
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  changecolor(color) {
    color.status = !color.status;
    if (color.name === 'Red') {
      this.userParams.Red = color.status;
    }
    if (color.name === 'Blue') {
      this.userParams.Blue = color.status;
    }
    if (color.name === 'Green') {
      this.userParams.Green = color.status;
    }
  }

  resetFilters() {
    this.colors = [
      {name: 'Red', status: true, id: 'Red'},
      {name: 'Blue', status: false, id: 'Blue'},
      {name: 'Green', status: true, id: 'Green'}
    ];
    this.userParams.Red = true;
    this.userParams.Blue = false;
    this.userParams.Green = true;

    this.userParams.gender = 'all';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'lastactive';
    this.authService.tempParams = this.userParams;
    this.loadUsers();
  }

  loadUsers() {
    console.log(this.userParams);
    console.log(this.pagination);
    // console.log(this.authService.tempParams);
    this.authService.tempParams = this.userParams;
    localStorage.setItem('tempParams', JSON.stringify(this.authService.tempParams));
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
      .subscribe((res: PaginatedResult<User[]>) => {
      this.users = res.result;
      this.pagination = res.pagination;
    }, error => {
      this.alertify.error(error);
    });
  }

  // OOO(event) {
  //   console.log(event.key);
  // }

  check() {
    if (this.userParams.minAge === 0) {
      this.c = true;
    } else {
      this.c = false;
    }
  }

  test() {
    this.reg.register();
    // if (this.reg.test2() === 1) {
    //   console.log('ok');
    // }
  }
  // look(str: string) {
  //   this.userParams.orderBy = str;
  //   this.loadUsers();
  // }
}
