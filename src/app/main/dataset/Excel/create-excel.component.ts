import { Component, Input, Output } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
    PassService, DatasetService, TempBaseUrl, DatasetDto, ExcelSheet, DatasetState,
    DatasetFieldDto, ExcelDatasetDto, SubDatasetDto, DatasetResultModel, GettingStartedService, LoadingService
} from '@shared/service-proxies/ids-service-proxies'
import { TokenService } from '@abp/auth/token.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
@Component({
    selector: 'Create-CSV',
    templateUrl: './create-excel.component.html',
    animations: [appModuleAnimation()]
})
export class CreateEXCELComponent {
    deleteExcel: DatasetDto[] = [];
    isSubmit: boolean = true;
    filePath: any;
    excelData: ExcelDatasetDto = new ExcelDatasetDto();
    key: string;
    complexForm: FormGroup;
    private height: number;
    private height1: number;
    private height2: number;
    serviceFilePath: any = null;
    mapfields: string[] = [];
    constructor(private gService: DatasetService, private exService: GettingStartedService, fb: FormBuilder, private _router: Router,
        private _session: TokenService, private _location: Location, route: ActivatedRoute, private pass: PassService, private load: LoadingService) {
        this.complexForm = fb.group({
            'name': [null, Validators.required],
            'description': [null, Validators.required],
            'file': ["s"],
            'enterFile': [null],
            'selectFile': [null]
        });
        try {
            debugger;
            // get entity key from url if it requested for edit
            this.key = route.snapshot.params['key'];
            // check for key if key present then attemp for edit dataset
            if (this.key !== "" && this.key !== null && this.key !== undefined) {
                if (this.pass.isUpdate && this.pass.passValue !== undefined && this.pass.passValue !== null) {
                    this.excelData = this.pass.passValue;
                    this.removeNullSubdataset();
                } {
                    this.pass.isUpdate = true;
                    this.pass.passId = this.key;
                    this.complexForm.controls["name"].disable();
                    if (this.pass.passValue !== undefined && this.pass.passValue !== null) {
                        this.excelData = this.pass.passValue;
                        this.removeNullSubdataset();
                    } else this.getDatasetDetails();
                }
            } else {
                // it restore data when page redirect back from subdataset page
                if (this.pass.passValue !== undefined && this.pass.passValue !== null) {
                    this.excelData = this.pass.passValue;
                    this.removeNullSubdataset();
                } else {
                    //it runs for create new dataset
                    this.pass.isUpdate = false;
                    this.excelData = new ExcelDatasetDto();
                }
            }
        } catch (e) {
            console.error("Error at facebook");
        }
    }
    /**
     * remove subdataset that has no entityname and description 
     */
    removeNullSubdataset() {
        this.excelData.subDatasets.forEach((item, index) => {
            if (item.entityName == undefined || item.entityDescription == undefined || item.entityName == null || item.entityDescription == null)
                this.excelData.subDatasets.splice(index, 1);
        })
    }
    getDatasetDetails() {
        if (this.key !== null) {
          this.load.start()
            this.gService.editDataset("Excel", this.key).subscribe(res => {
                debugger;
                this.load.stop()
                this.excelData = res;
            });
        }
    }
    //deletedata(d: any, k: any) {
    //    if (d.target.checked) {
    //        this.deleteExcel.push(k);
    //    }
    //    else {
    //        if (this.deleteExcel.length > 0)
    //            this.deleteExcel.splice(this.deleteExcel.indexOf(k), 1);
    //    }

