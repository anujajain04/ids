import { Component, Injector, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AnalysisService, AnalysisStudioConfig, TaskDto, Reader, Mapping, Variables } from '@shared/service-proxies/ids-analysis-service-proxies';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
    selector: 'sampler',
    templateUrl: './sampler.component.html',
    animations: [appModuleAnimation()]
})

export class SamplerComponent implements OnDestroy {
    @ViewChild('field') elField: ElementRef;
    @ViewChild('selectField') elSelectField: ElementRef;
    constructor(fb: FormBuilder, private config: AnalysisStudioConfig) {
        if (this.config.currentPosition < this.config.taskElements.length) {
            AnalysisService.isAnalysisPage = true;
            debugger;
            try {
                this.config.currentSampler = this.config.taskElements[this.config.currentPosition];
                // before going ahead get previous selected fields
                this.getVariablesFromPreviousTask();
                // (<TaskDto>this.config.taskElements[this.config.currentPosition]).samplePercentage
            } catch (e) { }
        }
    }

    onSelect(value: any) {
        debugger;
        this.config.currentSampler.samplePercentage = value;
    }
    getVariablesFromPreviousTask() {
        if (this.config.currentPosition > 0) {
            this.config.currentSampler.selectedVariable = [];
            this.config.currentSampler.leftVariables = [];
            ///if reqOprInputVarNumSelection is true
            if (this.config.taskElements[this.config.currentPosition - 1].reqOprInputVarNumSelection) {
                //CarryFwd flag Condition true.
                if (this.config.taskElements[this.config.currentPosition - 1].inputVarCarryFwdFlag) {
                    for (let x of this.config.taskElements[this.config.currentPosition - 1].rightVariables)
                        if (x.inOutFlag !== "I")
                            this.config.currentSampler
                                .selectedVariable
                                .push(new Variables(
                                    Variables.getRandomNumber,
                                    x.dataType,
                                    "IO", "",
                                    x.name,
                                    Variables.INPUT_VAR,
                                    x.variableType, false));
                } else {
                    //CarryFwd flag Condition false.
                    if (this.config.taskElements[this.config.currentPosition - 1] instanceof Reader) {
                        for (let x of this.config.taskElements[this.config.currentPosition - 1].rightVariables)
                            if (x.inOutFlag !== "I" && x.variableCategory === Variables.OPERATION_VAR)
                                this.config.currentSampler
                                    .selectedVariable
                                    .push(new Variables(
                                        Variables.getRandomNumber,
                                        x.dataType,
                                        "IO", "",
                                        x.name,
                                        Variables.INPUT_VAR,
                                        x.variableType, false));
                    } else
                        for (let x of this.config.taskElements[this.config.currentPosition - 1].rightVariables)
                            if (x.inOutFlag === "O" && x.variableCategory === Variables.OPERATION_VAR)
                                this.config.currentSampler
                                    .selectedVariable
                                    .push(new Variables(
                                        Variables.getRandomNumber,
                                        x.dataType,
                                        "IO", "",
                                        x.name,
                                        Variables.INPUT_VAR,
                                        x.variableType, false));
                }
                // inputOprVarSameAsOutputOprVarFlag flag condition.. get all the input variable form previous tasks.
                if (this.config.taskElements[this.config.currentPosition - 1].inputOprVarSameAsOutputOprVarFlag) {
                    this.config.currentSampler.allVariables = this.config.taskElements[this.config.currentPosition - 1].rightVariables;
                    for (let x of this.config.taskElements[this.config.currentPosition - 1].rightVariables)
                        if (x.variableCategory === Variables.INPUT_VAR && x.inOutFlag == "IO")
                            this.config.currentSampler
                                .selectedVariable
                                .push(new Variables(
                                    Variables.getRandomNumber,
                                    x.dataType,
                                    "IO", "",
                                    x.name,
                                    x.variableCategory,
                                    x.variableType,
                                    false));
                }
            } else {
                ///if reqOprInputVarNumSelection is false
                if (this.config.taskElements[this.config.currentPosition - 1].inputVarCarryFwdFlag) {
                    for (let x of this.config.taskElements[this.config.currentPosition - 1].selectedVariable)
                        if (x.inOutFlag !== "I")
                            this.config.currentSampler
                                .selectedVariable
                                .push(new Variables(
                                    Variables.getRandomNumber,
                                    x.dataType,
                                    "IO", "",
                                    x.name,
                                    Variables.INPUT_VAR,
                                    x.variableType, false));
                } else {
                    if (this.config.taskElements[this.config.currentPosition - 1] instanceof Reader) {
                        for (let x of this.config.taskElements[this.config.currentPosition - 1].selectedVariable)
                            if (x.inOutFlag !== "I" && x.variableCategory === Variables.OPERATION_VAR)
                                this.config.currentSampler
                                    .selectedVariable
                                    .push(new Variables(
                                        Variables.getRandomNumber,
                                        x.dataType,
                                        "IO", "",
                                        x.name,
                                        Variables.INPUT_VAR,
                                        x.variableType, false));
                    } else
                        for (let x of this.config.taskElements[this.config.currentPosition - 1].selectedVariable)
                            if (x.inOutFlag === "O" && x.variableCategory === Variables.OPERATION_VAR)
                                this.config.currentSampler
                                    .selectedVariable
                                    .push(new Variables(
                                        Variables.getRandomNumber,
                                        x.dataType,
                                        "IO", "",
                                        x.name,
                                        Variables.INPUT_VAR,
                                        x.variableType, false));
                }
                // inputOprVarSameAsOutputOprVarFlag flag condition.. get all the input variable form previous tasks.
                if (this.config.taskElements[this.config.currentPosition - 1].inputOprVarSameAsOutputOprVarFlag) {
                    this.config.currentSampler.allVariables = this.config.taskElements[this.config.currentPosition - 1].selectedVariable;
                    for (let x of this.config.taskElements[this.config.currentPosition - 1].selectedVariable)
                        if (x.variableCategory === Variables.INPUT_VAR && x.inOutFlag == "IO")
                            this.config.currentSampler
                                .selectedVariable
                                .push(new Variables(
                                    Variables.getRandomNumber,
                                    x.dataType,
                                    "IO", "",
                                    x.name,
                                    x.variableCategory,
                                    x.variableType,
                                    false));
                }
            }
        }
        // fill the selection box by variables
        if (this.config.currentSampler.reqOprInputVarNumSelection) {
            this.config.currentSampler.leftVariables = [];
            this.config.currentSampler.allVariables = [];
            for (let x of this.config.taskElements[this.config.currentPosition - 1].selectedVariable)
                this.config.currentSampler
                    .allVariables
                    .push(new Variables(
                        Variables.getRandomNumber,
                        x.dataType,
                        "IO", "",
                        x.name,
                        Variables.INPUT_VAR,
                        x.variableType, false));
            if (this.config.currentSampler.rightVariables.length < 1)
                for (let x of this.config.currentSampler.allVariables)
                    this.config.currentSampler.leftVariables.push(new Variables(
                        Variables.getRandomNumber,
                        x.dataType,
                        "IO", "",
                        x.name,
                        Variables.INPUT_VAR,
                        x.variableType, false));
            else
                for (let x of this.config.currentSampler.rightVariables) {
                    for (let v of this.config.currentSampler.allVariables)
                        if (v.name !== x.name)
                            this.config.currentSampler.leftVariables.push(new Variables(
                                Variables.getRandomNumber,
                                x.dataType,
                                "IO", "",
                                x.name,
                                Variables.INPUT_VAR,
                                x.variableType, false));
                }
        }
    }
    ngOnDestroy() {
        try {
            if (this.config.currentSampler !== undefined) {
                if (this.config.currentSampler.definateOprVar) {
                    //if definateOprVar is true
                    this.config.currentSampler.mapping = [];
                    this.config.currentSampler
                        .mapping
                        .push(new Mapping(
                            this.config.taskElements[this.config.currentPosition - 2].entityName,
                            this.config.currentSampler.cleanseText.name,
                            this.config.currentSampler.entityName,
                            "Text"
                        ));
                }
            }
        } catch (e) { }
    }
    arrowClick(value: boolean) {
        debugger;
        if (value) {
            //right arrow click
            let option = this.elField.nativeElement.options;
            for (let l of option)
                if (l.selected) {
                    let v: any = this.findField(l.value);
                    v.checked = true;
                    this.config.currentSampler.rightVariables.push(v);
                    this.config.currentSampler.leftVariables.splice(this.findVariableList(v.name), 1);
                }
        } else {
            //left arrow click 
            let option = this.elSelectField.nativeElement.options;
            for (let l of option)
                if (l.selected) {
                    let v: any = this.findField(l.value);
                    this.config.currentSampler.leftVariables.push(v);
                    this.config.currentSampler.rightVariables
                        .splice(this.findSelectedVariable(v.name), 1);
                }
        }
    }
    findField(v: any): any {
        for (let f of this.config.currentSampler.allVariables)
            if (f.name === v)
                return f;
        return null;

    }
    findVariableList(nm: string): number {
        for (let i: number = 0; i < this.config.currentSampler.leftVariables.length; i++)
            if (nm === this.config.currentSampler.leftVariables[i].name)
                return i;
        return -1;
    }
    findSelectedVariable(nm: string) {
        for (let i: number = 0; i < this.config.currentSampler.rightVariables.length; i++)
            if (nm === this.config.currentSampler.rightVariables[i].name)
                return i;
        return -1;
    }
    onCleanseSelect(value: any) {
        this.config.currentSampler.cleanseText = this.findVariable(value);
    }
    findVariable(value: string): Variables {
        for (let x of this.config.currentSampler.selectedVariable)
            if (value === x.name) {
                return x;
            }
        return new Variables(0, "", "", "", "", "", "", false);;
    }

}
