import { Component, Injector, Output, Input, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router } from '@angular/router';
import { DatasetService, TwitterDatasetDto, DatasetFieldDto, DatasetResultModel, SubDatasetDto, PassService } from '@shared/service-proxies/ids-service-proxies'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
declare var $: any;
@Component({
    selector: 'subtwitter',
    templateUrl: './twitter-sub-dataset.component.html',
    animations: [appModuleAnimation()]
})

export class SubTwitterDatasetComponent extends AppComponentBase {
    sd: Date = new Date();
    ud: Date = new Date();
    @ViewChild('field') elField: ElementRef;
    @ViewChild('selectField') elSelectField: ElementRef;
    twDataset: TwitterDatasetDto = new TwitterDatasetDto();
    complexForm: FormGroup;
    Fields: string[] = [];
    selectedField: string[] = [];
    isUpdate: boolean = false;
    _checkIndex = -1;
    _submitText: string = "Add";
    sDate: any;
    uDate: any;
    constructor(injector: Injector, private _router: Router, fb: FormBuilder, private service: DatasetService, private pass: PassService, private _location: Location) {
        super(injector);
        debugger;
        if (this.pass.passValue !== null) {
            this.twDataset = this.pass.passValue;
        } else {
            this._location.back();
        }
        this.complexForm = fb.group({
            'name': [null, Validators.required],
            'description': [null, Validators.required],
            'hashtag': [null, Validators.required],
            'selectedfields': [null],
            'tweets': [null],
            'language': [null],
            'sdate': [null],
            'udate': [null]
        });
        this.getFields();
    }
    get sdf() {
        return this.sd.toISOString().substring(0, 10);
    }
    get udf() {
        return this.ud.toISOString().substring(0, 10);
    }
    getFields() {
        this.service.getTwitterFields().subscribe(res => {
            this.Fields = res;
        });
    }
    arrowClick(value: boolean) {
        if (value) {
            //right arrow click
            let option = this.elField.nativeElement.options;
            for (let l of option)
                if (l.selected) {
                    this.selectedField.push(l.value);
                    this.Fields.splice(this.Fields.indexOf(l.value), 1);
                }
        } else {
            //left arrow click 
            let option = this.elSelectField.nativeElement.options;
            for (let l of option)
                if (l.selected) {
                    this.Fields.push(l.value);
                    this.selectedField.splice(this.selectedField.indexOf(l.value), 1);
                }

        }
    }
    ngOnInit() {
        //var date = new Date();
        //var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        //$('#date').datepicker({
        //    minDate: today
        //});  
        //$('#date2').datepicker({
        //    minDate: today
        //});

        var dt = new Date();
        var yyyy = dt.getFullYear().toString();
        var mm = (dt.getMonth() + 1).toString(); // getMonth() is zero-based
        var dd = dt.getDate().toString();
        var min = yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]); // padding
        
        $('#dateField').prop('min', min);


        $('#dateField1').prop('min', min);
    }
    createsubtwitter() {
        debugger;
        this._location.back();
    }
    submitForm(value: any): void {
        debugger;
        if (this.twDataset !== undefined && this.complexForm.valid) {
            if (this._checkIndex === -1) {
                let d = new SubDatasetDto();
                d.entityName = value.name;
                d.entityDescription = value.description;
                d.entityType = "SubDataset";
                d.className = "SubDataset";
                d.isCustom = "false";
                d.query = value.hashtag;
                d.tweetType = value.tweets;
                d.language = value.language;
                d.untilDate = this.uDate;
                d.sinceDate = this.sDate;
                if (this.pass.isUpdate)
                    d.datasetName = this.pass.passValue.entityName;
                if (this.selectedField.length > 0) {
                    for (let s of this.selectedField) {
                        let f: DatasetFieldDto = new DatasetFieldDto();
                        f.entityName = s;
                        f.entityDescription = s;
                        f.dataType = "text";
                        f.entityType = "DatasetField";
                        d.datasetFields.push(f);
                    }
                }
                if (this.twDataset.subDatasets === null)
                    this.twDataset.subDatasets = [];
                this.twDataset.subDatasets.push(d);
                this.clearFields();
            } else {
                // this.twDataset.subDatasets[this._checkIndex].entityName = value.name;
                this.twDataset.subDatasets[this._checkIndex].entityDescription = value.description;
                this.twDataset.subDatasets[this._checkIndex].query = value.hashtag;
                this.twDataset.subDatasets[this._checkIndex].language = value.language;
                this.twDataset.subDatasets[this._checkIndex].sinceDate = this.sDate;
                this.twDataset.subDatasets[this._checkIndex].untilDate = this.uDate;
                this.twDataset.subDatasets[this._checkIndex].changeFlag = true;
                if (this.selectedField.length > 0) {
                    this.twDataset.subDatasets[this._checkIndex].datasetFields = [];
                    for (let s of this.selectedField) {
                        let f: DatasetFieldDto = new DatasetFieldDto();
                        f.entityName = s;
                        f.entityDescription = s;
                        f.dataType = "text";
                        f.entityType = "DatasetField";
                        this.twDataset.subDatasets[this._checkIndex].datasetFields.push(f);
                    }
                }
                this.clearFields();
                
            }
        }
    }
    delete(value: any) {
        this.twDataset.subDatasets.splice(value, 1);
        this.clearFields();
    }
    isEmpty(): boolean {
        if (this.twDataset !== undefined && this.twDataset !== null) {
            if (this.twDataset.subDatasets !== undefined && this.twDataset.subDatasets !== null) {
                if (this.twDataset.subDatasets.length > 0)
                    return false;
            }
        }
        return true;
    }
    onChecked(event: any, val: any) {
        if (event.target.checked) {
            this._checkIndex = val;
            this._submitText = "Save";
            this.complexForm.controls["name"].disable();
            this.complexForm.controls["name"].setValue(this.twDataset.subDatasets[val].entityName);
            this.complexForm.controls["description"].setValue(this.twDataset.subDatasets[val].entityDescription);
            this.complexForm.controls["hashtag"].setValue(this.twDataset.subDatasets[val].query);
            this.complexForm.controls["tweets"].setValue(this.twDataset.subDatasets[val].tweetType);
            this.complexForm.controls["sdate"].setValue(this.twDataset.subDatasets[val].sinceDate);
            this.complexForm.controls["udate"].setValue(this.twDataset.subDatasets[val].untilDate);
            for (let r of this.twDataset.subDatasets[val].datasetFields) {
                let ch: boolean = false;
                for (let f of this.Fields) {
                    if (r.entityName === f) {
                        ch = true;
                        break;
                    }
                }
                if (ch)
                    this.selectedField.push(r.entityName);
            }
            for (let d of this.selectedField)
                this.Fields.splice(this.Fields.indexOf(d), 1);

        }
        else {
            this.clearFields();
        }
    }
    clearFields() {
        for (let s of this.selectedField) {
            this.Fields.push(s);
        }
        this.complexForm.controls["name"].enable();
        this.selectedField = [];
        this.complexForm.reset();
        this._checkIndex = -1;
        this._submitText = "Add";
    }
}