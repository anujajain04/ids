import { Component, ElementRef, ViewChild,  } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
//import { Injectable, Inject, Optional, OpaqueToken } from '@angular/core';
import { DatasetService, DeleteDatasetDto, DatasetListDto, DatasetType, DatasetDto, DatasetHistoryDto, PassService, LoadingService } from '@shared/service-proxies/ids-service-proxies';
//import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Router } from '@angular/router';
//import { AnalysisDtoDetails, AnalysisService, AnalysisStudioConfig } from '@shared/service-proxies/ids-analysis-service-proxies';
import {DashboardService, customDashboardParameters} from '@shared/service-proxies/ids-dashboard-service-proxies';
@Component({
    templateUrl: './use-cases.component.html',
    selector: 'Bo-dashbaord'
})

export class UseCaseComponent{
    dataset: DatasetDto[] = [];
    filterdataset: DatasetDto[];
    deleteDataset: DatasetDto[] = [];
    datatypes: DatasetType[];
    selectedType: string = null;
    typeLoad: boolean = false;
    i: number = 1;
    history: DatasetHistoryDto;
    pageSize: number = 10;
    currentPage: number;
    j: number;
    dashboardOutput: string;
    noCustomEntry : boolean = true;
    datasetName : string;
    reportName : string;
    datasetType : string;
    reportId : string;
    reportType : string;
    currentProjectUrl : any;
    url : string = null;
    //dashboardList: any = JSON.parse("[{'datasetName':'Fraud Prediction', 'reportName':'Fraud_Data','datasetType':'Excel', 'reportId':'Aadhbd4fNOJFsWSOT3jOiOA', 'reportType':'WebiReport'},{'datasetName':'Bankruptcy Prediction', 'reportName':'Bankruptcy_Prediction','datasetType':'Excel', 'reportId':'Afnw.Vxcdt5Fi4.fkofrKPM', 'reportType':'WebiReport'},{'datasetName':'Email Analysis','reportName':'EmailData','datasetType':'Excel', 'reportId':'AZ3jXnzjJCVDvxblba.Naos', 'reportType':'WebiReport'},{'datasetName':'Texonomix','reportName':'Telecom','datasetType':'Excel', 'reportId':'AYeviaWx88hGnPxoW6yDKUY', 'reportType':'WebiReport'}]");
    dashboardList1: any = [{datasetName:'Fraud Prediction', reportName:'Fraud_Data',datasetType:'Excel', reportId:'Aadhbd4fNOJFsWSOT3jOiOA', reportType:'WebiReport'},{datasetName:'Bankruptcy Prediction', reportName:'Bankruptcy_Prediction',datasetType:'Excel', reportId:'Afnw.Vxcdt5Fi4.fkofrKPM', reportType:'WebiReport'},{datasetName:'Email Analysis',reportName:'EmailData',datasetType:'Excel', reportId:'AZ3jXnzjJCVDvxblba.Naos', reportType:'WebiReport'},{datasetName:'Texonomix',reportName:'Telecom',datasetType:'Excel', reportId:'AYeviaWx88hGnPxoW6yDKUY', reportType:'WebiReport'},{datasetName:'Navigator', reportName:'Navigator',datasetType:'No',reportId:'application_base/Navigator_Analytics/', reportType:''}];
    dashboardList2: any = [{datasetName:'IOT', reportName:'IOT',datasetType:'No',reportId:'application_base/Passive_Infrastructure_Analytics/', reportType:''},{datasetName:'Wealth Management', reportName:'Wealth Management',datasetType:'No',reportId:'application_base/Wealth_Mgmt_Dashboard/', reportType:''}];
    
            
            
    
    //console.log(dashboardList);
    /*dashboardList: any = [{'dataseName':'Fraud Prediction','dashboardinfo':{datasetName:"Fraud_Data",datasetType:"Excel", reportId:"Aadhbd4fNOJFsWSOT3jOiOA", reportType:"WebiReport"}},
                               {'dataseName':'Bankruptcy Prediction','dashboardinfo':{datasetName:"Bankruptcy_Prediction",datasetType:"Excel", reportId:"Afnw.Vxcdt5Fi4.fkofrKPM", reportType:"WebiReport"}},
                               {'dataseName':'Email Analysis','dashboardinfo':{datasetName:"EmailData",datasetType:"Excel", reportId:"AZ3jXnzjJCVDvxblba.Naos", reportType:"WebiReport"}},
                                {'dataseName':'Texonomix','dashboardinfo':{datasetName:"Telecom",datasetType:"Excel", reportId:"AYeviaWx88hGnPxoW6yDKUY", reportType:"WebiReport"}}];
    */  
        constructor(private datasetService: DatasetService, private _router: Router, private data: PassService, private customDashConfig: customDashboardParameters,private sanitizer: DomSanitizer) {
    }
    
    setNewDashboard(value: string) {
        this.customDashConfig.datasetkeyForDashboard = value;
        if(value == "Navigator"){
            this._router.navigate(['navigatorDashboard']);
        }else if(value == "IOT"){
            this._router.navigate(['iot']);
        }else if(value == "Wealth Management"){
            this._router.navigate(['wealthManagement']);
        }
        else{
            debugger;
            console.log("dataset value++++++++++++++++++++++++++++++++");
            console.log(value);
            this._router.navigate(['customDashboard']);
        }
        
    }
}