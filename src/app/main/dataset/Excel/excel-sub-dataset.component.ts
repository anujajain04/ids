import { Component, Injector, Input, Output, EventEmitter, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router } from '@angular/router';
import { DatasetService, ExcelDatasetDto, DatasetFieldDto, SubDatasetDto, ExcelSheet, DatasetResultModel, PassService } from '@shared/service-proxies/ids-service-proxies'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
declare var $: any;
@Component({
    selector: 'subExcel',
    templateUrl: './excel-sub-dataset.component.html',
    animations: [appModuleAnimation()]
})

export class SubExcelDatasetComponent implements OnDestroy {
    @ViewChild('field') elField: ElementRef;
    @ViewChild('selectField') elSelectField: ElementRef;
    excelDataset: ExcelDatasetDto;
    workSheet: string = "";
    _checkedIndex: number = -1;
    //save selected sheet temporary
    tempSheet: ExcelSheet = new ExcelSheet();
    rssFields: string[] = [];
    selectedField: string[] = [];
    complexForm: FormGroup;
    private height1: number;
    constructor(private _location: Location, private _router: Router, fb: FormBuilder, private dsService: DatasetService, private pass: PassService) {
        debugger;
        if (this.pass.passValue !== null && this.pass.passValue !== undefined) {
            this.excelDataset = this.pass.passValue;
        } else {
            this._location.back();
        }
        this.complexForm = fb.group({
            'name': [null, Validators.required],
            'description': [null, Validators.required],
            'work': [null],
            'file': [null]
        });

    }
    addSubdataset() {
        debugger
        try {
            if (this._checkedIndex < 0) {
                let b: boolean = false;
                for (let x of this.excelDataset.subDatasets)
                    if (x.entityName === this.tempSheet.header)
                        b = true;
                if (!b) {
                    let sub: SubDatasetDto = new SubDatasetDto();
                    sub.entityName = this.complexForm.controls["name"].value;
                    sub.entityDescription = this.complexForm.controls["description"].value;
                    sub.className = "SubDataset";
                    sub.entityType = "SubDataset";
                    sub.query = this.tempSheet.header;
                    sub.datasetFields = this.tempSheet.fields;
                    sub.isCustom = "false";
                    this.excelDataset.subDatasets.push(sub);
                    this.tempSheet = new ExcelSheet();
                    this.complexForm.reset();
                    abp.notify.success("added");
                }
            } else {
                //update edit subdataset
                this.excelDataset.subDatasets[this._checkedIndex].entityName = this.complexForm.controls["name"].value;
                this.excelDataset.subDatasets[this._checkedIndex].entityDescription = this.complexForm.controls["description"].value;
                this.excelDataset.subDatasets[this._checkedIndex].query = this.tempSheet.header;
                this.excelDataset.subDatasets[this._checkedIndex].datasetFields = this.tempSheet.fields;
                this.complexForm.reset();
                this.tempSheet = new ExcelSheet();
                abp.notify.success("saved");

            }
            this._checkedIndex = -1;
        } catch (e) { }
    }
    addRow() {
        try {
            let d: DatasetFieldDto = new DatasetFieldDto();
            d.entityType = "DatasetField";
            this.tempSheet.fields.push(d);
        } catch (e) { }
    }
    deleteRow(id: number) {
        debugger
        try {
            this.tempSheet.fields.splice(id, 1);
        } catch (e) { }
    }
    ngOnInit() {
        this.height1 = window.innerHeight + 98;
    }
    submitForm(value: any): void {
        debugger;
        try {
            //if (this.excelDataset !== undefined) {
            //    let sub = new SubDatasetDto();
            //    sub.entityName = value.name;
            //    sub.entityDescription = value.description;
            //    sub.entityType = "SubDataset";
            //    sub.className = "SubDataset";
            //    sub.isCustom = "false";
            //    sub.query = value.name;
            //    if (this.excelDataset.subDatasets === null || this.excelDataset.subDatasets === undefined)
            //        this.excelDataset.subDatasets = [];
            //    this.excelDataset.subDatasets.push(sub);
            //    // this.complexForm.reset();
          //  }
        } catch (e) { }
        this._checkedIndex = -1;
    }
    /**
     * sub dataset checkbox checked for edit 
     * @param event check event
     * @param index subdataset list index
     */
    onChecked(event: any, index: any) {
        debugger;
        try {
            if (event.target.checked) {
                this._checkedIndex = index;
                this.complexForm.controls["name"].setValue(this.excelDataset.subDatasets[this._checkedIndex].entityName);
                this.complexForm.controls["description"].setValue(this.excelDataset.subDatasets[this._checkedIndex].entityDescription);
                this.tempSheet = new ExcelSheet();
                this.tempSheet.header = this.excelDataset.subDatasets[this._checkedIndex].query;
                this.tempSheet.fields = this.excelDataset.subDatasets[this._checkedIndex].datasetFields;
                // this.complexForm.controls["name"].setValue(this.excelDataset.subDatasets[this._checkedIndex].datasetName);
            } else {
                this.complexForm.reset();
                this.tempSheet = new ExcelSheet();
                this._checkedIndex = -1;
            }
        } catch (e) {
            console.error(e.message);
        }
    }
    createsubfacebook() {
        this._location.back();
    }
    delete(value: any) {
        this.excelDataset.subDatasets.splice(value, 1);
    }
    ngOnDestroy() {
        this.pass.passValue = this.excelDataset;
    }
}