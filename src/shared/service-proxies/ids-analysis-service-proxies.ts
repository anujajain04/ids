import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Injectable, Inject, Optional, OpaqueToken } from '@angular/core';
import { Http, Headers, Response, RequestOptionsArgs } from '@angular/http';
import { TokenService } from '@abp/auth/token.service';
import { TempBaseUrl, LoadingService, SubDatasetDto, DatasetFieldDto, DatasetResultModel } from '@shared/service-proxies/ids-service-proxies';
import { FormControl, FormGroup, Validators } from '@angular/forms';
// all API request for ids
@Injectable()
export class AnalysisService {
    static isAnalysisPage: boolean = false;
    private http: Http = null;
    protected jsonParseReviver: (key: string, value: any) => any = undefined;
    constructor( @Inject(Http) http: Http, private _session: TokenService, private load: LoadingService) {
        this.http = http;
    }
    getTemplateDatasetList(): Observable<Writer[]> {
        const _content = JSON.stringify({
            className: "RDBMS"
        });
        return this.http.request(TempBaseUrl.BASE_URL + "datasets/getDatasetListforTemplate/", {
            body: _content,
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            //alert(response.text());
            return this.processTemplateDatasetList(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processTemplateDatasetList(response));
                } catch (e) {
                    return <Observable<Writer[]>><any>Observable.throw(e);
                }
            } else
                return <Observable<Writer[]>><any>Observable.throw(response);
        });
    }
    protected processTemplateDatasetList(response: Response): Writer[] {
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: Writer[] = [];
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver)
            for (let r of result200['datasetList']) {
                let d = Writer.fromJS(r);
                result.push(d);
            }
            return result;
        }
        return null;
    }
    create(value: any): Observable<AnalysisResult> {
        return this.http.request(TempBaseUrl.BASE_URL + "analysis/", {
            body: value,
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processCreateAnalsis(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processCreateAnalsis(response));
                } catch (e) {
                    return <Observable<AnalysisResult>><any>Observable.throw(e);
                }
            } else
                return <Observable<AnalysisResult>><any>Observable.throw(response);
        });
    }
    protected processCreateAnalsis(response: Response): AnalysisResult {
        debugger;
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: AnalysisResult;
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            result = AnalysisResult.fromJS(result200);
            return result;
        }
        return null;
    }
    getModelForAnalysis(key: any): Observable<any> {
        return this.http.request(TempBaseUrl.BASE_URL + "models/" + key + "/getModelProcessingInstance", {
            method: "get",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return JSON.parse(response.text());
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(JSON.parse(response.text()));
                } catch (e) {
                    return <Observable<any>><any>Observable.throw(e);
                }
            } else
                return <Observable<any>><any>Observable.throw(response);
        });
    }
    updateAnalysis(key: string, value: any): Observable<AnalysisResult> {
        debugger;
        return this.http.request(TempBaseUrl.BASE_URL + "analysis/" + key, {
            body: value,
            method: "put",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processCreateAnalsis(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processCreateAnalsis(response));
                } catch (e) {
                    return <Observable<AnalysisResult>><any>Observable.throw(e);
                }
            } else
                return <Observable<AnalysisResult>><any>Observable.throw(response);
        });
    }
    update(key: string, value: any): Observable<AnalysisResult> {
        return this.http.request(TempBaseUrl.BASE_URL + "analysis/" + key, {
            body: value,
            method: "put",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processCreateAnalsis(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processCreateAnalsis(response));
                } catch (e) {
                    return <Observable<AnalysisResult>><any>Observable.throw(e);
                }
            } else
                return <Observable<AnalysisResult>><any>Observable.throw(response);
        });
    }
    getSidePane1(input: any): Observable<any[]> {
        //const _content = JSON.stringify({
        //    workspaceKey: TempBaseUrl.WORKSPACEKEY,
        //    sessionKey: this._session.getToken()
        //});
        debugger
        return this.http.request(TempBaseUrl.BASE_URL + "analysis/getTaskPaneListAnalysis/", {
            body: input,
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            return this.processDatasetCount(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processDatasetCount(response));
                } catch (e) {
                    return <Observable<any[]>><any>Observable.throw(e);
                }
            } else
                return <Observable<any[]>><any>Observable.throw(response);
        });
    }
    protected processDatasetCount(response: Response): any[] {
        debugger
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: any[] = [];
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            if (result200["taskAnalysisList"]["functions"] && result200["taskAnalysisList"]["functions"].constructor === Array) {
                for (let x of result200["taskAnalysisList"]["functions"]) {
                    result.push(TaskDto.fromJS(x));
                }
            }
            if (result200["taskAnalysisList"]["models"] && result200["taskAnalysisList"]["models"].constructor === Array) {
                for (let x of result200["taskAnalysisList"]["models"]) {
                    result.push(TaskModel.fromJS(x));
                }
            }
            if (result200["taskAnalysisList"]["writer"] && result200["taskAnalysisList"]["writer"].constructor === Array) {
                for (let x of result200["taskAnalysisList"]["writer"]) {
                    result.push(Writer.fromJS(x));
                }
            }
            if (result200["taskAnalysisList"]["reader"]) {
                result.push(Reader.fromJS(result200["taskAnalysisList"]["reader"]));

            }
            return result;
        }
        return null;
    }

    getAnalysisList(input: string): Observable<AnalysisDtoDetails[]> {
        debugger;
        return this.http.request(TempBaseUrl.BASE_URL + "analysis/" + input + "/getAnalaysisList/", {
            method: "get",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processAnalysisList(response);
        }).catch((response: any, caught: any) => {
            debugger;
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processAnalysisList(response));
                } catch (e) {
                    return <Observable<AnalysisDtoDetails[]>><any>Observable.throw(e);
                }
            } else
                return <Observable<AnalysisDtoDetails[]>><any>Observable.throw(response);
        });
    }
    protected processAnalysisList(response: Response): AnalysisDtoDetails[] {
        debugger;
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: AnalysisDtoDetails[] = [];
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            if (result200["analysisList"] && result200["analysisList"].constructor === Array) {
                let p = result200["analysisList"];
                for (let item of p) {
                    result.push(AnalysisDtoDetails.fromJS(item));
                }
                return result;
            }
        }
        return null;
    }
    getPollingfunctionality(input: string): Observable<any> {

        return this.http.request(TempBaseUrl.BASE_URL + "analysis/" + input + "/getAnalysisStatus/", {
            method: "get",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {

            return JSON.parse(response.text());
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(JSON.parse(response.text()));
                } catch (e) {
                    return <Observable<any>><any>Observable.throw(e);
                }
            } else
                return <Observable<any>><any>Observable.throw(response);
        });
    }


    abortAnalysis(input: string): Observable<any> {
        debugger;
        return this.http.request(TempBaseUrl.BASE_URL + "analysis/" + input + "/abortAnalysis/", {
            method: "get",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            //abp.notify.success(response.text())
            return JSON.parse(response.text());
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(JSON.parse(response.text()));
                } catch (e) {
                    return <Observable<any>><any>Observable.throw(e);
                }
            } else
                return <Observable<any>><any>Observable.throw(response);
        });
    }
    //protected processAbortAnalysis(response: Response): DatasetResultModel {
    //    const responseText = response.text();
    //    const status = response.status;
    //    if (status === 200) {
    //        let result: DatasetResultModel = null;
    //        let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver)
    //        result = DatasetResultModel.fromJS(result200, null);
    //        return result;
    //    }
    //    return null;
    //}

    runAnalysis(input: string): Observable<DatasetResultModel> {

        return this.http.request(TempBaseUrl.BASE_URL + "analysis/" + input + "/AnalysisRun/", {
            method: "get",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {

            return this.processRunAnalysis(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processRunAnalysis(response));
                } catch (e) {
                    return <Observable<DatasetResultModel>><any>Observable.throw(e);
                }
            } else
                return <Observable<DatasetResultModel>><any>Observable.throw(response);
        });
    }
    protected processRunAnalysis(response: Response): DatasetResultModel {
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: DatasetResultModel = null;
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver)
            result = DatasetResultModel.fromJS(result200, null);
            return result;
        }
        return null;
    }

    //chartAanalysis(input: string): Observable<chartAnalysisdto[]> {
    //    return this.http.request(TempBaseUrl.BASE_URL + "chart/" + input + "/AnalysisRun/", {
    //        method: "get",
    //        headers: new Headers({
    //            "Content-Type": "application/json; charset=UTF-8",
    //            "Accept": "application/json; charset=UTF-8"
    //        })
    //    }).map((response) => {
    //            return this.processChartAnalysis(response);
    //    }).catch((response: any, caught: any) => {
    //        if (response instanceof Response) {
    //            try {
    //                return Observable.of(this.processRunAnalysis(response));
    //            } catch (e) {
    //                return <Observable<chartAnalysisdto>><any>Observable.throw(e);
    //            }
    //        } else
    //            return <Observable<chartAnalysisdto>><any>Observable.throw(response);
    //    });
    //}
    //protected processChartAnalysis(response: Response): chartAnalysisdto[] {
    //    debugger;
    //    const responseText = response.text();
    //    const status = response.status;
    //    if (status === 200) {
    //        let result: chartAnalysisdto[] = [];
    //        let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
    //        if (result200["json"] && result200["json"].constructor === Array) {
    //            let p = result200["json"];
    //            for (let item of p) {
    //                result.push(chartAnalysisdto.fromJS(item));
    //            }
    //            return result;
    //        }
    //    }
    //    return null;
    //}


    deleteAnalysis(input: string): Observable<DatasetResultModel> {

        return this.http.request(TempBaseUrl.BASE_URL + "analysis/" + input + "/", {
            method: "delete",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {

            return this.processDeleteAnalysis(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processDeleteAnalysis(response));
                } catch (e) {
                    return <Observable<DatasetResultModel>><any>Observable.throw(e);
                }
            } else
                return <Observable<DatasetResultModel>><any>Observable.throw(response);
        });
    }
    protected processDeleteAnalysis(response: Response): DatasetResultModel {
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: DatasetResultModel = null;
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver)
            result = DatasetResultModel.fromJS(result200, null);
            return result;
        }
        return null;
    }


    analysisRunLog(input: string): Observable<AnalysisRunLogDetails[]> {
        debugger;
        return this.http.request(TempBaseUrl.BASE_URL + "analysis/" + input + "/viewAnalysisRunLog/", {
            method: "get",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processAnalysisRunLog(response);
        }).catch((response: any, caught: any) => {
            debugger;
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processAnalysisRunLog(response));
                } catch (e) {
                    return <Observable<AnalysisRunLogDetails[]>><any>Observable.throw(e);
                }
            } else
                return <Observable<AnalysisRunLogDetails[]>><any>Observable.throw(response);
        });
    }
    protected processAnalysisRunLog(response: Response): AnalysisRunLogDetails[] {
        debugger;
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: AnalysisRunLogDetails[] = [];
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            if (result200["statusMessage"] && result200["statusMessage"].constructor === Array) {
                let p = result200["statusMessage"];
                for (let item of p) {
                    result.push(AnalysisRunLogDetails.fromJS(item));
                }
                return result;
            }
        }
        return null;
    }

    getChartForAnalysis(input: string): Observable<AnalysisChart> {
        debugger;
        return this.http.request(TempBaseUrl.BASE_URL + "chart/" + input, {
            method: "get",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processChartAnalysis(response);
        }).catch((response: any, caught: any) => {
            debugger;
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processChartAnalysis(response));
                } catch (e) {
                    return <Observable<AnalysisChart>><any>Observable.throw(e);
                }
            } else
                return <Observable<AnalysisChart>><any>Observable.throw(response);
        });
    }
    protected processChartAnalysis(response: Response): AnalysisChart {
        debugger;
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: AnalysisChart;
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            result = AnalysisChart.fromJS(result200["chartJson"]);
            return result;
        }
        return null;
    }

    getAnalysisHistory(input: any, key: string): Observable<AnalysisModelHistory[]> {
        debugger;
        return this.http.request(TempBaseUrl.BASE_URL + "analysis/" + key + "/getAnalysisHistory/", {
            method: "post",
            body: input,
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processAnalysisHistory(response);
        }).catch((response: any, caught: any) => {
            debugger;
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processAnalysisHistory(response));
                } catch (e) {
                    return <Observable<AnalysisModelHistory[]>><any>Observable.throw(e);
                }
            } else
                return <Observable<AnalysisModelHistory[]>><any>Observable.throw(response);
        });
    }
    protected processAnalysisHistory(response: Response): AnalysisModelHistory[] {
        debugger;
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: AnalysisModelHistory[] = [];
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            if (result200["historyData"] && result200["historyData"].constructor === Array) {
                let p = result200["historyData"];
                for (let item of p) {
                    result.push(AnalysisModelHistory.fromJS(item));
                }
                return result;
            }
        }
        return null;
    }

    algorithmlist(input: string): Observable<AlgorithmList[]> {
        return this.http.request(TempBaseUrl.BASE_URL + "algorithm/" + input + "/getAlgorithmList/", {
            method: "get",
            headers: new Headers({
                "Content-Type": "application/json;charset=UTF-8",
                "Accept": "application/json;charset=UTF-8"
            })
        }).map((response) => {
            return this.processalgorithmlist(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processalgorithmlist(response));
                } catch (e) {
                    return <Observable<AlgorithmList[]>><any>Observable.throw(e);
                }
            } else
                return <Observable<AlgorithmList[]>><any>Observable.throw(response);
        })

    }

    protected processalgorithmlist(response: Response): AlgorithmList[] {
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: AlgorithmList[] = [];
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            if (result200["algorithmlist"] && result200.constructor === Array) {
                for (let item of result200["algorithmlist"]) {
                    result.push(AlgorithmList.fromJS(item));
                }
                return result;
            }
        }
        return null;
    }
    editAnalysis(value: any): Observable<CreateAnalysisDto> {
        return this.http.request(TempBaseUrl.BASE_URL + "analysis/" + value + "/", {
            method: "get",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            return this.processalEditAnalysis(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processalEditAnalysis(response));
                } catch (e) {
                    return <Observable<CreateAnalysisDto>><any>Observable.throw(e);
                }
            } else
                return <Observable<CreateAnalysisDto>><any>Observable.throw(response);
        });
    }
    protected processalEditAnalysis(response: Response): CreateAnalysisDto {
        debugger;
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            if (result200["analysisDetails"]) {
                return CreateAnalysisDto.fromJS(result200["analysisDetails"]);
            }
        }
        return null;
    }
}
@Injectable()
export class AnalysisStudioConfig {
    analysisRunningStatus: boolean = false;
    isEdit: boolean = false;
    createResult: AnalysisResult = new AnalysisResult();
    finalAnalysis: CreateAnalysisDto;
    updateFinalAnalysis: CreateAnalysisDto;
    taskType: TaskType = null;
    currentReader: Reader = new Reader();
    currentCleanser: TaskDto = new TaskDto();
    currentSampler: TaskDto = new TaskDto();
    currentFunction: TaskDto = new TaskDto();
    currentModel: TaskModel = new TaskModel();
    currentWriter: Writer = new Writer();
    currentPosition: number = 0;
    taskElements: any[] = [];
    datasetkeyForAnalysis: string;
    clearAll() {
        this.analysisRunningStatus = false;
        this.isEdit = false;
        this.createResult = new AnalysisResult();
        this.finalAnalysis = new CreateAnalysisDto();
        this.updateFinalAnalysis = null;
        this.taskType = null;
        this.currentCleanser = null;
        this.currentFunction = null;
        this.currentModel = null;
        this.currentPosition = 0;
        this.currentReader = null;
        this.currentWriter = null;
        this.taskElements = [];
        this.datasetkeyForAnalysis = null;
    }
}
export class TaskDto {
    id: number = 0;
    tType: string;
    className: string;
    operationClass: string;
    definateOprVar: boolean;
    entityName: string;
    cleanseText: Variables = new Variables(0, "", "", "", "", "", "", false);
    classText: Variables = new Variables(0, "", "", "", "", "", "", false);
    entityType: string;
    inputOprVarSameAsOutputOprVarFlag: boolean;
    taskType: TaskType;
    entityKey: string;
    entityDescription: string;
    functionCategory1: string;
    functionCategory2: string;
    functionCategory3: string;
    functionCategory4: string;
    reqOprInputVarNumSelection: boolean;
    inputVarCarryFwdFlag: boolean;
    ///required form fields
    textTocleanse: Variables[];
    numberPercentageFlag: string = "number";
    sampleNumber: string;
    samplePercentage: string;
    excludePanctuation: string = "";
    fileOrTextStopwordsFlag: string = "text";
    stopwordsList: string = "";
    selectedField: DatasetFieldDto[] = [];
    fields: DatasetFieldDto[] = [];
    defaultFlag: boolean;
    // required fields
    noOfWords: string = "";
    noOfPhrase: string = "";
    partOfSpeech: string = "";
    noOfCluster: string = "";
    noOfIteration: string = "";
    noOfIterations: string = "";
    preCompute: string = "";
    initializeMethod: string = "";
    linkageMetric: string = "";
    linkageCriteria: string = "";
    thresold: string = "";
    bracingFactor: string = "";
    leafSize: string = "";
    selectedFieldItem: any;
    tolerance: string = "";
    testDatasetId: string = "";
    testDatasetName: string = "";
    testSubDatasetId: string = "";
    filePath: string = "NA";
    algorithmTypeKey_id: string;
    variableList: Variables[] = [];
    selectedVariable: Variables[] = [];
    allVariables: Variables[] = [];
    //swapping list while selecting variables
    leftVariables: Variables[] = [];
    rightVariables: Variables[] = [];
    operationalVariables: Variables[] = [];
    taskProperties: TaskProperties;
    mapping: Mapping[] = [];
    inputMapping: Mapping[] = []
    //////Madhura///////
    correlationType: string = "";
    //////Kanchan//////////////
    //Step 1 : Adding Varables to Task DTO
    //Normalization
    normalizationMetric: string = "";
    inPlaceRowNormalization: boolean;
    //KNN Clustering
    noOfNeighbours: string = "";
    nearestNeighbourComputationTechnique: string;
    //Scale/Standardization
    unitStandardDeviation: boolean
    withMean: boolean
    // Linear Regression
    //SVM Classification
    //maxNoOfIterations:string=""
    //SVM Regression
    kernalType: string = ""
    //KNN Classification
    //All variables already Declared in KNN Clustering
    //Logistic Regresssion
    optimizationTechnique: string
    multiclassTechnique: string
    ////////////---------Step 1 Ends-----Kanchan ----------------


