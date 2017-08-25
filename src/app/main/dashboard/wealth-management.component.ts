import { Component, ElementRef, ViewChild,  } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
//import { Injectable, Inject, Optional, OpaqueToken } from '@angular/core';
import { DatasetService, DeleteDatasetDto, DatasetListDto, DatasetType, DatasetDto, DatasetHistoryDto, PassService, LoadingService } from '@shared/service-proxies/ids-service-proxies';
//import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Router } from '@angular/router';
//import { AnalysisDtoDetails, AnalysisService, AnalysisStudioConfig } from '@shared/service-proxies/ids-analysis-service-proxies';
import {DashboardService, customDashboardParameters} from '@shared/service-proxies/ids-dashboard-service-proxies';
@Component({
    templateUrl: './wealth-management.component.html',
    selector: 'Bo-dashbaord'
})

export class WealthManagementComponent{
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
    fileLocation: any;
        constructor(private datasetService: DatasetService, private _router: Router, private data: PassService, private customDashConfig: customDashboardParameters,private sanitizer: DomSanitizer) {
    }
    
    /*showUseCase(){
        if(this.customDashConfig.datasetkeyForDashboard === "Navigator"){
            this.fileLocation = this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/common/images/Navigator Analytics.swf');
            //this.fileLocation = '../../../assets/common/images/Navigator Analytics.swf';
        }else if(this.customDashConfig.datasetkeyForDashboard === "IOT"){
            //this.fileLocation = '../../../assets/common/images/Navigator_Analytics_Telecom.swf';
            this.fileLocation = this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/common/images/Navigator_Analytics_Telecom.swf');
        }else if(this.customDashConfig.datasetkeyForDashboard === "Wealth Management"){
            //this.fileLocation = '../../../assets/common/images/FPS.swf';
            this.fileLocation = this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/common/images/FPS.swf');
        }
        }*/
}