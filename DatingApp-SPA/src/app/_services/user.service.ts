import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../_models/user';
import { PaginatedResult, PaginatedResultMes, Pagination } from '../_models/pagination';
import { map } from 'rxjs/operators';
import { Message } from '../_models/message';
import { Photo } from '../_models/Photo';
// import { Card } fxrom '../_models/card';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;
  TT: boolean;
  i = 1;
  // uu: User = {id: 90,
  //   username: 'string',
  //   knownAs: 'string',
  //   age: 18,
  //   gender: 'male',
  //   created: '',
  //   lastActive: '2018-11-26T00:00:00',
  //   photoUrl: '',
  //   city: 'string',
  //   country: 'string'};
  // U = new BehaviorSubject<User>(this.uu);
  U: Observable<User> = new Observable<User>();

  constructor(private http: HttpClient) {
    this.U = this.http.get<User>(this.baseUrl + 'users/1');
  }

  getUsers(page?, itemsPerPage?, userParams?, likeParams?) {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if (userParams != null) {
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);
      // params = params.append('Red', userParams.Red);
      // params = params.append('Blue', userParams.Blue);
      // params = params.append('Green', userParams.Green);
    }

    if (likeParams === 'Likers') {
      params = params.append('likers', 'true');
    }
    if (likeParams === 'Likees') {
      params = params.append('likees', 'true');
    }

    // return this.http.get<User[]>(this.baseUrl + 'users', {observe: 'response', params})
    //   .pipe(
    //     map(response => {
    //       paginatedResult.result = response.body;
    //       if (response.headers.get('Pagination') != null) {
    //         paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
    //       }
    //       return paginatedResult;
    //     })
    //   );
    return this.http.get<User[]>(this.baseUrl + 'users', {observe: 'response', params})
      .pipe(
        map((response: any) => {
          paginatedResult.pagination = response.body.page;
          paginatedResult.result = response.body.userToReturn;
          return paginatedResult;
        })
      );
  }

  T() {
    return this.TT;
  }

  get() {
    this.i++;
    console.log(this.i);
    this.U = this.http.get<User>(this.baseUrl + 'users/' + this.i);
  }

  getUser(id) {
    return this.http.get<User>(this.baseUrl + 'users/' + id);
  }

  // getCard() {
  //   return this.http.get<Card[]>(this.baseUrl + 'values/cards');
  // }

  updateUser(id: number, user: User) {
    return this.http.post(this.baseUrl + 'users/' + id, user);
  }

  setMainPhoto(userId: number, id: number) {
    function set(_userId: number, _id: number, baseUrl: string, http: HttpClient): Observable<Object> {
      return http.post(baseUrl + 'users/' + _userId + '/photos/' + _id + '/setMain', {});
    }
    return set(userId, id, this.baseUrl, this.http);
    // return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {});
  }

  deletePhoto(userId: number, id: number) {
    return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + id, {});
  }

  sendLike(id: number, recipientId: number) {
    return this.http.post(this.baseUrl + 'users/' + id + '/like/' + recipientId, {});
  }

  getMessages(id: number, page?, itemsPerPage?, messageContainer?) {
    // const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();

    // tslint:disable-next-line:prefer-const
    let result: Message[];
    // tslint:disable-next-line:prefer-const
    let pagination: Pagination;
    // tslint:disable-next-line:prefer-const
    let paginatedResult: PaginatedResultMes = {result, pagination};

    let params = new HttpParams();

    params = params.append('MessageContainer', messageContainer);

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    // {observe: 'response', params}便是此函数的第二个参数，observe代表后面要调用response的header等，params和post方法中的传参一样的！
    // 如果不加response则和userdetail一样！如果换成post也可一样操作！
    // response换成body也可以！
    return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages', {observe: 'response', params})
      .pipe(
        map((response: any) =>  {
          // alert(response.length);
          // return response;
          paginatedResult.result = response.body;
          // if (paginatedResult.result.length > 0) {
          //   alert(response.body[0].content);
          // }
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          // paginatedResult.pagination.currentPage = 8;
          // paginatedResult.pagination.itemsPerPage = 5;
          // paginatedResult.pagination.totalItems = 39;
          // paginatedResult.pagination.totalPages = 8;
          return paginatedResult;
        })
      );
  }

  getMessagethread(id: number, recipientId: number) {
    return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages/thread/' + recipientId);
  }

  sendMessage(id: number, message: Message) {
    return this.http.post(this.baseUrl + 'users/' + id + '/messages', message);
  }

  deleteMessage(id: number, userId: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + id, {});
  }

  markAsRead(messageId: number, userId: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + messageId + '/read', {});
  }
}