    //////
    constructor(data?: any) {
        // debugger;
        //this.selectedFieldItem.entityName
        if (data !== undefined) {
            this.className = data["className"] !== undefined ? data["className"] : "";
            this.algorithmTypeKey_id = data["algorithmTypeKey_id"] !== undefined ? data["algorithmTypeKey_id"] : "";
            this.operationClass = data["operationClass"] !== undefined ? data["operationClass"] : "";
            this.definateOprVar = data["definateOprVar"] !== undefined ? data["definateOprVar"] : null;
            this.entityName = data["entityName"] !== undefined ? data["entityName"] : null;
            this.tType = data["className"] !== undefined ? data["className"] : this.operationClass;
            this.entityType = data["entityType"] !== undefined ? data["entityType"] : null;
            this.inputOprVarSameAsOutputOprVarFlag = data["inputOprVarSameAsOutputOprVarFlag"] !== undefined ? data["inputOprVarSameAsOutputOprVarFlag"] : null;
            if (data["entityType"] !== undefined)
                if ((<string>data["entityType"]).toLowerCase() === "cleanser")
                    this.taskType = TaskType.CLEANSER;
                else if ((<string>data["entityType"]).toLowerCase() === "sampler")
                    this.taskType = TaskType.SAMPLER;
                else if ((<string>data["entityType"]).toLowerCase() === "function")
                    this.taskType = TaskType.FUNCTION;
                else this.taskType = null;
            this.entityKey = data["entityKey"] !== undefined ? data["entityKey"] : null;
            this.entityDescription = data["entityDescription"] !== undefined ? data["entityDescription"] : null;
            this.functionCategory1 = data["functionCategory1"] !== undefined ? data["functionCategory1"] : null;
            this.functionCategory2 = data["functionCategory2"] !== undefined ? data["functionCategory2"] : null;
            this.functionCategory3 = data["functionCategory3"] !== undefined ? data["functionCategory3"] : null;
            this.functionCategory4 = data["functionCategory4"] !== undefined ? data["functionCategory4"] : null;
            this.reqOprInputVarNumSelection = data["reqOprInputVarNumSelection"] !== undefined ? data["reqOprInputVarNumSelection"] : null;
            this.inputVarCarryFwdFlag = data["inputVarCarryFwdFlag"] !== undefined ? data["inputVarCarryFwdFlag"] : null;
            this.bracingFactor = data["bracingFactor"] !== undefined ? data["bracingFactor"] : "";
            this.definateOprVar = data["definateOprVar"] !== undefined ? data["definateOprVar"] : "";
            this.excludePanctuation = data["excludePanctuation"] !== undefined ? data["excludePanctuation"] : "";
            this.fileOrTextStopwordsFlag = data["fileOrTextStopwordsFlag"] !== undefined ? data["fileOrTextStopwordsFlag"] : "";
            this.filePath = data["filePath"] !== undefined ? data["filePath"] : "";
            this.functionCategory1 = data["functionCategory1"] !== undefined ? data["functionCategory1"] : "";
            this.functionCategory2 = data["functionCategory2"] !== undefined ? data["functionCategory2"] : "";
            this.functionCategory3 = data["functionCategory3"] !== undefined ? data["functionCategory3"] : "";
            this.functionCategory4 = data["functionCategory4"] !== undefined ? data["functionCategory4"] : "";
            this.initializeMethod = data["initilizationMethod"] !== undefined ? data["initilizationMethod"] : "";
            this.inputOprVarSameAsOutputOprVarFlag = data["inputOprVarSameAsOutputOprVarFlag"] !== undefined ? data["inputOprVarSameAsOutputOprVarFlag"] : null;
            this.inputVarCarryFwdFlag = data["inputVarCarryFwdFlag"] !== undefined ? data["inputVarCarryFwdFlag"] : null;
            this.defaultFlag = data["defaultFlag"] !== undefined ? data["defaultFlag"] : null;
            this.leafSize = data["leafSize"] !== undefined ? data["leafSize"] : "";
            this.linkageCriteria = data["linkageCriterias"] !== undefined ? data["linkageCriterias"] : "";
            this.linkageMetric = data["linkageMetrics"] !== undefined ? data["linkageMetrics"] : "";
            this.noOfCluster = data["numberOfClusters"] !== undefined ? data["numberOfClusters"] : "";
            this.noOfIterations = data["noOfIterations"] !== undefined ? data["noOfIterations"] : "";
            this.noOfPhrase = data["numberOfPhrases"] !== undefined ? data["numberOfPhrases"] : "";
            this.noOfWords = data["numberOfWords"] !== undefined ? data["numberOfWords"] : "";
            this.numberPercentageFlag = data["numberPercentageFlag"] !== undefined ? data["numberPercentageFlag"] : "number";
            this.partOfSpeech = data["partOfSpeech"] !== undefined ? data["partOfSpeech"] : "";
            this.preCompute = data["preComputeDistance"] !== undefined ? data["preComputeDistance"] : "";
            this.reqOprInputVarNumSelection = data["reqOprInputVarNumSelection"] !== undefined ? data["reqOprInputVarNumSelection"] : null;
            this.sampleNumber = data["sampleNumber"] !== undefined ? data["sampleNumber"] : "";
            this.samplePercentage = data["samplePercentage"] !== undefined ? data["samplePercentage"] : "";
            this.thresold = data["thresold"] !== undefined ? data["thresold"] : "";
            this.tolerance = data["toleranceValue"] !== undefined ? data["toleranceValue"] : "";
            if (data["stopwordsList"] && data["stopwordsList"].constructor === Array) {
                for (let x of data["stopwordsList"])
                    this.stopwordsList += x + ",";
            }
            //Step 2: Addition of Variables in Constructor -------Kanchan -------------
            this.normalizationMetric = data["normalizationMetric"] !== undefined ? data["normalizationMetric"] : "";
            this.inPlaceRowNormalization = data["inPlaceRowNormalization"] !== undefined ? data["inPlaceRowNormalization"] : "";
            this.noOfNeighbours = data["noOfNeighbours"] !== undefined ? data["noOfNeighbours"] : "";
            this.nearestNeighbourComputationTechnique = data["nearestNeighbourComputationTechnique"] !== undefined ? data["nearestNeighbourComputationTechnique"] : "";
            this.unitStandardDeviation = data["unitStandardDeviation"] !== undefined ? data["unitStandardDeviation"] : "";
            this.withMean = data["withMean"] !== undefined ? data["withMean"] : "";
            // this.maxNoOfIterations = data["maxNoOfIterations"] !== undefined ? data["maxNoOfIterations"] : "";
            this.kernalType = data["kernalType"] !== undefined ? data["kernalType"] : "";
            this.optimizationTechnique = data["optimizationTechnique"] !== undefined ? data["optimizationTechnique"] : "";
            this.multiclassTechnique = data["multiclassTechnique"] !== undefined ? data["multiclassTechnique"] : "";
            ////Madhura//////////
          this.correlationType = data["correlationType"] !== undefined ? data["correlationType"] : "";
        }
    }
    clone(): any {
        var cloneObj = new (<any>this.constructor());
        for (var attribut in this) {
            if (typeof this[attribut] === "object") {
                cloneObj[attribut] = this.clone();
            } else {
                cloneObj[attribut] = this[attribut];
            }
        }
        return cloneObj;
    }
    get compare() {
        if (this.taskType === TaskType.CLEANSER)
            return this.entityKey + "Cleanser" + this.id;
        else if (this.taskType === TaskType.FUNCTION)
            return this.entityKey + "Function" + this.id;
        else if (this.taskType === TaskType.SAMPLER)
            return this.entityKey + "Sampler" + this.id;
    }
    static fromJS(data: any): TaskDto {
        return new TaskDto(data);
    }
    //create json object for same class
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["entityKey"] = this.entityKey !== undefined ? this.entityKey : "";
        data["testDatasetId"] = this.testDatasetId !== undefined ? this.testDatasetId : "";
        data["testDatasetName"] = this.testDatasetName !== undefined ? this.testDatasetName : "";
        data["operationClass"] = this.className !== undefined ? this.className : "";
        data["testSubDatasetId"] = this.testSubDatasetId !== undefined ? this.testSubDatasetId : "";
        if (this.taskType === TaskType.SAMPLER) {
            data["samplerType"] = this.tType !== undefined ? this.tType : "";
            data["numberPercentageFlag"] = this.numberPercentageFlag !== undefined ? this.numberPercentageFlag : "";
            if (this.numberPercentageFlag === "number") {
                this.samplePercentage = "";
            } else this.sampleNumber = "";
            data["sampleNumber"] = this.sampleNumber !== undefined ? this.sampleNumber : "";
            data["samplePercentage"] = this.samplePercentage !== undefined ? this.samplePercentage : "";
        } else if (this.taskType === TaskType.CLEANSER) {
            data["cleanserType"] = this.tType !== undefined ? this.tType : "";
            data["filePath"] = this.filePath !== undefined ? this.filePath : "";
            if (this.className === "CustomStopwordRemover") {
                data["stopwordsList"] = [];
                for (let s of this.stopwordsList.split(","))
                    data["stopwordsList"].push(s);
                data["fileOrTextStopwordsFlag"] = this.fileOrTextStopwordsFlag !== undefined ? this.fileOrTextStopwordsFlag : "";
            } else if (this.className === "PunctuationRemover") {
                data["excludePanctuation"] = this.excludePanctuation !== undefined ? this.excludePanctuation : "";
                data["customizationDoneFlag"] = "false";
            }
        } else if (this.taskType === TaskType.FUNCTION) {
            if (this.className === "WordToWordCorrelationAnalysis") {
                data["correlationType1"] = "word";
                data["correlationType2"] = "word";
                data["correlationPos1"] = "null";
                data["correlationPos2"] = "null";
                data["numberOfWords"] = this.noOfWords !== undefined ? this.noOfWords : "";
                data["numberOfPhrases"] = this.noOfPhrase !== undefined ? this.noOfPhrase : "";
            }
            if (this.className === "PhraseToPhraseCorrelationAnalysis") {
                data["correlationType1"] = "phrase";
                data["correlationType2"] = "phrase";
                data["correlationPos1"] = "null";
                data["correlationPos2"] = "null";
                data["numberOfPhrases"] = this.noOfPhrase !== undefined ? this.noOfPhrase : "";
            }
            if (this.className === "WordToPhraseCorrelationAnalysis") {
                data["correlationType1"] = "word";
                data["correlationType2"] = "phrase";
                data["correlationPos1"] = "null";
                data["correlationPos2"] = "null";
                data["numberOfWords"] = this.noOfWords !== undefined ? this.noOfWords : "";
                data["numberOfPhrases"] = this.noOfPhrase !== undefined ? this.noOfPhrase : "";
            }
            if (this.className === "CentroidAlgorithm") {
                data["preComputeDistance"] = this.preCompute !== undefined ? this.preCompute : "";
                data["initilizationMethod"] = this.initializeMethod !== undefined ? this.initializeMethod : "";
                data["numberOfIterations"] = this.noOfIterations !== undefined ? this.noOfIterations : "";
                data["numberOfClusters"] = this.noOfCluster !== undefined ? this.noOfCluster : "";
                data["toleranceValue"] = this.tolerance !== undefined ? this.tolerance : "";
            }
            if (this.className === "DensityAlgorithm" || "SKDensityAlgorithm") {
                data["leafSize"] = this.leafSize !== undefined ? this.leafSize : "";
            }
            if (this.className === "ConnectivityAlgorithm") {
                data["linkageMetrics"] = this.linkageMetric !== undefined ? this.linkageMetric : "";
                data["linkageCriterias"] = this.linkageCriteria !== undefined ? this.linkageCriteria : "";
                data["numberOfClusters"] = this.noOfCluster !== undefined ? this.noOfCluster : "";
            }
            if (this.className === "IncrementalAlgorithm") {
                data["threshold"] = this.thresold !== undefined ? this.thresold : "";
                data["branchingFactor"] = this.bracingFactor !== undefined ? this.bracingFactor : "";
                data["numberOfClusters"] = this.noOfCluster !== undefined ? this.noOfCluster : "";
            }
            if (this.className === "BasicFrequencyAlgorithm") {
                data["frequencyType"] = "Word";
                data["frequencyPOS"] = "Basic";
                data["numberOfWords"] = this.noOfWords !== undefined ? this.noOfWords : "";
            } else if (this.className === "AdjectiveFrequencyAlgorithm") {
                data["frequencyType"] = "Word";
                data["frequencyPOS"] = "Adjective";
            } else if (this.className === "VerbFrequencyAlgorithm") {
                data["frequencyType"] = "Word";
                data["frequencyPOS"] = "Verb";
            } else if (this.className === "NounFrequencyAlgorithm") {
                data["frequencyType"] = "Word";
                data["frequencyPOS"] = "Noun";
            }
            //Step 3 : JSON Generation ---------Kanchan
            if (this.className === "SKScale") {

                data["inPlaceRowNormalization"] = this.inPlaceRowNormalization !== undefined ? this.inPlaceRowNormalization : false;
                data["unitStandardDeviation"] = this.unitStandardDeviation !== undefined ? this.unitStandardDeviation : false;
                data["withMean"] = this.withMean !== undefined ? this.withMean : false;

            }
            else if (this.className === "SKNormalization") {
                data["normalizationMetric"] = this.normalizationMetric !== undefined ? this.normalizationMetric : "";
                data["inPlaceRowNormalization"] = this.inPlaceRowNormalization !== undefined ? this.inPlaceRowNormalization : false;

            }
            else if (this.className === "SKKNNClustering") {
                data["noOfNeighbours"] = this.noOfNeighbours !== undefined ? this.noOfNeighbours : "";
                data["nearestNeighbourComputationTechnique"] = this.nearestNeighbourComputationTechnique !== undefined ? this.nearestNeighbourComputationTechnique : "";

            }
            else if (this.className === "SKLinearRegression") {

            }
            else if (this.className === "SKSVMClassification") {
                data["tolerance"] = this.tolerance !== undefined ? this.tolerance : "";
                data["noOfIterations"] = this.noOfIterations !== undefined ? this.noOfIterations : "";
            }
            else if (this.className === "SKSVMRegression") {
                data["tolerance"] = this.tolerance !== undefined ? this.tolerance : "";
                data["noOfIterations"] = this.noOfIterations !== undefined ? this.noOfIterations : "";
                data["kernalType"] = this.kernalType !== undefined ? this.kernalType : "";

            }
            else if (this.className === "SKLogisticRegression") {
                data["tolerance"] = this.tolerance !== undefined ? this.tolerance : "";
                data["multiclassTechnique"] = this.multiclassTechnique !== undefined ? this.multiclassTechnique : "";
                data["optimizationTechnique"] = this.optimizationTechnique !== undefined ? this.optimizationTechnique : "";

            }
            else if (this.className === "SKKNNClassification") {
                data["noOfNeighbours"] = this.noOfNeighbours !== undefined ? this.noOfNeighbours : "";
                data["nearestNeighbourComputationTechnique"] = this.nearestNeighbourComputationTechnique !== undefined ? this.nearestNeighbourComputationTechnique : "";

            }
            else if (this.className === "CorrelationStatsAnalysis") {
              data["correlationType"] = this.correlationType !== undefined ? this.correlationType : "";
            }
            else if (this.className === "SKCentroidAlgorithm"|| "SKConnectivityAlgorithm") {
              data["numberOfClusters"] = this.noOfCluster !== undefined ? this.noOfCluster : "";
            }
        }
        return data;
    }
    toJSON() {
        return JSON.stringify(this.toJS());
    }
}
export class TaskModel {
    id: number = 0;
    selectMap: string[] = [];
    processing: any;
    processId: string;
    lastRunDate: string;
    entityName: string;
    entityType: string;
    Results: TaskModelResult;
    taskType: TaskType;
    modelType: string;
    entityKey: string;
    className: string;
    entityDescription: string;
    runFlag: string;
    parentKey: string;
    readyFlag: string;
    operationClass: string;
    selectedField: DatasetFieldDto[] = [];
    fields: DatasetFieldDto[] = [];
    cleanseText: Variables = new Variables(0, "", "", "", "", "", "", false);
    classText: Variables = new Variables(0, "", "", "", "", "", "", false);
    selectedFieldItem: any;
    noOfIteration: string = "";
    modelVariable: Variables[] = [];
    //swapping list while selecting variables
    leftVariables: Variables[] = [];
    rightVariables: Variables[] = [];
    variableList: Variables[] = [];
    selectedVariable: Variables[] = [];
    allVariables: Variables[] = [];
    taskProperties: TaskProperties;
    mapping: Mapping[] = [];
    inputMapping: any[] = [];
    operationalVariables: Variables[] = [];
    // processing =[]
    // static flagsrue
    inputVarCarryFwdFlag: boolean = true;
    definateOprVar: boolean = true;
    reqOprInputVarNumSelection: boolean = false;
    inputOprVarSameAsOutputOprVarFlag: boolean = false;
    constructor(data?: any) {
        debugger;
        if (data !== undefined) {

            this.processId = data["processId"] !== undefined ? data["processId"] : null;
            this.operationClass = data["operationClass"] !== undefined ? data["operationClass"] : null;
            this.lastRunDate = data["lastRunDate"] !== undefined ? data["lastRunDate"] : null;
            this.entityName = data["entityName"] !== undefined ? data["entityName"] : null;
            this.entityType = data["entityType"] !== undefined ? data["entityType"] : null;
            this.Results = TaskModelResult.fromJS(data["Results"]);
            this.modelType = data["modelType"] !== undefined ? data["modelType"] : null;
            this.entityKey = data["entityKey"] !== undefined ? data["entityKey"] : null;
            this.className = data["className"] !== undefined ? data["className"] : null;
            this.entityDescription = data["entityDescription"] !== undefined ? data["entityDescription"] : null;
            this.runFlag = data["runFlag"] !== undefined ? data["runFlag"] : null;
            this.readyFlag = data["readyFlag"] !== undefined ? data["readyFlag"] : null;
            this.modelVariable = data["modelVariable"] !== undefined ? data["modelVariable"] : null;
        }
    }
    clone(): any {
        var cloneObj = new (<any>this.constructor());
        for (var attribut in this) {
            if (typeof this[attribut] === "object") {
                cloneObj[attribut] = this.clone();
            } else {
                cloneObj[attribut] = this[attribut];
            }
        }
        return cloneObj;
    }
    get compare() {
        return this.entityKey + "Model" + this.id;
    }
    static fromJS(data: any): TaskModel {
        return new TaskModel(data);
    }

    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["operationClass"] = this.className !== undefined ? this.className : "";
        data["entityKey"] = this.entityKey !== undefined ? this.entityKey : "";
        // data["modelVariable"] = this.modelVariable !== undefined ? this.modelVariable : "";
        data["proccessingTasks"] = this.processing !== undefined ? this.processing.Tasks : "";
        return data;
    }
}
export class TaskModelResult {
    recall: string;
    autoFlag: string;
    precision: string;
    accuracy: string;
    accuracyIteration2: string;
    fScore: TaskType;
    modelType: string;
    accuracyIteration1: string;
    constructor(data?: any) {
        // debugger;
        if (data !== undefined) {
            this.recall = data["recall"] !== undefined ? data["recall"] : null;
            this.autoFlag = data["autoFlag"] !== undefined ? data["autoFlag"] : null;
            this.precision = data["precision"] !== undefined ? data["precision"] : null;
            this.accuracy = data["accuracy"] !== undefined ? data["accuracy"] : null;
            this.accuracyIteration2 = data["accuracyIteration2"] !== undefined ? data["accuracyIteration2"] : null;
            this.fScore = data["fScore"] !== undefined ? data["fScore"] : null;
            this.accuracyIteration1 = data["accuracyIteration1"] !== undefined ? data["accuracyIteration1"] : null;
        }
    }
    clone(): any {
        var cloneObj = new (<any>this.constructor());
        for (var attribut in this) {
            if (typeof this[attribut] === "object") {
                cloneObj[attribut] = this.clone();
            } else {
                cloneObj[attribut] = this[attribut];
            }
        }
        return cloneObj;
    }
    static fromJS(data: any): TaskModelResult {
        return new TaskModelResult(data);
    }
    //create json object for same class
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        return data;
    }
    toJSON() {
        return JSON.stringify(this.toJS());
    }
}
export class Writer {
    id: number = 0;
    operationClass: string;
    connectionString: string;
    entityName: string;
    analysis: string;
    entityType: string;
    entityKey: string;
    className: string;
    entityDescription: string;
    parentKey: string;
    userName: string;
    password: string;
    driverKey: string;
    serverName: string;
    databaseName: string;
    subDatasets: SubDatasetDto[] = [];
    template: any = new TemplateDto();
    selectedField: DatasetFieldDto[] = [];
    fields: DatasetFieldDto[] = [];
    templateList: TemplateDto[] = [];
    variableList: Variables[] = [];
    operationalVariables: Variables[] = [];
    selectedVariable: Variables[] = [];
    allVariables: Variables[] = [];
    // all flags
    inputVarCarryFwdFlag: boolean = false;
    definateOprVar: boolean = false;
    reqOprInputVarNumSelection: boolean = true;
    inputOprVarSameAsOutputOprVarFlag: boolean = false;

