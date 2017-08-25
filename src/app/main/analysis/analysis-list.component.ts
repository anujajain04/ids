import { Component, ElementRef, ViewChild } from '@angular/core';
import { DeleteDatasetDto, DatasetListDto, DatasetType, DatasetDto, DatasetHistoryDto, PassService, LoadingService } from '@shared/service-proxies/ids-service-proxies';
import { AnalysisDtoDetails, AnalysisService, AnalysisModelHistory, DeleteAnalysisDto } from '@shared/service-proxies/ids-analysis-service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Router } from '@angular/router';

@Component({
    templateUrl: './analysis-list.component.html',
    selector: 'data-list-app',
    animations: [appModuleAnimation()]

})

export class AnalysisListComponent {
    @ViewChild('pager') pager: ElementRef;
    analysis: AnalysisDtoDetails[] = [];
    filteranalysis: AnalysisDtoDetails[];
    deleteAnalysis: AnalysisDtoDetails[] = [];
    datatypes: DatasetType[];
    historydetails: AnalysisModelHistory[]=[];
    type: boolean = false;
    selectedType: string = null;
    typeLoad: boolean = false;
    i: number = 1;
    history: DatasetHistoryDto;
    pageSize: number = 10;
    currentPage: number = 1;
    arr: Array<number> = [];
    constructor(private analysisService: AnalysisService, private _router: Router, private data: PassService, private load: LoadingService) {
        this.data.clearAll();
        this.getAnalysisList();
        //this.getTypes();

    }
   


    getAnalysisList() {
        debugger;
        this.load.start();
        let s: string = "e921bf1a-5a9b-41e9-968f-a8675838dabd";
        this.analysisService.getAnalysisList(s).subscribe(result => {
            debugger;
            this.analysis = result;
            this.filteranalysis = result;
            this.load.stop();
            for (let i: number = 1; i <= Math.ceil(this.analysis.length / this.pageSize); i++) {
                this.arr.push(i);
            }
            this.currentPage = 1;
            this.filteranalysis = this.analysis.slice(0, this.pageSize);
            //if (this.dataset.length % 10 > 0)
            //this.pageCount++;
        });

    }

    filter(key: string) {
        debugger;
        this.filteranalysis = [];
        if (key == null && key === "") {
            this.filteranalysis = this.analysis;
        } else {
            for (let i of this.analysis) {
                if (i.entityName.toLowerCase().includes(key.toLowerCase())) {
                    this.filteranalysis.push(i);
                }
            }
        }
    }
    deletedata(d: any, k: any) {
        debugger;
        if (d.target.checked) {
            this.deleteAnalysis.push(k);
        }
        else {
            if (this.deleteAnalysis.length > 0)
                this.deleteAnalysis.splice(this.deleteAnalysis.indexOf(k), 1);
        }

    }
    isPresent(k: any): boolean {
        if (this.deleteAnalysis !== undefined)
            if (this.deleteAnalysis.indexOf(k)===-1)
                return false
            else true;
        else false;
    }
    selectAll(event: any) {
        debugger;
        if (event.target.checked) {
            this.deleteAnalysis = [];
            for (let k of this.analysis)
                this.deleteAnalysis.push(k);// = this.dataset;
        } else this.deleteAnalysis = [];
    }
    isAll(): boolean {
        debugger;
        if (this.analysis.length === this.deleteAnalysis.length && this.analysis.length !== 0)
            return true;
        return false;
    }
    yesdel() {
        debugger;
        this.load.start();
        let delDto: DeleteAnalysisDto = new DeleteAnalysisDto();
        for (let it of this.deleteAnalysis)
            delDto.entityList.push(it.entityKey);
        this.load.isLoading = true;
        this.analysisService.deleteAnalysis(delDto.entityList[0]).subscribe(res => {
            debugger;
            this.load.stop();
            if (res["status_code"] === 1) {
                abp.notify.success(res["string_message"]);
                this.deleteAnalysis = [];
                this.analysis = [];
                this.filteranalysis = [];
                // this.pager.nativeElement.reset();
                this.arr = [];
                this.getAnalysisList();
            } else {
                abp.notify.error(res["string_message"]);
            }
        });

    }
    changePage(p: any) {
        this.currentPage = p;
        this.filteranalysis = this.analysis.slice(((this.currentPage - 1) * this.pageSize), ((this.currentPage - 1) * this.pageSize) + this.pageSize);

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
    //    this.analysisService.getAnalysisTypes().subscribe(res => {
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
        this._router.navigate(['createanalysis']);
    }

    //onOption(value, keyVal) {
    //    console.log('Values:' + value + "," + keyVal);
    //    if (value == "explore")
    //        this._router.navigate(['explore_dataset', keyVal]);
    //    else if (value == "history")
    //        this.gotohistory(keyVal);
    //}
    dashboard() {
        this._router.navigate(['dashboard']);
    }
    //gotohistory(value: any) {
    //    debugger;
    //    this.analysisService.analysisHistory(value).subscribe(re => {
    //        debugger;
    //        this.history = re;
    //        //  alert("Dataset Details:\n" + re.dsName + "\n" + re.dsKey + "\n" + re.dsModifiedDate + "\n" + re.dsRefreshDate + "\n" + re.dsCreateDate);
    //    });
    //}

    getHistory(keyVal: string, id: number) {
        debugger;
        const input = JSON.stringify({
            className: "Analysis"
        });
        let d: any = {};
        d["className"] = "Analysis";
        this.analysisService.getAnalysisHistory(d, keyVal).subscribe(re => {
            debugger;
            if (re !== undefined)
            {
                if (re.length > 0)
                    this.filteranalysis[id].analysisHistory = re[0];
                this.historydetails = re;
            }
            
        });           
    
     }


}
