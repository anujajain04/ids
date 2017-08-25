import { Component, Injector, ElementRef, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DatasetService, RSSDatasetDto, LoadingService, DatasetState, DatasetFieldDto, SubDatasetDto, DatasetDto, DatasetResultModel, TempBaseUrl, PassService } from '@shared/service-proxies/ids-service-proxies'
import { TokenService } from '@abp/auth/token.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WorkspaceService, WorkspaceDto } from '@shared/service-proxies/ids-workspace-service-proxies';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
@Component({
    selector: 'Create-RSS',
    templateUrl: './create-rss.component.html',
    animations: [appModuleAnimation()]
})

export class CreateRSSComponent {
    @ViewChild('field') elField: ElementRef;
    @ViewChild('selectField') elSelectField: ElementRef;
    rssData: RSSDatasetDto = new RSSDatasetDto();
    complexForm: FormGroup;
    rssFields: string[] = [];
    selectedField: string[] = [];
    key: string;
    isUpdate: boolean = false;
    private height1: number;
    constructor(private service: DatasetService, fb: FormBuilder, private wService: WorkspaceService,
        private pass: PassService, route: ActivatedRoute,
        private _session: TokenService, private _location: Location, private load: LoadingService) {
        this.complexForm = fb.group({
            'name': [null, Validators.required, this.rssData.entityName],
            'description': [null, Validators.required],
            'url': [null, Validators.required],
            'selectedfields': [null]
        });
        this.key = route.snapshot.params['key'];
        try {
            this.key = route.snapshot.params['key'];
            if (this.key !== "" && this.key !== null && this.key !== undefined) {
                if (this.pass.isUpdate && this.pass.passValue !== undefined && this.pass.passValue !== null) {
                    this.rssData = this.pass.passValue;
                } {
                    this.pass.isUpdate = true;
                    this.pass.passId = this.key;
                    this.complexForm.controls["name"].disable();
                    if (this.pass.passValue !== undefined && this.pass.passValue !== null) {
                        this.rssData = this.pass.passValue;
                    } else this.getDatasetDetails();
                }
            } else {
                this.pass.isUpdate = false;
                this.rssData = new RSSDatasetDto();
            }
        } catch (e) {
            console.error("Error at facebook");
        }
    }

    ngOnInit() {
        //this.height = window.innerHeight - 65;
        this.height1 = window.innerHeight - 80;
        //this.height2 = window.innerHeight - 245;
    }
    getDatasetDetails() {
        if (this.key !== null) {
            //this.fbDataset = new FacebookDatasetDto();
          this.load.start()
            this.service.editDataset("RSS", this.key).subscribe(res => {
                this.load.stop()
                if (res !== null && res !== undefined) {
                    this.rssData = res;
                    this.complexForm.controls["name"].setValue(this.rssData.entityName);
                    this.complexForm.controls["description"].setValue(this.rssData.entityDescription);
                    this.complexForm.controls["url"].setValue(this.rssData.subDatasets[0].entityName);
                    this.getRssFields();
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
    getRssFields() {
        this.selectedField = [];
        this.rssFields = [];
        debugger;
        if (this.complexForm.controls['url'].valid || this.pass.isUpdate) {
          this.load.start()
            let input = JSON.stringify(
                {
                    sessionKey: this._session.getToken(),
                    rssUrl: this.pass.isUpdate ? this.rssData.subDatasets[0].query : this.complexForm.controls['url'].value
                });

            this.service.getRssFields(input).subscribe(res => {
                this.load.stop()
                this.rssFields = res;
                if (this.pass.isUpdate) {
                    if (this.rssData !== undefined) {
                        if (this.rssData.subDatasets.length > 0) {
                            for (let r of this.rssData.subDatasets[0].datasetFields) {
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
    submitForm(value: any): void {
        debugger
        this.rssData.entityName = value.name;
        this.rssData.entityDescription = value.description;
        this.rssData.entityType = "Dataset";
        this.rssData.className = "RSS";
        this.rssData.dashboardKey = "";
        this.rssData.workspaceKey = WorkspaceService.WorkSpaceKey;
        this.rssData.workspaceName = "workspaceName";
        this.rssData.sessionKey = this._session.getToken();
        if (!this.pass.isUpdate) {
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
                    s.datasetFields.push(f);
                }
            }
            this.rssData.subDatasets.push(s);
        } else {
            if (this.rssData.subDatasets.length > 0)
                for (let item of this.selectedField) {
                    let b: boolean = false;
                    for (let x of this.rssData.subDatasets[0].datasetFields)
                        if (x.entityName === item)
                            b = true;
                    if (!b) {
                        let f: DatasetFieldDto = new DatasetFieldDto();
                        f.entityName = item;
                        f.entityDescription = item;
                        f.dataType = "text";
                        f.entityType = "DatasetField";
                        f.datasetId = this.rssData.entityKey;
                        f.datasetName = this.rssData.entityName;
                        this.rssData.subDatasets[0].datasetFields.push(f);
                    }
                }
        }

      this.load.start()
        if (this.pass.isUpdate) {
            this.service.updateDataset(this.rssData.toUpdateJSON().toString(), DatasetState.RSS, this.rssData.entityKey).subscribe(res => {
                debugger;
                this.load.stop()
                if (res.statusCode == 1) {
                    abp.notify.success(res.statusMessage);
                    this._location.back();
                } else abp.notify.error(res.statusMessage);
            });
        } else {
            this.service.createRSSDataset(this.rssData).subscribe(rs => {
                this.load.stop()
                if (rs.statusCode == 1) {
                    abp.notify.success(rs.statusMessage);
                    this.complexForm.reset();
                    this._location.back();
                } else {
                    abp.notify.error(rs.statusMessage);
                }
            });
        }
    }
    getUrl(): string {
        if (this.rssData !== undefined) {
            if (this.rssData.subDatasets !== undefined)
                if (this.rssData.subDatasets.length > 0)
                    return this.rssData.subDatasets[0].query;
        }
        return "";
    }
}