    taskProperties: TaskProperties;
    mapping: Mapping[] = [];
    inputMapping: Mapping[] = [];
    constructor(data?: any) {
        // debugger;
        if (data !== undefined) {
            this.connectionString = data["connectionString"] !== undefined ? data["connectionString"] : null;
            this.entityName = data["entityName"] !== undefined ? data["entityName"] : null;
            this.operationClass = data["operationClass"] !== undefined ? data["operationClass"] : null;
            this.entityType = data["entityType"] !== undefined ? data["entityType"] : null;
            this.entityKey = data["entityKey"] !== undefined ? data["entityKey"] : data["entityName"];
            this.className = data["className"] !== undefined ? data["className"] : null;
            this.analysis = data["analysis"] !== undefined ? data["analysis"] : null;
            this.entityDescription = data["entityDescription"] !== undefined ? data["entityDescription"] : null;
            this.parentKey = data["parentKey"] !== undefined ? data["parentKey"] : null;
            this.userName = data["userName"] !== undefined ? data["userName"] : null;
            this.password = data["password"] !== undefined ? data["password"] : null;
            this.driverKey = data["driverKey"] !== undefined ? data["driverKey"] : null;
            this.serverName = data["serverName"] !== undefined ? data["serverName"] : null;
            this.databaseName = data["databaseName"] !== undefined ? data["databaseName"] : null;
            if (data["subDatasets"] && data["subDatasets"].constructor === Array) {
                for (let item of data["subDatasets"]) {
                    let sub: SubDatasetDto = SubDatasetDto.fromJS(item, "");
                    sub.readOrWrite = "Writer";
                    this.subDatasets.push(sub);
                }
            }
        }
    }
    clone(): any {
        var cloneObj = new (<any>this.constructor());
        for (var attribut in this) {
            if (typeof this[attribut] === "object") {
                cloneObj[attribut] = this.clone();
            } else {
                cloneObj[attribut] = this[attribut];
            }
        }
        return cloneObj;
    }
    get compare() {
        return this.entityKey + "Writer" + this.id;
    }
    static fromJS(data: any): Writer {
        return new Writer(data);
    }
    //create json object for same class
    toJS(data?: any) {
        data = data === undefined ? {} : data;

        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["entityKey"] = this.entityKey !== undefined ? this.entityKey : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["className"] = this.className !== undefined ? this.className : "";
        data["operationClass"] = "Destination";
        data["connectionString"] = this.connectionString;
        data["userName"] = this.userName !== undefined ? this.userName : "";
        data["password"] = this.password !== undefined ? this.password : "";
        data["driverKey"] = this.driverKey !== undefined ? this.driverKey : "";
        data["parentKey"] = this.parentKey !== undefined ? this.parentKey : "";
        data["serverName"] = this.serverName !== undefined ? this.serverName : "";
        data["databaseName"] = this.databaseName !== undefined ? this.databaseName : "";
        data["subDatasets"] = [];
        if (this.subDatasets && this.subDatasets.constructor === Array) {
            for (let item of this.subDatasets)
                data["subDatasets"].push(item.toJS());
        }
        return data;
    }
    toJSON() {
        return JSON.stringify(this.toJS());
    }
}
export class Reader {
    id: number = 0;
    operationClass: string;
    connectionString: string;
    entityName: string;
    analysis: string;
    entityType: string;
    entityKey: string;
    className: string;
    entityDescription: string;
    parentKey: string;
    subDatasets: SubDatasetDto[] = [];
    variableList: Variables[] = [];
    selectedVariable: Variables[] = [];
    allVariables: Variables[] = [];
    //edit
    //swapping list while selecting variables
    leftVariables: Variables[] = [];
    rightVariables: Variables[] = [];
    operationalVariables: Variables[] = [];
    taskProperties: TaskProperties;
    mapping: Mapping[] = [];
    inputMapping: Mapping[] = [];
    // static flags
    inputVarCarryFwdFlag: boolean = false;
    definateOprVar: boolean = false;
    reqOprInputVarNumSelection: boolean = true;
    inputOprVarSameAsOutputOprVarFlag: boolean = false;

