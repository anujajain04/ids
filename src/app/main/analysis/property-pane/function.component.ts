import { Component, Injector, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AnalysisService, AnalysisStudioConfig, Mapping, TaskDto, Reader, Variables } from '@shared/service-proxies/ids-analysis-service-proxies';

@Component({
    selector: 'function',
    templateUrl: './function.component.html',
    animations: [appModuleAnimation()]
})

export class FunctionComponent implements OnDestroy {
    txt: string = "";
    txt1: string = "";
    @ViewChild('field') elField: ElementRef;
    @ViewChild('selectField') elSelectField: ElementRef;
    constructor(private config: AnalysisStudioConfig) {
        debugger;
        if (this.config.currentPosition < this.config.taskElements.length) {
            AnalysisService.isAnalysisPage = true;
            try {
                this.config.currentFunction = this.config.taskElements[this.config.currentPosition];
                this.getVariablesFromPreviousTask();
                this.txt = this.config.currentFunction.cleanseText.name + "";
                this.txt1 = this.config.currentFunction.classText.name + "";
            } catch (e) {
                console.error("Function Con:" + e.message);
            }
        }
    }
    get isComman(): boolean {
        if (this.config.currentFunction.className == "CentroidAlgorithm"
            || this.config.currentFunction.className == "DensityAlgorithm"
            || this.config.currentFunction.className == "ConnectivityAlgorithm"
            || this.config.currentFunction.className == "IncrementalAlgorithm"
            || this.config.currentFunction.className == "WordToPhraseCorrelationAnalysis"
            || this.config.currentFunction.className == "PhraseToPhraseCorrelationAnalysis"
            || this.config.currentFunction.className == "WordToWordCorrelationAnalysis"
            || this.config.currentFunction.functionCategory2 == "Entity Extraction"
            || this.config.currentFunction.className == "SKScale"
            || this.config.currentFunction.className == "SKNormalization"
            || this.config.currentFunction.className == "SKKNNClustering"
            || this.config.currentFunction.className == "LabelEncoder"
            || this.config.currentFunction.className == "SKSupervisedFeatureSelection"
          || this.config.currentFunction.className == "SKUnSupervisedFeatureSelection"
        || this.config.currentFunction.className == "CorrelationStatsAnalysis"
          || this.config.currentFunction.className == "SKIncrementalAlgorithm"
          || this.config.currentFunction.className == "SKCentroidAlgorithm"
          || this.config.currentFunction.className == "SKConnectivityAlgorithm"
          || this.config.currentFunction.className == "SKDensityAlgorithm") {
            return false;
        }
        return true;
    }
    onSelectNormalizationMetric(value: any) {
        debugger;
        this.config.currentFunction.normalizationMetric = value;

    }
    findVariable(value: string): Variables {
        for (let x of this.config.currentFunction.selectedVariable)
            if (value === x.name)
                return x;
        return null;
    }
    onCleanseSelect(value: any) {
        this.txt = value;
        this.config.currentFunction.cleanseText = this.findVariable(value);
    }
    onSelect(value: any) {
        debugger;
        if (this.config.currentFunction.preCompute) {
            this.config.currentFunction.preCompute = value;
        }
        else if (this.config.currentFunction.initializeMethod) {
            this.config.currentFunction.initializeMethod = value;
        }
        else if (this.config.currentFunction.classText) {
            this.config.currentFunction.classText = this.findVariable(value);
        }
        else if (this.config.currentFunction.linkageMetric) {
            this.config.currentFunction.linkageMetric = value;
        }
        else if (this.config.currentFunction.linkageCriteria) {
            this.config.currentFunction.linkageCriteria = value;
        }
        else if (this.config.currentFunction.nearestNeighbourComputationTechnique) {
            this.config.currentFunction.nearestNeighbourComputationTechnique = value;
        }
    }
  onCorrelationSelect(value: any) {
      debugger;
        this.config.currentFunction.correlationType = value;
  }

