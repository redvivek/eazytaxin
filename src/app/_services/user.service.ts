import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById(id: number) {
        return this.http.get(`${environment.apiUrl}/users/${id}`);
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/users/register`, user);
    }

    update(user: User) {
        return this.http.put(`${environment.apiUrl}/users/${user.UserId}`, user);
    }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`);
    }

    checkUserByEmailId(emailid: string){
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(`${environment.apiUrl}/users/isEmailRegisterd`, JSON.stringify({ email: emailid }), { headers: headers })
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.log(error);
        return Observable.throw(error.json());
        ;
    }
}