    constructor(data?: any) {
        if (data !== undefined) {
            this.connectionString = data["connectionString"] !== undefined ? data["connectionString"] : null;
            this.entityName = data["entityName"] !== undefined ? data["entityName"] : null;
            this.operationClass = data["operationClass"] !== undefined ? data["operationClass"] : null;
            this.entityType = data["entityType"] !== undefined ? data["entityType"] : null;
            this.entityKey = data["entityKey"] !== undefined ? data["entityKey"] : data["entityName"];
            this.className = data["className"] !== undefined ? data["className"] : null;
            this.analysis = data["analysis"] !== undefined ? data["analysis"] : null;
            this.entityDescription = data["entityDescription"] !== undefined ? data["entityDescription"] : null;
            this.parentKey = data["parentKey"] !== undefined ? data["parentKey"] : null;
            if (data["subDatasets"] && data["subDatasets"].constructor === Array) {
                for (let item of data["subDatasets"]) {
                    let sub: SubDatasetDto = SubDatasetDto.fromJS(item, "");
                    sub.readOrWrite = "Reader";
                    this.subDatasets.push(sub);
                }
            }
        }
    }
    clone(): any {
        var cloneObj = new (<any>this.constructor());
        for (var attribut in this) {
            if (typeof this[attribut] === "object") {
                cloneObj[attribut] = this.clone();
            } else {
                cloneObj[attribut] = this[attribut];
            }
        }
        return cloneObj;
    }
    get getVariable() {
        for (let v of this.subDatasets[0].selectedField) {
            this.variableList.push(
                new Variables(Variables.getRandomNumber, v.dataType, "O", "", v.entityName, "Operation", v.variableType, false
                ));
        }
        return this.variableList;
    }
    get compare() {
        return this.entityKey + "Reader" + this.id;
    }
    getSubdataset(data: any) {
        if (data["subDatasets"] && data["subDatasets"].constructor === Array) {
            for (let item of data["subDatasets"]) {
                this.subDatasets.push(item);
            }
        }
    }
    static fromJS(data: any): Reader {
        return new Reader(data);
    }
    //create json object for same class
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["entityKey"] = this.entityKey !== undefined ? this.entityKey : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["className"] = this.className !== undefined ? this.className : "";
        data["operationClass"] = this.className !== undefined ? this.className : "";
        data["connectionString"] = this.connectionString !== undefined ? this.connectionString : "";
        data["parentKey"] = this.parentKey !== undefined ? this.parentKey : "";
        data["subDatasets"] = [];
        if (this.subDatasets && this.subDatasets.constructor === Array) {
            for (let item of this.subDatasets)
                data["subDatasets"].push(item.toAnalysisJS());
        }
        return data;
    }
    toJSON() {
        return JSON.stringify(this.toJS());
    }
}
export class AlgorithmList {
    type: string;
    typeKey: string;
    cls: string = "";
    algorithmId: string;
    algorithmTypeKey: string;
    algorithmName: string;
    algorithmDesc: string;
    catagory1: string;
    catagory2: string;
    catagory3: string;
    defaultFlag: string;
    constructor(data?: any) {
        if (data !== undefined) {
            this.algorithmId = data["algorithmId"] !== undefined ? data["algorithmId"] : null;
            this.algorithmTypeKey = data["algorithmTypeKey"] !== undefined ? data["algorithmTypeKey"] : null;
            this.algorithmName = data["algorithmName"] !== undefined ? data["algorithmName"] : null;
            this.algorithmDesc = data["algorithmDesc"] !== undefined ? data["algorithmDesc"] : null;
            this.catagory1 = data["catagory1"] !== undefined ? data["catagory1"] : null;
            this.catagory2 = data["catagory2"] !== undefined ? data["catagory2"] : null;
            this.catagory3 = data["catagory3"] !== undefined ? data["catagory3"] : null;
            this.defaultFlag = data["defaultFlag"] !== undefined ? data["defaultFlag"] : null;

        }
    }
    static fromJS(data: any): AlgorithmList {
        return new AlgorithmList(data);
    }
}
export class QuickTree {
    id: string;
    parent: string;
    text: string;
    icon: string;
    constructor(id, parent, text, icon) {
        this.id = id;
        this.parent = parent;
        this.text = text;
        this.icon = icon;
    }
    toJson(data?: any) {
        data = {};
        data["id"] = this.id;
        data["parent"] = this.parent;
        data["text"] = this.text;
        return data;
    }
}
export class PaneTreeDto {
    title: string;
    taskData: any[];
    constructor(title: string, taskData: any[]) {
        this.title = title;
        this.taskData = taskData;
    }
}
export class CreateAnalysisDto {
    processId: string;
    entityName: string;
    entityDescription: string;
    entityType: string = "analysis";
    srcDatasetName: string;
    srcDatasetId: string;
    trgSubDatasetId: string;
    trgDatasetId: string;
    trgDatasetName: string;
    AnalysisType: string;
    chartWidgetKey: string;
    runFlag: string;
    entityKey: string;
    trgSubDatasetName: string;
    tasks: Task[] = [];

    taskElements: any[] = [];
    constructor(data?: any) {
      debugger;
        if (data !== undefined) {
            this.chartWidgetKey = data["chartWidgetKey"] !== undefined ? data["chartWidgetKey"] : null;
            this.entityDescription = data["entityDescription"] !== undefined ? data["entityDescription"] : null;
            this.entityKey = data["entityKey"] !== undefined ? data["entityKey"] : null;
            this.entityName = data["entityName"] !== undefined ? data["entityName"] : null;
            this.entityType = data["entityType"] !== undefined ? data["entityType"] : null;
            this.processId = data["processId"] !== undefined ? data["processId"] : null;
            this.runFlag = data["runFlag"] !== undefined ? data["runFlag"] : null;
            this.srcDatasetId = data["srcDatasetId"] !== undefined ? data["srcDatasetId"] : null;
            this.srcDatasetName = data["srcDatasetName"] !== undefined ? data["srcDatasetName"] : null;
            this.trgDatasetId = data["trgDatasetId"] !== undefined ? data["trgDatasetId"] : null;
            this.trgDatasetName = data["trgDatasetName"] !== undefined ? data["trgDatasetName"] : null;
            this.trgSubDatasetId = data["trgSubDatasetId"] !== undefined ? data["trgSubDatasetId"] : null;
            this.trgSubDatasetName = data["trgSubDatasetName"] !== undefined ? data["trgSubDatasetName"] : null;
            this.chartWidgetKey = data["chartWidgetKey"] !== undefined ? data["chartWidgetKey"] : null;
            let i: number = Object.keys(data["tasks"]).length;
            for (let index: number = 1; index <= i; index++) {
                let nm: string = "taskID" + index;
                this.parseTask(data["tasks"][nm]);
            }
        }
    }
    parseTask(data: any) {
        debugger;
        //parse all tasks to edit
        let task: any;
        if (data !== undefined) {
            if (data["taskType"].toLowerCase() == "reader") {
                task = Reader.fromJS(data["operationDict"]);
                task.entityName = data["entityName"];
            } else if (data["taskType"].toLowerCase() == "writer") {
                task = Writer.fromJS(data["operationDict"]);
                task.entityName = data["entityName"];
            } else if (data["taskType"].toLowerCase() == "model") {
                task = TaskModel.fromJS(data["operationDict"]);
                task.entityName = data["entityName"];
            } else {
                task = TaskDto.fromJS(data["operationDict"]);
                task.entityName = data["entityName"];
            }

            if (task !== undefined) {
                if (data["variables"].constructor === Array) {
                    if (task instanceof Reader) {
                        for (let item of data["variables"]) {
                            let v: Variables = new Variables(Variables.getRandomNumber,
                                item["dataType"],
                                item["inOutFlag"],
                                item["isDefaultFlag"],
                                item["name"],
                                item["variableCategory"],
                                item["variableType"],
                                item["selected"] === "True" ? true : false
                            );
                            if (v.inOutFlag === "O") {
                                task.rightVariables.push(v);
                            }
                            // v.checked = item["selected"] !== undefined ? item["selected"].toLowerCase() == "true" ? true : false : false;
                        }
                    } else {
                        for (let item of data["variables"]) {
                            let v: Variables = new Variables(Variables.getRandomNumber,
                                item["dataType"],
                                item["inOutFlag"],
                                item["isDefaultFlag"],
                                item["name"],
                                item["variableCategory"],
                                item["variableType"],
                                item["selected"] === "True" ? true : false
                            );
                            if (v.inOutFlag === "I") {
                                task.allVariables.push(v);
                            } else {
                                task.selectedVariable.push(v);
                                // task.rightVariables.push(v);
                            };
                            // v.checked = item["selected"] !== undefined ? item["selected"].toLowerCase() == "true" ? true : false : false;
                        }
                    }
                }
                if (data["taskProperties"]) {
                    task.taskProperties = new TaskProperties(data["taskProperties"]["definateOprVar"],
                        data["taskProperties"]["inputOperationVariablesSameAsOutputOperationVariablesFlag"],
                        data["taskProperties"]["inputVarCarryFwdFlag"],
                        data["taskProperties"]["reqOprInputVarNumSelection"]);
                }
                if (data["mapping"]) {
                    let index: number = 0;
                    for (let item of data["mapping"]) {
                        task.mapping.push(new Mapping(item["fromTaskName"],
                            item["fromField"],
                            item["toTaskName"],
                            item["toField"]));
                        if (index === 0) {
                            task.cleanseText.name = item["fromField"];
                        } else task.classText.name = item["fromField"];
                        index++;
                    }
                }
                if (data["inputMapping"]) {
                    let index: number = 0;
                    for (let item of data["inputMapping"]) {
                        task.mapping.push(new Mapping(item["fromTaskName"],
                            item["fromField"],
                            item["toTaskName"],
                            item["toField"]));
                        if (index === 0) {
                            task.cleanseText.name = item["fromField"];
                        } else task.classText.name = item["fromField"];
                        index++;
                    }
                }
                this.taskElements.push(task);
            }
        }
    }
    copyFunction(task: TaskDto, data: any): TaskDto {
        task.bracingFactor = data["bracingFactor"] !== undefined ? data["bracingFactor"] : "";
        task.definateOprVar = data["definateOprVar"] !== undefined ? data["definateOprVar"] : "";
        task.excludePanctuation = data["excludePanctuation"] !== undefined ? data["excludePanctuation"] : "";
        task.fileOrTextStopwordsFlag = data["fileOrTextStopwordsFlag"] !== undefined ? data["fileOrTextStopwordsFlag"] : "";
        task.filePath = data["filePath"] !== undefined ? data["filePath"] : "";
        task.functionCategory1 = data["functionCategory1"] !== undefined ? data["functionCategory1"] : "";
        task.functionCategory2 = data["functionCategory2"] !== undefined ? data["functionCategory2"] : "";
        task.functionCategory3 = data["functionCategory3"] !== undefined ? data["functionCategory3"] : "";
        task.functionCategory4 = data["functionCategory4"] !== undefined ? data["functionCategory4"] : "";
        task.initializeMethod = data["initializeMethod"] !== undefined ? data["initializeMethod"] : "";
        task.inputOprVarSameAsOutputOprVarFlag = data["inputOprVarSameAsOutputOprVarFlag"] !== undefined ? data["inputOprVarSameAsOutputOprVarFlag"] : "";
        task.inputVarCarryFwdFlag = data["inputVarCarryFwdFlag"] !== undefined ? data["inputVarCarryFwdFlag"] : "";
        task.leafSize = data["leafSize"] !== undefined ? data["leafSize"] : "";
        task.linkageCriteria = data["linkageCriteria"] !== undefined ? data["linkageCriteria"] : "";
        task.linkageMetric = data["linkageMetric"] !== undefined ? data["linkageMetric"] : "";
        task.noOfCluster = data["numberOfCluster"] !== undefined ? data["noOfCluster"] : "";
        task.noOfIterations = data["noOfIterations"] !== undefined ? data["noOfIterations"] : "";
        task.noOfPhrase = data["noOfPhrase"] !== undefined ? data["noOfPhrase"] : "";
        task.noOfWords = data["noOfWords"] !== undefined ? data["noOfWords"] : "";
        task.numberPercentageFlag = data["numberPercentageFlag"] !== undefined ? data["numberPercentageFlag"] : "number";
        task.partOfSpeech = data["partOfSpeech"] !== undefined ? data["partOfSpeech"] : "";
        task.preCompute = data["preCompute"] !== undefined ? data["preCompute"] : "";
        task.reqOprInputVarNumSelection = data["reqOprInputVarNumSelection"] !== undefined ? data["reqOprInputVarNumSelection"] : "";
        task.sampleNumber = data["sampleNumber"] !== undefined ? data["sampleNumber"] : "";
        task.samplePercentage = data["samplePercentage"] !== undefined ? data["samplePercentage"] : "";
        task.thresold = data["thresold"] !== undefined ? data["thresold"] : "";
        task.tolerance = data["tolerance"] !== undefined ? data["tolerance"] : "";
        if (data["stopwordsList"] && data["stopwordsList"].constructor === Array) {
            for (let x of data["stopwordsList"])
                task.stopwordsList += x + ",";
        }
        return task;
    }
    static fromJS(data: any): CreateAnalysisDto {
        return new CreateAnalysisDto(data);
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["srcDatasetName"] = this.srcDatasetName !== undefined ? this.srcDatasetName : "";
        data["srcDatasetId"] = this.srcDatasetId !== undefined ? this.srcDatasetId : "";
        data["trgSubdatasetId"] = this.trgSubDatasetId !== undefined ? this.trgSubDatasetId : "";
        data["trgDatasetId"] = this.trgDatasetId !== undefined ? this.trgDatasetId : "";
        data["trgSubdatasetName"] = this.trgSubDatasetName !== undefined ? this.trgSubDatasetName : "";
        data["trgDatasetName"] = this.trgDatasetName !== undefined ? this.trgDatasetName : "";
        data["AnalysisType"] = this.AnalysisType !== undefined ? this.AnalysisType : "";
        // data["tasks"] = {};
        let data1: any = {}
        if (this.tasks && this.tasks.constructor === Array) {
            let i: number = 1;
            for (let item of this.tasks)
                data1["taskID" + (i++)] = item.toJS();
        }
        data["tasks"] = data1;
        return data;
    }
    toUpdateJS(data?: any) {
        data = data === undefined ? {} : data;
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["entityKey"] = this.entityKey !== undefined ? this.entityKey : "";
        data["srcDatasetName"] = this.srcDatasetName !== undefined ? this.srcDatasetName : "";
        data["srcDatasetId"] = this.srcDatasetId !== undefined ? this.srcDatasetId : "";
        data["trgSubDatasetId"] = this.trgSubDatasetId !== undefined ? this.trgSubDatasetId : "";
        data["trgDatasetId"] = this.trgDatasetId !== undefined ? this.trgDatasetId : "";
        data["trgSubDatasetName"] = this.trgSubDatasetName !== undefined ? this.trgSubDatasetName : "";
        data["trgDatasetName"] = this.trgDatasetName !== undefined ? this.trgDatasetName : "";
        //data["AnalysisType"] = this.AnalysisType !== undefined ? this.AnalysisType : "";
        data["chartWidgetKey"] = this.chartWidgetKey !== undefined ? this.chartWidgetKey : "";
        data["changeFlag"] = "True";
        // data["tasks"] = {};
        let data1: any = {}
        if (this.tasks && this.tasks.constructor === Array) {
            let i: number = 1;
            for (let item of this.tasks)
                data1["taskID" + (i++)] = item.toJS();
        }
        data["tasks"] = data1;
        return data;
    }
    toJSON() {
        return JSON.stringify(this.toJS());
    }
    toUpdarteJSON() {
        return JSON.stringify(this.toUpdateJS());
    }
}

