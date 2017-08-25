import { Component, Injector, Output, Input, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Router } from '@angular/router';
import { DatasetService, TempBaseUrl, RDBMSDatasetDto, SubDatasetDto, PassService, DatasetResultModel } from '@shared/service-proxies/ids-service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';


@Component({
    selector: 'sub-rdbms',
    templateUrl: './rdbms-subdataset.component.html',
    animations: [appModuleAnimation()]
})
export class SubRDBMSComponent implements OnDestroy {
    @Output() onClick = new EventEmitter();
    @Input() rdbms: RDBMSDatasetDto;
    tableList: string[];
    isCustom: boolean = false;
    queryType: string = "table";
    complexForm: FormGroup;
    _checkIndex = -1;
    _submitText: string = "Add";
    constructor(private _router: Router,
        private pass: PassService, private service: DatasetService, private _location: Location, private fb: FormBuilder) {
        debugger;
        this.complexForm = fb.group({
            'name': [null, Validators.required],
            'description': [null, Validators.required],
            'query': [null],
            'create': ['t'],
            'table': ['table']
        });
        this.complexForm.controls['name'].disable();
        if (this.pass.passValue === undefined || this.pass.passValue === null)
            this._location.back();
        else {
            this.rdbms = this.pass.passValue;
            this.getTableList();
        }
    }

    back() {
        this._location.back();
    }
    getTableList() {
        debugger;
        let param = JSON.stringify({
            entityName: this.rdbms.entityName,
            entityDescription: this.rdbms.entityDescription,
            entityType: "Dataset",
            className: "RDBMS",
            connectionString: this.rdbms.driverKey !== undefined ? this.rdbms.driverKey.toLowerCase() == "postgresql unicode" || "oracle connection"? this.rdbms.getPostConnection() : this.rdbms.getConnection() : "",
            userName: this.rdbms.userName,
            password: this.rdbms.password,
            driverKey: this.rdbms.driverKey,
            serverName: this.rdbms.serverName,
            schemaName: "public",
            databaseName: this.rdbms.databaseName,
            workspaceKey: TempBaseUrl.WORKSPACEKEY,
            workspaceName: "workspaceName",
            sessionKey: this.rdbms.sessionKey
        });
        this.service.getTableList(param).subscribe(res => {
            debugger;
            this.tableList = res;
        });
    }
    submitForm(value: any) {
        debugger
        if (this._checkIndex === -1) {
            // add subdataset
            let sub: SubDatasetDto = new SubDatasetDto();
            sub.entityDescription = value.description;
            sub.entityType = "SubDataset";
            sub.className = "SubDataset";
            sub.datasetName = this.rdbms.entityName;
            sub.isCustom = String(this.isCustom);
            if (this.queryType === "query") {
                sub.query = value.query;
                sub.entityName = value.name;
            } else {
                sub.query = value.table;
                sub.entityName = value.table
            }
            if (this.rdbms.subDatasets === null || this.rdbms.subDatasets === undefined)
                this.rdbms.subDatasets = [];
            this.rdbms.subDatasets.push(sub);
            this.complexForm.reset();
            this.complexForm.controls['table'].setValue("table");
            this.pass.passValue = this.rdbms;
        } else {
            //update subdataset
            this.rdbms.subDatasets[this._checkIndex].entityDescription = value.description;
            if (this.queryType === "query") {
                this.rdbms.subDatasets[this._checkIndex].query = value.query;
            } else {
                this.rdbms.subDatasets[this._checkIndex].query = value.table;
                this.rdbms.subDatasets[this._checkIndex].entityName = value.table;
            }
            this.rdbms.subDatasets[this._checkIndex].changeFlag = true;

            this.clearFields();
        }
    }
    //showDiv(event: any) {
    //    debugger;
    //    if (event === 't')
    //        this.isCustom = false;
    //    else this.isCustom = true;
    //}
    onChecked(event: any, val: any) {
        if (event.target.checked) {
            this._checkIndex = val;
            this._submitText = "Save";
            this.complexForm.controls["name"].disable();
            this.complexForm.controls["name"].setValue(this.rdbms.subDatasets[val].entityName);
            this.complexForm.controls["description"].setValue(this.rdbms.subDatasets[val].entityDescription);
            debugger;
            if (this.rdbms.subDatasets[val].isCustom.toLowerCase() === "true") {
                this.queryType = "query";
                this.complexForm.controls['query'].setValue(this.rdbms.subDatasets[val].query);
            } else {
                this.queryType = "table";
                this.complexForm.controls['table'].setValue(this.rdbms.subDatasets[val].query);
            }
        }
        else {
            this.clearFields();
        }
    }
    onChange(v: any) {
        debugger;
        this.complexForm.controls['name'].setValue(v);
    }
    onTypeChange(v: any) {
        this.complexForm.controls['name'].setValue("");
        if (v === "table")
            this.complexForm.controls['name'].disable();
        else 
            this.complexForm.controls['name'].enable();
    }
    clearFields() {
        this.complexForm.controls["name"].enable();
        this.complexForm.reset();
        this._submitText = "Add";
        this._checkIndex = -1;
        this.isCustom = false;
    }
    delete(value: any) {
        this.rdbms.subDatasets.splice(value, 1);
    }
    ngOnDestroy() {
        debugger
        this.pass.passValue = this.rdbms;
    }
}