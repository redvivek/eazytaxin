import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
//import 'rxjs/add/operators/catch';

import { environment } from '@environments/environment';
import { NewUser} from '@app/_models';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    /*getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById(id: number) {
        return this.http.get(`${environment.apiUrl}/users/${id}`);
    }*/

    register(user: NewUser) {
        return this.http.post(`${environment.apiUrl}/users/register`, user);
    }

    /*update(user: User) {
        return this.http.put(`${environment.apiUrl}/users/${id}`, user);
    }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`);
    }*/

    checkUserByEmailId(emailid: string){
        //console.log("Email" + emailid);
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        return this.http.post(`${environment.apiUrl}/users/isEmailRegisterd`, { email: emailid }, { headers: headers })
            .pipe(
            map((response: Response) => response.json()),
            catchError (this.handleError)
            )
    }

    private handleError(error: any) {
        console.log(error);
        return Observable.throw(error.json());
        ;
    }
}