    //onSelect1(value: any) {
    //    this.config.currentFunction.initializeMethod = value;
    //}
    //onCleanseSelect1(value: any) {
    //    this.txt1 = value;
    //    this.config.currentFunction.classText = this.findVariable(value);
    //}
    //ononSelectLinkage(value: any) {
    //    this.config.currentFunction.linkageMetric = value;
    //}
    //ononSelectCriteria(value: any) {
    //    this.config.currentFunction.linkageCriteria = value;
    //}
    //ononSelectComputationTechnique(value: any) {
    //    this.config.currentFunction.nearestNeighbourComputationTechnique = value;
    //}
    ngOnDestroy() {
        // if (this.config.currentFunction.definateOprVar)
        debugger;
        try {
            if (this.config.currentFunction !== undefined) {
              if (this.config.currentFunction.className === "BasicFrequencyAlgorithm" || this.config.currentFunction.className === "AdjectiveFrequencyAlgorithm" || this.config.currentFunction.className === "VerbFrequencyAlgorithm" || this.config.currentFunction.className === "NounFrequencyAlgorithm") {
                //defineteoprVar is true then show mapping else not
                this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "I", "", "text", Variables.OPERATION_VAR, "Text", false));
                this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "Integer", "O", "", this.config.currentFunction.entityName + ".frequency", Variables.OPERATION_VAR, "Discrete", false));
                this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "O", "", this.config.currentFunction.entityName + ".word", Variables.OPERATION_VAR, "Text", false));

                //
              } else if (this.config.currentFunction.className === "WordToWordCorrelationAnalysis" || this.config.currentFunction.className === "VerbToVerbCorrelationAnalysis" || this.config.currentFunction.className === "NounToAdjectiveCorrelationAnalysis" || this.config.currentFunction.className === "NounToVerbCorrelationAnalysis" || this.config.currentFunction.className === "WordToPhraseCorrelationAnalysis" || this.config.currentFunction.className === "PhraseToPhraseCorrelationAnalysis") {
                debugger;
                this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "I", "", "text", Variables.OPERATION_VAR, "Text", false));
                this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "O", "", this.config.currentFunction.entityName + ".text1", Variables.OPERATION_VAR, "Text", false));
                this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "O", "", this.config.currentFunction.entityName + ".text2", Variables.OPERATION_VAR, "Text", false));
                this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "Integer", "O", "", this.config.currentFunction.entityName + ".correlationScore", Variables.OPERATION_VAR, "Discrete", false));
                //
              } else if (this.config.currentFunction.className === "CorrelationStatsAnalysis") {
                this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "I", "", "text", Variables.OPERATION_VAR, "Text", false));
                this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "O", "", this.config.currentFunction.entityName + ".column1", Variables.OPERATION_VAR, "Text", false));
                this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "O", "", this.config.currentFunction.entityName + ".column2", Variables.OPERATION_VAR, "Text", false));
                this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "Integer", "O", "", this.config.currentFunction.entityName + ".correlationScore", Variables.OPERATION_VAR, "Discrete", false));
                this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "Integer", "O", "", this.config.currentFunction.entityName + ".significance", Variables.OPERATION_VAR, "Discrete", false));
                //
              } else if (this.config.currentFunction.className === "BasicSentimentAlgorithm1" || this.config.currentFunction.className === "BasicSentimentAlgorithm2" || this.config.currentFunction.className === "BasicSentimentAlgorithm3") {
                this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "I", "", "text", Variables.OPERATION_VAR, "Text", false));
                this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "text", "O", "", this.config.currentFunction.entityName + ".sentiment", Variables.OPERATION_VAR, "Categorical", false));
                this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "text", "O", "", this.config.currentFunction.entityName + ".sentimentScore", Variables.OPERATION_VAR, "Discrete", false));
                //
              } else if (this.config.currentFunction.className === "SKIncrementalAlgorithm" || this.config.currentFunction.className === "SKCentroidAlgorithm" || this.config.currentFunction.className === "SKConnectivityAlgorithm" || this.config.currentFunction.className === "SKDensityAlgorithm") {
                debugger;
                this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "I", "", "text", Variables.OPERATION_VAR, "Text", false));
                this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "O", "", this.config.currentFunction.entityName + ".silhouteScore ", Variables.OPERATION_VAR, "Text", false));
                //
              } else if (this.config.currentFunction.className === "BasicEntityExtraction" || this.config.currentFunction.className === "AdvancedEntityExtraction") {
                this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "I", "", "text", Variables.OPERATION_VAR, "Text", false));
                //
              } else if (this.config.currentFunction.className === "CentroidAlgorithm" || this.config.currentFunction.className === "DensityAlgorithm" || this.config.currentFunction.className === "ConnectivityAlgorithm" || this.config.currentFunction.className === "IncrementalAlgorithm") {
                this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "I", "", "text", Variables.OPERATION_VAR, "Text", false));
                this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "O", "", this.config.currentFunction.entityName + ".label", Variables.OPERATION_VAR, "Text", false));
                this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "O", "", this.config.currentFunction.entityName + ".name", Variables.OPERATION_VAR, "Text", false));
                this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "O", "", this.config.currentFunction.entityName + ".type", Variables.OPERATION_VAR, "Text", false));
                this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "O", "", this.config.currentFunction.entityName + ".relevance", Variables.OPERATION_VAR, "Text", false));
                this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "O", "", this.config.currentFunction.entityName + ".personType", Variables.OPERATION_VAR, "Text", false));
                this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "O", "", this.config.currentFunction.entityName + ".nationality", Variables.OPERATION_VAR, "Text", false));
                this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "O", "", this.config.currentFunction.entityName + ".confidencelevel", Variables.OPERATION_VAR, "Text", false));
                this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "O", "", this.config.currentFunction.entityName + ".frequency", Variables.OPERATION_VAR, "Text", false));
                this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "I", "", this.config.currentFunction.entityName + ".preComputeDistance", Variables.OPERATION_VAR, "Text", false));
                this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "I", "", this.config.currentFunction.entityName + ".initilizationMethod", Variables.OPERATION_VAR, "Text", false));
                this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "I", "", this.config.currentFunction.entityName + ".linkageMetrics", Variables.OPERATION_VAR, "Text", false));
                this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "I", "", this.config.currentFunction.entityName + ".linkageCriterias", Variables.OPERATION_VAR, "Text", false));
                this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "I", "", this.config.currentFunction.entityName + ".nearestNeighbourComputationTechnique", Variables.OPERATION_VAR, "Text", false));
              } else if (this.config.currentFunction.className === "NaiveBayesAlgorithm" || this.config.currentFunction.className === "SVMAlgorithm" || this.config.currentFunction.className === "EntropyAlgorithm") {
                this.config.currentFunction.allVariables.push(new Variables(Variables.getRandomNumber, "Text", "I", "", "text", Variables.OPERATION_VAR, "Text", false));
                this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "O", "", this.config.currentFunction.entityName + ".label", Variables.OPERATION_VAR, "Text", false));
              }
              else if (this.config.currentFunction.className === "SKNormalization" || this.config.currentFunction.className === "SKScale") {

                //Kanchan ------------------
                // Code to Add right variables to selected variables
                try {
                  //this.config.currentFunction.allVariables.push(new Variables(Variables.getRandomNumber, "Text", "I", "", "text", Variables.OPERATION_VAR, "Text", false));
                  debugger
                  for (let x of this.config.currentFunction.rightVariables) {
                    debugger;
                    this.config.currentFunction.selectedVariable.push(new Variables(
                      Variables.getRandomNumber,
                      x.dataType,
                      "O", "",
                      this.config.currentFunction.entityName + "." + x.name,
                      Variables.OPERATION_VAR,
                      x.variableType,
                      false));
                  }
                  // save selected variables
                  this.config.currentFunction.rightVariables = [];
                  for (let x of this.config.currentFunction.selectedVariable) {
                    debugger
                    this.config.currentFunction.rightVariables.push(new Variables(
                      Variables.getRandomNumber,
                      x.dataType,
                      "O", "",
                      x.name,
                      Variables.OPERATION_VAR,
                      x.variableType,
                      false));

                  }


                  debugger
                } catch (e) {
                }
              }


              else if (this.config.currentFunction.className === "LabelEncoder") {
                //Kanchan

                try {
                  //this.config.currentFunction.allVariables.push(new Variables(Variables.getRandomNumber, "Text", "I", "", "text", Variables.OPERATION_VAR, "Text", false));
                  debugger
                  for (let x of this.config.currentFunction.rightVariables) {
                    debugger;
                    this.config.currentFunction.selectedVariable.push(new Variables(
                      Variables.getRandomNumber,
                      x.dataType,
                      "I", "",
                      this.config.currentFunction.entityName + "." + x.name,
                      Variables.OPERATION_VAR,
                      x.variableType,
                      true));
                    this.config.currentFunction.selectedVariable.push(new Variables(
                      Variables.getRandomNumber,
                      x.dataType,
                      "O", "",
                      this.config.currentFunction.entityName + "." + x.name + ".*",
                      Variables.OPERATION_VAR,
                      "Continuous",
                      false));
                  }
                  // save selected variables
                  //this.config.currentFunction.rightVariables = [];
                  //for (let x of this.config.currentFunction.selectedVariable) {
                  //debugger
                  //this.config.currentFunction.rightVariables.push(new Variables(
                  // Variables.getRandomNumber,
                  //x.dataType,
                  //"O", "",
                  //x.name,
                  //Variables.OPERATION_VAR,
                  //x.variableType,
                  //false));

                  //}


                } catch (e) {
                }

              }
              else if (this.config.currentFunction.className === "SKSupervisedFeatureSelection" || this.config.currentFunction.className === "SKUnsupervisedFeatureSelection") {
                //Kanchan

                try {
                  //this.config.currentFunction.allVariables.push(new Variables(Variables.getRandomNumber, "Text", "I", "", "text", Variables.OPERATION_VAR, "Text", false));
                  debugger
                  for (let x of this.config.currentFunction.rightVariables) {
                    debugger;
                    this.config.currentFunction.selectedVariable.push(new Variables(
                      Variables.getRandomNumber,
                      x.dataType,
                      "I", "",
                      this.config.currentFunction.entityName + "." + x.name,
                      Variables.OPERATION_VAR,
                      x.variableType,
                      true));
                  }
                  this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "O", "", this.config.currentFunction.entityName + ".*", Variables.OPERATION_VAR, "Continuous", false));
                  this.config.currentFunction.selectedVariable.push(new Variables(Variables.getRandomNumber, "Text", "O", "", this.config.currentFunction.entityName + ".value", Variables.OPERATION_VAR, "Continuous", false));
                  this.config.currentFunction.mapping = [];
                  this.config.currentFunction
                    .mapping
                    .push(new Mapping(
                      '',//this.config.taskElements[this.config.currentPosition - 2].entityName,
                      this.config.currentFunction.cleanseText.name,
                      this.config.currentFunction.entityName,
                      'value'
                    ));


                } catch (e) {
                }

              }
            }


            //-----------Kanchan ------------end-----------




            if (this.config.currentFunction.definateOprVar) {

                this.config.currentFunction
                    .mapping
                    .push(new Mapping(
                        this.config.taskElements[this.config.currentPosition - 2].entityName,
                        this.txt,
                        this.config.currentFunction.entityName,
                        "text"
                    ));
                if (this.config.currentFunction.functionCategory1 === "Algorithm")
                    this.config.currentFunction
                        .mapping
                        .push(new Mapping(
                            this.config.taskElements[this.config.currentPosition - 2].entityName,
                            this.config.currentFunction.classText.name,
                            this.config.currentFunction.entityName,
                            "label"
                        ));
            }
        } catch (e) {
            console.error("Function:" + e.message);
        }
    }
    getVariablesFromPreviousTask() {
        debugger
        if (this.config.currentPosition > 0) {
            this.config.currentFunction.selectedVariable = [];
            this.config.currentFunction.leftVariables = [];
            ///if reqOprInputVarNumSelection is true

            if (this.config.taskElements[this.config.currentPosition - 1].reqOprInputVarNumSelection) {
                //CarryFwd flag Condition true.
                if (this.config.taskElements[this.config.currentPosition - 1].inputVarCarryFwdFlag) {
                    for (let x of this.config.taskElements[this.config.currentPosition - 1].selectedVariable)
                        if (x.inOutFlag !== "I")
                            this.config.currentFunction
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
                                this.config.currentFunction
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
                            if (x.inOutFlag !== "I" && x.variableCategory === Variables.INPUT_VAR)
                                this.config.currentFunction
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
                    this.config.currentFunction.allVariables = this.config.taskElements[this.config.currentPosition - 1].selectedVariable;
                    for (let x of this.config.taskElements[this.config.currentPosition - 1].selectedVariable)
                        if (x.variableCategory === Variables.OPERATION_VAR && x.inOutFlag == "O")
                            this.config.currentFunction
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
                            this.config.currentFunction
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
                            this.config.currentFunction
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
                    this.config.currentFunction.allVariables = this.config.taskElements[this.config.currentPosition - 1].selectedVariable;
                    for (let x of this.config.taskElements[this.config.currentPosition - 1].selectedVariable)
                        if (x.variableCategory === Variables.OPERATION_VAR && x.inOutFlag == "O")
                            this.config.currentFunction
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
            if (this.config.currentFunction.reqOprInputVarNumSelection) {
                this.config.currentFunction.leftVariables = [];
                this.config.currentFunction.allVariables = [];
                for (let x of this.config.currentFunction.selectedVariable){
                    if (x.variableCategory === 'Input')
                        this.config.currentFunction
                            .allVariables
                            .push(new Variables(
                                Variables.getRandomNumber,
                                x.dataType,
                                "IO", "",
                                x.name,
                                Variables.INPUT_VAR,
                                x.variableType, false));
                }
                if (this.config.currentFunction.rightVariables.length < 1){
                    for (let x of this.config.currentFunction.allVariables){
                        this.config.currentFunction.leftVariables.push(new Variables(
                            Variables.getRandomNumber,
                            x.dataType,
                            "IO", "",
                            x.name,
                            Variables.INPUT_VAR,
                            x.variableType, false));
                    }
                }
                else {
                    for (let x of this.config.currentFunction.allVariables) {
                        let variablePresent = false;
                        for (let v of this.config.currentFunction.rightVariables)
                            if (v.name === x.name)
                              variablePresent = true;
                        if (variablePresent === false)
                            this.config.currentFunction.leftVariables.push(new Variables(
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
                    this.config.currentFunction.rightVariables.push(v);
                    this.config.currentFunction.leftVariables.splice(this.findVariableList(v.name), 1);
                }
            /* else{
              for(let j of this.config.currentFunction.leftVariables)
              {
                 debugger;
                // let v: any = this.findField(j.value);
               //  v.inOutFlag = "IO";
                 this.config.currentFunction.rightVariables.push(j)

              }

             }*/
        } else {
            //left arrow click
            let option = this.elSelectField.nativeElement.options;
            for (let l of option)
                if (l.selected) {
                    let v: any = this.findField(l.value);
                    v.inOutFlag = "I";
                    this.config.currentFunction.leftVariables.push(v);
                    this.config.currentFunction.rightVariables
                        .splice(this.findSelectedVariable(v.name), 1);
                }
        }
    }
    findField(v: any): any {
        for (let f of this.config.currentFunction.allVariables)
            if (f.name === v)
                return f;
        return null;

    }
    findVariableList(nm: string): number {
        for (let i: number = 0; i < this.config.currentFunction.leftVariables.length; i++)
            if (nm === this.config.currentFunction.leftVariables[i].name)
                return i;
        return -1;
    }
    findSelectedVariable(nm: string) {
        for (let i: number = 0; i < this.config.currentFunction.rightVariables.length; i++)
            if (nm === this.config.currentFunction.rightVariables[i].name)
                return i;
        return -1;
    }
}
