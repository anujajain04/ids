import { Component, ElementRef, ViewChild, AfterViewInit, OnInit, Directive, Input} from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { GettingStartedService, GSDatasetDto,ExcelDatasetDto, GSExcelDto,SubDatasetDto, TempBaseUrl, DatasetResultModel } from '@shared/service-proxies/ids-service-proxies'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TokenService } from '@abp/auth/token.service';
@Component({
    selector: 'gsexcel-app',
    templateUrl: './excel-dataset.component.html',
    animations: [appModuleAnimation()]
})
export class GSExcelComponent {
    gsDataset: GSDatasetDto = GSDatasetDto.fromJS();
    isSubmit: boolean = false;
    filePath: any;
    mapfields: string[] = [];
    serviceFilePath: any = null;
    reader: FileReader;
    complexForm: FormGroup;
    private height: number;
    ngOnInit() {
        debugger;
        this.height = window.innerHeight-300;
    }
    constructor(private gService: GettingStartedService, fb: FormBuilder, private _session: TokenService) {
        debugger;
       
        if (this.gService.globalGSDataset !== undefined) {
            if (this.gService.globalGSDataset instanceof (ExcelDatasetDto)) {
                this.gsDataset.entityName = this.gService.globalGSDataset.entityName;
                this.gsDataset.entityDescription = this.gService.globalGSDataset.entityDescription;
                this.gsDataset.isBack = true;
            }
        }
        this.complexForm = fb.group({
            'name': [null, Validators.required],
            'description': [null, Validators.required],
            'file': ["s", Validators.required],
            'enterFile': [null],
            'selectFile': [null]
        });
    }

    enableError() {
        this.complexForm.controls['name'].markAsTouched();
        this.complexForm.controls['description'].markAsTouched();
        this.complexForm.controls['file'].markAsTouched();
        this.complexForm.controls['enterFile'].markAsTouched();
        this.complexForm.controls['selectFile'].markAsTouched();
        if (this.complexForm.valid && this.filePath !== undefined) {
            this.submitForm(this.complexForm.value);
        }
    }
    onChange(e) {
        this.filePath = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
        this.serviceFilePath = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
        var pattern = "application/vnd.ms-excel";
        var pattern1="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        if (this.filePath.type == pattern || this.filePath.type == pattern1) {
            let uploadFile = (<HTMLInputElement>window.document.getElementById('file')).files[0];
            var fileReader = new FileReader();
            fileReader.readAsText(uploadFile);
            fileReader.onloadend = (data) => {
                debugger;
                console.log("fileReader.onload");
                var contents: any = data.target;
                this.mapfields = contents.result.split(',');
            }
        } else {
            this.filePath = null;
        }

    }

    uploadAll() {
        debugger;
        let a = this.gsDataset.datasetType = "Excel";
        let b ="";
        this.gService.uploadFile(this.serviceFilePath,a,b).subscribe(res => {
            if (res.statusCode === 1) {
                try {
                    debugger;
                    this.gsDataset.filePath = res.fileLocation;
                    //for (let item of res.fileDataHeaders[this.serviceFilePath.name]) {
                        this.gsDataset.mapData=Object.keys(res.fileDataHeaders); 
                    //}
                } catch (e) { }
                abp.notify.success(res.statusMessage);
            } else abp.notify.error(res.statusMessage);
        });
    }

    change() {
        this.filePath = null;
    }
    onBlurMethod(value: string) {
        debugger;
        let regex = new RegExp("([a-zA-Z]:(\\w+)*\\[a-zA-Z0_9]+)?.xls");
        let regex1 = new RegExp("([a-zA-Z]:(\\w+)*\\[a-zA-Z0_9]+)?.xlsx");
        if (value.match(regex) || value.match(regex1)) {
            this.filePath = value;
        } else {
            this.filePath = null;
        }
    }
    submitForm(value: any): GSDatasetDto {
        this.gsDataset.entityName = value.name;
        this.gsDataset.entityDescription = value.description;
        this.gsDataset.entityType = "Dataset";
        this.gsDataset.className = "Excel";
        this.gsDataset.dashboardKey = "";
        this.gsDataset.workspaceKey = TempBaseUrl.WORKSPACEKEY;
        this.gsDataset.workspaceName = "workspaceName";
        this.gsDataset.sessionKey = this._session.getToken();
        if (value.file === 's') {
            //this.gsDataset.filePath = this.filePath.name;
            this.isSubmit = true;
        } else {
            if (value.enterFile !== null && value.enterFile !== "") {
                var filename = this.filePath.replace(/^.*[\\\/]/, '');
                this.gsDataset.filePath = filename;
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