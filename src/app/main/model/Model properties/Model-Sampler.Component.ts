import { Component, Injector, ViewChild, ElementRef } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { QuickTree, ModelService, TaskDto, Mapping, TaskType, Reader, Variables, ModelStudioConfig }
    from '@shared/service-proxies/ids-model-service-proxies';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
    selector: 'Model-Sampler',
    templateUrl: './Model-Sampler.Component.html',
    animations: [appModuleAnimation()]
})

export class ModelSamplerComponent {
    @ViewChild('field') elField: ElementRef;
    @ViewChild('selectField') elSelectField: ElementRef;
    constructor(fb: FormBuilder, private config: ModelStudioConfig) {
        try {
            ModelService.isModelPage = true;
            if (this.config.isPreProcessor) {
                if (this.config.currentPosition < this.config.taskElements.length) {
                    this.config.currentSampler = this.config.taskElements[this.config.currentPosition];
                    this.getVariablesFromPreviousPreProcessorTask();
                }
            } else {
                if (this.config.currentPosition < this.config.taskElements1.length) {
                    this.config.currentSampler = this.config.taskElements1[this.config.currentPosition];
                    this.config.currentSampler.selectedVariable = [];
                    this.getVariablesFromPreviousProcessingTask();
                }
            }
        } catch (e) {
            console.error("Error in Sampler");
        }
    }

    onSelect(value: any) {
        debugger;
        this.config.currentSampler.samplePercentage = value;
    }


    getVariablesFromPreviousPreProcessorTask() {
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
    getVariablesFromPreviousProcessingTask() {
        //check if previous task is from preproccessing
        let tempTaskList: any;
        let index: number;
        if (this.config.currentPosition > 0) {
            tempTaskList = this.config.taskElements1;
            index = this.config.currentPosition - 1;
        }
        if (this.config.currentPosition === 0) {
            tempTaskList = this.config.taskElements;
            index = this.config.taskElements.length - 1;
        }


        if (tempTaskList != undefined) {
            this.config.currentSampler.selectedVariable = [];
            this.config.currentSampler.leftVariables = [];
            ///if reqOprInputVarNumSelection is true
            if (tempTaskList[index].reqOprInputVarNumSelection) {
                //CarryFwd flag Condition true.
                if (tempTaskList[index].inputVarCarryFwdFlag) {
                    for (let x of tempTaskList[index].rightVariables)
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
                    if (tempTaskList[index] instanceof Reader) {
                        for (let x of tempTaskList[this.config.currentPosition - 1].rightVariables)
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
                        for (let x of tempTaskList[index].rightVariables)
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
                if (tempTaskList[index].inputOprVarSameAsOutputOprVarFlag) {
                    this.config.currentSampler.allVariables = tempTaskList[index].rightVariables;
                    for (let x of tempTaskList[index].rightVariables)
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
                if (tempTaskList[index].inputVarCarryFwdFlag) {
                    for (let x of tempTaskList[index].selectedVariable)
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
                    if (tempTaskList[index] instanceof Reader) {
                        for (let x of tempTaskList[index].selectedVariable)
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
                        for (let x of tempTaskList[index].selectedVariable)
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
                if (tempTaskList[index].inputOprVarSameAsOutputOprVarFlag) {
                    this.config.currentSampler.allVariables = tempTaskList[index].selectedVariable;
                    for (let x of tempTaskList[index].selectedVariable)
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
            // fill the selection box by variables
            if (this.config.currentSampler.reqOprInputVarNumSelection) {
                for (let x of tempTaskList[index].selectedVariable)
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

    }
    ngOnDestroy() {
        try {
            if (this.config.currentSampler !== undefined) {
                if (this.config.currentSampler.definateOprVar) {
                    if (this.config.isPreProcessor) {
                        if (this.config.taskElements.length > 1) {
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
                    } else {
                        if (this.config.currentPosition == 1) {
                            //if definateOprVar is true
                            this.config.currentSampler.mapping = [];
                            this.config.currentSampler
                                .mapping
                                .push(new Mapping(
                                    this.config.taskElements[this.config.taskElements.length - 1].entityName,
                                    this.config.currentSampler.cleanseText.name,
                                    this.config.currentSampler.entityName,
                                    "Text"
                                ));
                        } else {
                            if (this.config.taskElements1.length > 1) {
                                this.config.currentSampler.mapping = [];
                                this.config.currentSampler
                                    .mapping
                                    .push(new Mapping(
                                        this.config.taskElements1[this.config.currentPosition - 2].entityName,
                                        this.config.currentSampler.cleanseText.name,
                                        this.config.currentSampler.entityName,
                                        "Text"
                                    ));
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.error("Error in Sampler");
        }
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
