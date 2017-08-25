
import { Component, ElementRef, ViewChild } from '@angular/core';
import { DatasetService, DeleteDatasetDto, DatasetListDto, DatasetType, DatasetDto, DatasetHistoryDto, PassService, LoadingService } from '@shared/service-proxies/ids-service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Http } from '@angular/http';
import { PostService } from './posts.service';
import { Router } from '@angular/router';
import { DashboardService, DashboardDto, DeletedashboardDto, DashboardStudioConfig } from '@shared/service-proxies/ids-dashboard-service-proxies';
@Component({
    templateUrl: './dashboard-configuration.component.html',
    selector: 'home-dash',
    animations: [appModuleAnimation()]

})

export class DashboardListConfiguration {
    passValue: number;

    constructor(private _router: Router, private config: DashboardStudioConfig) {

    }

    sdfs() {
        this.config.createDashboard.chartWidgets[0].chartWidgetTitle;
    }
   

    onclick(event) {
        debugger
        var l = event.target.parentElement.parentElement.getElementsByClassName("col1");
        var count = l.length;
        if (count == 0) {
            for (var i = 0; i < 14; i++) {
                event.target.parentElement.parentElement.parentElement.getElementsByClassName("col1")[i].className = "col1 col-md-2 dashconfig screendivlayout";
                event.target.parentElement.parentElement.parentElement.getElementsByClassName("col1")[i].value = i;
            }
            event.currentTarget.className = "myclass col1 col-md-2 dashconfig screendivlayout";
            this.passValue = event.currentTarget.value;
        }
        else {

            for (var i = 0; i < count; i++) {
                l[i].className = "col1 col-md-2 dashconfig screendivlayout";
                l[i].value = i;
            }

            event.currentTarget.className = "myclass col1 col-md-2 dashconfig screendivlayout";
            this.passValue = event.currentTarget.value;
        }
        var selected = document.getElementsByClassName("selectedDashboardTemplate");
        if (selected.length > 0) {
            selected[0].className = "textaligndiv";
        }
        event.target.parentElement.parentElement.getElementsByClassName("textaligndiv")[0].className = "textaligndiv selectedDashboardTemplate";
        this.config.key = this.passValue;
        //this.config.createDashboard.layoutID = this.passValue;
       // this._router.navigate(['create-dashStudio', this.passValue]);        
    }

}