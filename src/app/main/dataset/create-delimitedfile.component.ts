import { Component, EventEmitter, Input, Output } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { TokenService } from '@abp/auth/token.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { WorkspaceService, WorkspaceDto } from '@shared/service-proxies/ids-workspace-service-proxies';
import { DatasetService, DatasetDto, ColumnDto, DatasetFieldDto, SubDatasetDto, CSVDatasetDto, TempBaseUrl, PassService, GettingStartedService, DatasetResultModel, DatasetState, LoadingService } from '@shared/service-proxies/ids-service-proxies'
const URL = 'http://localhost:4200/uploaded_files';
declare var $: any;
@Component({
    selector: 'Create-CSV',
    templateUrl: './create-delimitedfile.component.html',
    animations: [appModuleAnimation()]
})
export class CreateCSVComponent {
    @Output() onClick = new EventEmitter();
    csvdataset: CSVDatasetDto = new CSVDatasetDto();
    isSubmit: boolean = false;
    canUpload: boolean = false;
    file: File;
    filePath: any = null;
    complexForm: FormGroup;
    serviceFilePath: any = null;
    mapfields: string[] = [];
    key: string;
    private height: number;
    private height1: number;
    private height2: number;
    constructor(private _router: Router, private _loc: Location, route: ActivatedRoute, private gService: GettingStartedService, private pass: PassService, private dService: DatasetService, fb: FormBuilder, private _session: TokenService, private load: LoadingService) {
        this.complexForm = fb.group({
            'name': [null, Validators.required],
            'description': [null, Validators.required],
            'delimit': [null, Validators.required],
            'file': ["s", Validators.required],
            'enterFile': [null],
            'selectFile': [null]
        });
        debugger
        this.key = route.snapshot.params['key'];
        if (this.key === '' || this.key === null || this.key === undefined) {
            this.csvdataset = new CSVDatasetDto();
            this.pass.isUpdate = false;
        } else {
            this.pass.isUpdate = true;
            this.getDatasetDetails();
        }
    }
    addRow() {
        debugger
        let d: DatasetFieldDto = new DatasetFieldDto();
        d.entityType = "DatasetField";
        this.csvdataset.columnList.push(d);
    }
    deleteRow(id: number) {
        debugger
        this.csvdataset.columnList.splice(id, 1);
    }
    ngOnInit() {
        debugger
        this.height = window.innerHeight - 65;
        this.height1 = window.innerHeight;
        this.height2 = window.innerHeight - 245;
    }

    onChange(e) {

        //// required to install npm install ng2-file-upload --save
        //this.filePath = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
        //var pattern = "application/vnd.ms-excel";
        //if (this.filePath.type !== pattern) {
        //    this.filePath = null;
        //    return;
        //} else {

        //}
        debugger;
        this.filePath = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
        this.serviceFilePath = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
        var pattern = "application/vnd.ms-excel";
        if (this.filePath.type !== pattern) {
            this.filePath = null;
            return;
        } else {
            //let uploadFile = (<HTMLInputElement>window.document.getElementById('file')).files[0];
            //var fileReader = new FileReader();
            //fileReader.readAsText(uploadFile);
            //fileReader.onloadend = (data) => {
            //    debugger;
            //    console.log("fileReader.onload");
            //    var contents: any = data.target;
            //    this.mapfields = contents.result.split(',');
            //}

        }

    }
    change() {
        debugger
        this.filePath = null;
    }
    onBlurMethod(value: string) {
        debugger;
        let regex = new RegExp("([a-zA-Z]:(\\w+)*\\[a-zA-Z0_9]+)?.csv");
        if (value.match(regex)) {
            this.filePath = value;
        } else {
            this.filePath = null;
        }
    }