export class Task {
    entityName: string;
    taskType: string;
    taskId: string;
    operationDict: any;
    predecessorID: string[] = [];
    successorID: string[] = [];
    predecessorName: string[] = [];
    successorName: string[] = [];
    mapping: Mapping[] = [];
    inputMapping: Mapping[] = [];
    variables: Variables[] = [];
    taskProperties: TaskProperties;
    constructor(data?: any) {
        if (data !== undefined) {

        }
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["taskType"] = this.taskType !== undefined ? this.taskType : "";
        data["taskId"] = this.taskId !== undefined ? this.taskId : "";
        data["operationDict"] = this.operationDict.toJS();
        data["successorID"] = [];
        for (let s of this.successorID)
            data["successorID"].push(s);

        data["predecessorName"] = [];
        for (let s of this.predecessorName)
            data["predecessorName"].push(s);

        data["successorName"] = [];
        for (let s of this.successorName)
            data["successorName"].push(s);

        data["predecessorID"] = [];
        for (let p of this.predecessorID)
            data["predecessorID"].push(p);

        data["mapping"] = [];
        for (let m of this.mapping) {
            data["mapping"].push(m.toJS());
        }
        data["inputMapping"] = [];
        for (let m of this.mapping) {
            data["inputMapping"].push(m.toJS());
        }
        data["variables"] = [];
        if (this.variables && this.variables.constructor === Array) {
            for (let item of this.variables)
                data["variables"].push(item.toJS());
        }
        data["taskProperties"] = this.taskProperties.toJS();
        return data;
    }
}
export class Mapping {
    fromTaskName: string;
    fromField: string;
    toTaskName: string;
    toField: string;
    constructor(ftn: string, ff: string, ttn: string, tf: string) {
        this.fromTaskName = ftn;
        this.toTaskName = ttn;
        this.toField = tf;
        this.fromField = ff;
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["fromTaskName"] = this.fromTaskName !== undefined ? this.fromTaskName : "";
        data["fromField"] = this.fromField !== undefined ? this.fromField : "";
        data["toTaskName"] = this.toTaskName !== undefined ? this.toTaskName : "";
        data["toField"] = this.toField !== undefined ? this.toField : "";
        return data;
    }
}
export class TaskProperties {
    definateOprVar: string;
    inputOperationVariablesSameAsOutputOperationVariablesFlag: string;
    inputVarCarryFwdFlag: string;
    reqOprInputVarNumSelection: any;
    constructor(ov: string, vf: string, ff: string, ns: string) {
        this.definateOprVar = ov;
        this.inputOperationVariablesSameAsOutputOperationVariablesFlag = vf;
        this.inputVarCarryFwdFlag = ff;
        this.reqOprInputVarNumSelection = ns;
    }

    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["definateOprVar"] = this.definateOprVar ? "True" : "False";
        data["inputOperationVariablesSameAsOutputOperationVariablesFlag"] = this.inputOperationVariablesSameAsOutputOperationVariablesFlag ? "True" : "False";
        data["inputVarCarryFwdFlag"] = this.inputVarCarryFwdFlag ? "True" : "False";
        data["reqOprInputVarNumSelection"] = this.reqOprInputVarNumSelection ? "True" : "False";
        return data;
    }
}
export class Variables {
    static INPUT_VAR: string = "Input";
    static OPERATION_VAR: string = "Operation";
    checked: boolean = false;
    id: any;
    dataType: string;
    inOutFlag: string;
    isDefaultFlag: string;
    name: string;
    variableCategory: string;
    variableType: string;
    constructor(id: any, dt: string, iof: string, idf: string, nm: string, vc: string, vt: string, isSelected: boolean) {
        this.id = id;
        this.dataType = dt;
        this.inOutFlag = iof;
        this.isDefaultFlag = idf;
        this.name = nm;
        this.variableCategory = vc;
        this.variableType = vt;
        this.checked = isSelected;
    }

    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["dataType"] = this.dataType !== undefined ? this.dataType : "";
        data["inOutFlag"] = this.inOutFlag !== undefined ? this.inOutFlag : "";
        data["isDefaultFlag"] = this.isDefaultFlag !== undefined ? this.isDefaultFlag : "";
        data["name"] = this.name !== undefined ? this.name : "";
        data["variableCategory"] = this.variableCategory !== undefined ? this.variableCategory : "";
        data["variableType"] = this.variableType !== undefined ? this.variableType : "";
        data["selected"] = this.checked ? "True" : "False";
        return data;
    }
    static get getRandomNumber(): any {
        var randomnumber = Math.ceil(Math.random() * 1000);
        return randomnumber;
    }
}
export class TemplateDto {
    userName: string;
    connectionString: string;
    entityName: string;
    entityType: string;
    entityKey: string;
    className: string;
    entityDescription: string;
    databaseName: string;
    password: string;
    driverKey: string;
    serverName: string;
    parentKey: string;
    subDatasets: SubDatasetDto[] = [];
    constructor(data?: any) {
        if (data !== undefined) {
            this.entityKey = data["entityKey"] !== undefined ? data["entityKey"] : null;
            this.entityName = data["entityName"] !== undefined ? data["entityName"] : null;
            this.entityDescription = data["entityDescription"] !== undefined ? data["entityDescription"] : null;
            this.entityType = data["entityType"] !== undefined ? data["entityType"] : null;
            this.className = data["className"] !== undefined ? data["className"] : null;
            this.connectionString = data["connectionString"] !== undefined ? data["connectionString"] : null;
            this.password = data["password"] !== undefined ? data["password"] : "";
            this.userName = data["userName"] !== undefined ? data["userName"] : "";
            this.driverKey = data["driverKey"] !== undefined ? data["driverKey"] : "";
            this.serverName = data["serverName"] !== undefined ? data["serverName"] : "";
            this.parentKey = data["parentKey"] !== undefined ? data["parentKey"] : "";
            this.databaseName = data["databaseName"] !== undefined ? data["databaseName"] : "";
        }
    }
    getConnection(): string {
        return "DRIVER={" + this.driverKey + "};DATABASE=" + this.databaseName + ";UID=" + this.userName + ";PWD=" + this.password + ";SERVER=" + this.serverName + ";";

    }
    getPostConnection(): string {
        return "DRIVER={" + this.driverKey + "};DATABASE=" + this.databaseName + ";UID=" + this.userName + ";PWD=" + this.password + ";SERVER=" + this.serverName + ";PORT=5432;";

    }
    static fromJS(data: any): TemplateDto {
        return new TemplateDto(data);
    }
    //create json object for same class
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["entityKey"] = this.entityKey !== undefined ? this.entityKey : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["className"] = this.className !== undefined ? this.className : "";
        data["operationClass"] = "Destination";
        data["connectionString"] = this.connectionString;
        data["userName"] = this.userName !== undefined ? this.userName : "";
        data["password"] = this.password !== undefined ? this.password : "";
        data["driverKey"] = this.driverKey !== undefined ? this.driverKey : "";
        data["parentKey"] = this.parentKey !== undefined ? this.parentKey : "";
        data["serverName"] = this.serverName !== undefined ? this.serverName : "";
        data["databaseName"] = this.databaseName !== undefined ? this.databaseName : "";
        data["subDatasets"] = [];
        return data;
    }

    toJSON() {
        return JSON.stringify(this.toJS());
    }
}
export enum TaskType {
    CLEANSER = 1,
    SAMPLER,
    FUNCTION,
    MODEL,
    READER,
    WRITER,
    BLANK
}



export class AnalysisDtoDetails {
    processId: string;
    srcDatasetName: string;
    trgSubDatasetId: string;
    trgDatasetName: string;
    entityName: string;
    entityType: string;
    entityKey: string;
    className: string;
    modifiedBy: string;
    entityDescription: string;
    createdBy: string;
    dateModified: string;
    dateCreated: string;
    trgDatasetId: string;
    runFlag: string;
    srcDatasetId: string;
    trgSubDatasetName: string;
    analysisHistory: AnalysisModelHistory = new AnalysisModelHistory();
    isRunning: boolean = true;
    chartWidgetKey: string;
    constructor(data?: any) {
        // debugger;
        if (data !== undefined) {
            this.processId = data["processId"] !== undefined ? data["processId"] : null;
            this.srcDatasetName = data["srcDatasetName"] !== undefined ? data["srcDatasetName"] : null;
            this.trgSubDatasetId = data["trgSubDatasetId"] !== undefined ? data["trgSubDatasetId"] : null;
            this.trgDatasetName = data["trgDatasetName"] !== undefined ? data["trgDatasetName"] : null;
            this.entityName = data["entityName"] !== undefined ? data["entityName"] : null;
            this.entityType = data["entityType"] !== undefined ? data["entityType"] : null;
            this.entityKey = data["entityKey"] !== undefined ? data["entityKey"] : null;
            this.className = data["className"] !== undefined ? data["className"] : null;
            this.modifiedBy = data["modifiedBy"] !== undefined ? data["modifiedBy"] : null;
            this.entityDescription = data["entityDescription"] !== undefined ? data["entityDescription"] : null;
            this.createdBy = data["createdBy"] !== undefined ? data["createdBy"] : null;
            this.dateModified = data["dateModified"] !== undefined ? data["dateModified"] : null;
            this.dateCreated = data["dateCreated"] !== undefined ? data["dateCreated"] : null;
            this.trgDatasetId = data["trgDatasetId"] !== undefined ? data["trgDatasetId"] : null;
            this.srcDatasetId = data["srcDatasetId"] !== undefined ? data["srcDatasetId"] : null;
            this.trgSubDatasetName = data["trgSubDatasetName"] !== undefined ? data["trgSubDatasetName"] : null;
            this.runFlag = data["runFlag"] !== undefined ? data["runFlag"] : null;
            this.chartWidgetKey = data["chartWidgetKey"] !== undefined ? data["chartWidgetKey"] : null;

        }
    }

    static fromJS(data: any): AnalysisDtoDetails {
        return new AnalysisDtoDetails(data);
    }
    toJS(data?: any) {

    }
}



export class AnalysisRunLogDetails {
    status: string;
    startDate: string;
    EndDate: string;
    taskType: string;
    analysisKey: string;
    taskName: string;

    constructor(data?: any) {
        debugger;
        if (data !== undefined) {
            this.status = data["status"] !== undefined ? data["status"] : null;
            this.startDate = data["startDate"] !== undefined ? data["startDate"] : null;
            this.EndDate = data["endDate"] !== undefined ? data["endDate"] : null;
            this.taskType = data["taskType"] !== undefined ? data["taskType"] : null;
            //this.analysisKey = data["analysisKey"] !== undefined ? data["analysisKey"] : null;
            this.taskName = data["taskName"] !== undefined ? data["taskName"] : null;

        }
    }

