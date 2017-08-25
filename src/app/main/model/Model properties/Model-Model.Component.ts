    import { Component, Injector, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
    import { appModuleAnimation } from '@shared/animations/routerTransition';
    import { AppComponentBase } from '@shared/common/app-component-base';
    import { FormGroup, Validators, FormControl } from '@angular/forms';
    import { QuickTree, ModelService, TaskDto, TaskType, Reader, Mapping, Variables, ModelStudioConfig }
      from '@shared/service-proxies/ids-model-service-proxies';
    import { TempBaseUrl, LoadingService, SubDatasetDto, DatasetFieldDto, DatasetService } from '@shared/service-proxies/ids-service-proxies';

    @Component({
      selector: 'Model-Model',
      templateUrl: './Model-Model.Component.html',
      animations: [appModuleAnimation()]
    })

    export class ModelAnalysisComponent implements OnInit {
      txt: string = "";
      txt1: string = "";
      @ViewChild('field') elField: ElementRef;
      @ViewChild('selectField') elSelectField: ElementRef;
      constructor(private service: ModelService, private config: ModelStudioConfig) {
        try {
          ModelService.isModelPage = true;
          debugger;
          if (this.config.isPreProcessor) {
            if (this.config.currentPosition < this.config.taskElements.length) {
              this.config.currentModel = this.config.taskElements[this.config.currentPosition];
              this.getVariablesFromPreviousPreProcessorTask();
              this.txt = this.config.currentModel.cleanseText.name + "";
              this.txt1 = this.config.currentModel.classText.name + "";
            }
          } else {
            if (this.config.currentPosition < this.config.taskElements1.length) {
              this.config.currentModel = this.config.taskElements1[this.config.currentPosition];
              //this.config.currentModel.selectedVariable = [];
              this.getVariablesFromPreviousProcessingTask();
              this.txt = this.config.currentModel.cleanseText.name + "";
              this.txt1 = this.config.currentModel.classText.name + "";
            }
          }
        } catch (e) {
          console.error("Error in Model");
        }
      }
      findVariable(value: string): Variables {
        for (let x of this.config.currentModel.selectedVariable)
          if (value === x.name) {
            return x;
          }
        return null;
      }
      onCleanseSelect(value: any) {
        this.config.currentModel.cleanseText = this.findVariable(value);
      }
      onMappingSelect(variable: any, value: any) {
        debugger;
        if (this.variableExists(variable.name))
          this.config.taskElements[this.config.currentPosition].inputMapping.push({ "fromField": value, "toField": variable.name });
      }
      variableExists(name) {
        for (let v in this.config.taskElements[this.config.currentPosition].inputMapping) {
          if (v["toField"] === name)
            return false;
          else return true;
        }
        return true
      }
      onCleanseSelect1(value: any) {
        this.config.currentModel.classText = this.findVariable(value);
      }
      getModel() {

        this.service.getModelForModel(this.config.currentModel.entityKey).subscribe(res => {
          debugger;
          this.config.currentModel.processing = res.modelData;
          //let temp = JSON.parse(res.modelData.modelVariable);
          let temp = res.modelData.modelVariable;
          for (let item of temp) {
            if (item.inOutFlag === "I") {
              this.config.currentModel
                .modelVariable
                .push(new Variables(Variables.getRandomNumber,
                  item.dataType,
                  item.inOutFlag,
                  item.isDefaultFlag,
                  item.name,
                  item.variableCategory,
                  item.variableType,
                  false));
            }
          }

        });




      }
      ngOnInit() {
      }
      onSubmit() {
      }

      ngOnDestroy() {
        debugger;
        try {
          if (this.config.currentModel !== undefined) {
            if (this.config.currentModel.processing !== undefined) {

              let tempModelVariableArray = JSON.parse(this.config.currentModel.processing.modelVariable);
              debugger;
              for (let item of tempModelVariableArray) {
                this.config.currentModel
                  .selectedVariable
                  .push(new Variables(Variables.getRandomNumber,
                    item.dataType,
                    item.inOutFlag,
                    item.isDefaultFlag,
                    item.name,
                    item.variableCategory,
                    item.variableType,
                    false));
              }
            }
            //this.config.currentModel.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "I", "", "text", Variables.OPERATION_VAR, "Text", false));
            //this.config.currentModel.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "I", "", "label", Variables.OPERATION_VAR, "Text", false));
            //this.config.currentModel.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "O", "", this.config.currentModel.entityName + ".label", Variables.OPERATION_VAR, "Text", false));
            debugger;
            if (this.config.currentModel.definateOprVar) {
              this.config.currentModel.mapping = [];
              debugger;
              for (let m in this.config.taskElements[this.config.currentPosition - 1].inputMapping) {
                this.config.currentModel
                  .mapping
                  .push(new Mapping(
                    this.config.taskElements[this.config.currentPosition - 2].entityName,
                    this.config.taskElements[this.config.currentPosition - 1].inputMapping[m].fromField,
                    this.config.taskElements[this.config.currentPosition - 1].entityName,
                    this.config.taskElements[this.config.currentPosition - 1].inputMapping[m].toField
                  ));
              }
            }
          }
        } catch (e) {
          console.error("Model Des:" + e.message);
        }
      }
      getVariablesFromPreviousPreProcessorTask() {
        if (this.config.currentPosition > 0) {
          this.config.currentModel.selectedVariable = [];
          this.config.currentModel.leftVariables = [];
          ///if reqOprInputVarNumSelection is true
          if (this.config.taskElements[this.config.currentPosition - 1].reqOprInputVarNumSelection) {
            //CarryFwd flag Condition true.
            if (this.config.taskElements[this.config.currentPosition - 1].inputVarCarryFwdFlag) {
              for (let x of this.config.taskElements[this.config.currentPosition - 1].selectedVariable)
                if (x.inOutFlag !== "I")
                  this.config.currentModel
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
                    this.config.currentModel
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
                  if (x.inOutFlag !== "I" && x.variableCategory === Variables.INPUT_VAR)
                    this.config.currentModel
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
              this.config.currentModel.allVariables = this.config.taskElements[this.config.currentPosition - 1].selectedVariable;
              for (let x of this.config.taskElements[this.config.currentPosition - 1].selectedVariable)
                if (x.variableCategory === Variables.OPERATION_VAR && x.inOutFlag == "O")
                  this.config.currentModel
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
                  this.config.currentModel
                    .selectedVariable
                    .push(new Variables(
                      Variables.getRandomNumber,
                      x.dataType,
                      "IO", "",
                      x.name,
                      Variables.INPUT_VAR,
                      x.variableType, false));
            } else {
              for (let x of this.config.taskElements[this.config.currentPosition - 1].selectedVariable)
                if (x.inOutFlag === "O" && x.variableCategory === Variables.OPERATION_VAR)
                  this.config.currentModel
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
              this.config.currentModel.allVariables = this.config.taskElements[this.config.currentPosition - 1].selectedVariable;
              for (let x of this.config.taskElements[this.config.currentPosition - 1].selectedVariable)
                if (x.variableCategory === Variables.OPERATION_VAR && x.inOutFlag == "O")
                  this.config.currentModel
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
        if (this.config.currentModel.reqOprInputVarNumSelection)
          this.config.currentModel.leftVariables = [];
        this.config.currentModel.allVariables = [];
        for (let x of this.config.currentModel.selectedVariable){
          if (x.variableCategory === 'Input')
            this.config.currentModel
              .allVariables
              .push(new Variables(
                Variables.getRandomNumber,
                x.dataType,
                "IO", "",
                x.name,
                Variables.INPUT_VAR,
                x.variableType, false));
        }
        if (this.config.currentModel.rightVariables.length < 1){
          for (let x of this.config.currentModel.allVariables){
            this.config.currentModel.leftVariables.push(new Variables(
              Variables.getRandomNumber,
              x.dataType,
              "IO", "",
              x.name,
              Variables.INPUT_VAR,
              x.variableType, false));
          }
        }
        else {
          for (let x of this.config.currentModel.allVariables) {
            let variablePresent = false;
            for (let v of this.config.currentModel.rightVariables)
              if (v.name === x.name)
                variablePresent = true;
            if (variablePresent === false)
              this.config.currentModel.leftVariables.push(new Variables(
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
      if (this.config.currentPosition > 0)
        tempTaskList = this.config.taskElements1;
      if (this.config.currentPosition === 0)
        tempTaskList = this.config.taskElements;


      if (tempTaskList != undefined) {
        this.config.currentModel.selectedVariable = [];
        this.config.currentModel.leftVariables = [];
        ///if reqOprInputVarNumSelection is true
        if (tempTaskList[this.config.currentPosition - 1].reqOprInputVarNumSelection) {
          //CarryFwd flag Condition true.
          if (tempTaskList[this.config.currentPosition - 1].inputVarCarryFwdFlag) {
            for (let x of tempTaskList[this.config.currentPosition - 1].selectedVariable)
              if (x.inOutFlag !== "I")
                this.config.currentModel
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
            if (tempTaskList[this.config.currentPosition - 1] instanceof Reader) {
              for (let x of tempTaskList[this.config.currentPosition - 1].rightVariables)
                if (x.inOutFlag !== "I" && x.variableCategory === Variables.OPERATION_VAR)
                  this.config.currentModel
                    .selectedVariable
                    .push(new Variables(
                      Variables.getRandomNumber,
                      x.dataType,
                      "IO", "",
                      x.name,
                      Variables.INPUT_VAR,
                      x.variableType, false));
            } else
              for (let x of tempTaskList[this.config.currentPosition - 1].selectedVariable)
                if (x.inOutFlag === "O" && x.variableCategory === Variables.OPERATION_VAR)
                  this.config.currentModel
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
          if (tempTaskList[this.config.currentPosition - 1].inputOprVarSameAsOutputOprVarFlag) {
            this.config.currentModel.allVariables = tempTaskList[this.config.currentPosition - 1].selectedVariable;
            for (let x of tempTaskList[this.config.currentPosition - 1].selectedVariable)
              if (x.variableCategory === Variables.INPUT_VAR && x.inOutFlag == "IO")
                this.config.currentModel
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
          if (tempTaskList[this.config.currentPosition - 1].inputVarCarryFwdFlag) {
            for (let x of tempTaskList[this.config.currentPosition - 1].selectedVariable)
              if (x.inOutFlag !== "I")
                this.config.currentModel
                  .selectedVariable
                  .push(new Variables(
                    Variables.getRandomNumber,
                    x.dataType,
                    "IO", "",
                    x.name,
                    Variables.INPUT_VAR,
                    x.variableType, false));
          } else {
            if (tempTaskList[this.config.currentPosition - 1] instanceof Reader) {
              for (let x of tempTaskList[this.config.currentPosition - 1].selectedVariable)
                if (x.inOutFlag !== "I" && x.variableCategory === Variables.OPERATION_VAR)
                  this.config.currentModel
                    .selectedVariable
                    .push(new Variables(
                      Variables.getRandomNumber,
                      x.dataType,
                      "IO", "",
                      x.name,
                      Variables.INPUT_VAR,
                      x.variableType, false));
            } else
              for (let x of tempTaskList[this.config.currentPosition - 1].selectedVariable)
                if (x.inOutFlag === "O" && x.variableCategory === Variables.OPERATION_VAR)
                  this.config.currentModel
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
          if (tempTaskList[this.config.currentPosition - 1].inputOprVarSameAsOutputOprVarFlag) {
            this.config.currentModel.allVariables = tempTaskList[this.config.currentPosition - 1].selectedVariable;
            for (let x of tempTaskList[this.config.currentPosition - 1].selectedVariable)
              if (x.variableCategory === Variables.INPUT_VAR && x.inOutFlag == "IO")
                this.config.currentModel
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
      if (this.config.currentModel.reqOprInputVarNumSelection)
        this.config.currentModel.leftVariables = [];
      this.config.currentModel.allVariables = [];
      for (let x of this.config.currentModel.selectedVariable){
        if (x.variableCategory === 'Input')
          this.config.currentModel
            .allVariables
            .push(new Variables(
              Variables.getRandomNumber,
              x.dataType,
              "IO", "",
              x.name,
              Variables.INPUT_VAR,
              x.variableType, false));
      }
      if (this.config.currentModel.rightVariables.length < 1){
        for (let x of this.config.currentModel.allVariables){
          this.config.currentModel.leftVariables.push(new Variables(
            Variables.getRandomNumber,
            x.dataType,
            "IO", "",
            x.name,
            Variables.INPUT_VAR,
            x.variableType, false));
        }
      }
      else {
        for (let x of this.config.currentModel.allVariables) {
          let variablePresent = false;
          for (let v of this.config.currentModel.rightVariables)
            if (v.name === x.name)
              variablePresent = true;
          if (variablePresent === false)
            this.config.currentModel.leftVariables.push(new Variables(
              Variables.getRandomNumber,
              x.dataType,
              "IO", "",
              x.name,
              Variables.INPUT_VAR,
              x.variableType, false));
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
            let v: any = this.findField(l.value);
            v.inOutFlag = "O";
            this.config.currentModel.rightVariables.push(v);
            this.config.currentModel.leftVariables.splice(this.findVariableList(v.name), 1);
          }
      } else {
        //left arrow click
        let option = this.elSelectField.nativeElement.options;
        for (let l of option)
          if (l.selected) {
            let v: any = this.findField(l.value);
            v.inOutFlag = "I";
            this.config.currentModel.leftVariables.push(v);
            this.config.currentModel.rightVariables
              .splice(this.findSelectedVariable(v.name), 1);
          }
      }
    }
    findField(v: any): any {
      for (let f of this.config.currentModel.allVariables)
        if (f.name === v)
          return f;
      return null;

    }
    findVariableList(nm: string): number {
      for (let i: number = 0; i < this.config.currentModel.leftVariables.length; i++)
        if (nm === this.config.currentModel.leftVariables[i].name)
          return i;
      return -1;
    }
    findSelectedVariable(nm: string) {
      for (let i: number = 0; i < this.config.currentModel.rightVariables.length; i++)
        if (nm === this.config.currentModel.rightVariables[i].name)
          return i;
      return -1;
    }
    }
