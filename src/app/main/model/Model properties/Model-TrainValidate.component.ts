import { Component, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { QuickTree, ModelService, TaskDto, TaskType, Reader, Variables, ModelStudioConfig }
    from '@shared/service-proxies/ids-model-service-proxies';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
    selector: 'Model-train',
    templateUrl: './Model-TrainValidate.component.html',
    animations: [appModuleAnimation()]
})

export class ModelTrainValidateComponent {
    txt: string = "";
    constructor(private config: ModelStudioConfig) {
        debugger;
        try {
            ModelService.isModelPage = true;
            this.config.currentTrainValidate.definateOprVar = false;
            this.config.currentTrainValidate.inputOprVarSameAsOutputOprVarFlag = true;
            this.config.currentTrainValidate.inputVarCarryFwdFlag = false;
            this.config.currentTrainValidate.reqOprInputVarNumSelection = false;
            if (this.config.isPreProcessor) {
                if (this.config.currentPosition < this.config.taskElements.length) {
                    this.config.currentTrainValidate = this.config.taskElements[this.config.currentPosition];
                    this.getVariablesFromPreviousPreProcessorTask();
                }
            }
        } catch (e) {
            console.error("Error in Train");
        }
    }
    findVariable(value: string): Variables {
        for (let x of this.config.currentTrainValidate.selectedVariable)
            if (value === x.name)
                return x;
        return null;
    }
    onSelect(value: any) {
        //this.config.currentTrainValidate.cleanseText = this.findVariable(value);
    }
    getVariablesFromPreviousPreProcessorTask() {
        if (this.config.currentPosition > 0) {
            this.config.currentTrainValidate.selectedVariable = [];
            this.config.currentTrainValidate.leftVariables = [];
            ///if reqOprInputVarNumSelection is true
            if (this.config.taskElements[this.config.currentPosition - 1].reqOprInputVarNumSelection) {
                //CarryFwd flag Condition true.
                if (this.config.taskElements[this.config.currentPosition - 1].inputVarCarryFwdFlag) {
                    for (let x of this.config.taskElements[this.config.currentPosition - 1].rightVariables)
                        if (x.inOutFlag !== "I")
                            this.config.currentTrainValidate
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
                                this.config.currentTrainValidate
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
                                this.config.currentTrainValidate
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
                    this.config.currentTrainValidate.allVariables = this.config.taskElements[this.config.currentPosition - 1].rightVariables;
                    for (let x of this.config.taskElements[this.config.currentPosition - 1].rightVariables)
                        if (x.variableCategory === Variables.INPUT_VAR && x.inOutFlag == "IO")
                            this.config.currentTrainValidate
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
                            this.config.currentTrainValidate
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
                                this.config.currentTrainValidate
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
                                this.config.currentTrainValidate
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
                    this.config.currentTrainValidate.allVariables = this.config.taskElements[this.config.currentPosition - 1].selectedVariable;
                    for (let x of this.config.taskElements[this.config.currentPosition - 1].selectedVariable)
                        if (x.variableCategory === Variables.INPUT_VAR && x.inOutFlag == "IO")
                            this.config.currentTrainValidate
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
        if (this.config.currentTrainValidate.reqOprInputVarNumSelection) {
            for (let x of this.config.taskElements[this.config.currentPosition - 1].selectedVariable)
                this.config.currentTrainValidate
                    .allVariables
                    .push(new Variables(
                        Variables.getRandomNumber,
                        x.dataType,
                        "IO", "",
                        x.name,
                        Variables.INPUT_VAR,
                        x.variableType, false));
            if (this.config.currentTrainValidate.rightVariables.length < 1)
                for (let x of this.config.currentTrainValidate.allVariables)
                    this.config.currentTrainValidate.leftVariables.push(new Variables(
                        Variables.getRandomNumber,
                        x.dataType,
                        "IO", "",
                        x.name,
                        Variables.INPUT_VAR,
                        x.variableType, false));
            else
                for (let x of this.config.currentTrainValidate.rightVariables) {
                    for (let v of this.config.currentTrainValidate.allVariables)
                        if (v.name !== x.name)
                            this.config.currentTrainValidate.leftVariables.push(new Variables(
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
