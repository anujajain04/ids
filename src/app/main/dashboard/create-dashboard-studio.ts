import { Component, ElementRef, ViewChild,Input } from '@angular/core';
import { DatasetService, DeleteDatasetDto, DatasetListDto, DatasetType, DatasetDto, DatasetHistoryDto, PassService, LoadingService } from '@shared/service-proxies/ids-service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Http } from '@angular/http';
import { PostService } from './posts.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DashboardService, DashboardDto, DeletedashboardDto, DashboardStudioConfig } from '@shared/service-proxies/ids-dashboard-service-proxies';

@Component({
    templateUrl: './create-dashboard-studio.html',
    selector: 'dash-studio',
    animations: [appModuleAnimation()]

})

export class DashboardStudioComponent {
    stepNumber: number = 1;
    errorMassege: boolean = false;
    layoutID: number;
    key: number;
    dashboardData:any;
    constructor(private dashboardService: DashboardService, private _router: Router, route: ActivatedRoute,private data: PassService, private load: LoadingService, private config: DashboardStudioConfig) {
        this.data.clearAll();
        this.layoutID = this.config.key;
        this.key = this.config.key;
        this.dashboardData ={};
        debugger;
    }



    gotoTitle() {
        
        debugger;
        if (this.config.key === undefined) {
            this.errorMassege = true;
        }
        else {
            this.errorMassege = false;
            if (this.stepNumber <= 1) {
                //this.stepNumber += 1;
                this.layoutID = this.config.key;
                debugger;
                this.dashboardData = this.config.createDashboard.toJS();
                this._router.navigate(['dash-title-config', this.layoutID,this.dashboardData]);
                

            }
            else {

                this.create(this.config.createDashboard.toJS());
            }
        }
    }


  

    create(input: any) {
        debugger;
        this.dashboardService.createDashboard(input).subscribe(res => {
            if (res.statusCode == 1)
                abp.notify.success(res.statusMessage);
            else
                abp.notify.error(res.statusMessage);
        });
    }
      

}