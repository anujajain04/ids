
import { Component, ElementRef, ViewChild } from '@angular/core';
import { DatasetService, DeleteDatasetDto, DatasetListDto, DatasetType, DatasetDto, DatasetHistoryDto, PassService, LoadingService } from '@shared/service-proxies/ids-service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AnalysisDtoDetails, AnalysisService, AnalysisModelHistory, DeleteAnalysisDto } from '@shared/service-proxies/ids-analysis-service-proxies';
import { Router } from '@angular/router';
import { WorkspaceService, WorkspaceDto } from '@shared/service-proxies/ids-workspace-service-proxies';
import { ModelService, ModelListDto, DeleteModelDto, ModelStudioConfig } from '@shared/service-proxies/ids-model-service-proxies';
@Component({
    templateUrl: './model-list.component.html',
    selector: 'data-list-app',
    animations: [appModuleAnimation()]

})

export class ModelListComponent {
    @ViewChild('pager') pager: ElementRef;
    dataset: DatasetDto[] = [];
    model: ModelListDto[] = [];
    filterdataset: DatasetDto[];
    filtermodel: ModelListDto[]=[];
    filterdash: AnalysisDtoDetails[];
    deleteModel: ModelListDto[] = [];
    historydetails: AnalysisModelHistory[] = [];   
    datatypes: DatasetType[];
    type: boolean = false;
    selectedType: string = null;
    typeLoad: boolean = false;
    i: number = 1;
    workspacelist: any;
    history: DatasetHistoryDto;
    pageSize: number = 10;
    currentPage: number;
    arr: Array<number> = [];
    math: any;
    constructor(private datasetService: DatasetService, public workspace: WorkspaceService, private config: ModelStudioConfig, private modelService: ModelService, private _router: Router, private data: PassService, private load: LoadingService) {
        this.data.clearAll();
        this.config.clearAll();
        this.getModelList();
        //this.getTypes();
        this.math = Math;
        debugger
        this.workspace.getWorkspacelist().subscribe(res => {
            this.workspacelist = res;

        })
    }
    getModelList() {
        debugger;
        this.load.start();
        //let s: string = "e921bf1a-5a9b-41e9-968f-a8675838dabd";
        this.modelService.modelList().subscribe(result => {
            debugger;
            result.reverse();
            this.model = result;
            this.filtermodel = result;
            this.load.stop()
            for (let i: number = 1; i <= Math.ceil(this.model.length / this.pageSize); i++) {
                this.arr.push(i);
            }
      
            this.currentPage = 1;
            this.filtermodel = this.model.slice(0, this.pageSize);
            //if (this.dataset.length % 10 > 0)
            //this.pageCount++;
        });

    }


    filter(key: string) {
        debugger;
        this.filtermodel = [];
        if (key == null && key === "") {
            this.filtermodel = this.model;
        } else {
            for (let i of this.model) {
                if (i.entityName.toLowerCase().includes(key.toLowerCase())) {
                    this.filtermodel.push(i);
                }
            }
        }
    }
    deletedata(d: any, k: any) {
        debugger;
        if (d.target.checked) {
            this.deleteModel.push(k);
        }
        else {
            if (this.deleteModel.length > 0)
                this.deleteModel.splice(this.deleteModel.indexOf(k), 1);
        }

    }
    isPresent(k: any): boolean {
        debugger;
        if (this.deleteModel !== undefined)
            if (this.deleteModel.indexOf(k) === -1)
                return false
            else true;
        else false;
    }
    selectAll(event: any) {
        debugger;
        if (event.target.checked) {
            this.deleteModel = [];
            for (let d of this.model)
                this.deleteModel.push(d);// = this.dataset;
        } else this.deleteModel = [];
    }
    isAll(): boolean {
        if (this.model.length === this.deleteModel.length && this.model.length !== 0)
            return true;
        return false;
    }
    yes() {
        debugger;
        //this.load.start();
        let keyVal = "b586f21d-61aa-4376-bf45-f294e14ca4f9";
        let delDto: DeleteModelDto = new DeleteModelDto();
        for (let it of this.deleteModel)
            delDto.entityList.push(it.entityKey);
      this.load.start()
        this.modelService.deletemodel(delDto.entityList[0], delDto.entityList[0]).subscribe(res => {
            debugger;
            this.load.stop()
            if (res.statusCode === 1) {
                abp.notify.success(res.statusMessage);
                this.deleteModel = [];
                this.model = [];
                this.filtermodel = [];
                // this.pager.nativeElement.reset();
                this.arr = [];
                this.getModelList();
            } else {
                abp.notify.error("Model Deleted Successfully.");
            }
        });

    }
    changePage(p: any) {
        this.currentPage = p;
        this.filtermodel = this.model.slice(((this.currentPage - 1) * this.pageSize), ((this.currentPage - 1) * this.pageSize) + this.pageSize);

    }
    //gotoexplore(value: DatasetDto) {
    //    this.data.passValue = value;
    //    this.data.passId = value.entityKey;
    //    this.data.passName = value.entityName;
    //    this._router.navigate(['explore_dataset', value.entityKey]);
    //}