    getDatasetDetails() {
        debugger
        if (this.key !== null) {
            //this.fbDataset = new FacebookDatasetDto();
          this.load.start()
            this.dService.editDataset("CSV", this.key).subscribe(res => {
                debugger;
                this.load.stop()
                this.csvdataset = res;
                this.complexForm.controls["delimit"].setValue(this.csvdataset.columnDelimiter);
                if (this.csvdataset.subDatasets.length > 0) {
                    this.csvdataset.columnList = this.csvdataset.subDatasets[0].datasetFields;
                }
            });
        }
    }
    uploadAll(value: any) {
        debugger;
        let a = this.csvdataset.datasetType = "CSV";
        let b = this.csvdataset.columnDelimiter = value.delimit;
        this.gService.uploadFile(this.serviceFilePath, a, b).subscribe(res => {
            if (res.statusCode === 1 || res.status_code === 1) {
                try {
                    this.csvdataset.filePath = res.fileLocation;
                    for (let item of res.fileDataHeaders[this.serviceFilePath.name]) {
                        let d: DatasetFieldDto = new DatasetFieldDto();
                        d.entityType = "DatasetField";
                        d.entityName = item;
                        d.entityDescription = item;
                        this.csvdataset.columnList.push(d);
                    }
                } catch (e) { }

                abp.notify.success(res.statusMessage == undefined ? res.status_code : res.statusMessage);
            } else abp.notify.error(res.statusMessage == undefined ? res.status_code : res.statusMessage);
        });
    }
    enableError() {
        debugger
        this.complexForm.controls['name'].markAsTouched();
        this.complexForm.controls['description'].markAsTouched();
        this.complexForm.controls['delimit'].markAsTouched();
        this.complexForm.controls['file'].markAsTouched();
        this.complexForm.controls['enterFile'].markAsTouched();
        this.complexForm.controls['selectFile'].markAsTouched();
        if (this.complexForm.valid && this.filePath !== undefined) {
            this.submitForm(this.complexForm.value);
        }
    }
    submitForm(value: any): void {
        debugger;
        this.csvdataset.entityName = value.name;
        this.csvdataset.entityDescription = value.description;
        this.csvdataset.entityType = "Dataset";
        this.csvdataset.className = "File";
        this.csvdataset.dashboardKey = "";
        this.csvdataset.workspaceKey = WorkspaceService.WorkSpaceKey;
        this.csvdataset.workspaceName = "workspaceName";
        this.csvdataset.columnDelimiter = value.delimit;
        this.csvdataset.sessionKey = this._session.getToken();
        debugger
        if (value.file === 's') {
            //this.csvdataset.filePath = this.filePath.name;
            this.isSubmit = true;
        } else {
            if (value.enterFile !== null && value.enterFile !== "") {
                var filename = this.filePath.replace(/^.*[\\\/]/, '');
                this.csvdataset.filePath = this.filePath;
                this.isSubmit = true;
            } else this.isSubmit = false;
        }
        if (this.isSubmit && !this.pass.isUpdate) {
            this.csvdataset.subDatasets = [];
            let sub: SubDatasetDto = new SubDatasetDto();
            sub.entityName = this.csvdataset.entityName;
            sub.entityDescription = this.csvdataset.entityDescription;
            sub.className = "SubDataset";
            sub.entityType = "SubDataset";
            sub.query = "";
            sub.datasetFields = this.csvdataset.columnList;
            this.csvdataset.subDatasets.push(sub);
          this.load.start()
            this.dService.createCsvDataset(this.csvdataset).subscribe(rs => {
                debugger
                this.load.stop()
                if (rs.statusCode == 1) {
                    abp.notify.success("Dataset Saved.");
                    this.complexForm.reset();
                    this._loc.back();
                } else {
                    abp.notify.error("Unable to save dataset");
                }
            });
        } else if (this.pass.isUpdate) {
            this.csvdataset.subDatasets[0].datasetFields = this.csvdataset.columnList;
            this.csvdataset.subDatasets[0].changeFlag = true;
            this.dService.updateDataset(this.csvdataset.toUpdateJSON().toString(), DatasetState.CSV, this.csvdataset.entityKey).subscribe(res => {
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