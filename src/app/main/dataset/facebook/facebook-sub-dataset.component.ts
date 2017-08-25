import { Component, Injector, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router } from '@angular/router';
import { DatasetService, FacebookDatasetDto, DatasetFieldDto, SubDatasetDto, DatasetResultModel, PassService } from '@shared/service-proxies/ids-service-proxies'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
@Component({
    selector: 'subfacebook',
    templateUrl: './facebook-sub-dataset.component.html',
    animations: [appModuleAnimation()]
})

export class SubFacebookDatasetComponent extends AppComponentBase {
    @ViewChild('field') elField: ElementRef;
    @ViewChild('selectField') elSelectField: ElementRef;
    fbDataset: FacebookDatasetDto;
    rssFields: string[] = [];
    selectedField: string[] = [];
    complexForm: FormGroup;
    isUpdate: boolean = false;
    _checkIndex = -1;
    _submitText: string = "Add";
    //private height: number;
    //private height1: number;
    //private height2: number; 
    constructor(injector: Injector, private _location: Location, private _router: Router, fb: FormBuilder, private dsService: DatasetService, private pass: PassService) {
        super(injector);
        debugger;
        if (this.pass.passValue !== null && this.pass.passValue !== undefined)
            this.fbDataset = this.pass.passValue;
        else
            this._location.back();
        this.complexForm = fb.group({
            'name': [null, Validators.required],
            'description': [null, Validators.required],
            'pageId': [null, Validators.required]
        });
        this.getFields();

    }
    getFields() {
        this.dsService.getFacebookFields().subscribe(res => {
            this.rssFields = res;
        });
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

    //ngOnInit() {
    //    this.height = window.innerHeight - 65;
    //    this.height1 = window.innerHeight - 75;
    //    this.height2 = window.innerHeight - 245;
    //}
    submitForm(value: any): void {
        debugger;
        if (this._checkIndex === -1) {
            if (this.fbDataset !== undefined && this.complexForm.valid) {
                let sub = new SubDatasetDto();
                sub.entityName = value.name;
                sub.entityDescription = value.description;
                sub.entityType = "SubDataset";
                sub.className = "SubDataset";
                sub.isCustom = "False";
                sub.query = value.pageId;
                if (this.pass.isUpdate)
                    sub.datasetName = this.pass.passValue.entityName;
                if (this.selectedField.length > 0) {
                    for (let s of this.selectedField) {
                        let f: DatasetFieldDto = new DatasetFieldDto();
                        f.entityName = s;
                        f.entityDescription = s;
                        f.dataType = "text";
                        f.entityType = "DatasetField";
                        f.datasetName = this.fbDataset.entityName;
                        f.datasetId = this.fbDataset.entityKey;
                        sub.datasetFields.push(f);
                    }
                }
                if (this.fbDataset.subDatasets === null || this.fbDataset.subDatasets === undefined)
                    this.fbDataset.subDatasets = [];
                this.fbDataset.subDatasets.push(sub);
                this.complexForm.reset();
                this.rssFields = [];
                this.selectedField = [];
                this.getFields();

            }
        } else {
            // this.twDataset.subDatasets[this._checkIndex].entityName = value.name;
            this.fbDataset.subDatasets[this._checkIndex].entityDescription = value.description;
            this.fbDataset.subDatasets[this._checkIndex].query = value.pageId;
            this.fbDataset.subDatasets[this._checkIndex].changeFlag = true;
            if (this.selectedField.length > 0) {
                this.fbDataset.subDatasets[this._checkIndex].datasetFields = [];
                for (let s of this.selectedField) {
                    let f: DatasetFieldDto = new DatasetFieldDto();
                    f.entityName = s;
                    f.entityDescription = s;
                    f.dataType = "text";
                    f.entityType = "DatasetField";
                    this.fbDataset.subDatasets[this._checkIndex].datasetFields.push(f);
                }
            }
            this.clearFields();
        }

        //abp.notify.success("Dataset Saved.");
    }
    createsubfacebook() {
        this._location.back();
    }
    delete(value: any) {
        this.fbDataset.subDatasets.splice(value, 1);
        this.clearFields();
    }
    onChecked(event: any, val: any) {
        if (event.target.checked) {
            this._checkIndex = val;
            this._submitText = "Save";
            this.complexForm.controls["name"].disable();
            this.complexForm.controls["name"].setValue(this.fbDataset.subDatasets[val].entityName);
            this.complexForm.controls["description"].setValue(this.fbDataset.subDatasets[val].entityDescription);
            this.complexForm.controls["pageId"].setValue(this.fbDataset.subDatasets[val].query);
            for (let r of this.fbDataset.subDatasets[val].datasetFields) {
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
        else {
            this.clearFields();
        }
    }
    isEmpty(): boolean {
        if (this.fbDataset !== undefined && this.fbDataset !== null) {
            if (this.fbDataset.subDatasets !== undefined && this.fbDataset.subDatasets !== null) {
                if (this.fbDataset.subDatasets.length > 0)
                    return false;
            }
        }
        return true;
    }
    clearFields() {
        for (let s of this.selectedField) {
            this.rssFields.push(s);
        }
        this.complexForm.controls["name"].enable();
        this.selectedField = [];
        this.complexForm.reset();
        this._checkIndex = -1;
        this._submitText = "Add";
    }
}