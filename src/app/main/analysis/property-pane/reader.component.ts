﻿import { Component, Injector, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AnalysisService, AnalysisStudioConfig, Variables } from '@shared/service-proxies/ids-analysis-service-proxies';
import { TempBaseUrl, LoadingService, SubDatasetDto, DatasetFieldDto, DatasetService } from '@shared/service-proxies/ids-service-proxies';
@Component({
    selector: 'reader-dataset',
    templateUrl: './reader.component.html',
    animations: [appModuleAnimation()]
})
export class ReaderDatasetComponent implements OnDestroy {
    @ViewChild('field') elField: ElementRef;
    @ViewChild('selectField') elSelectField: ElementRef;
    fields: Variables[] = [];
    allField: DatasetFieldDto[] = [];
    constructor(private config: AnalysisStudioConfig, private service: DatasetService, private load: LoadingService) {
        //AnalysisService.isAnalysisPage = true;
        //this.config.currentReader.subDatasets[0].entityName
        debugger;
        if (this.config.currentPosition < this.config.taskElements.length) {
            try {
                this.config.currentReader = this.config.taskElements[this.config.currentPosition];
                if (this.config.currentReader.allVariables.length < 1)
                    this.getDataFields();
            } catch (e) {

            }
        }
    }
    getDataFields() {
        debugger
        //this.load.start();
        let key: string = "";
        key = this.config.currentReader.subDatasets[0].entityKey;
        this.service.getDatasetFields(key)
            .subscribe(res => {
                //this.load.stop();
                debugger;
                this.config.currentReader.subDatasets[0].datasetFields = res;
                this.config.currentReader.leftVariables = [];
                if (this.config.currentReader.rightVariables.length > 0) {
                    for (let v of res) {
                        let b: boolean = false;
                        for (let x of this.config.currentReader.rightVariables)
                            if (v.entityName === x.name) {
                                b = true;
                                break;
                            }
                        if (!b)
                            this.config.currentReader.leftVariables
                                .push(new Variables(Variables.getRandomNumber,
                                    v.dataType,
                                    "I",
                                    "",
                                    v.entityName,
                                    Variables.OPERATION_VAR,
                                    v.variableType,
                                    false
                                ));
                    }
                } else {
                    for (let v of res) {
                        this.config.currentReader.leftVariables
                            .push(new Variables(Variables.getRandomNumber,
                                v.dataType,
                                "I",
                                "",
                                v.entityName,
                                Variables.OPERATION_VAR,
                                v.variableType,
                                false
                            ));
                    }
                }
                for (let v of res)
                    this.config.currentReader.allVariables
                        .push(new Variables(Variables.getRandomNumber,
                            v.dataType,
                            "I",
                            "",
                            v.entityName,
                            Variables.OPERATION_VAR,
                            v.variableType,
                            false
                        ));
            });
    }

    filterFields() {
        debugger;
        if (this.config.currentReader.subDatasets[0].selectedField.length > 0) {
            for (let d of this.config.currentReader.subDatasets[0].selectedField)
                this.config.currentReader.subDatasets[0].fields.splice(this.config.currentReader.subDatasets[0].fields.indexOf(d), 1);
        }
    }
    findField(v: any): any {
        for (let f of this.config.currentReader.allVariables)
            if (f.name === v)
                return f;
        return null;

    }
    findVariableList(nm: string): number {
        for (let i: number = 0; i < this.config.currentReader.leftVariables.length; i++)
            if (nm === this.config.currentReader.leftVariables[i].name)
                return i;
        return -1;
    }
    findSelectedVariable(nm: string) {
        for (let i: number = 0; i < this.config.currentReader.selectedVariable.length; i++)
            if (nm === this.config.currentReader.selectedVariable[i].name)
                return i;
        return -1;
    }
    arrowClick(value: boolean) {
        debugger;
        if (value) {
            //right arrow click
            let option = this.elField.nativeElement.options;
            for (let l of option)
                if (l.selected) {
                    let v: any = this.findField(l.value);
                    v.checked = false;
                    this.config.currentReader.rightVariables.push(v);
                    this.config.currentReader.leftVariables.splice(this.findVariableList(v.name), 1);
                }
        } else {
            //left arrow click 
            let option = this.elSelectField.nativeElement.options;
            for (let l of option)
                if (l.selected) {
                    let v: any = this.findField(l.value);
                    v.checked = true;
                    this.config.currentReader.leftVariables.push(v);
                    this.config.currentReader.rightVariables
                        .splice(this.findSelectedVariable(v.name), 1);
                }
        }
    }
    ngOnDestroy() {
        debugger;
        try {
            if (this.config.currentReader !== undefined) {
                this.config.currentReader.selectedVariable = [];
                for (let x of this.config.currentReader.rightVariables) {
                    this.config.currentReader.selectedVariable.push(new Variables(
                        Variables.getRandomNumber,
                        x.dataType,
                        "O", "",
                        x.name,
                        Variables.OPERATION_VAR,
                        x.variableType,
                        true));
                }
                // save selected variables
                this.config.currentReader.rightVariables = [];
                for (let x of this.config.currentReader.selectedVariable) {
                    this.config.currentReader.rightVariables.push(new Variables(
                        Variables.getRandomNumber,
                        x.dataType,
                        "O", "",
                        x.name,
                        Variables.OPERATION_VAR,
                        x.variableType,
                        true));
                }
            }
        } catch (e) { }
    }
}
