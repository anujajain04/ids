import { Component, ElementRef, ViewChild, } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
//import { Injectable, Inject, Optional, OpaqueToken } from '@angular/core';
import { DatasetService, DeleteDatasetDto, DatasetListDto, DatasetType, DatasetDto, DatasetHistoryDto, PassService, LoadingService } from '@shared/service-proxies/ids-service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Router } from '@angular/router';
//import { AnalysisDtoDetails, AnalysisService, AnalysisStudioConfig } from '@shared/service-proxies/ids-analysis-service-proxies';
import { DashboardService, customDashboardParameters } from '@shared/service-proxies/ids-dashboard-service-proxies';
@Component({
    templateUrl: './custom-dashboard.component.html',
    selector: 'Bo-dashbaord',
    animations: [appModuleAnimation()]
})

export class CustomDasboardComponent {
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
    noCustomEntry: boolean = true;
    datasetName: string;
    reportName: string;
    datasetType: string;
    reportId: string;
    reportType: string;
    currentProjectUrl: any;
    url: string = null;
    //dashboardList: any = JSON.parse("[{'datasetName':'Fraud Prediction', 'reportName':'Fraud_Data','datasetType':'Excel', 'reportId':'Aadhbd4fNOJFsWSOT3jOiOA', 'reportType':'WebiReport'},{'datasetName':'Bankruptcy Prediction', 'reportName':'Bankruptcy_Prediction','datasetType':'Excel', 'reportId':'Afnw.Vxcdt5Fi4.fkofrKPM', 'reportType':'WebiReport'},{'datasetName':'Email Analysis','reportName':'EmailData','datasetType':'Excel', 'reportId':'AZ3jXnzjJCVDvxblba.Naos', 'reportType':'WebiReport'},{'datasetName':'Texonomix','reportName':'Telecom','datasetType':'Excel', 'reportId':'AYeviaWx88hGnPxoW6yDKUY', 'reportType':'WebiReport'}]");
    dashboardList: any = [{ datasetName: 'Fraud Prediction', reportName: 'Fraud_Data', datasetType: 'Excel', reportId: 'Aadhbd4fNOJFsWSOT3jOiOA', reportType: 'WebiReport' }, { datasetName: 'Bankruptcy Prediction', reportName: 'Bankruptcy_Prediction', datasetType: 'Excel', reportId: 'Afnw.Vxcdt5Fi4.fkofrKPM', reportType: 'WebiReport' }, { datasetName: 'Email Analysis', reportName: 'EmailData', datasetType: 'Excel', reportId: 'AZ3jXnzjJCVDvxblba.Naos', reportType: 'WebiReport' }, { datasetName: 'Texonomix', reportName: 'Telecom', datasetType: 'Excel', reportId: 'AYeviaWx88hGnPxoW6yDKUY', reportType: 'WebiReport' }];
    //console.log(dashboardList);
    /*dashboardList: any = [{'dataseName':'Fraud Prediction','dashboardinfo':{datasetName:"Fraud_Data",datasetType:"Excel", reportId:"Aadhbd4fNOJFsWSOT3jOiOA", reportType:"WebiReport"}},
                               {'dataseName':'Bankruptcy Prediction','dashboardinfo':{datasetName:"Bankruptcy_Prediction",datasetType:"Excel", reportId:"Afnw.Vxcdt5Fi4.fkofrKPM", reportType:"WebiReport"}},
                               {'dataseName':'Email Analysis','dashboardinfo':{datasetName:"EmailData",datasetType:"Excel", reportId:"AZ3jXnzjJCVDvxblba.Naos", reportType:"WebiReport"}},
                                {'dataseName':'Texonomix','dashboardinfo':{datasetName:"Telecom",datasetType:"Excel", reportId:"AYeviaWx88hGnPxoW6yDKUY", reportType:"WebiReport"}}];
    */
    constructor(private datasetService: DatasetService, private _router: Router, private data: PassService, private customDashConfig: customDashboardParameters, private sanitizer: DomSanitizer) {
        this.getDatasetList();
        this.currentProjectUrl = this.sanitizer.bypassSecurityTrustResourceUrl("");
    }
    getDatasetList() {
        abp.ui.setBusy();
        this.datasetService.getDatasetList().subscribe(result => {
            abp.ui.clearBusy();
            this.dataset = result;
            this.filterdataset = result;
            this.filterdataset = this.dataset.slice(0, this.pageSize);
            if (this.customDashConfig.datasetkeyForDashboard === undefined) {
                //show error
            }
            else {
                this.setDashboard();
            }
        });
        console.log("got list +++++++++++++++++++++++++++++++++");
        console.log(this.dataset);
        console.log(this.filterdataset);

    }

    setDashboard() {
        debugger;
        console.log("inside setDashboard++++++++++++++++++++++");
        //this.customDashConfig.datasetkeyForDashboard = 'Texonomix';
        for (let item of this.dashboardList) {
            console.log("umesh");
            console.log(item.datasetName);
            if (item.datasetName === this.customDashConfig.datasetkeyForDashboard) {
                console.log("telecom matched+++++++++++++++++++++++");
                this.noCustomEntry = false;
                this.datasetName = item.datasetName;
                this.datasetType = item.datasetType;
                this.reportId = item.reportId;
                this.reportType = item.reportType;
                this.reportName = item.reportName
                console.log("got member");
                break;
            }
        }
        console.log("this.noCustomEntry++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
        console.log(this.dataset);
        if (this.noCustomEntry === true) {
            console.log("inside if+++++++++++++");
            for (this.j = 0; this.j < this.dataset.length; this.j++) {
                console.log(this.dataset[this.j].className);
                if (this.dataset[this.j].entityName === this.customDashConfig.datasetkeyForDashboard) {
                    console.log("got from dataset list++++++++++++");
                    this.reportId = this.dataset[this.j].entityDescription;
                    if (((this.reportId.indexOf(".") !== -1) && (this.reportId.length === 23)) || ((this.reportId.indexOf(" ") === -1) && (this.reportId.length === 23))) {
                        this.reportId = this.dataset[this.j].entityDescription;
                    } else {
                        if (this.dataset[this.j].className === 'Twitter') {
                            this.reportId = "AWM6KBRxerRFlGeD2kSU73c";
                        } else if (this.dataset[this.j].className === 'Facebook') {
                            this.reportId = "AWM6KBRxerRFlGeD2kSU73c";
                        } else if (this.dataset[this.j].className === 'Excel') {
                            this.reportId = "AYeviaWx88hGnPxoW6yDKUY";
                        } else if (this.dataset[this.j].className === 'RDBMS') {
                            this.reportId = "AWM6KBRxerRFlGeD2kSU73c";
                        } else if (this.dataset[this.j].className === 'RSS') {
                            this.reportId = "AWM6KBRxerRFlGeD2kSU73c";
                        }
                    }
                    this.datasetName = this.dataset[this.j].entityName;
                    this.datasetType = this.dataset[this.j].className;
                    this.reportType = 'WebiReport';
                    this.reportName = this.dataset[this.j].entityName;
                    break;
                }
            }
        }

        this.url = "http://114.143.21.250:8080/NavigatorIDS/index.jsp?" + "sdkey=" + this.reportName + "&reportId=" + this.reportId + "&reportType=" + this.reportType;
        //url = "http://192.168.10.42:8080/NavigatorIDS/index.jsp?" + "sdkey=" + sdKey+ "&ddKey=" + ddKey + "&reportId="+ reportId;
        console.log(this.url);
        this.currentProjectUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    }
}