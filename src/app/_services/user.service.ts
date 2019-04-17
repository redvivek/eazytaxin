import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable ,BehaviorSubject} from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
//import 'rxjs/add/operators/catch';

import { environment } from '@environments/environment';
import { NewUser} from '@app/_models';

@Injectable({ providedIn: 'root' })
export class UserService {
    
    private messageSource = new BehaviorSubject('');
    currentMessage = this.messageSource.asObservable();

    constructor(private http: HttpClient) { }

    changeMessage(message: string) {
        this.messageSource.next(message)
    }

    public get currentMessageValue(){
        return this.messageSource.value;
    }

    /*getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById(id: number) {
        return this.http.get(`${environment.apiUrl}/users/${id}`);
    }*/

    register(user: NewUser) {
        return this.http.post(`${environment.apiUrl}/users/register`, user);
    }

    sendActivationLink(userid:string){
        var inputdata = {
            "userid" : userid
        };
        return this.http.post(`${environment.apiUrl}/users/sendActivationMail`, inputdata);
    }

    verifyCode(resetcode:string,userid:string){
        var inputdata = {
            "userid" : userid,
            "resetcode" : resetcode
        };
        return this.http.post(`${environment.apiUrl}/users/checkResetCode`, inputdata);
    }

    resetPassword(userid:string,password:string){
        var inputdata = {
            "userid" : userid,
            "password" : password
        };
        return this.http.post(`${environment.apiUrl}/users/updatePassword`, inputdata);
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

    forgetPassword(emailid: string){
        console.log("Email " + emailid);
        var inputdata = {
            "emailid" : emailid
        };
        return this.http.post(`${environment.apiUrl}/users/sendForgetPwdLink`, inputdata);

    }

    private handleError(error: any) {
        console.log(error);
        return Observable.throw(error.json());
        ;
    }
}