    //}
    //selectAll(event: any) {
    //    debugger;
    //    if (event.target.checked) {
    //        this.deleteExcel = [];
    //        for (let d of this.dataset)
    //            this.deleteExcel.push(d);// = this.dataset;
    //    } else this.deleteExcel = [];
    //}
    /**
     * not used
     */
    //isAll(): boolean {
    //    if (this.dataset.length === this.deleteExcel.length && this.dataset.length !== 0)
    //        return true;
    //    return false;
    //}
    /**
        it calls on add subdataset button click
     * store all changes and and redirect to sub dataset page
     * @param value
     */
    submitForm(value: any): void {
        debugger;
        try {
           // this.excelData.entityName = value.name;
            //this.excelData.entityDescription = value.description;
            this.excelData.entityType = "Dataset";
            this.excelData.className = "Excel";
            this.excelData.dashboardKey = "";
            this.excelData.workspaceKey = TempBaseUrl.WORKSPACEKEY;
            this.excelData.sessionKey = this._session.getToken();
            this.excelData.workspaceName = "workspaceName";
            if (value.file !== 's') {
                this.excelData.filePath = this.complexForm.controls["enterFile"].value;
            }
            this.pass.passValue = this.excelData;
            this.createsubExcel();

        } catch (e) {
            console.error(e.message);
        }
    }
    /**
     * naviagate to subdataset page
     */
    createsubExcel() {
        this._router.navigate(['sub-Excel']);
    }
    /**
     * api call for create excel dataset
     */
    save() {
        debugger;
        if (this.excelData !== undefined) {
            if (!this.pass.isUpdate) {
              this.load.start()
                this.gService.createExcelDataset(this.excelData).subscribe(rs => {
                    if (rs.statusCode == 1) {
                        abp.notify.success("Dataset Saved.");
                        this._location.back();
                    } else {
                        abp.notify.error("Unable to save dataset");
                    }
                    this.load.stop()
                });
            } else {
                //update
              this.load.start()
                this.gService.updateDataset(this.excelData.toUpdateJSON().toString(), DatasetState.EXCEL, this.excelData.entityKey).subscribe(res => {
                    debugger;
                    this.load.stop()
                    if (res.statusCode == 1) {
                        abp.notify.success(res.statusMessage);
                        this.getDatasetDetails();
                    } else abp.notify.error(res.statusMessage);
                });
            }
        }
    }

    ngOnInit() {
        this.height = window.innerHeight - 55;
        this.height1 = window.innerHeight - 72;
        this.height2 = window.innerHeight - 245;
    }
    /**
     * store file object in this.serviceFilePath . this object will be sent to the server
     * @param e // e is a file object
     */
    onChange(e) {
        debugger;
        this.serviceFilePath = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    }
    /**
     * update file path on radi button checked false
     */
    change() {
        this.excelData.filePath = null;
    }
    /**
     *  upload excel file and get the server file path and worksheet list with fields
     */
    uploadAll() {
        debugger;
        let a = this.excelData.datasetType = "Excel";
        this.exService.uploadFile(this.serviceFilePath, a, "").subscribe(res => {
            debugger;
            if (res.statusCode === 1 || res.status_code === 1) {
                let sheets: any[] = [];
                this.excelData.filePath = res.fileLocation;
                //get sheets array and respective column headers.
                Object.keys(res.fileDataHeaders).forEach((item, index) => {
                    let tempSheet: ExcelSheet = new ExcelSheet();
                    ///get sheet name and its header fields
                    tempSheet.header = item;
                    for (let x of res.fileDataHeaders[item]) {
                        //get column headers
                        let d: DatasetFieldDto = new DatasetFieldDto();
                        d.entityType = "DatasetField";
                        d.entityName = x;
                        d.entityDescription = x;
                        tempSheet.fields.push(d);
                    }
                    this.excelData.excelSheet.push(tempSheet);
                });

                abp.notify.success(res.statusMessage == undefined ? res.status_code : res.statusMessage);
            } else abp.notify.error(res.statusMessage == undefined ? res.status_code : res.statusMessage);
        });
    }
    /**
     * check inpu file type for file location 
     * @param value
     */
    onBlurMethod(value: string) {
        debugger;
        let regex = new RegExp("([a-zA-Z]:(\\w+)*\\[a-zA-Z0_9]+)?.csv");
        if (value.match(regex)) {
            this.excelData.filePath = value;
        }
    }
}