    static fromJS(data: any): AnalysisRunLogDetails {
        return new AnalysisRunLogDetails(data);
    }
    toJS(data?: any) {

    }
}



export class AnalysisModelHistory {
    runLogKey: string;
    entityType: string;
    entityKey: string;
    entityName: string;
    startDate: string;
    endDate: string;
    executedBy: string;
    logFileLocation: string;
    runStatus: string;

    constructor(data?: any) {
        // debugger;
        if (data !== undefined) {
            this.runLogKey = data["runLogKey"] !== undefined ? data["runLogKey"] : null;
            this.entityType = data["entityType"] !== undefined ? data["entityType"] : null;
            this.entityKey = data["entityKey"] !== undefined ? data["entityKey"] : null;
            this.entityName = data["entityName"] !== undefined ? data["entityName"] : null;
            this.startDate = data["startDate"] !== undefined ? data["startDate"] : null;
            this.endDate = data["endDate"] !== undefined ? data["endDate"] : null;
            this.executedBy = data["executedBy"] !== undefined ? data["executedBy"] : null;
            this.logFileLocation = data["logFileLocation"] !== undefined ? data["logFileLocation"] : null;
            this.runStatus = data["runStatus"] !== undefined ? data["runStatus"] : null;

        }
    }

    static fromJS(data: any): AnalysisModelHistory {
        return new AnalysisModelHistory(data);
    }
    toJS(data?: any) {

    }
}
export class DeleteAnalysisDto {
    sessionKey: string;
    entityList: string[] = [];
    constructor(data?: any) {
    }
    static fromJS(data: any): AnalysisDtoDetails {
        return new AnalysisDtoDetails(data);
    }
    //create json object for same class
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["sessionKey"] = this.sessionKey !== undefined ? this.sessionKey : "";
        data["entityList"] = [];
        if (this.entityList && this.entityList.constructor === Array) {
            for (let item of this.entityList)
                data["entityList"].push(item);
        }
        return data;
    }

    toJSON() {
        return JSON.stringify(this.toJS());
    }
}



export class AlgorithmType {
    type: string;
    typeKey: string;
    cls: string = "";
    constructor(data?: any, ) {
        if (data !== undefined) {
            this.type = data["algorithmTypeKey"] !== undefined ? data["algorithmTypeKey"] : null;
            this.typeKey = data["algorithmType"] !== undefined ? data["algorithmType"] : null;
        }
    }
    static fromJS(data: any): AlgorithmType {
        return new AlgorithmType(data);
    }
}

export class AnalysisResult {
    status_code: number = -1;
    string_message: string;
    detail: CreateAnalysisResult;
    constructor(data?: any) {
        if (data !== undefined) {
            this.status_code = data["statusCode"] !== undefined ? data["statusCode"] : -1;
            this.string_message = data["statusMessage"] !== undefined ? data["statusMessage"] : "";
            this.detail = CreateAnalysisResult.fromJS(data["analysisDetails"] !== undefined ? data["analysisDetails"] : data["resultData"]);
        }
    }
    static fromJS(data: any): AnalysisResult {
        return new AnalysisResult(data);
    }
}

export class CreateAnalysisResult {
    analysisKey: string;
    analysisType: string;
    analysisName: string;
    dashboardKey: string;
    chartWidgetKey: string;
    constructor(data?: any) {
        if (data !== undefined) {
            this.analysisKey = data["analysisKey"] !== undefined ? data["analysisKey"] : "";
            this.analysisType = data["analysisType"] !== undefined ? data["analysisType"] : "";
            this.analysisName = data["analysisName"] !== undefined ? data["analysisName"] : "";
            this.dashboardKey = data["dashboardKey"] !== undefined ? data["dashboardKey"] : "";
            this.chartWidgetKey = data["chartWidgetKey"] !== undefined ? data["chartWidgetKey"] : "";

        }
    }
    static fromJS(data: any): CreateAnalysisResult {
        return new CreateAnalysisResult(data);
    }
}


//export class chartAnalysisdto {
//    type: ChartType;
//    chartData: any[] = [];
//    chartJson: ChartjsonDetails;
//    entityType: string;
//    entityKey: string;
//    entityName: string;
//    chartTitle: string;
//    entityDescription: string;
//    chartType: string;
//    parentKey: string;
//    protected jsonParseReviver: (key: string, value: any) => any = undefined;
//    constructor(data?: any) {
//        // debugger;
//        if (data !== undefined) {
//            this.chartJson = data["chartJson"] !== undefined ? data["chartJson"] : null;
//            this.entityType = data["entityType"] !== undefined ? data["entityType"] : null;
//            this.entityKey = data["entityKey"] !== undefined ? data["entityKey"] : null;
//            this.entityName = data["entityName"] !== undefined ? data["entityName"] : null;
//            this.chartTitle = data["chartTitle"] !== undefined ? data["chartTitle"] : null;
//            this.entityDescription = data["entityDescription"] !== undefined ? data["entityDescription"] : null;
//            this.chartType = data["chartType"] !== undefined ? data["chartType"] : null;
//            this.parentKey = data["parentKey"] !== undefined ? data["parentKey"] : null;
//        }
//    }

//    static fromJS(data: any): chartAnalysisdto {
//        return new chartAnalysisdto(data);
//    }
//    toJS(data?: any) {

//    }
//}


//export class ChartjsonDetails {
//    gridStackWidth: string;
//    chartPositionTop: string;
//    chartWidgetName: string;
//    gridStackHeight: string;
//    chartWidgetWidth: string;
//    chartSpecificOptions: chartSpecificOptionsDetails;
//    chartWidgetTitle: string;
//    chartPositionLeft: string;
//    chartWidgetIdentifier: string;
//    chartType: string;
//    chartWidgetHeight: string;

//    constructor(data?: any) {
//        // debugger;
//        if (data !== undefined) {
//            this.gridStackWidth = data["gridStackWidth"] !== undefined ? data["gridStackWidth"] : null;
//            this.chartPositionTop = data["chartPositionTop"] !== undefined ? data["chartPositionTop"] : null;
//            this.chartWidgetName = data["chartWidgetName"] !== undefined ? data["chartWidgetName"] : null;
//            this.gridStackHeight = data["gridStackHeight"] !== undefined ? data["gridStackHeight"] : null;
//            this.chartWidgetWidth = data["chartWidgetWidth"] !== undefined ? data["chartWidgetWidth"] : null;
//            this.chartSpecificOptions = data["chartSpecificOptions"] !== undefined ? data["chartSpecificOptions"] : null;
//            this.chartWidgetTitle = data["chartWidgetTitle"] !== undefined ? data["chartWidgetTitle"] : null;
//            this.chartPositionLeft = data["chartPositionLeft"] !== undefined ? data["chartPositionLeft"] : null;
//            this.chartWidgetIdentifier = data["chartWidgetIdentifier"] !== undefined ? data["chartWidgetIdentifier"] : null;
//            this.chartType = data["chartType"] !== undefined ? data["chartType"] : null;
//            this.chartWidgetHeight = data["chartWidgetHeight"] !== undefined ? data["chartWidgetHeight"] : null;

//        }
//    }

//    static fromJS(data: any): ChartjsonDetails {
//        return new ChartjsonDetails(data);
//    }
//    toJS(data?: any) {

//    }
//}


/**
 * Chart Analysis Details Classes
 */


export class AnalysisChart {
    entityName: string;
    entityType: string;
    entityKey: string;
    chartTitle: string;
    entityDescription: string;
    chartType: string;
    parentKey: string;
    chartJson: AnalysisChartJSON;
    constructor(data?: any) {
        if (data !== undefined) {
            this.entityName = data["entityName"] !== undefined ? data["entityName"] : null;
            this.entityType = data["entityType"] !== undefined ? data["entityType"] : null;
            this.entityKey = data["entityKey"] !== undefined ? data["entityKey"] : null;
            this.chartType = data["chartType"] !== undefined ? data["chartType"] : null;
            this.chartTitle = data["chartTitle"] !== undefined ? data["chartTitle"] : null;
            this.entityDescription = data["entityDescription"] !== undefined ? data["entityDescription"] : null;
            this.chartType = data["chartType"] !== undefined ? data["chartType"] : null;
            this.parentKey = data["parentKey"] !== undefined ? data["parentKey"] : null;
            this.chartJson = AnalysisChartJSON.fromJS(data["chartJson"]);
        }
    }
    static fromJS(data?: any): AnalysisChart {
        return new AnalysisChart(data);
    }
}

export class AnalysisChartJSON {
    type: ChartType;
    chartData: any[] = [];
    chartWidgetName: string;
    gridStackHeight: string;
    chartWidgetWidth: string;
    chartType: string;
    chartWidgetKey: string;
    gridStackWidth: string;
    chartPositionTop: string;
    chartSpecificOptions: any;
    chartWidgetTitle: string;
    chartPositionLeft: string;
    chartWidgetIdentifier: string;
    chartWidgetHeight: string;

    protected jsonParseReviver: (key: string, value: any) => any = undefined;
    constructor(data?: any) {
        if (data !== undefined) {
            this.chartWidgetName = data["chartWidgetName"] !== undefined ? data["chartWidgetName"] : null;
            this.chartWidgetName = data["chartWidgetName"] !== undefined ? data["chartWidgetName"] : null;
            this.chartWidgetWidth = data["chartWidgetWidth"] !== undefined ? data["chartWidgetWidth"] : null;
            this.chartType = data["chartType"] !== undefined ? data["chartType"] : null;
            this.chartWidgetKey = data["chartWidgetKey"] !== undefined ? data["chartWidgetKey"] : null;
            this.gridStackWidth = data["gridStackWidth"] !== undefined ? data["gridStackWidth"] : null;
            this.chartPositionTop = data["chartPositionTop"] !== undefined ? data["chartPositionTop"] : null;
            this.chartWidgetTitle = data["chartWidgetTitle"] !== undefined ? data["chartWidgetTitle"] : null;
            this.chartPositionLeft = data["chartPositionLeft"] !== undefined ? data["chartPositionLeft"] : null;
            this.chartWidgetIdentifier = data["chartWidgetIdentifier"] !== undefined ? data["chartWidgetIdentifier"] : null;
            this.chartWidgetHeight = data["chartWidgetHeight"] !== undefined ? data["chartWidgetHeight"] : null;
            this.chartSpecificOptions = this.getType(data["chartSpecificOptions"]);
            if (this.chartSpecificOptions !== undefined) {
                debugger;
                this.chartData = this.chartSpecificOptions.chartData;
                //if (data["chartData"]) {
                //    if (this.type === ChartType.WORD) {
                //        let w = JSON.parse(JSON.stringify(data["chartData"]), this.jsonParseReviver);
                //        if (w.data && w.data.constructor === Array) {
                //            for (let item of w.data) {
                //                this.chartData.push(WorldCloudChart.fromJS(item));
                //            }
                //        }
                //    } else if (this.type === ChartType.PIE) {
                //        let w = data["chartData"];
                //        if (w && w.constructor === Array) {
                //            for (let item of w) {
                //                this.chartData.push(PieChart.fromJS(item));
                //            }
                //        }
                //    } else if (this.type === ChartType.CHORD) {
                //        let w = JSON.parse(JSON.stringify(data["chartData"]), this.jsonParseReviver);
                //        // w = JSON.parse(w, this.jsonParseReviver);
                //        if (w.data) {
                //            this.chartData.push(ChordChart.fromJS(w.data));
                //        }
                //    }
                //}
            }
        }

    }
    getType(value: any): any {
        let s: string = value["chartVisualizationType"];
        if (s.toLowerCase() === "word cloud") {
            this.type = ChartType.WORD;
            return WorldCloudOptions.fromJS(value);
        } else if (s.toLowerCase() === "pie chart") {
            this.type = ChartType.PIE;
            return PieChartOptions.fromJS(value);
        } else if (s.toLowerCase() === "chord chart") {
            this.type = ChartType.CHORD;
            return ChordChartOptions.fromJS(value);
        }
    }
    static fromJS(data?: any): AnalysisChartJSON {
        return new AnalysisChartJSON(data);
    }
    //getChartJS(data?: any) {
    //    if (this.type === ChartType.CHORD) {
    //        data = [];
    //        for (let c of this.chartData) {
    //            data.push(c);
    //            let x: ChordChart;
    //            x.
    //        }

    //    } else if (this.type === ChartType.WORD) {

    //    } else if (this.type === ChartType.PIE) {

    //    }
    //}
}
export class WorldCloudChart {
    word: string;
    size: string;
    constructor(data?: any) {
        if (data !== undefined) {
            this.word = data["word"] !== undefined ? data["word"] : null;
            this.size = data["size"] !== undefined ? data["size"] : null;
        }
    }
    static fromJS(data?: any): WorldCloudChart {
        return new WorldCloudChart(data);
    }
}
export class PieChart {
    measure: string;
    label: string;
    constructor(data?: any) {
        if (data !== undefined) {
            this.measure = data["measure"] !== undefined ? data["measure"] : null;
            this.label = data["label"] !== undefined ? data["label"] : null;
        }
    }
    static fromJS(data?: any): PieChart {
        return new PieChart(data);
    }
}
export class ChordChart {
    matrix: any[] = [];
    label: any = [];
    constructor(data?: any) {
        debugger;
        if (data !== undefined) {
            for (let m of data["matrix"]) {
                let ar: number[] = [];
                for (let x of m) {
                    ar.push(+x);
                }
                this.matrix.push(ar);
            }
            this.label = data["label"] !== undefined ? data["label"] : null;
        }
    }
    static fromJS(data?: any): ChordChart {
        return new ChordChart(data);
    }
    //toJS(data?: any) {
    //    data = data === undefined ? {} : data;
    //    data["label"] = this.label !== undefined ? this.label : "";
    //    data["datasetKey"] = this.datasetKey !== undefined ? this.datasetKey : "";
    //    return data;
    //}
}

export class LineChart {
    chartdata: number[] = [];
    constructor(data?: any) {
        if (data !== undefined) {
            this.chartdata.push(data);
        }
    }
    static fromJS(data?: any): LineChart {
        return new LineChart(data);
    }
}