    //edit(value: DatasetDto) {
    //    debugger;
    //    this.data.isUpdate = true;
    //    this.data.passId = value.entityKey;
    //    if (value.className.toLowerCase() == "rss") {
    //        this._router.navigate(['create_rss', value.entityKey]);
    //    }
    //    else if (value.className.toLowerCase() == "twitter")
    //        this._router.navigate(['create_twitter', value.entityKey]);
    //    else if (value.className.toLowerCase() == "facebook")
    //        this._router.navigate(['create_fb', value.entityKey]);
    //    else if (value.className.toLowerCase() == "delimited file")
    //        this._router.navigate(['create_csv', value.entityKey]);
    //    else if (value.className.toLowerCase() == "excel")
    //        this._router.navigate(['create_excel', value.entityKey]);
    //    else if (value.className.toLowerCase() == "database" || value.className.toLowerCase() == "rdbms")
    //        this._router.navigate(['create_rdbms', value.entityKey]);
    //}
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
    //getTypes() {
    //    this.datasetService.getDatasetTypes().subscribe(res => {
    //        debugger;
    //        this.datatypes = res;
    //        this.typeLoad = true;
    //    });
    //}
    //createDataset(newValue: string) {
    //    debugger;
    //    this.data.isUpdate = false;
    //    if (newValue.toLowerCase() == "database")
    //        this._router.navigate(['create_rdbms', '']);
    //    else if (newValue.toLowerCase() == "delimited file")
    //        this._router.navigate(['create_csv', '']);
    //    else if (newValue.toLowerCase() == "excel")
    //        this._router.navigate(['create_excel', '']);
    //    else if (newValue.toLowerCase() == "twitter")
    //        this._router.navigate(['create_twitter', '']);
    //    else if (newValue.toLowerCase() == "facebook")
    //        this._router.navigate(['create_fb', '']);
    //    else if (newValue.toLowerCase() == "rss") {
    //        this._router.navigate(['create_rss', '']);
    //    }
    //}
    gotocreate() {
        this._router.navigate(['CreateModel', ""]);
    }
    goToEdit(value: string) {
        this.config.isEdit = true;
        this._router.navigate(['CreateModel', value]);
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
        debugger;
        this.datasetService.datasetHistory(value).subscribe(re => {
            debugger;
            this.history = re;
            //  alert("Dataset Details:\n" + re.dsName + "\n" + re.dsKey + "\n" + re.dsModifiedDate + "\n" + re.dsRefreshDate + "\n" + re.dsCreateDate);
        });
    }

    getHistory(keyVal: string, id: number) {
        debugger;
        const input = JSON.stringify({
            className: "Analysis"
        });

        //let d: any = {};
        //d["className"] = "Analysis"; 
        this.modelService.getModelHistory(input, keyVal).subscribe(re => {
            debugger;
            if (re !== undefined) {
                if (re.length > 0)
                    this.filtermodel[id].modelHistory = re[0];
                this.historydetails = re;
              
            }
           
        });

    }


    getTrainTest(value: string) {
        debugger;
      this.load.start()
        abp.notify.success("Train Test Started");
        this.modelService.trainTestModel(value).subscribe(re => {
            this.load.stop()
            if (re.statusCode === 1) {
                abp.notify.success(re.statusMessage);
            }
            else
                abp.notify.error(re.statusMessage);
        });
    }


    abortModel(value: string) {
        debugger;

        this.modelService.AbortModel(value).subscribe(res => {
            if (res.statusCode === 1) {
                abp.notify.success(res.statusMessage);
            }
            else
                abp.notify.error(res.statusMessage);
        });
    }

    Validate(value: string) {
        debugger;
        abp.notify.success("Validate Model Started");
        this.modelService.ValidateModel(value).subscribe(re => {

            if (re.statusCode === 1) {
                abp.notify.success(re.statusMessage);
            }

            else
                abp.notify.error(re.statusMessage);


        });
    }


    algotypelist(value: string) {
        let s: string = "349f4497-6e95-422a-80da-a0b3b1789540";
        debugger;
        this.modelService.algorithmlist(s).subscribe(re => {


        });
    }


}
