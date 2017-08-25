import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DatasetService, SubDatasetDto, DatasetDto, DatasetFieldDto, PassService, LoadingService, DatasetViewData } from '@shared/service-proxies/ids-service-proxies';
import { ActivatedRoute, Router } from '@angular/router';
import { customDashboardParameters } from '@shared/service-proxies/ids-dashboard-service-proxies';
@Component({
    templateUrl: './explore-dataset.component.html',
    animations: [appModuleAnimation()]
})
export class ExploreDatasetComponent {
    key: string = null;
    subData: SubDatasetDto[];
    SubDataset: SubDatasetDto[] = [];
    viewAnalysisData: DatasetViewData[] = [];
    dataset: any;
    isOk: boolean = false;
    show: boolean = false;
    dashboardList: any;
    showTable: string;
    headerArray: string[] = [];
    analysisName: string;
    constructor(private _router: Router, private datasetService: DatasetService,
        route: ActivatedRoute, private pass: PassService, private load: LoadingService, private customDashConfig: customDashboardParameters) {
        debugger;
        this.key = route.snapshot.params['key'];

        if (this.customDashConfig.targetDatasetKey === undefined) {
            //show error
            this.getSubData();
            this.showTable = "datasetData";
        }
        else {
            this.dashboardList = { subDatasetKey: this.customDashConfig.trgSubDatasetKey, datasetKey: this.customDashConfig.targetDatasetKey };
            this.getSubDatasetData();
            this.showTable = "analysisData";
            this.analysisName = this.customDashConfig.analysisName;
        }

        this.dataset = this.pass.passValue;
    }
    getSubData() {
        if (this.key !== null && this.key !== "") {
          this.load.start()
            this.datasetService.getSubDataset(this.key).subscribe(result => {
                debugger;
                this.load.stop()
                this.SubDataset = result;
                this.subData = result;
            });
        }
    }
    click() {
        this.show = !this.show;
    }
    filter(val: string) {
        debugger;
        this.subData = [];
        if (val == null && val === "") {
            this.subData = this.SubDataset;
        } else {
            for (let i of this.SubDataset) {
                if (i.entityName.toLowerCase().includes(val.toLowerCase())) {
                    this.subData.push(i);
                }
            }
        }
    }

    getSubDatasetData() {
        debugger;
        if (this.key !== null && this.key !== "") {
          this.load.start()
            this.datasetService.getSubDatasetData(this.customDashConfig.trgSubDatasetKey, this.customDashConfig.targetDatasetKey).subscribe(result => {
                debugger;
                this.load.stop()
                this.headerArray = Object.keys(result.viewData[0])
                for (let item of result.viewData) {
                    this.viewAnalysisData.push(new DatasetViewData(item, this.headerArray));
                }
            });
        }
    }

    onEdit() {
        this.pass.isUpdate = true;
        this.pass.passId = this.key;
        this.pass.passValue = null;
        if (this.dataset.className.toLowerCase() == "rss") {
            this._router.navigate(['create_rss', this.key]);
        }
        else if (this.dataset.className.toLowerCase() == "twitter")
            this._router.navigate(['create_twitter', this.key]);
        else if (this.dataset.className.toLowerCase() == "facebook")
            this._router.navigate(['create_fb', this.key]);
        else if (this.dataset.className.toLowerCase() == "delimited file")
            this._router.navigate(['create_csv', this.key]);
        else if (this.dataset.className.toLowerCase() == "excel")
            this._router.navigate(['create_excel', this.key]);
        else if (this.dataset.className.toLowerCase() == "database")
            this._router.navigate(['create_rdbms', this.key]);
    }
}