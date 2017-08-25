import { Component, ElementRef, ViewChild } from '@angular/core';
import { DatasetService, DeleteDatasetDto, DatasetListDto, DatasetType, DatasetDto, DatasetHistoryDto, PassService, LoadingService } from '@shared/service-proxies/ids-service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Router, NavigationEnd } from '@angular/router';
import { AnalysisDtoDetails, AnalysisService, AnalysisStudioConfig } from '@shared/service-proxies/ids-analysis-service-proxies';
import { DashboardService, customDashboardParameters } from '@shared/service-proxies/ids-dashboard-service-proxies';
import { WorkspaceService, WorkspaceDto } from '@shared/service-proxies/ids-workspace-service-proxies';
@Component({
    templateUrl: './dataset-list.component.html',
    selector: 'data-list-app',
    animations: [appModuleAnimation()]

})

export class DatasetListComponent {
    @ViewChild('pager') pager: ElementRef;
    workspaceKey: any;
    workspaceName: any;
    dataset: DatasetDto[] = [];
    filterdataset: DatasetDto[];
    deleteDataset: DatasetDto[] = [];
    datatypes: DatasetType[];
    type: boolean = false;
    selectedType: string = null;
    analysislist: AnalysisDtoDetails[];
    typeLoad: boolean = false;
    i: number = 1;
    history: DatasetHistoryDto;
    pageSize: number = 10;
    currentPage: number;
    arr: Array<number> = [];
    deleteAnalysisKey: string;
    RunAnalysisKey: string;
    AbortAnalysisKey: string;
    workspacelist: any;
    ppos: number;
    cpos: number;
    constructor(private _route: Router, private datasetService: DatasetService, private dashService: DashboardService, private analysisService: AnalysisService, private _router: Router,
        private data: PassService, private config: AnalysisStudioConfig, private customDashConfig: customDashboardParameters, public workspace: WorkspaceService, private load: LoadingService) {
        this.data.clearAll();
        this.getDatasetList();
        this.getTypes();
        this.config.clearAll();
        debugger
        this.workspace.getWorkspacelist().subscribe(res => {
            this.workspacelist = res;

        })

    }
    getDatasetList() {
        debugger;
       this.load.start()
        this.datasetService.getDatasetList().subscribe(result => {
            debugger;
           this.load.stop()
            result.reverse();
            this.dataset = result;
            this.filterdataset = result;
            for (let p of this.filterdataset) {
                if (p.className === "Facebook") {
                    p.src = "../../../assets/img/img/Facebook black.svg";
                }
                if (p.className === "CSV") {
                    p.src = "../../../assets/img/img/CSV black.svg";
                }
                if (p.className === "Twitter") {
                    p.src = "../../../assets/img/img/Twitter black.svg";
                }
                if (p.className === "RSS") {
                    p.src = "../../../assets/img/img/RSS black.svg";
                }
                if (p.className === "Excel") {
                    p.src = "../../../assets/img/img/Excel black.svg";
                }
                if (p.className === "RDBMS") {
                    p.src = "../../../assets/img/img/dataset black icon.svg";
                }
               
            }
            for (let i: number = 1; i <= Math.ceil(this.dataset.length / this.pageSize); i++) {
                this.arr.push(i);
            }
            this.currentPage = 1;
            this.filterdataset = this.dataset.slice(0, this.pageSize);
            //if (this.dataset.length % 10 > 0)
            //this.pageCount++;
        });

    }
    ngOnInit() {
        this._router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }

            var scrollToTop = window.setInterval(function () {
                var pos = window.pageYOffset;
                if (pos > 0) {
                    window.scrollTo(0, 0); // how far to scroll on each step
                } else {
                    window.clearInterval(scrollToTop);
                }
            }, 16); // how fast to scroll (this equals roughly 60 fps)
        });
    }
    getChart(str: string) {
        this._route.navigate(['chart-result', str]);
    }
    filter(key: string) {
        this.filterdataset = [];
        if (key == null && key === "") {
            this.filterdataset = this.dataset;
        } else {
            for (let i of this.dataset) {
                if (i.entityName.toLowerCase().includes(key.toLowerCase())) {
                    this.filterdataset.push(i);
                }
            }
        }
    }
    deletedata(d: any, k: any) {
        debugger
        if (d.target.checked) {
            this.deleteDataset.push(k);
        }
        else {
            if (this.deleteDataset.length > 0)
                this.deleteDataset.splice(this.deleteDataset.indexOf(k), 1);
        }

    }
    isPresent(k: any): boolean {
        if (this.deleteDataset !== undefined)
            if (this.deleteDataset.indexOf(k) === -1)
                return false
            else true;
        else false;
    }
    selectAll(event: any) {
        debugger;
        if (event.target.checked) {
            this.deleteDataset = [];
            for (let d of this.dataset)
                this.deleteDataset.push(d);// = this.dataset;
        } else this.deleteDataset = [];
    }
    isAll(): boolean {
        if (this.dataset.length === this.deleteDataset.length && this.dataset.length !== 0)
            return true;
        return false;
    }
    yes() {
       this.load.start()
        let delDto: DeleteDatasetDto = new DeleteDatasetDto();
        for (let it of this.deleteDataset)
            delDto.entityList.push(it.entityKey);
        this.datasetService.deleteMultipleDataset(delDto).subscribe(res => {
           this.load.stop()
            if (res.statusCode === 1) {
                abp.notify.success(res.statusMessage);
                this.deleteDataset = [];
                this.dataset = [];
                this.filterdataset = [];
                // this.pager.nativeElement.reset();
                this.arr = [];
                this.getDatasetList();
            } else {
                abp.notify.error(res.statusMessage);
            }
        });

    }
    selectDataset(d: any) {
        debugger
        this.workspaceKey = d.entityKey;
        this.workspaceName = d.entityName;
    }
    copymoveDataset(d:any) {
        debugger
        let c = [];
        for (let w of this.deleteDataset) {
          
                c.push({ 'entityName': w.entityName, 'entityKey': w.entityKey});
            
        }
        if (d.currentTarget.dataset.target === "#copy") {
            var p = {
                "copyMoveObjects": c,
                "newWorkspaceKey": this.workspaceKey, "newWorkspaceName": this.workspaceName, "actionType": "copy", "operationType": "null"
            }
        }
        else if (d.currentTarget.dataset.target === "#move") {
            var p = {
                "copyMoveObjects": c,
                "newWorkspaceKey": this.workspaceKey, "newWorkspaceName": this.workspaceName, "actionType": "move", "operationType": "null"
            }
        }
       this.load.start()
        this.workspace.copyMoveObject(p).subscribe(res => {
           this.load.stop()
            debugger
        })
    }


    changePage(p: any) {
        this.currentPage = p;
        this.filterdataset = this.dataset.slice(((this.currentPage - 1) * this.pageSize), ((this.currentPage - 1) * this.pageSize) + this.pageSize);

    }
    gotoexplore(value: DatasetDto) {
        this.data.passValue = value;
        this.data.passId = value.entityKey;
        this.data.passName = value.entityName;
        this._router.navigate(['explore_dataset', value.entityKey]);
    }

    edit(value: DatasetDto) {
        debugger;
        this.data.isUpdate = true;
        this.data.passId = value.entityKey;
        if (value.className.toLowerCase() == "rss") {
            this._router.navigate(['create_rss', value.entityKey]);
        }
        else if (value.className.toLowerCase() == "twitter")
            this._router.navigate(['create_twitter', value.entityKey]);
        else if (value.className.toLowerCase() == "facebook")
            this._router.navigate(['create_fb', value.entityKey]);
        else if (value.className.toLowerCase() == "csv")
            this._router.navigate(['create_csv', value.entityKey]);
        else if (value.className.toLowerCase() == "excel")
            this._router.navigate(['create_excel', value.entityKey]);
        else if (value.className.toLowerCase() == "database" || value.className.toLowerCase() == "rdbms")
            this._router.navigate(['create_rdbms', value.entityKey]);
    }
    next() {
        // toastr.success("Facebook dataset created successfully"," ");
        debugger;
        if (this.currentPage < this.arr.length) {
            this.currentPage++;
            this.changePage(this.currentPage);
        }
        // window.document.getElementById("focus"+11).focus();
    }
    previous() {
        debugger;
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
    getTypes() {
        this.datasetService.getDatasetTypes().subscribe(res => {
            this.datatypes = res;
            this.typeLoad = true;
        });
    }
    createDataset(newValue: string) {
        this.data.isUpdate = false;
        if (newValue.toLowerCase() == "database")
            this._router.navigate(['create_rdbms', '']);
        else if (newValue.toLowerCase() == "delimited file")
            this._router.navigate(['create_csv', '']);
        else if (newValue.toLowerCase() == "excel")
            this._router.navigate(['create_excel', '']);
        else if (newValue.toLowerCase() == "twitter")
            this._router.navigate(['create_twitter', '']);
        else if (newValue.toLowerCase() == "facebook")
            this._router.navigate(['create_fb', '']);
        else if (newValue.toLowerCase() == "rss") {
            this._router.navigate(['create_rss', '']);
        }
    }

    onOption(value, keyVal) {
        console.log('Values:' + value + "," + keyVal);
        if (value == "explore")
            this._router.navigate(['explore_dataset', keyVal]);
        else if (value == "history")
            this.gotohistory(keyVal);
    }
    dashboard() {
        this._router.navigate(['dashboard']);
    }
    gotohistory(value: any) {
        this.datasetService.datasetHistory(value).subscribe(re => {
            debugger;
            this.history = re;
        });
    }

    getanalysislist(value: string, pos: number) {
        debugger;
        this.analysisService.getAnalysisList(value).subscribe(re => {
            this.analysislist = re;
            this.analysislist[0].runFlag;
            this.filterdataset[pos].analysislist = re;
        });

    }
    editAnalysis(value: string, parent: string) {
        this.config.isEdit = true;
        this.config.datasetkeyForAnalysis = parent;
        this._router.navigate(['create_analysis', parent, value]);
    }

    runAnalysis(value: string, parentpos: number, childpos: number) {
        debugger;
        this.RunAnalysisKey = value;
        this.ppos = parentpos;
        this.cpos = childpos;
    }

    confirmRun() {

        debugger;

        if (this.RunAnalysisKey !== null) {
            this.analysisService.runAnalysis(this.RunAnalysisKey).subscribe(res => {
                debugger;
                if (res.statusCode === 1) {
                    abp.notify.success(res.statusMessage);
                    this.RunAnalysisKey = null;
                }
                else {
                    abp.notify.error(res.statusMessage);
                }
            });
        }
    }

    abortAnalysis(value: string, parentpos: number, childpos: number) {
        debugger;
        this.AbortAnalysisKey = value;
        this.ppos = parentpos;
        this.cpos = childpos;
    }
    confirmAbort() {
        debugger;
        if (this.AbortAnalysisKey !== null) {
            this.analysisService.abortAnalysis(this.AbortAnalysisKey).subscribe(res => {
                debugger;
                if (res.statusCode === 1) {
                    abp.notify.success(res.statusMessage);
                    this.AbortAnalysisKey = null;
                    this.filterdataset[this.ppos].analysislist[this.cpos].runFlag = "False";
                }
                else {
                    abp.notify.error(res.statusMessage);
                }
            });
        }
    }
    viewChart(key:any) {
        debugger;
        try {
            let a: string = "";
            if (this.config.createResult.status_code === 1)
                a = this.config.createResult.detail.chartWidgetKey;
            if (this.config.isEdit)
                a = this.config.updateFinalAnalysis.chartWidgetKey;
            this._route.navigate(['chart-result', key]);
        } catch (e) {
            console.error(e.message);
        }

    }


    deleteAnalysis(value: string, parentpos: number, childpos: number) {
        debugger;
        this.deleteAnalysisKey = value;
        this.ppos = parentpos;
        this.cpos = childpos;

    }


    confirmDelete() {

        if (this.deleteAnalysisKey !== null) {
            this.analysisService.deleteAnalysis(this.deleteAnalysisKey).subscribe(res => {
                debugger;
                if (res.statusCode === 1) {
                    this.filterdataset[this.ppos].analysislist.splice(this.cpos, 1);
                    abp.notify.success(res.statusMessage);
                    this.deleteAnalysisKey = null;

                }
                else {
                    abp.notify.error(res.statusMessage);
                }
            });
        }
    }

    // getHistory(keyVal: string) {
    //  this.datasetService.datasetHistory(keyVal).subscribe(re=>this.history=re  );            
    //alert("Dataset Details:\n" + re.dsName + "\n" + re.dsKey + "\n" + re.dsModifiedDate + "\n" + re.dsRefreshDate + "\n" + re.dsCreateDate);
    // }

    // }


    gotoanalysiscreate(value: string) {
        this.config.datasetkeyForAnalysis = value;
        this._router.navigate(['create_analysis', value, ""]);
    }


    viewDashboard(value: string) {
        debugger;
        //this.filterdataset[pos];
        //this.dashService.viewDashboard(value).subscribe(res => {


        //});
        //  this._router.navigate(['dashboard',value]);
        this.customDashConfig.datasetkeyForDashboard = value;
        this._router.navigate(['customDashboard']);


    }
}
