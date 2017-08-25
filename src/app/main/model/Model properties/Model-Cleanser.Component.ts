import { Component, Injector, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { QuickTree, ModelService, TaskDto, TaskType, Reader, Mapping, Variables, ModelStudioConfig }
    from '@shared/service-proxies/ids-model-service-proxies';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//import { AnalysisService } from '@shared/service-proxies/ids-analysis-service-proxies';
@Component({
    selector: 'Model-Cleanser',
    templateUrl: './Model-Cleanser.Component.html',
    animations: [appModuleAnimation()]
})

export class modelcleanserComponent implements OnDestroy {
    select: Variables = new Variables(0, "", "", "", "", "", "", false);
    txt: string = "";
    @ViewChild('field') elField: ElementRef;
    @ViewChild('selectField') elSelectField: ElementRef;
    constructor(fb: FormBuilder, private config: ModelStudioConfig) {
        try {
            if (this.config.isPreProcessor) {
                if (this.config.currentPosition < this.config.taskElements.length) {
                    this.config.currentCleanser = this.config.taskElements[this.config.currentPosition];
                    this.getVariablesFromPreviousPreProcessorTask();
                    this.txt = this.config.currentCleanser.cleanseText.name + "";
                    ModelService.isModelPage = true;
                }
            } else {
                if (this.config.currentPosition < this.config.taskElements1.length) {
                    this.config.currentCleanser = this.config.taskElements1[this.config.currentPosition];
                    this.config.currentCleanser.selectedVariable = [];
                    this.getVariablesFromPreviousProcessingTask();
                    this.txt = this.config.currentCleanser.cleanseText.name + "";
                    ModelService.isModelPage = true;
                }
            }
            
        } catch (e) {
            console.error("Error in Cleanser:"+e.message);
        }
    }
    ngOnDestroy() {
        debugger
        try {
            if (this.config.currentCleanser !== undefined) {
                if (this.config.currentCleanser.definateOprVar) {
                    if (this.config.isPreProcessor) {
                        if (this.config.taskElements.length > 1) {
                            //if definateOprVar is true
                            this.config.currentCleanser.mapping = [];
                            this.config.currentCleanser
                                .mapping
                                .push(new Mapping(
                                    this.config.taskElements[this.config.currentPosition - 2].entityName,
                                    this.txt,
                                    this.config.currentCleanser.entityName,
                                    this.config.currentCleanser.entityName + ".cleansedText"
                                ));
                        }
                    } else {
                        if (this.config.currentPosition == 0) {
                            //if definateOprVar is true
                            this.config.currentCleanser.mapping = [];
                            this.config.currentCleanser
                                .mapping
                                .push(new Mapping(
                                    this.config.taskElements[this.config.taskElements.length - 2].entityName,
                                    this.txt,
                                    this.config.currentCleanser.entityName,
                                    this.config.currentCleanser.entityName + ".cleansedText"
                                ));
                        } else {
                            if (this.config.taskElements1.length > 1) {
                                this.config.currentCleanser.mapping = [];
                                this.config.currentCleanser
                                    .mapping
                                    .push(new Mapping(
                                        this.config.taskElements1[this.config.currentPosition - 2].entityName,
                                        this.txt,
                                        this.config.currentCleanser.entityName,
                                        this.config.currentCleanser.entityName + ".cleansedText"
                                    ));
                            }
                        }
                    }
                }
                // if (this.config.currentCleanser.definateOprVar)
                if (this.findField(this.config.currentCleanser.entityName + ".cleansedText") === null) {
                    this.config.currentCleanser.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "I", "", "text", "Operation", "Text", false));
                    this.config.currentCleanser.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "O", "", this.config.currentCleanser.entityName + ".cleansedText", "Operation", "Text", false));
                }
            }
        } catch (e) {
            console.error("Error in Cleanser");
        }
    }

    findField(v: any): any {
        for (let f of this.config.currentCleanser.selectedVariable)
            if (f.name === this.config.currentCleanser.entityName + ".CleansedText")
                return f;
        return null;
    }
    findVariable(value: string): Variables {
        for (let x of this.config.currentCleanser.selectedVariable)
            if (value === x.name) {
                return x;
            }
        return new Variables(0, "", "", "", "", "", "", false);;
    }
    onCleanseSelect(value: any) {
        debugger;
        this.config.currentCleanser.cleanseText = this.findVariable(value);
    }


    getVariablesFromPreviousPreProcessorTask() {
        debugger
        if (this.config.currentPosition > 0) {
            this.config.currentCleanser.selectedVariable = [];
            this.config.currentCleanser.leftVariables = [];
            ///if reqOprInputVarNumSelection is true
            if (this.config.taskElements[this.config.currentPosition - 1].reqOprInputVarNumSelection) {
                //CarryFwd flag Condition true.
                if (this.config.taskElements[this.config.currentPosition - 1].inputVarCarryFwdFlag) {
                    for (let x of this.config.taskElements[this.config.currentPosition - 1].rightVariables)
                        if (x.inOutFlag !== "I")
                            this.config.currentCleanser
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
                                this.config.currentCleanser
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
                                this.config.currentCleanser
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
                    this.config.currentCleanser.allVariables = this.config.taskElements[this.config.currentPosition - 1].rightVariables;
                    for (let x of this.config.taskElements[this.config.currentPosition - 1].rightVariables)
                        if (x.variableCategory === Variables.INPUT_VAR && x.inOutFlag == "IO")
                            this.config.currentCleanser
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
                            this.config.currentCleanser
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
                                this.config.currentCleanser
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
                                this.config.currentCleanser
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
                    this.config.currentCleanser.allVariables = this.config.taskElements[this.config.currentPosition - 1].selectedVariable;
                    for (let x of this.config.taskElements[this.config.currentPosition - 1].selectedVariable)
                        if (x.variableCategory === Variables.INPUT_VAR && x.inOutFlag == "IO")
                            this.config.currentCleanser
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
        if (this.config.currentCleanser.reqOprInputVarNumSelection) {
            for (let x of this.config.taskElements[this.config.currentPosition - 1].selectedVariable)
                this.config.currentCleanser
                    .allVariables
                    .push(new Variables(
                        Variables.getRandomNumber,
                        x.dataType,
                        "IO", "",
                        x.name,
                        Variables.INPUT_VAR,
                        x.variableType, false));
            if (this.config.currentCleanser.rightVariables.length < 1)
                for (let x of this.config.currentCleanser.allVariables)
                    this.config.currentCleanser.leftVariables.push(new Variables(
                        Variables.getRandomNumber,
                        x.dataType,
                        "IO", "",
                        x.name,
                        Variables.INPUT_VAR,
                        x.variableType, false));
            else
                for (let x of this.config.currentCleanser.rightVariables) {
                    for (let v of this.config.currentCleanser.allVariables)
                        if (v.name !== x.name)
                            this.config.currentCleanser.leftVariables.push(new Variables(
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
            this.config.currentCleanser.selectedVariable = [];
            this.config.currentCleanser.leftVariables = [];
            ///if reqOprInputVarNumSelection is true
            if (tempTaskList[index].reqOprInputVarNumSelection) {
                //CarryFwd flag Condition true.
                if (tempTaskList[index].inputVarCarryFwdFlag) {
                    for (let x of tempTaskList[index].rightVariables)
                        if (x.inOutFlag !== "I")
                            this.config.currentCleanser
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
                        for (let x of tempTaskList[index].rightVariables)
                            if (x.inOutFlag !== "I" && x.variableCategory === Variables.OPERATION_VAR)
                                this.config.currentCleanser
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
                                this.config.currentCleanser
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
                    this.config.currentCleanser.allVariables = tempTaskList[index].rightVariables;
                    for (let x of tempTaskList[index].rightVariables)
                        if (x.variableCategory === Variables.INPUT_VAR && x.inOutFlag == "IO")
                            this.config.currentCleanser
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
                            this.config.currentCleanser
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
                                this.config.currentCleanser
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
                                this.config.currentCleanser
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
                    this.config.currentCleanser.allVariables = tempTaskList[index].selectedVariable;
                    for (let x of tempTaskList[index].selectedVariable)
                        if (x.variableCategory === Variables.INPUT_VAR && x.inOutFlag == "IO")
                            this.config.currentCleanser
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
            if (this.config.currentCleanser.reqOprInputVarNumSelection) {
                for (let x of tempTaskList[index].selectedVariable)
                    this.config.currentCleanser
                        .allVariables
                        .push(new Variables(
                            Variables.getRandomNumber,
                            x.dataType,
                            "IO", "",
                            x.name,
                            Variables.INPUT_VAR,
                            x.variableType, false));
                if (this.config.currentCleanser.rightVariables.length < 1)
                    for (let x of this.config.currentCleanser.allVariables)
                        this.config.currentCleanser.leftVariables.push(new Variables(
                            Variables.getRandomNumber,
                            x.dataType,
                            "IO", "",
                            x.name,
                            Variables.INPUT_VAR,
                            x.variableType, false));
                else
                    for (let x of this.config.currentCleanser.rightVariables) {
                        for (let v of this.config.currentCleanser.allVariables)
                            if (v.name !== x.name)
                                this.config.currentCleanser.leftVariables.push(new Variables(
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
    arrowClick(value: boolean) {
        debugger;
        if (value) {
            //right arrow click
            let option = this.elField.nativeElement.options;
            for (let l of option)
                if (l.selected) {
                    let v: any = this.findLeftField(l.value);
                    v.inOutFlag = "O";
                    this.config.currentCleanser.rightVariables.push(v);
                    this.config.currentCleanser.leftVariables.splice(this.findVariableList(v.name), 1);
                }
        } else {
            //left arrow click 
            let option = this.elSelectField.nativeElement.options;
            for (let l of option)
                if (l.selected) {
                    let v: any = this.findLeftField(l.value);
                    v.inOutFlag = "I";
                    this.config.currentCleanser.leftVariables.push(v);
                    this.config.currentCleanser.rightVariables
                        .splice(this.findSelectedVariable(v.name), 1);
                }
        }
    }
    findLeftField(v: any): any {
        for (let f of this.config.currentCleanser.allVariables)
            if (f.name === v)
                return f;
        return null;

    }
    findVariableList(nm: string): number {
        for (let i: number = 0; i < this.config.currentCleanser.leftVariables.length; i++)
            if (nm === this.config.currentCleanser.leftVariables[i].name)
                return i;
        return -1;
    }
    findSelectedVariable(nm: string) {
        for (let i: number = 0; i < this.config.currentCleanser.rightVariables.length; i++)
            if (nm === this.config.currentCleanser.rightVariables[i].name)
                return i;
        return -1;
    }

}