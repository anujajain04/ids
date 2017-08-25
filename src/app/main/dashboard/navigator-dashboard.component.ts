import { Component, ElementRef, ViewChild,  } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
//import { Injectable, Inject, Optional, OpaqueToken } from '@angular/core';
import { DatasetService, DeleteDatasetDto, DatasetListDto, DatasetType, DatasetDto, DatasetHistoryDto, PassService, LoadingService } from '@shared/service-proxies/ids-service-proxies';
//import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Router } from '@angular/router';
//import { AnalysisDtoDetails, AnalysisService, AnalysisStudioConfig } from '@shared/service-proxies/ids-analysis-service-proxies';
import {DashboardService, customDashboardParameters} from '@shared/service-proxies/ids-dashboard-service-proxies';
@Component({
    templateUrl: './navigator-dashboard.component.html',
    selector: 'Bo-dashbaord'
})

export class NavigatorDashboardComponent{
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
    
    
}