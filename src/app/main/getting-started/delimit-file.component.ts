import { Component, NgZone, Inject, Input, Output } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { GettingStartedService, GSDatasetDto, SubDatasetDto, GSCSVDto, CSVDatasetDto, TempBaseUrl, DatasetResultModel } from '@shared/service-proxies/ids-service-proxies'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TokenService } from '@abp/auth/token.service';
@Component({
    selector: 'gscsv-app',
    templateUrl: './delimit-file.component.html',
    animations: [appModuleAnimation()]
})
export class GSCSVComponent {
    gsDataset: GSDatasetDto = GSDatasetDto.fromJS();
    isSubmit: boolean = false;
    mapfields: string[] = [];
    filePath: any = null;
    serviceFilePath: any = null;
    complexForm: FormGroup;
    container: string = "s";
    private height: number;
    ngOnInit() {
        this.height = window.innerHeight - 300;
    }
    constructor(private gService: GettingStartedService, fb: FormBuilder, private _session: TokenService) {

        if (this.gService.globalGSDataset !== undefined) {
            if (this.gService.globalGSDataset instanceof (CSVDatasetDto)) {
                this.gsDataset.entityName = this.gService.globalGSDataset.entityName;
                this.gsDataset.entityDescription = this.gService.globalGSDataset.entityDescription;
                this.gsDataset.isBack = true;
            }
        }
        //form 
        this.complexForm = fb.group({
            'name': [null, Validators.required],
            'description': [null, Validators.required],
            'delimit': [null, Validators.required],
            'file': ["s", Validators.required],
            'enterFile': [null],
            'selectFile': [null]
        });

    }
    /**
     * enable error if required fields are not fills
     */
    enableError() {
        this.complexForm.controls['name'].markAsTouched();
        this.complexForm.controls['description'].markAsTouched();
        this.complexForm.controls['delimit'].markAsTouched();
        this.complexForm.controls['file'].markAsTouched();
        this.complexForm.controls['enterFile'].markAsTouched();
        this.complexForm.controls['selectFile'].markAsTouched();
        if (this.complexForm.valid && this.serviceFilePath !== undefined) {
            this.submitForm(this.complexForm.value);
        }
    }
    /**
     * match file type i.e only allow csv files 
     * @param e
     */
    onChange(e) {
        debugger;
        this.filePath = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
        var pattern = "application/vnd.ms-excel";
        if (this.filePath.type !== pattern) {
            this.filePath = null;
            return;
        } else {
            this.serviceFilePath = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
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
    /**
     * upload csv file and get fields
     */
    onUploadClick() {
        debugger;
        let a = this.gsDataset.datasetType = "CSV";
        let b = this.gsDataset.columnDelimiter = this.complexForm.controls["delimit"].value;
        this.gService.uploadFile(this.serviceFilePath, a, b).subscribe(res => {
            debugger
            if (res.statusCode === 1) {
                try {
                    this.gsDataset.filePath = res.fileLocation;
                    for (let item of res.fileDataHeaders[this.serviceFilePath.name]) {
                        this.gsDataset.mapData.push(item);
                    }
                } catch (e) { }
                abp.notify.success(res.statusMessage);
            } else abp.notify.error(res.statusMessage);
        });
    }
    change() {
        this.filePath = null;
    }
    /**
     * on blur event of location textbox.
     * get file location
     * @param value
     */
    onBlurMethod(value: string) {
        debugger;
        let regex = new RegExp("([a-zA-Z]:(\\w+)*\\[a-zA-Z0_9]+)?.csv");
        if (value.match(regex)) {
            this.gsDataset.filePath = value;
        } else {
            this.gsDataset.filePath = null;
        }
    }
    submitForm(value: any): GSDatasetDto {
        debugger;
        this.gsDataset.entityName = value.name;
        this.gsDataset.entityDescription = value.description;
        this.gsDataset.entityType = "Dataset";
        this.gsDataset.className = "File";
        this.gsDataset.dashboardKey = "";
        this.gsDataset.datasetType = "CSV";
        this.gsDataset.workspaceKey = TempBaseUrl.WORKSPACEKEY;
        this.gsDataset.workspaceName = "workspaceName";
        this.gsDataset.columnDelimiter = value.delimit;
        this.gsDataset.sessionKey = this._session.getToken();
        if (value.file === 's') {
           // this.gsDataset.filePath = this.filePath.name;
            this.isSubmit = true;
        } else {
            if (value.enterFile !== null && value.enterFile !== "") {
                // var filename = this.filePath.replace(/^.*[\\\/]/, '');
                this.gsDataset.filePath = this.filePath;
                this.isSubmit = true;
            } else this.isSubmit = false;
        }
        if (this.isSubmit) {
            this.gsDataset.subDatasets = [];
            let sub: SubDatasetDto = new SubDatasetDto();
            sub.entityName = this.gsDataset.entityName;
            sub.entityDescription = this.gsDataset.entityDescription;
            sub.className = "SubDataset";
            sub.entityType = "SubDataset";
            sub.query = "";
            sub.datasetFields = [];
            this.gsDataset.subDatasets.push(sub);
            return this.gsDataset;
        }
        return null;

    }

}