export class DonutChart {
    name: string;
    count: number;
    percentage: number;
    color: string;
    constructor(data?: any) {
        if (data !== undefined) {
            this.name = data["name"] !== undefined ? data["name"] : null;
            this.count = data["count"] !== undefined ? data["count"] : null;
            this.percentage = data["percentage"] !== undefined ? data["percentage"] : null;
            this.color = data["color"] !== undefined ? data["color"] : null;
        }
    }
    static fromJS(data?: any): DonutChart {
        return new DonutChart(data);
    }
}

export class BarChart {
    label: string;
    value: number;

    constructor(data?: any) {
        if (data !== undefined) {
            this.label = data["label"] !== undefined ? data["label"] : null;
            this.value = data["value"] !== undefined ? data["value"] : null;
        }
    }
    static fromJS(data?: any): BarChart {
        return new BarChart(data);
    }
}

export class HorizontalBarChart {
    letter: string;
    frequency: number;

    constructor(data?: any) {
        if (data !== undefined) {
            this.letter = data["letter"] !== undefined ? data["letter"] : null;
            this.frequency = data["frequency"] !== undefined ? data["frequency"] : null;
        }
    }
    static fromJS(data?: any): HorizontalBarChart {
        return new HorizontalBarChart(data);
    }
}

export class WorldCloudOptions {
    chartData: WorldCloudChart[] = [];
    chartVariable: ChartVariables[] = [];
    chartMapping: ChartMapping[] = [];// pending some fields
    wordCloudDescription: string;
    wordCloudWordRotation: string;
    wordCloudLegendFlag: string;
    datasetKey: string;
    wordCloudLabelFontSize: string;
    chartVisualizationType: string;
    wordCloudWidth: string;
    subDatasetKey: string;
    wordCloudTitle: string;
    wordCloudLabelFontColourPallet: string;
    wordCloudLabelFontType: string;
    AnalysisDatasetFlag: string;
    AnalysisKey: string;
    wordCloudHeight: string;

    constructor(data?: any) {
        if (data !== undefined) {
            this.wordCloudDescription = data["wordCloudDescription"] !== undefined ? data["wordCloudDescription"] : null;
            this.wordCloudWordRotation = data["wordCloudWordRotation"] !== undefined ? data["wordCloudWordRotation"] : null;
            this.wordCloudLegendFlag = data["wordCloudLegendFlag"] !== undefined ? data["wordCloudLegendFlag"] : null;
            this.datasetKey = data["datasetKey"] !== undefined ? data["datasetKey"] : null;
            this.wordCloudLabelFontSize = data["wordCloudLabelFontSize"] !== undefined ? data["wordCloudLabelFontSize"] : null;
            this.chartVisualizationType = data["chartVisualizationType"] !== undefined ? data["chartVisualizationType"] : null;
            this.wordCloudWidth = data["wordCloudWidth"] !== undefined ? data["wordCloudWidth"] : null;
            this.subDatasetKey = data["subDatasetKey"] !== undefined ? data["subDatasetKey"] : null;
            this.wordCloudTitle = data["wordCloudTitle"] !== undefined ? data["wordCloudTitle"] : null;
            this.wordCloudLabelFontColourPallet = data["wordCloudLabelFontColourPallet"] !== undefined ? data["wordCloudLabelFontColourPallet"] : null;
            this.wordCloudLabelFontType = data["wordCloudLabelFontType"] !== undefined ? data["wordCloudLabelFontType"] : null;
            this.AnalysisDatasetFlag = data["AnalysisDatasetFlag"] !== undefined ? data["AnalysisDatasetFlag"] : null;
            this.AnalysisKey = data["AnalysisKey"] !== undefined ? data["AnalysisKey"] : null;
            this.wordCloudHeight = data["wordCloudHeight"] !== undefined ? data["wordCloudHeight"] : null;

            if (data["ChartVariable"] && data["ChartVariable"].constructor === Array) {
                for (let item of data["ChartVariable"]) {
                    this.chartVariable.push(ChartVariables.fromJS(item));
                }
            }
            if (data["ChartMapping"] && data["ChartMapping"].constructor === Array) {
                for (let item of data["ChartMapping"]) {
                    this.chartMapping.push(ChartMapping.fromJS(item));
                }
            }
            if (data["chartData"] && data["chartData"].constructor === Array) {
                for (let item of data["chartData"]) {
                    this.chartData.push(WorldCloudChart.fromJS(item));
                }
            }
        }
    }
    static fromJS(data?: any): WorldCloudOptions {
        return new WorldCloudOptions(data);
    }
}
export class PieChartOptions {
    chartData: PieChart[] = [];
    chartVariable: ChartVariables[] = [];
    chartMapping: ChartMapping[] = [];// pending some fields

    pieChartLabel: string;
    pieChartDescription: string;
    pieChartLabelFontColour: string;
    pieChartTitle: string;
    chartVisualizationType: string;
    subDatasetKey: string;
    datasetKey: string;
    pieChartLegendFlag: string;
    pieChartWidth: string;
    pieChartLabelFontType: string;
    AnalysisDatasetFlag: string;
    AnalysisKey: string;
    pieChartHeight: string;
    pieChartRadius: string;
    pieChartLabelFontSize: string;

    constructor(data?: any) {
        if (data !== undefined) {
            this.pieChartLabel = data["pieChartLabel"] !== undefined ? data["pieChartLabel"] : null;
            this.pieChartDescription = data["pieChartDescription"] !== undefined ? data["pieChartDescription"] : null;
            this.pieChartLabelFontColour = data["pieChartLabelFontColour"] !== undefined ? data["pieChartLabelFontColour"] : null;
            this.pieChartTitle = data["pieChartTitle"] !== undefined ? data["pieChartTitle"] : null;
            this.pieChartLegendFlag = data["pieChartLegendFlag"] !== undefined ? data["pieChartLegendFlag"] : null;
            this.chartVisualizationType = data["chartVisualizationType"] !== undefined ? data["chartVisualizationType"] : null;
            this.datasetKey = data["datasetKey"] !== undefined ? data["datasetKey"] : null;
            this.subDatasetKey = data["subDatasetKey"] !== undefined ? data["subDatasetKey"] : null;
            this.pieChartWidth = data["pieChartWidth"] !== undefined ? data["pieChartWidth"] : null;
            this.pieChartLabelFontType = data["pieChartLabelFontType"] !== undefined ? data["pieChartLabelFontType"] : null;
            this.pieChartHeight = data["pieChartHeight"] !== undefined ? data["pieChartHeight"] : null;
            this.AnalysisDatasetFlag = data["AnalysisDatasetFlag"] !== undefined ? data["AnalysisDatasetFlag"] : null;
            this.AnalysisKey = data["AnalysisKey"] !== undefined ? data["AnalysisKey"] : null;
            this.pieChartRadius = data["pieChartRadius"] !== undefined ? data["pieChartRadius"] : null;
            this.pieChartLabelFontSize = data["pieChartLabelFontSize"] !== undefined ? data["pieChartLabelFontSize"] : null;

            if (data["ChartVariable"] && data["ChartVariable"].constructor === Array) {
                for (let item of data["ChartVariable"]) {
                    this.chartVariable.push(ChartVariables.fromJS(item));
                }
            }
            if (data["ChartMapping"] && data["ChartMapping"].constructor === Array) {
                for (let item of data["ChartMapping"]) {
                    this.chartMapping.push(ChartMapping.fromJS(item));
                }
            }
            if (data["chartData"] && data["chartData"].constructor === Array) {
                for (let item of data["chartData"]) {
                    this.chartData.push(PieChart.fromJS(item));
                }
            }
        }
    }
    static fromJS(data?: any): PieChartOptions {
        return new PieChartOptions(data);
    }
}
export class ChordChartOptions {
    chartData: any[] = [];
    chartVariable: ChartVariables[] = [];
    chartMapping: ChartMapping[] = [];// pending some fields
    subDatasetKey: string;
    datasetKey: string;
    AnalysisDatasetFlag: string;
    AnalysisKey: string;
    chartVisualizationType: string;
    chordChartLabelFontColourPallet: string;
    chordChartLabelFontSize: string;
    wordCloudWordRotation: string;
    chordChartWidth: string;
    chordChartLabelFontType: string;
    chordChartDescription: string;
    chordChartHeight: string;
    chordChartLegendFlag: string;
    chordChartTitle: string;

    constructor(data?: any) {
        if (data !== undefined) {
            this.chordChartLabelFontColourPallet = data["chordChartLabelFontColourPallet"] !== undefined ? data["chordChartLabelFontColourPallet"] : null;
            this.chordChartLabelFontSize = data["chordChartLabelFontSize"] !== undefined ? data["chordChartLabelFontSize"] : null;
            this.wordCloudWordRotation = data["wordCloudWordRotation"] !== undefined ? data["wordCloudWordRotation"] : null;
            this.chordChartWidth = data["chordChartWidth"] !== undefined ? data["chordChartWidth"] : null;
            this.chordChartLabelFontType = data["chordChartLabelFontType"] !== undefined ? data["chordChartLabelFontType"] : null;
            this.chartVisualizationType = data["chartVisualizationType"] !== undefined ? data["chartVisualizationType"] : null;
            this.datasetKey = data["datasetKey"] !== undefined ? data["datasetKey"] : null;
            this.subDatasetKey = data["subDatasetKey"] !== undefined ? data["subDatasetKey"] : null;
            this.chordChartDescription = data["chordChartDescription"] !== undefined ? data["chordChartDescription"] : null;
            this.chordChartHeight = data["chordChartHeight"] !== undefined ? data["chordChartHeight"] : null;
            this.chordChartLegendFlag = data["chordChartLegendFlag"] !== undefined ? data["chordChartLegendFlag"] : null;
            this.AnalysisDatasetFlag = data["AnalysisDatasetFlag"] !== undefined ? data["AnalysisDatasetFlag"] : null;
            this.AnalysisKey = data["AnalysisKey"] !== undefined ? data["AnalysisKey"] : null;
            this.chordChartTitle = data["chordChartTitle"] !== undefined ? data["chordChartTitle"] : null;

            if (data["ChartVariable"] && data["ChartVariable"].constructor === Array) {
                for (let item of data["ChartVariable"]) {
                    this.chartVariable.push(ChartVariables.fromJS(item));
                }
            }
            if (data["ChartMapping"] && data["ChartMapping"].constructor === Array) {
                for (let item of data["ChartMapping"]) {
                    this.chartMapping.push(ChartMapping.fromJS(item));
                }
            }
            if (data["chartData"]) {
                //for (let item of data["chartData"]) {
                this.chartData.push(ChordChart.fromJS(data["chartData"]));
                //}
            }
        }
    }
    static fromJS(data?: any): ChordChartOptions {
        return new ChordChartOptions(data);
    }
}

export class LineChartOptions {
    chartData: LineChart[] = [];
    ChartVariable: ChartVariables[] = [];
    ChartMapping: string[] = [];// pending some fields
    wordCloudDescription: string;
    wordCloudWordRotation: string;
    wordCloudLegendFlag: string;
    datasetKey: string;
    wordCloudLabelFontSize: string;
    chartVisualizationType: string;
    wordCloudWidth: string;
    subDatasetKey: string;
    wordCloudTitle: string;
    wordCloudLabelFontColourPallet: string;
    wordCloudLabelFontType: string;
    AnalysisDatasetFlag: string;
    AnalysisKey: string;
    wordCloudHeight: string;

    constructor(data?: any) {
        if (data !== undefined) {
            this.wordCloudDescription = data["wordCloudDescription"] !== undefined ? data["wordCloudDescription"] : null;
            this.wordCloudWordRotation = data["wordCloudWordRotation"] !== undefined ? data["wordCloudWordRotation"] : null;
            this.wordCloudLegendFlag = data["wordCloudLegendFlag"] !== undefined ? data["wordCloudLegendFlag"] : null;
            this.datasetKey = data["datasetKey"] !== undefined ? data["datasetKey"] : null;
            this.wordCloudLabelFontSize = data["wordCloudLabelFontSize"] !== undefined ? data["wordCloudLabelFontSize"] : null;
            this.chartVisualizationType = data["chartVisualizationType"] !== undefined ? data["chartVisualizationType"] : null;
            this.wordCloudWidth = data["wordCloudWidth"] !== undefined ? data["wordCloudWidth"] : null;
            this.subDatasetKey = data["subDatasetKey"] !== undefined ? data["subDatasetKey"] : null;
            this.wordCloudTitle = data["wordCloudTitle"] !== undefined ? data["wordCloudTitle"] : null;
            this.wordCloudLabelFontColourPallet = data["wordCloudLabelFontColourPallet"] !== undefined ? data["wordCloudLabelFontColourPallet"] : null;
            this.wordCloudLabelFontType = data["wordCloudLabelFontType"] !== undefined ? data["wordCloudLabelFontType"] : null;
            this.AnalysisDatasetFlag = data["AnalysisDatasetFlag"] !== undefined ? data["AnalysisDatasetFlag"] : null;
            this.AnalysisKey = data["AnalysisKey"] !== undefined ? data["AnalysisKey"] : null;
            this.wordCloudHeight = data["wordCloudHeight"] !== undefined ? data["wordCloudHeight"] : null;

            if (data["ChartVariable"] && data["ChartVariable"].constructor === Array) {
                for (let item of data["ChartVariable"]) {
                    this.ChartVariable.push(ChartVariables.fromJS(item));
                }
            }
            if (data["chartData"] && data["chartData"].constructor === Array) {
                for (let item of data["chartData"]) {
                    this.chartData.push(LineChart.fromJS(item));
                }
            }
        }
    }
    static fromJS(data?: any): LineChartOptions {
        return new LineChartOptions(data);
    }
}

export class DonutChartOptions {
    chartData: DonutChart[] = [];
    ChartVariable: ChartVariables[] = [];
    ChartMapping: string[] = [];// pending some fields
    wordCloudDescription: string;
    wordCloudWordRotation: string;
    wordCloudLegendFlag: string;
    datasetKey: string;
    wordCloudLabelFontSize: string;
    chartVisualizationType: string;
    wordCloudWidth: string;
    subDatasetKey: string;
    wordCloudTitle: string;
    wordCloudLabelFontColourPallet: string;
    wordCloudLabelFontType: string;
    AnalysisDatasetFlag: string;
    AnalysisKey: string;
    wordCloudHeight: string;

