import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Message } from '../_models/message';
import { AuthService } from '../_services/auth.service';
import { PaginatedResult } from '../_models/pagination';


@Injectable()
export class MessagesResolver {
    pageNumber = 1;
    pageSize = 5;
    messageContainer = 'Unread';

    constructor(private userService: UserService, private authService: AuthService,
        private router: Router, private alertify: AlertifyService) {}

    resolve() {
        // 如果还想return就不能用subscribe!
        return this.userService.getMessages(this.authService.decodedToken.nameid, this.pageNumber,
            this.pageSize, this.messageContainer).pipe(
                map((res: any) => {
                    // res.pagination.currentPage = 8;
                    return res;
                }),
                catchError(error => {
                this.alertify.error('Problem retrirving messages');
                this.router.navigate(['']);
                return of(null);
            })
        );

        // 错的
        // return this.userService.getMessages(this.authService.decodedToken.nameid, this.pageNumber,
        //     this.pageSize, this.messageContainer).subscribe((res: PaginatedResult<Message[]>) => {
        //         this.alertify.success('asxaxsa');
        //         return res;
        //     });

        // 对的
        // const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();
        // return this.userService.getMessages(this.authService.decodedToken.nameid, this.pageNumber,
        //     this.pageSize, this.messageContainer).pipe(
        //         map((response: any) =>  {
        //             paginatedResult.result = response.body;
        //             if (response.headers.get('Pagination') != null) {
        //               paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        //             }
        //             return paginatedResult;
        //           }),
        //         catchError(error => {
        //             this.alertify.error('Problem retrirving messages');
        //             this.router.navigate(['']);
        //             return of(null);
        //         })
        // );
    }
}
