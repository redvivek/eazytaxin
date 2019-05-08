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

    public setCurrApplicationValue(data): void {
        this.currentAppSubject.next(data);
    }

    fetchDashboardDataByAssYearUserId(assYear:string,userid:number){
        var inputdata = {
            "assYear" : assYear,
            "userid" : userid
        };
        return this.http.post(`${environment.apiUrl}/tax/fetchDashboardInfo`, inputdata);
    }

    fetchAppDetailsByAppidAndUserId(appId:number,userId:number){
        var inputdata = {
            "appId" : appId,
            "userId" : userId
        };
        return this.http.post(`${environment.apiUrl}/tax/fetchAppInfo`, inputdata);
    }

    fetchInProgAppDataByUserid(userid:number,selYear:string){
        return this.http.post(`${environment.apiUrl}/tax/fetchInProgApps`,{"userid":userid,"selYear":selYear})
        .pipe(map(data => {
            if(data['statusCode'] == 200){
                if (data['ResultData']) {
                    //console.log("Current InProg App value"+ JSON.stringify(data['ResultData']));
                    if(data['ResultData'].length > 0){
                        const appdata:ApplicationMain = { 
                            'appId': data['ResultData'][0].ApplicationId,
                            'taxperiod':data['ResultData'][0].AssesmentYear,
                            'xmluploadflag':data['ResultData'][0].XmlUploadFlag,
                            'applicationStage':data['ResultData'][0].ApplicationStage, 
                            'appStatus':'Progress' 
                        };
                        localStorage.removeItem("currentUserApp");
                        localStorage.setItem("currentUserApp", JSON.stringify(appdata));
                        this.currentAppSubject.next(appdata);
                    }
                }
            }
            return data;
        }));
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

    getDataFromXMLByUserId(appid:number,userid:number,category:string){
        var jsonInput = {
            "appid":appid,
            "userid" : userid,
            "category" : category
        };
        return this.http.post<any>(`${environment.apiUrl}/tax/getInfoFromXML`, jsonInput)
        .pipe(map(result => {
            if(result['statusCode'] == 200){
                if (result['infoData']) {
                    //console.log("Current App value"+ JSON.stringify(result['infoData']));
                    return result['infoData'];
                }
            }
            /* if(result['statusCode'] == 201){
                if (result['Message']) {
                    console.log("Current App value"+ JSON.stringify(result['Message']));
                    let data = [];
                    return null;
                }
            }

            if(result['statusCode'] == 204){
                if (result['Message']) {
                    console.log("Current App value"+ JSON.stringify(result['Message']));
                    let data = [];
                    return null;
                }
            } */
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

    getPersonalInfoByAppId(id: number) {
        return this.http.post<any>(`${environment.apiUrl}/tax/appPersonalDetails`, { id })
        .pipe(map(perinfodata => {
            if(perinfodata['statusCode'] == 200){
                if (perinfodata['PerData'] != "") {
                    //console.log("Current App value"+ JSON.stringify(perinfodata['PerData']));
                    return perinfodata['PerData'];
                }else{
                    return null;
                }
            }
        }));
    }

    checkExistingPan(panVal : string,userid:number){
        return this.http.post<any>(`${environment.apiUrl}/tax/checkExistingPan`, {'panVal':panVal,'userId':userid});
    }

    getAddressInfoByAppId(id: number,addresstype:string) {
        return this.http.post<any>(`${environment.apiUrl}/tax/appAddressDetails`, { id,addresstype })
            .pipe(map(perinfodata => {
                if(perinfodata['statusCode'] == 200){
                    if (perinfodata['PerData'] != "") {
                        //console.log("Current App value"+ JSON.stringify(perinfodata['PerData']));
                        return perinfodata['PerData'];
                    }else{
                        return null;
                    }
                }
            }));
    }

    getBankInfoByAppId(id: number) {
        return this.http.post<any>(`${environment.apiUrl}/tax/appBankDetails`, { id })
            .pipe(map(perinfodata => {
                if (perinfodata['PerData'] != "") {
                    //console.log("Current App value"+ JSON.stringify(perinfodata['PerData']));
                    return perinfodata['PerData'];
                }else{
                    return null;
                }
            }));
    }

    getAssetsInfoByAppId(id: number) {
        return this.http.post<any>(`${environment.apiUrl}/tax/appAssetsDetails`, { id })
            .pipe(map(perinfodata => {
                if (perinfodata['PerData'] != "") {
                    //console.log("Current App value"+ JSON.stringify(perinfodata['PerData']));
                    return perinfodata['PerData'];
                }else{
                    return null;
                }
            }));
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

    updateAssestInfoData(assestinfodata){
        return this.http.post(`${environment.apiUrl}/tax/updateAssestsInfo`, assestinfodata);
    }

    //save assests info details
    saveImmAssestsInfoData(immovableAssInputParam) {
        var jsonInput = {
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

    //save deduction details
    saveDeductionsDetails(deductionsInputParam){
        return this.http.post(`${environment.apiUrl}/tax/saveDeductions`, deductionsInputParam);
    }

    saveOtherDeductionsDetails(deductionsInputParam){
        return this.http.post(`${environment.apiUrl}/tax/saveOtherDeductions`, deductionsInputParam);
    }

    fetchDeductionDetails(userid,appid){
        var jsonInput = {
            "userid" : userid,
            "appid" : appid
        };
        return this.http.post(`${environment.apiUrl}/tax/fetchDeductionsDetails`, jsonInput);
    }

    saveTaxexPaidDetails(taxesPaidParam){
        return this.http.post(`${environment.apiUrl}/tax/saveTaxpaidInfo`, taxesPaidParam);
    }

    getPaymentInfoByAppidAndUsrid(appid,userid){
        var jsonInput = {
            "userid" : userid,
            "appid" : appid
        };
        return this.http.post(`${environment.apiUrl}/tax/fetchAppPaymentDetails`, jsonInput);
    }

    getTransInfoByAppidAndUsrid(appid,userid){
        var jsonInput = {
            "userid" : userid,
            "appid" : appid
        };
        return this.http.post(`${environment.apiUrl}/tax/fetchAppTransDetails`, jsonInput);
    }

    savePaymentDetails(inputJson){
        return this.http.post(`${environment.apiUrl}/tax/saveTranInfo`, inputJson);
    }

    doFinalSubmission(appid,userid){
        var jsonInput = {
            "userid" : userid,
            "appid" : appid
        };
        return this.http.post(`${environment.apiUrl}/tax/submitITRApplication`, jsonInput);
    }
}