    constructor(data?: any) {
        if (data !== undefined) {
            this.wordCloudDescription = data["wordCloudDescription"] !== undefined ? data["wordCloudDescription"] : null;
            this.wordCloudWordRotation = data["wordCloudWordRotation"] !== undefined ? data["wordCloudWordRotation"] : null;
            this.wordCloudLegendFlag = data["wordCloudLegendFlag"] !== undefined ? data["wordCloudLegendFlag"] : null;
            this.datasetKey = data["datasetKey"] !== undefined ? data["datasetKey"] : null;
            this.wordCloudLabelFontSize = data["wordCloudLabelFontSize"] !== undefined ? data["wordCloudLabelFontSize"] : null;
            this.chartVisualizationType = data["chartVisualizationType"] !== undefined ? data["chartVisualizationType"] : null;
            this.wordCloudWidth = data["wordCloudWidth"] !== undefined ? data["wordCloudWidth"] : null;
            this.subDatasetKey = data["subDatasetKey"] !== undefined ? data["subDatasetKey"] : null;
            this.wordCloudTitle = data["wordCloudTitle"] !== undefined ? data["wordCloudTitle"] : null;
            this.wordCloudLabelFontColourPallet = data["wordCloudLabelFontColourPallet"] !== undefined ? data["wordCloudLabelFontColourPallet"] : null;
            this.wordCloudLabelFontType = data["wordCloudLabelFontType"] !== undefined ? data["wordCloudLabelFontType"] : null;
            this.AnalysisDatasetFlag = data["AnalysisDatasetFlag"] !== undefined ? data["AnalysisDatasetFlag"] : null;
            this.AnalysisKey = data["AnalysisKey"] !== undefined ? data["AnalysisKey"] : null;
            this.wordCloudHeight = data["wordCloudHeight"] !== undefined ? data["wordCloudHeight"] : null;

            if (data["ChartVariable"] && data["ChartVariable"].constructor === Array) {
                for (let item of data["ChartVariable"]) {
                    this.ChartVariable.push(ChartVariables.fromJS(item));
                }
            }
            if (data["chartData"] && data["chartData"].constructor === Array) {
                for (let item of data["chartData"]) {
                    this.chartData.push(DonutChart.fromJS(item));
                }
            }
        }
    }
    static fromJS(data?: any): DonutChartOptions {
        return new DonutChartOptions(data);
    }
}

export class BarChartOptions {
    chartData: BarChart[] = [];
    ChartVariable: ChartVariables[] = [];
    ChartMapping: string[] = [];// pending some fields
    wordCloudDescription: string;
    wordCloudWordRotation: string;
    wordCloudLegendFlag: string;
    datasetKey: string;
    wordCloudLabelFontSize: string;
    chartVisualizationType: string;
    wordCloudWidth: string;
    subDatasetKey: string;
    wordCloudTitle: string;
    wordCloudLabelFontColourPallet: string;
    wordCloudLabelFontType: string;
    AnalysisDatasetFlag: string;
    AnalysisKey: string;
    wordCloudHeight: string;

    constructor(data?: any) {
        if (data !== undefined) {
            this.wordCloudDescription = data["wordCloudDescription"] !== undefined ? data["wordCloudDescription"] : null;
            this.wordCloudWordRotation = data["wordCloudWordRotation"] !== undefined ? data["wordCloudWordRotation"] : null;
            this.wordCloudLegendFlag = data["wordCloudLegendFlag"] !== undefined ? data["wordCloudLegendFlag"] : null;
            this.datasetKey = data["datasetKey"] !== undefined ? data["datasetKey"] : null;
            this.wordCloudLabelFontSize = data["wordCloudLabelFontSize"] !== undefined ? data["wordCloudLabelFontSize"] : null;
            this.chartVisualizationType = data["chartVisualizationType"] !== undefined ? data["chartVisualizationType"] : null;
            this.wordCloudWidth = data["wordCloudWidth"] !== undefined ? data["wordCloudWidth"] : null;
            this.subDatasetKey = data["subDatasetKey"] !== undefined ? data["subDatasetKey"] : null;
            this.wordCloudTitle = data["wordCloudTitle"] !== undefined ? data["wordCloudTitle"] : null;
            this.wordCloudLabelFontColourPallet = data["wordCloudLabelFontColourPallet"] !== undefined ? data["wordCloudLabelFontColourPallet"] : null;
            this.wordCloudLabelFontType = data["wordCloudLabelFontType"] !== undefined ? data["wordCloudLabelFontType"] : null;
            this.AnalysisDatasetFlag = data["AnalysisDatasetFlag"] !== undefined ? data["AnalysisDatasetFlag"] : null;
            this.AnalysisKey = data["AnalysisKey"] !== undefined ? data["AnalysisKey"] : null;
            this.wordCloudHeight = data["wordCloudHeight"] !== undefined ? data["wordCloudHeight"] : null;

            if (data["ChartVariable"] && data["ChartVariable"].constructor === Array) {
                for (let item of data["ChartVariable"]) {
                    this.ChartVariable.push(ChartVariables.fromJS(item));
                }
            }
            if (data["chartData"] && data["chartData"].constructor === Array) {
                for (let item of data["chartData"]) {
                    this.chartData.push(BarChart.fromJS(item));
                }
            }
        }
    }
    static fromJS(data?: any): BarChartOptions {
        return new BarChartOptions(data);
    }
}

export class HorizontalBarChartOptions {
    chartData: HorizontalBarChart[] = [];
    ChartVariable: ChartVariables[] = [];
    ChartMapping: string[] = [];// pending some fields
    wordCloudDescription: string;
    wordCloudWordRotation: string;
    wordCloudLegendFlag: string;
    datasetKey: string;
    wordCloudLabelFontSize: string;
    chartVisualizationType: string;
    wordCloudWidth: string;
    subDatasetKey: string;
    wordCloudTitle: string;
    wordCloudLabelFontColourPallet: string;
    wordCloudLabelFontType: string;
    AnalysisDatasetFlag: string;
    AnalysisKey: string;
    wordCloudHeight: string;

    constructor(data?: any) {
        if (data !== undefined) {
            this.wordCloudDescription = data["wordCloudDescription"] !== undefined ? data["wordCloudDescription"] : null;
            this.wordCloudWordRotation = data["wordCloudWordRotation"] !== undefined ? data["wordCloudWordRotation"] : null;
            this.wordCloudLegendFlag = data["wordCloudLegendFlag"] !== undefined ? data["wordCloudLegendFlag"] : null;
            this.datasetKey = data["datasetKey"] !== undefined ? data["datasetKey"] : null;
            this.wordCloudLabelFontSize = data["wordCloudLabelFontSize"] !== undefined ? data["wordCloudLabelFontSize"] : null;
            this.chartVisualizationType = data["chartVisualizationType"] !== undefined ? data["chartVisualizationType"] : null;
            this.wordCloudWidth = data["wordCloudWidth"] !== undefined ? data["wordCloudWidth"] : null;
            this.subDatasetKey = data["subDatasetKey"] !== undefined ? data["subDatasetKey"] : null;
            this.wordCloudTitle = data["wordCloudTitle"] !== undefined ? data["wordCloudTitle"] : null;
            this.wordCloudLabelFontColourPallet = data["wordCloudLabelFontColourPallet"] !== undefined ? data["wordCloudLabelFontColourPallet"] : null;
            this.wordCloudLabelFontType = data["wordCloudLabelFontType"] !== undefined ? data["wordCloudLabelFontType"] : null;
            this.AnalysisDatasetFlag = data["AnalysisDatasetFlag"] !== undefined ? data["AnalysisDatasetFlag"] : null;
            this.AnalysisKey = data["AnalysisKey"] !== undefined ? data["AnalysisKey"] : null;
            this.wordCloudHeight = data["wordCloudHeight"] !== undefined ? data["wordCloudHeight"] : null;

            if (data["ChartVariable"] && data["ChartVariable"].constructor === Array) {
                for (let item of data["ChartVariable"]) {
                    this.ChartVariable.push(ChartVariables.fromJS(item));
                }
            }
            if (data["chartData"] && data["chartData"].constructor === Array) {
                for (let item of data["chartData"]) {
                    this.chartData.push(HorizontalBarChart.fromJS(item));
                }
            }
        }
    }
    static fromJS(data?: any): HorizontalBarChart {
        return new HorizontalBarChart(data);
    }
}


export class ChartVariables {
    type: string;
    variableName: string;
    constructor(data?: any) {
        if (data !== undefined) {
            this.type = data["type"] !== undefined ? data["type"] : null;
            this.variableName = data["variableName"] !== undefined ? data["variableName"] : null;
        }
    }
    static fromJS(data?: any): ChartVariables {
        return new ChartVariables(data);
    }
}

export interface Pie {
    label: string;
    measure: number;
}
export interface Donut {
    name: string;
    count: number;
    percentage: number;
    color: any;
}
export enum ChartType {
    WORD = 1,
    CHORD,
    PIE,
    DONUT,
    LINE,
    BAR,
    HORIZONTALBAR
}


/*class chartSpecificOptionsDetails
*/


//export class chartSpecificOptionsDetails {
//    datasetKey: string;
//    chordChartWidth: string;
//    chartVisualizationType: string;
//    chordChartLabelFontType: string;
//    subDatasetKey: string;
//    chordChartLabelFontSize: string;
//    chordChartOuterRadius: string;
//    chordChartLabelFontColour: string;
//    ChartVariable: string[] = [];
//    analysisDatasetFlag: string;
//    analysisKey: string;
//    chordChartInnerRadius: string;
//    chordChartHeight: string;
//    ChartMapping: chartMappingDetails;
//    chordChartTitle: string;
//    constructor(data?: any) {
//        // debugger;
//        if (data !== undefined) {
//            this.datasetKey = data["datasetKey"] !== undefined ? data["datasetKey"] : null;
//            this.chordChartWidth = data["chordChartWidth"] !== undefined ? data["chordChartWidth"] : null;
//            this.chartVisualizationType = data["chartVisualizationType"] !== undefined ? data["chartVisualizationType"] : null;
//            this.chordChartLabelFontType = data["chordChartLabelFontType"] !== undefined ? data["chordChartLabelFontType"] : null;
//            this.subDatasetKey = data["subDatasetKey"] !== undefined ? data["subDatasetKey"] : null;
//            this.chordChartLabelFontSize = data["chordChartLabelFontSize"] !== undefined ? data["chordChartLabelFontSize"] : null;
//            this.chordChartOuterRadius = data["chordChartOuterRadius"] !== undefined ? data["chordChartOuterRadius"] : null;
//            this.chordChartLabelFontColour = data["chordChartLabelFontColour"] !== undefined ? data["chordChartLabelFontColour"] : null;
//            this.ChartVariable = data["ChartVariable"] !== undefined ? data["ChartVariable"] : null;
//            this.analysisDatasetFlag = data["analysisDatasetFlag"] !== undefined ? data["analysisDatasetFlag"] : null;
//            this.analysisKey = data["analysisKey"] !== undefined ? data["analysisKey"] : null;
//            this.chordChartInnerRadius = data["chordChartInnerRadius"] !== undefined ? data["chordChartInnerRadius"] : null;
//            this.chordChartHeight = data["chordChartHeight"] !== undefined ? data["chordChartHeight"] : null;
//            this.ChartMapping = data["ChartMapping"] !== undefined ? data["ChartMapping"] : null;
//            this.chordChartTitle = data["chordChartTitle"] !== undefined ? data["chordChartTitle"] : null;

//        }
//    }

//    static fromJS(data: any): chartSpecificOptionsDetails {
//        return new chartSpecificOptionsDetails(data);
//    }
//    toJS(data?: any) {

//    }
//}



export class ChartMapping {
    measures: MeasureDetails[] = [];
    dimension: DimensionDetails[] = [];
    constructor(data?: any) {
        if (data !== undefined) {
            this.measures = data["measures"] !== undefined ? data["measures"] : "";
            this.dimension = data["dimension"] !== undefined ? data["dimension"] : "";
        }
    }
    static fromJS(data: any): ChartMapping {
        return new ChartMapping(data);
    }
}



export class MeasureDetails {
    mapping: string;
    aggregation: string;
    variableName: string;
    constructor(data?: any) {
        if (data !== undefined) {
            this.mapping = data["mapping"] !== undefined ? data["mapping"] : "";
            this.aggregation = data["aggregation"] !== undefined ? data["aggregation"] : "";
            this.variableName = data["variableName"] !== undefined ? data["variableName"] : "";

        }
    }
    static fromJS(data: any): MeasureDetails {
        return new MeasureDetails(data);
    }
}


export class DimensionDetails {
    legendrule: LegendRuleDetails;
    mapping: string;
    variablename: string;
    constructor(data?: any) {
        if (data !== undefined) {
            this.legendrule = data["legendrule"] !== undefined ? data["legendrule"] : "";
            this.mapping = data["mapping"] !== undefined ? data["mapping"] : "";
            this.variablename = data["variablename"] !== undefined ? data["variablename"] : "";

        }
    }
    static fromjs(data: any): DimensionDetails {
        return new DimensionDetails(data);
    }
}


export class LegendRuleDetails {
    legendFlag: string;
    legendName: string;
    legendFont: string;
    rule: string;
    legendColour: string;

    constructor(data?: any) {
        if (data !== undefined) {
            this.legendFlag = data["legendFlag"] !== undefined ? data["legendFlag"] : "";
            this.legendName = data["legendName"] !== undefined ? data["legendName"] : "";
            this.legendFont = data["legendFont"] !== undefined ? data["legendFont"] : "";
            this.rule = data["rule"] !== undefined ? data["rule"] : "";
            this.legendColour = data["legendColour"] !== undefined ? data["legendColour"] : "";

        }
    }
    static fromJS(data: any): LegendRuleDetails {
        return new LegendRuleDetails(data);
    }
}
