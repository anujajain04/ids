import { Component, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DatasetService } from '@shared/service-proxies/ids-service-proxies';
import { AnalysisService, AnalysisStudioConfig, Writer, Reader, TemplateDto, Variables } from '@shared/service-proxies/ids-analysis-service-proxies';
@Component({
    selector: 'writer',
    templateUrl: './writer.component.html',
    animations: [appModuleAnimation()]
})

export class WriterDatasetComponent {
    isTemplate: boolean = false;
    templateList: Writer[] = [];
    txt: string = "";
    constructor(private config: AnalysisStudioConfig, private service: AnalysisService, private dataService: DatasetService) {
        AnalysisService.isAnalysisPage = true;
        if (this.config.currentPosition < this.config.taskElements.length) {
            try {
                this.config.currentWriter = this.config.taskElements[this.config.currentPosition];
                // if (this.config.currentWriter.entityType === undefined || this.config.currentWriter.entityType === null) {
                //   this.isTemplate = true;
                if (this.config.currentWriter.templateList.length < 1)
                    this.getTempate();

                this.txt = this.config.currentWriter.entityName;
                this.getVariablesFromPreviousTask();
            } catch (e) {
                console.error("Writer:" + e.message);
            }
        }
        debugger;
    }
    getDataFields() {
        try {
            this.dataService.getDatasetFields(this.config.currentWriter.template.entityKey)
                .subscribe(res => {
                    debugger;
                    this.config.currentWriter.variableList = [];
                    for (let v of res) {
                        this.config.currentWriter.variableList.push(
                            new Variables(Variables.getRandomNumber, v.dataType, "I", "", v.entityName, Variables.OPERATION_VAR, v.variableType, false
                            ));
                    }
                    this.config.currentWriter.allVariables = [];
                    for (let f of this.config.currentWriter.variableList)
                        this.config.currentWriter.allVariables.push(f);
                });
        } catch (e) {
            console.error("Writer:" + e.message);
        }
    }
    getTempate() {
        try {
            this.service.getTemplateDatasetList().subscribe(res => {
                debugger;
                this.templateList = res;
                if (res.length > 0) {
                    if (this.config.currentWriter == null && this.config.currentWriter == undefined)
                        this.config.currentWriter = res[0];
                }
                // this.getDataFields();
            });
        } catch (e) {
            console.error("Writer:" + e.message);
        }
    }
    onChangeObj(val: any) {
        try {
            if (val !== undefined && val !== null)
                this.config.currentWriter = val;
            if (this.config.currentPosition > 0) {
                this.config.currentWriter.selectedField = [];
                if (this.config.currentWriter !== undefined || this.config.currentWriter !== null)
                    //for (let x of this.config.taskElements[this.config.currentPosition - 1].selectedVariable) {
                    //    this.config.currentWriter.selectedVariable.push(new Variables(Variables.getRandomNumber, x.dataType, "I", "", x.name, Variables.INPUT_VAR, x.variableType, false));
                    //}
                    this.getVariablesFromPreviousTask();
            }
            this.config.taskElements[this.config.currentPosition] = this.config.currentWriter;
        } catch (e) {
            console.error("Writer:" + e.message);
        }
    }
    getVariablesFromPreviousTask() {
      debugger;
        if (this.config.currentPosition > 0) {
            this.config.currentWriter.selectedVariable = [];
            //this.config.currentWriter.leftVariables = [];
            ///if reqOprInputVarNumSelection is true
            if (this.config.taskElements[this.config.currentPosition - 1].reqOprInputVarNumSelection) {
                //CarryFwd flag Condition true.
                if (this.config.taskElements[this.config.currentPosition - 1].inputVarCarryFwdFlag) {
                    for (let x of this.config.taskElements[this.config.currentPosition - 1].selectedVariable)

                        if (x.inOutFlag !== "I") {
                            if (!this.isVariablePresent(x.name))
                                this.config.currentWriter
                                    .selectedVariable
                                    .push(new Variables(
                                        Variables.getRandomNumber,
                                        x.dataType,
                                        "IO", "",
                                        x.name,
                                        Variables.INPUT_VAR,
                                        x.variableType, false));
                        }
                    //this.removeExtraVariables(this.config.taskElements[this.config.currentPosition - 1].rightVariables);
                } else {
                    //CarryFwd flag Condition false.
                    if (this.config.taskElements[this.config.currentPosition - 1] instanceof Reader) {
                        for (let x of this.config.taskElements[this.config.currentPosition - 1].rightVariables)
                            if (x.inOutFlag !== "I" && x.variableCategory === Variables.OPERATION_VAR)
                                this.config.currentWriter
                                    .selectedVariable
                                    .push(new Variables(
                                        Variables.getRandomNumber,
                                        x.dataType,
                                        "IO", "",
                                        x.name,
                                        Variables.INPUT_VAR,
                                        x.variableType, false));
                    }
                    else
                        for (let x of this.config.taskElements[this.config.currentPosition - 1].selectedVariable)
                            if (x.inOutFlag === "O" && x.variableCategory === Variables.OPERATION_VAR)
                                if (!this.isVariablePresent(x.name))
                                    this.config.currentWriter
                                        .selectedVariable
                                        .push(new Variables(
                                            Variables.getRandomNumber,
                                            x.dataType,
                                            "IO", "",
                                            x.name,
                                            Variables.INPUT_VAR,
                                            x.variableType, false));
                    //this.removeExtraVariables(this.config.taskElements[this.config.currentPosition - 1].rightVariables);
                }
                // inputOprVarSameAsOutputOprVarFlag flag condition.. get all the input variable form previous tasks.
                if (this.config.taskElements[this.config.currentPosition - 1].inputOprVarSameAsOutputOprVarFlag) {
                    this.config.currentWriter.allVariables = this.config.taskElements[this.config.currentPosition - 1].selectedVariable;
                    for (let x of this.config.taskElements[this.config.currentPosition - 1].selectedVariable)
                        if (x.variableCategory === Variables.OPERATION_VAR && x.inOutFlag == "O")
                            if (!this.isVariablePresent(x.name))
                                this.config.currentWriter
                                    .selectedVariable
                                    .push(new Variables(
                                        Variables.getRandomNumber,
                                        x.dataType,
                                        "IO", "",
                                        x.name,
                                        x.variableCategory,
                                        x.variableType,
                                        false));
                    //this.removeExtraVariables(this.config.taskElements[this.config.currentPosition - 1].rightVariables);
                }
            } else {
                ///if reqOprInputVarNumSelection is false
                if (this.config.taskElements[this.config.currentPosition - 1].inputVarCarryFwdFlag) {
                    for (let x of this.config.taskElements[this.config.currentPosition - 1].selectedVariable)
                        if (x.inOutFlag !== "I")
                            if (!this.isVariablePresent(x.name))
                                this.config.currentWriter
                                    .selectedVariable
                                    .push(new Variables(
                                        Variables.getRandomNumber,
                                        x.dataType,
                                        "IO", "",
                                        x.name,
                                        Variables.INPUT_VAR,
                                        x.variableType, false));
                    //  this.removeExtraVariables(this.config.taskElements[this.config.currentPosition - 1].selectedVariable);
                } else {
                    for (let x of this.config.taskElements[this.config.currentPosition - 1].selectedVariable)
                        if (x.inOutFlag === "O" && x.variableCategory === Variables.OPERATION_VAR)
                            if (!this.isVariablePresent(x.name))
                                this.config.currentWriter
                                    .selectedVariable
                                    .push(new Variables(
                                        Variables.getRandomNumber,
                                        x.dataType,
                                        "IO", "",
                                        x.name,
                                        Variables.INPUT_VAR,
                                        x.variableType, false));
                   // this.removeExtraVariables(this.config.taskElements[this.config.currentPosition - 1].selectedVariable);
                }
                // inputOprVarSameAsOutputOprVarFlag flag condition.. get all the input variable form previous tasks.
                if (this.config.taskElements[this.config.currentPosition - 1].inputOprVarSameAsOutputOprVarFlag) {
                    this.config.currentWriter.allVariables = this.config.taskElements[this.config.currentPosition - 1].selectedVariable;
                    for (let x of this.config.taskElements[this.config.currentPosition - 1].selectedVariable)
                        if (x.variableCategory === Variables.OPERATION_VAR && x.inOutFlag == "O")
                            if (!this.isVariablePresent(x.name))
                                this.config.currentWriter
                                    .selectedVariable
                                    .push(new Variables(
                                        Variables.getRandomNumber,
                                        x.dataType,
                                        "IO", "",
                                        x.name,
                                        x.variableCategory,
                                        x.variableType,
                                        false));
                    //this.removeExtraVariables(this.config.taskElements[this.config.currentPosition - 1].selectedVariable);
                }
            }
        }
        // fill the selection box by variables
        //if (this.config.currentWriter.reqOprInputVarNumSelection) {
        //    for (let x of this.config.taskElements[this.config.currentPosition - 1].selectedVariable)
        //        this.config.currentWriter
        //            .allVariables
        //            .push(new Variables(
        //                Variables.getRandomNumber,
        //                x.dataType,
        //                "IO", "",
        //                x.name,
        //                Variables.INPUT_VAR
        //                x.variableType, false));
        //    if (this.config.currentWriter.rightVariables.length < 1)
        //        for (let x of this.config.currentWriter.allVariables)
        //            this.config.currentWriter.leftVariables.push(new Variables(
        //                Variables.getRandomNumber,
        //                x.dataType,
        //                "IO", "",
        //                x.name,
        //                Variables.INPUT_VAR
        //                x.variableType, false));
        //    else
        //        for (let x of this.config.currentWriter.rightVariables) {
        //            for (let v of this.config.currentWriter.allVariables)
        //                if (v.name !== x.name)
        //                    this.config.currentWriter.leftVariables.push(new Variables(
        //                        Variables.getRandomNumber,
        //                        x.dataType,
        //                        "IO", "",
        //                        x.name,
        //                        Variables.INPUT_VAR
        //                        x.variableType, false));
        //        }
        //}
    }

    removeExtraVariables(value: any) {
        for (let i of value) {
            let index: number = 0;
            for (let j of this.config.currentWriter.selectedVariable) {
                if (i.name !== j.name) {
                    this.config.currentWriter.selectedVariable.splice(index, 1);
                    return;
                }
                index++;
            }
        }
    }
    isVariablePresent(value: string): boolean {
        let index: number = 0;
        for (let i of this.config.currentWriter.selectedVariable) {
            if (i.name === value) {
                return true;
            }
            index++;
        }
        return false;
    }
}
