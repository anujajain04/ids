import { Component, ElementRef, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { GettingStartedService, RSSDatasetDto, DatasetService, DatasetFieldDto, SubDatasetDto, PassService, GSDatasetDto, TempBaseUrl, DatasetResultModel, LoadingService } from '@shared/service-proxies/ids-service-proxies'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TokenService } from '@abp/auth/token.service';
@Component({
    selector: 'gsrss',
    templateUrl: './rss.component.html',
    animations: [appModuleAnimation()]
})
export class GSRSSComponent {
    @ViewChild('field') elField: ElementRef;
    @ViewChild('selectField') elSelectField: ElementRef;
    gsDataset: GSDatasetDto = GSDatasetDto.fromJS();
    complexForm: FormGroup;
    rssFields: string[] = [];
    selectedField: string[] = [];
    private height: number;
    constructor(private gService: GettingStartedService, private pass: PassService,private ds: DatasetService, fb: FormBuilder, private _session: TokenService, private load: LoadingService) {

        if (this.gService.globalGSDataset !== undefined) {
            if (this.gService.globalGSDataset instanceof (RSSDatasetDto)) {
                this.gsDataset.entityName = this.gService.globalGSDataset.entityName;
                this.gsDataset.entityDescription = this.gService.globalGSDataset.entityDescription;
                this.gsDataset.subDatasets = this.gService.globalGSDataset.subDatasets;
                this.gsDataset.isBack = true;
            }
        }
        this.complexForm = fb.group({
            'name': [null, Validators.required],
            'description': [null, Validators.required],
            'url': [null, Validators.required],
            'selectedfields': [null]
        });
      //  this.getRssFields();
    }
    ngOnInit() {
        this.height = window.innerHeight - 300;
    }

    enableError() {
        this.complexForm.controls['name'].markAsTouched();
        this.complexForm.controls['description'].markAsTouched();
        this.complexForm.controls['url'].markAsTouched();
        if (this.complexForm.valid) {
            this.submitForm(this.complexForm.value);
        }
    }
    //getRssFields1() {
    //    if (this.complexForm.controls['name'].valid && this.complexForm.controls['description'].valid && this.complexForm.controls['url'].valid) {

    //        let input = JSON.stringify(
    //            {
    //                sessionKey: this._session.getToken(),
    //                rssUrl: this.complexForm.controls['url'].value
    //            });
    //        this.ds.getRssFields(input).subscribe(res => {
    //            this.rssFields = res;
    //        });
    //    }
    //}

    getRssFields() {
        this.selectedField = [];
        this.rssFields = [];
        debugger;
        if (this.complexForm.controls['url'].valid || this.pass.isUpdate) {
          this.load.start()
            let input = JSON.stringify(
                {
                    sessionKey: this._session.getToken(),
                    rssUrl: this.pass.isUpdate ? this.gsDataset.subDatasets[0].query : this.complexForm.controls['url'].value
                });

            this.ds.getRssFields(input).subscribe(res => {
                this.load.stop()
                this.rssFields = res;
                if (this.pass.isUpdate) {
                    if (this.gsDataset !== undefined) {
                        if (this.gsDataset.subDatasets.length > 0) {
                            for (let r of this.gsDataset.subDatasets[0].datasetFields) {
                                let ch: boolean = false;
                                for (let f of this.rssFields) {
                                    if (r.entityName === f) {
                                        ch = true;
                                        break;
                                    }
                                }
                                if (ch)
                                    this.selectedField.push(r.entityName);
                            }
                            for (let d of this.selectedField)
                                this.rssFields.splice(this.rssFields.indexOf(d), 1);
                        }
                    }
                }
            });
        }
    }
    arrowClick(value: boolean) {
        if (value) {
            //right arrow click
            let option = this.elField.nativeElement.options;
            for (let l of option)
                if (l.selected) {
                    this.selectedField.push(l.value);
                    this.rssFields.splice(this.rssFields.indexOf(l.value), 1);
                }
        } else {
            //left arrow click 
            let option = this.elSelectField.nativeElement.options;
            for (let l of option)
                if (l.selected) {
                    this.rssFields.push(l.value);
                    this.selectedField.splice(this.selectedField.indexOf(l.value), 1);
                }
        }
    }
    submitForm(value: any): GSDatasetDto {
        this.gsDataset.entityName = value.name;
        this.gsDataset.entityDescription = value.description;
        this.gsDataset.entityType = "Dataset";
        this.gsDataset.className = "RSS";
        this.gsDataset.dashboardKey = "";
        this.gsDataset.workspaceKey = TempBaseUrl.WORKSPACEKEY;
        this.gsDataset.workspaceName = "workspaceName";
        this.gsDataset.sessionKey = this._session.getToken();
        let s: SubDatasetDto = new SubDatasetDto();
        s.className = "SubDataset";
        s.entityType = "SubDataset";
        s.entityName = value.name;
        s.entityDescription = value.description;
        s.isCustom = "false";
        s.query = value.url;
        if (this.selectedField.length > 0) {
            for (let s1 of this.selectedField) {
                let f: DatasetFieldDto = new DatasetFieldDto();
                f.entityName = s1;
                f.entityDescription = s1;
                f.dataType = "text";
                f.entityType = "DatasetField";
                f.className = s1;
                s.datasetFields.push(f);
            }
        }
        this.gsDataset.subDatasets.push(s);
        return this.gsDataset;
    }
    getUrl(): string {
        if (this.gsDataset !== undefined) {
            if (this.gsDataset.subDatasets !== undefined)
                if (this.gsDataset.subDatasets.length > 0)
                    return this.gsDataset.subDatasets[0].query;
        }
        return "";
    }
}