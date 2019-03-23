import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination, PaginatedResult } from '../_models/pagination';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { isNgTemplate } from '@angular/compiler';
import { User } from '../_models/user';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  // 很关键！！！！！！！！
  // pagination: Pagination = {currentPage: 8, itemsPerPage: 5, totalPages: 10, totalItems: 50};
  pagination: Pagination;

  messageContainer = 'Unread';
  // currentpage = 1;
  // itemsperpage = 5;

  constructor(private userService: UserService, private authService: AuthService,
    private route: ActivatedRoute, private alertify: AlertifyService, private pag: PaginatedResult<Message[]>) {  }

  ngOnInit() {
    // const pag: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();
    // pag.pagination.currentPage = 8;
    // pag.pagination.itemsPerPage = 5;
    // pag.pagination.totalItems = 39;
    // pag.pagination.totalPages = 8;
    // this.pagination = this.pag.pagination;
    // this.pag.pagination.currentPage = 8;
    // this.pagination = this.pag.pagination;
    this.route.data.subscribe((res: PaginatedResult<Message[]>) => {
      // this.pag = data['messages'];

      // 整体初始化后可以单独赋值！！！！！！！！！！
      // this.pagination.currentPage = 5;
      // this.pagination.itemsPerPage = 10;
      // this.loadMessages();

      this.messages = res['messages'].result;
      this.pagination = res['messages'].pagination;

      // this.pagination = this.pag.pagination;

      // this.pagination.itemsPerPage = 10;
      // this.messages = this.pag.result;
    });
    // this.loadMessages();
  }

  // 所有函数必须要有终点（subscribe）
  loadMessages() {
    // const p: Observable<Message[]> = this.userService.getMessages(this.authService.decodedToken.nameid,
    //   this.pagination.currentPage, this.pagination.itemsPerPage, this.messageContainer).pipe(
    //         map((res: any) => {
    //         this.messages = res.result;
    //         this.pagination = res.pagination;
    //         return this.messages;
    //       })
    //   );
    //   p.subscribe(() => {});
    //   alert(p);

    this.userService.getMessages(this.authService.decodedToken.nameid, this.pagination.currentPage,
      this.pagination.itemsPerPage, this.messageContainer)
      .pipe(
        map((res: any) => {
        // alert(JSON.stringify(res));
        this.messages = res.result;
        this.pagination = res.pagination;
      })
      ).subscribe(() => {
        }, error => {
          this.alertify.error(error);
        });

      // this.userService.getMessages(this.authService.decodedToken.nameid, this.pagination.currentPage,
      //   this.pagination.itemsPerPage, this.messageContainer)
      //   .pipe(
      //     map((response: any) =>  {
      //       this.messages = response.body;
      //       if (response.headers.get('Pagination') != null) {
      //         this.pagination = JSON.parse(response.headers.get('Pagination'));
      //       }
      //     })
      //   ).subscribe(() => {});

      // this.userService.getMessages(this.authService.decodedToken.nameid, this.pagination.currentPage,
      //   this.pagination.itemsPerPage, this.messageContainer)
      //   .subscribe((res: PaginatedResult<Message[]>) => {
      //     this.messages = res.result;
      //     this.pagination = res.pagination;
      //   }, error => {
      //     this.alertify.error(error);
      //   });

    // if (this.pagination != null) {
    //   this.userService.getMessages(this.authService.decodedToken.nameid, this.pagination.currentPage,
    //     this.pagination.itemsPerPage, this.messageContainer)
    //     .subscribe((res: PaginatedResult<Message[]>) => {
    //       this.messages = res.result;
    //       this.pagination = res.pagination;
    //     }, error => {
    //       this.alertify.error(error);
    //     });
    // } else {
    //   this.userService.getMessages(this.authService.decodedToken.nameid, this.currentpage,
    //     this.itemsperpage, this.messageContainer)
    //     .subscribe((res: PaginatedResult<Message[]>) => {
    //       this.messages = res.result;
    //       this.pagination = res.pagination;
    //     }, error => {
    //       this.alertify.error(error);
    //     });
    // }
  }

  deleteMessage(id: number) {
    this.alertify.confirm('Are you sure you want to delete', () => {
      this.userService.deleteMessage(id, this.authService.decodedToken.nameid).pipe(
        map((res: any) => {
          this.alertify.success('Message deleted');
          this.loadMessages();
        })
      ).subscribe(() => {
      }, error => {
          this.alertify.error(error);
        });
    });

    // 很关键，运行速度问题，loadmessages()运行快，所以一个不够用！！！！！！！
    // this.alertify.confirm('Are you sure you want to delete', () => {
    //   this.userService.deleteMessage(id, this.authService.decodedToken.nameid);
    //   // this.messages.splice(this.messages.findIndex(p => p.id === id), 1);
    //   this.alertify.success('Message deleted');
    //   this.loadMessages();
      // this.loadMessages();
      // this.loadMessages();
      // this.loadMessages();
      // this.loadMessages();
    // });

    // this.alertify.confirm('Are you sure you want to delete', () => {
    //   this.userService.deleteMessage(id, this.authService.decodedToken.nameid).subscribe(() => {
    //     // this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
    //     this.alertify.success('Message deleted');
    //     this.loadMessages();
    //   }, error => {
    //     this.alertify.error(error);
    //   });
    // });
  }

  pageChanged(event: any) {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }

}
