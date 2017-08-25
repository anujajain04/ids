
import { Component, ElementRef, ViewChild } from '@angular/core';
import { DatasetService, DeleteDatasetDto, DatasetListDto, DatasetType, DatasetDto, DatasetHistoryDto, PassService, LoadingService } from '@shared/service-proxies/ids-service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Http } from '@angular/http';
import { PostService } from './posts.service';
import { TokenService } from '@abp/auth/token.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DashboardService, DashboardDto, DeletedashboardDto, DashboardStudioConfig } from '@shared/service-proxies/ids-dashboard-service-proxies';
import { TempBaseUrl } from '@shared/service-proxies/ids-service-proxies';


@Component({
    templateUrl: './dashboard-list.component.html',
    selector: 'dash',
    animations: [appModuleAnimation()]

})

export class DashboardListComponent {
    @ViewChild('pager') pager: ElementRef;
    dash: DashboardDto[] = [];
    filterdash: DashboardDto[];
    deleteDash: DashboardDto[] = [];
    datatypes: DatasetType[];
    type: boolean = false;
    selectedType: string = null;
    typeLoad: boolean = false; 
    i: number = 1;
    history: DatasetHistoryDto;
    pageSize: number = 10;
    currentPage: number;
    arr: Array<number> = [];
    key: string;
    layoutID: number;
    dashboardData: any={};
    constructor(private dashboardService: DashboardService, private _router: Router, private data: PassService, private load: LoadingService, route: ActivatedRoute, private config: DashboardStudioConfig, private _session: TokenService, ) {
        this.data.clearAll();
        this.getDashList();
        this.config.clearAll();
        //this.getTypes();
        this.key = route.snapshot.params['key'];

    }
    getDashList() {
        debugger;
        abp.ui.setBusy()
        let s: string = "e921bf1a-5a9b-41e9-968f-a8675838dabd";
        this.dashboardService.getDashboardList(s).subscribe(result => {
            debugger;
            this.dash = result;
            this.filterdash = result;
            abp.ui.clearBusy();
            for (let i: number = 1; i <= Math.ceil(this.dash.length / this.pageSize); i++) {
                this.arr.push(i);
            }
            this.currentPage = 1;
            this.filterdash = this.dash.slice(0, this.pageSize);
            //if (this.dataset.length % 10 > 0)
            //this.pageCount++;
        });

    }


    filter(key: string) {
        debugger;
        this.filterdash = [];
        if (key == null && key === "") {
            this.filterdash = this.dash;
        } else {
            for (let i of this.dash) {
                if (i.entityName.toLowerCase().includes(key.toLowerCase())) {
                    this.filterdash.push(i);
                }
            }
        }
    }
    deleteObject: DashboardDto;
    deletedata(d: any, k: any) {
        debugger;
        if (d.target.checked) {
            this.deleteDash.push(k);
            this.deleteObject = k;
        }
        else {
            if (this.deleteDash.length > 0)
                this.deleteDash.splice(this.deleteDash.indexOf(k), 1);
        }

    }
    isPresent(k: any): boolean {
        if (this.deleteDash !== undefined)
            if (this.deleteDash.indexOf(k) === -1)
                return false
            else true;
        else false;
    }
    selectAll(event: any) {
        debugger;
        if (event.target.checked) {
            this.deleteDash = [];
            for (let d of this.dash)
                this.deleteDash.push(d);// = this.dataset;
        } else this.deleteDash = [];
    }
    isAll(): boolean {
        if (this.dash.length === this.deleteDash.length && this.dash.length !== 0)
            return true;
        return false;
    }
    yes() {
        let delDto: DeletedashboardDto = new DeletedashboardDto();
        for (let it of this.deleteDash)
            delDto.entityList.push(it.entityKey);
        abp.ui.setBusy();
        this.dashboardService.deleteDashboard(this.deleteObject.entityKey).subscribe(res => {
            debugger;
            abp.ui.clearBusy();
            if (res.statusCode === 1) {
                abp.notify.success(res.statusMessage);
                this.deleteDash = [];
                this.dash = [];
                this.filterdash = [];
                // this.pager.nativeElement.reset();
                this.arr = [];
                this.getDashList();
            } else {
                abp.notify.error(res.statusMessage);
            }
        });

    }
    changePage(p: any) {
        this.currentPage = p;
        this.filterdash = this.dash.slice(((this.currentPage - 1) * this.pageSize), ((this.currentPage - 1) * this.pageSize) + this.pageSize);

    }
   
    next() {
        if (this.currentPage < this.arr.length) {
            this.currentPage++;
            this.changePage(this.currentPage);
        }
    }
    previous() {
        if (this.arr.length > 1 && this.currentPage > 1) {
            this.currentPage--;
            this.changePage(this.currentPage);
        }
    }
    onChange(newValue) {

        //console.log('okk'+((DatasetType)newValue).type);
        if (newValue !== "" && newValue !== null) {
            this.selectedType = newValue;
            this.type = true;
        } else {
            this.selectedType = null;
            this.type = false;
        }

        //this.createDataset();
        // ... do other stuff here ...
    }

    onChange1(newValue) {
        //console.log('okk'+((DatasetType)newValue).type);
        if (newValue !== "" && newValue !== null) {
            this.selectedType = newValue;
            this.type = true;
        } else {
            this.selectedType = null;
            this.type = false;
        }


    }
 
    dashboard() {
        this._router.navigate(['dashboard']);
    }
 
    schedule() {
        this._router.navigate(['scheduled-dash']);
    }

    gotoedit(value:string) {
        abp.ui.setBusy();
        debugger;
        try {
               this.data.isUpdate = true;
               this.data.passId = value;
               this.dashboardData["dashboardKey"]=value;
               this.dashboardData["isViewFlag"]=false;
            this.dashboardService.editDashboard(value).subscribe(result => {
                abp.ui.clearBusy();
                debugger;
                let data = result;
                debugger;
                this._router.navigate(['dash-title-config',data.layoutID, this.dashboardData]);
            });
               
            }
            catch (e) {
                debugger;
                console.log(e)
            }
    }
    
    gotoview(value:string) {
        abp.ui.setBusy();
        debugger;
        try {
               let dashbardData: any={};
               dashbardData["dashboardKey"]=value;
               //dashbardData["isViewFlag"]=true;
            this.dashboardService.editDashboard(value).subscribe(result => {
                abp.ui.clearBusy();
                debugger;
                let data = result;
                debugger;
                this._router.navigate(['previewDashboard',data.layoutID, dashbardData]);
            });
               
            }
            catch (e) {
                debugger;
                console.log(e)
            }
    }

    gotocreate() {
        this._router.navigate(['create-dashStudio']);
    }
    gotoexplore(value: string) {
        this.layoutID = this.config.key;
        debugger;
        this.dashboardData = this.config.createDashboard.toJS();
        this._router.navigate(['previewDashboard', value, this.dashboardData]);
    }
    
    gotodemo(){
        
        this._router.navigate(['demodashboard']);
    
    }
    //createDashboard(input: any) {
    //    debugger;
    //    abp.ui.setBusy();
    //    this.dashboardService.createDashBoard(input).subscribe(res => {
    //        debugger;
    //        abp.ui.clearBusy();
    //        this.config.createResult = res;
    //       // this.createDashboard(this.config.finalDashboard.toJSON());
    //        if (res.statusCode === 1)
    //            abp.notify.success(res.statusMessage);
    //        else
    //            abp.notify.error(res.statusMessage);
           
    //    });
    //    //this.createDashboard(this.config.finalDashboard.toJSON());
    //}

}
