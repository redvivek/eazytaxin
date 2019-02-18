import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { ApplicationMain, Basicinfo} from '@app/_models';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
    private currentAppSubject: BehaviorSubject<ApplicationMain>;
    public currentApplication: Observable<ApplicationMain>;

    constructor(
        private http: HttpClient
    ) {
        this.currentAppSubject = new BehaviorSubject<ApplicationMain>(JSON.parse(localStorage.getItem('currentUserApp')));
        this.currentApplication = this.currentAppSubject.asObservable();
    }

    public get currentApplicationValue(): ApplicationMain {
        return this.currentAppSubject.value;
    }

    fetchDashboardDataByAssYearUserId(assYear,userid){
        var inputdata = {
            "assYear" : assYear,
            "userid" : userid
        };
        return this.http.post(`${environment.apiUrl}/tax/fetchDashboardInfo`, inputdata);
    }

    getByAppId(id: number) {
        return this.http.post<any>(`${environment.apiUrl}/tax/appMainDetails`, { id })
            .pipe(map(appmaindata => {
                if(appmaindata['statusCode'] == 200){
                    if (appmaindata['AppData']) {
                        //console.log("Current App value"+ JSON.stringify(appmaindata['AppData']));
                    }
                }
                
                return appmaindata['AppData'];
            }));
    }
    
    //Initate Application creation
    createApplication(applicationData) {
        return this.http.post(`${environment.apiUrl}/tax/createApplication`, applicationData);
    }

    //update Application main table with basicinfo details
    updateApplicationMain(basicInfoData) {
        return this.http.post(`${environment.apiUrl}/tax/saveBasicInfo`, basicInfoData);
    }

    //save persoanl info details
    savePersonalInfoData(perinfoData) {
        return this.http.post(`${environment.apiUrl}/tax/savePersonalInfo`, perinfoData);
    }
    
    //save address info details
    saveAddressInfoData(addinfoData) {
        return this.http.post(`${environment.apiUrl}/tax/saveAddressInfo`, addinfoData);
    }
    
    //save bank info details
    saveBankInfoData(bankinfodata) {
        return this.http.post(`${environment.apiUrl}/tax/saveBankDetails`, bankinfodata);
    }
    
    //save assests info details
    saveAssestsInfoData(assestinfodata) {
        return this.http.post(`${environment.apiUrl}/tax/saveAssestsInfo`, assestinfodata);
    }

    //save assests info details
    saveImmAssestsInfoData(assInfoId,immovableAssInputParam) {
        var jsonInput = {
            "assInfoId" : assInfoId,
            "immovableAssInputParam" : immovableAssInputParam
        };
        return this.http.post(`${environment.apiUrl}/tax/saveImmAssestsInfo`,jsonInput);
    }

    //save Sal Income info details
    saveSalIncomeDetails(salinfoData) {
        console.log("InputParam "+salinfoData);
        return this.http.post(`${environment.apiUrl}/tax/saveSalaryIncome`, salinfoData);
    }

    //save Other Income info details
    saveOtherIncomeDetails(othinfoData) {
        return this.http.post(`${environment.apiUrl}/tax/saveOtherIncome`, othinfoData);
    }

    //save HouseProp Income info details
    saveHouseIncomeDetails(houseinfoData) {
        return this.http.post(`${environment.apiUrl}/tax/saveHouseIncome`, houseinfoData);
    }

    //save RentalProp Income info details
    saveRentalIncomeDetails(rentalinfoData) {
        return this.http.post(`${environment.apiUrl}/tax/saveRentalIncome`, rentalinfoData);
    }

    //save RentalProp Income info details
    saveCapitalIncomeDetails(capitalinfoData) {
        return this.http.post(`${environment.apiUrl}/tax/saveCapitalIncome`, capitalinfoData);
    }
}