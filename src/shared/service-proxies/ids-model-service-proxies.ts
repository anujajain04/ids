import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Injectable, Inject, Optional, OpaqueToken } from '@angular/core';
import { Http, Headers, Response, RequestOptionsArgs } from '@angular/http';
import { TokenService } from '@abp/auth/token.service';
import { TempBaseUrl, LoadingService, SubDatasetDto, DatasetFieldDto, DatasetResultModel } from '@shared/service-proxies/ids-service-proxies';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AnalysisDtoDetails, AnalysisService, AnalysisModelHistory } from '@shared/service-proxies/ids-analysis-service-proxies';
// all API request for ids
@Injectable()
export class ModelService {
    static isModelPage: boolean = false;
    private http: Http = null;
    protected jsonParseReviver: (key: string, value: any) => any = undefined;
    constructor( @Inject(Http) http: Http, private _session: TokenService) {
        this.http = http;
    }


    createModel(input: any): Observable<ModelStudioResult> {
        return this.http.request(TempBaseUrl.BASE_URL + "models/", {
            body: input,
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processCreateModel(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processCreateModel(response));
                } catch (e) {
                    return <Observable<ModelStudioResult>><any>Observable.throw(e);
                }
            } else
                return <Observable<ModelStudioResult>><any>Observable.throw(response);
        });
    }
    protected processCreateModel(response: Response): ModelStudioResult {
        debugger;
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: ModelStudioResult;
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            result = ModelStudioResult.fromJS(result200);
            return result;
        }
        return null;
    }

    getModelForModel(key: any): Observable<any> {
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


    getSidePane1(): Observable<any[]> {
        //const _content = JSON.stringify({
        //    workspaceKey: TempBaseUrl.WORKSPACEKEY,
        //    sessionKey: this._session.getToken()
        //});
        debugger
        return this.http.request(TempBaseUrl.BASE_URL + "models/getTaskPaneListModel/", {
            method: "GET",
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
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: any[] = [];
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            debugger;
            if (result200["taskModelList"]["functions"] && result200["taskModelList"]["functions"].constructor === Array) {
                for (let x of result200["taskModelList"]["functions"]) {
                    result.push(TaskDto.fromJS(x));
                }
            }
            if (result200["taskModelList"]["datasetList"]) {
                for (let x of result200["taskModelList"]["datasetList"]) {
                    result.push(Reader.fromJS(x));
                }
            }
            if (result200["taskModelList"]["modelList"]) {
                for (let x of result200["taskModelList"]["modelList"]) {
                    result.push(TaskModel.fromJS(x));
                }
            }
            // if (result200["taskModelList"]["datasetList"]) {

            //     let j: ReaderDto = new ReaderDto();
            //     j.title = "RDBMS";
            //     for (let x of result200["taskModelList"]["reader"]["RDBMS"]) {
            //         j.readerData.push(Reader.fromJS(x));
            //         //result.push(Reader.fromJS(result200["taskModelList"]["reader"]));
            //     }
            //     result.push(j);

            //     j = new ReaderDto();
            //     j.title = "Twitter";

            //     for (let x of result200["taskModelList"]["reader"]["Twitter"]) {
            //         j.readerData.push(Reader.fromJS(x));
            //         //result.push(Reader.fromJS(result200["taskModelList"]["reader"]));
            //     }
            //     result.push(j);

            //      j = new ReaderDto();
            //     j.title = "Excel";

            //     for (let x of result200["taskModelList"]["reader"]["Excel"]) {
            //         j.readerData.push(Reader.fromJS(x));
            //         //result.push(Reader.fromJS(result200["taskModelList"]["reader"]));
            //     }
            //     result.push(j);

            //      j = new ReaderDto();
            //      j.title = "Facebook";

            //     for (let x of result200["taskModelList"]["reader"]["Facebook"]) {
            //         j.readerData.push(Reader.fromJS(x));
            //         //result.push(Reader.fromJS(result200["taskModelList"]["reader"]));
            //     }
            //     result.push(j);

            //     j = new ReaderDto();
            //     j.title = "File";

            //     for (let x of result200["taskModelList"]["reader"]["File"]) {
            //         j.readerData.push(Reader.fromJS(x));
            //         //result.push(Reader.fromJS(result200["taskModelList"]["reader"]));
            //     }
            //     result.push(j);

            //     j = new ReaderDto();
            //     j.title = "RSS";

            //     for (let x of result200["taskModelList"]["reader"]["RSS"]) {
            //         j.readerData.push(Reader.fromJS(x));
            //         //result.push(Reader.fromJS(result200["taskModelList"]["reader"]));
            //     }
            //     result.push(j);



            // }

            return result;
        }
        return null;
    }

    modelList(): Observable<ModelListDto[]> {
        debugger
        return this.http.request(TempBaseUrl.BASE_URL + "models/", {
            method: "get",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processmodelList(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processmodelList(response));
                } catch (e) {
                    return <Observable<ModelListDto[]>><any>Observable.throw(e);
                }
            } else
                return <Observable<ModelListDto[]>><any>Observable.throw(response);
        });
    }
    protected processmodelList(response: Response): ModelListDto[] {
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: ModelListDto[] = [];
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            if (result200["modelList"] && result200["modelList"].constructor == Array) {
                let p = result200["modelList"];
                for (let item of p) {
                    result.push(ModelListDto.fromJS(item));
                }
                return result;
            }


        }
        return null;
    }

    deletemodel(input: string, key: string): Observable<any> {

        return this.http.request(TempBaseUrl.BASE_URL + "models/" + key + "/", {
            method: "delete",
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
    protected processDeleteModel(response: Response): DatasetResultModel {
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




    RunModel(input: string): Observable<DatasetResultModel> {
        debugger;
        return this.http.request(TempBaseUrl.BASE_URL + "models/" + input + "/runModel/", {
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
                    return <Observable<DatasetResultModel>><any>Observable.throw(e);
                }
            } else
                return <Observable<DatasetResultModel>><any>Observable.throw(response);
        });
    }
    protected processRunModel(response: Response): DatasetResultModel {
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

    getModelHistory(input: any, key: string): Observable<AnalysisModelHistory[]> {
        debugger;
        return this.http.request(TempBaseUrl.BASE_URL + "models/" + key + "/getModelHistory/", {
            method: "post",
            body: input,
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processModelHistory(response);
        }).catch((response: any, caught: any) => {
            debugger;
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processModelHistory(response));
                } catch (e) {
                    return <Observable<AnalysisModelHistory[]>><any>Observable.throw(e);
                }
            } else
                return <Observable<AnalysisModelHistory[]>><any>Observable.throw(response);
        });
    }
    protected processModelHistory(response: Response): AnalysisModelHistory[] {
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


    getModelStatus(input: string): Observable<DatasetResultModel> {

        return this.http.request(TempBaseUrl.BASE_URL + "models/" + input + "/getModelStatus/", {
            method: "get",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processModelStatus(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processModelStatus(response));
                } catch (e) {
                    return <Observable<DatasetResultModel>><any>Observable.throw(e);
                }
            } else
                return <Observable<DatasetResultModel>><any>Observable.throw(response);
        });
    }
    protected processModelStatus(response: Response): DatasetResultModel {
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

    AbortModel(input: string): Observable<any> {
        debugger;
        return this.http.request(TempBaseUrl.BASE_URL + "models/" + input + "/abortModel/", {
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
    protected processAbortModel(response: Response): DatasetResultModel {
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

    ValidateModel(input: string): Observable<DatasetResultModel> {

        return this.http.request(TempBaseUrl.BASE_URL + "models/" + input + "/validateModel/", {
            method: "get",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processValidateModel(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processValidateModel(response));
                } catch (e) {
                    return <Observable<DatasetResultModel>><any>Observable.throw(e);
                }
            } else
                return <Observable<DatasetResultModel>><any>Observable.throw(response);
        });
    }
    protected processValidateModel(response: Response): DatasetResultModel {
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


    trainTestModel(input: string): Observable<any> {
        debugger;
        return this.http.request(TempBaseUrl.BASE_URL + "models/" + input + "/trainTestModel/", {
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
    protected processtrainTestModel(response: Response): any {
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: any = null;
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver)
            result = DatasetResultModel.fromJS(result200, null);
            return result;
        }
        return null;
    }


    AlgorithmtypeModel(): Observable<AlgorithmType[]> {
        return this.http.request(TempBaseUrl.BASE_URL + "models/getAlgorithmTypeList/", {
            method: "get",
            headers: new Headers({
                "Content-Type": "application/json;charset=UTF-8",
                "Accept": "application/json;charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processgetalgorithmtype(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processgetalgorithmtype(response));
                } catch (e) {
                    return <Observable<AlgorithmType[]>><any>Observable.throw(e);
                }
            } else
                return <Observable<AlgorithmType[]>><any>Observable.throw(response);
        });
    }
    protected processgetalgorithmtype(response: Response): AlgorithmType[] {
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: AlgorithmType[] = [];
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            if (result200 && result200.constructor === Array) {
                for (let item of result200) {
                    result.push(AlgorithmType.fromJS(item));
                }
                return result;
            }
        }
        return null;
    }


    AlgorithmInstance(input: string): Observable<AlgorithmInstance[]> {
        return this.http.request(TempBaseUrl.BASE_URL + "algorithm/" + input, {
            method: "get",
            headers: new Headers({
                "Content-Type": "application/json;charset=UTF-8",
                "Accept": "application/json;charset=UTF-8"
            })
        }).map((response) => {
            return this.processgetalgorithmInstance(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processgetalgorithmInstance(response));
                } catch (e) {
                    return <Observable<AlgorithmInstance[]>><any>Observable.throw(e);
                }
            } else
                return <Observable<AlgorithmInstance[]>><any>Observable.throw(response);
        });
    }
    protected processgetalgorithmInstance(response: Response): AlgorithmInstance[] {
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: AlgorithmInstance[] = [];
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            if (result200["algorithmData"] && result200["algorithmData"].constructor === Array) {
                for (let item of result200["algorithmData"]) {
                    result.push(AlgorithmInstance.fromJS(item));
                }
                return result;
            }
        }
        return null;

    }

    AlgorithmParameter(input: string): Observable<AlgorithmParameters[]> {
        return this.http.request(TempBaseUrl.BASE_URL + "algorithm/" + input + "getAlgorithmVariables/", {
            method: "get",
            headers: new Headers({
                "Content-Type": "application/json;charset=UTF-8",
                "Accept": "application/json;charset=UTF-8"
            })
        }).map((response) => {
            return this.processgetalgorithmparameter(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processgetalgorithmparameter(response));
                } catch (e) {
                    return <Observable<AlgorithmParameters[]>><any>Observable.throw(e);
                }
            } else
                return <Observable<AlgorithmParameters[]>><any>Observable.throw(response);

        })
    }
    protected processgetalgorithmparameter(response: Response): AlgorithmParameters[] {
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: AlgorithmParameters[] = [];
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            if (result200["algorithmTypeList"] && result200["algorithmTypeList"].constructor === Array) {
                for (let item of result200["algorithmTypeList"]) {
                    result.push(AlgorithmParameters.fromJS(item));
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
            if (result200["algorithmlist"] && result200["algorithmlist"].constructor === Array) {
                for (let item of result200["algorithmlist"]) {
                    result.push(AlgorithmList.fromJS(item));
                }
                return result;
            }
        }
        return null;
    }
    editModel(value: any): Observable<CreatemodelDto> {
        return this.http.request(TempBaseUrl.BASE_URL + "models/" + value + "/", {
            method: "get",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            return this.processalEditModel(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processalEditModel(response));
                } catch (e) {
                    return <Observable<CreatemodelDto>><any>Observable.throw(e);
                }
            } else
                return <Observable<CreatemodelDto>><any>Observable.throw(response);
        });
    }
    protected processalEditModel(response: Response): CreatemodelDto {
        debugger;
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: any[] = [];
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            if (result200["statusCode"] == 1) {
                return CreatemodelDto.fromJS(result200["modelDetails"]);
            }

        }
        return null;
    }
    updateModel(key: string, value: any): Observable<any> {
        debugger;
        return this.http.request(TempBaseUrl.BASE_URL + "models/" + key, {
            body: value,
            method: "put",
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
                    return Observable.of(this.processCreateModel(response));
                } catch (e) {
                    return <Observable<any>><any>Observable.throw(e);
                }
            } else
                return <Observable<any>><any>Observable.throw(response);
        });
    }
    //Model Run Log -------------------------------------------


    getPollingfunctionality(input: string): Observable<any> {

        return this.http.request(TempBaseUrl.BASE_URL + "models/" + input + "/getModelStatus/", {
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
                    return null;
                }
            } else
                return null;
        });
    }



    ModelRunLog(input: string): Observable<ModelRunLogDetails[]> {
        debugger;
        return this.http.request(TempBaseUrl.BASE_URL + "models/" + input + "/viewModelRunLog/", {
            method: "get",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processModelRunLog(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processModelRunLog(response));
                } catch (e) {
                    return <Observable<ModelRunLogDetails[]>><any>Observable.throw(e);
                }
            } else
                return <Observable<ModelRunLogDetails[]>><any>Observable.throw(response);
        });
    }
    protected processModelRunLog(response: Response): ModelRunLogDetails[] {
        const responseText = response.text();
        const status = response.status;
        //if (status === 200) {
        //    let result: DatasetResultModel = null;
        //    let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver)
        //    result = DatasetResultModel.fromJS(result200, null);
        //    return result;
        //}
        //return null;
        if (status === 200) {
            let result: ModelRunLogDetails[] = [];
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            if (result200["statusMessage"] && result200["statusMessage"].constructor === Array) {
                let p = result200["statusMessage"];
                for (let item of p) {
                    result.push(ModelRunLogDetails.fromJS(item));
                }
                return result;
            }
        }
        return null;
    }






    //--------------------------------------------
}
@Injectable()
export class ModelStudioConfig {
    isPreProcessor: boolean = null;
    isEdit: boolean = null;
    isValidate: boolean = null;
    createResult: ModelStudioResult = new ModelStudioResult();
    taskType: TaskType = null;
    currentReader: Reader = new Reader();
    currentCleanser: TaskDto = new TaskDto();
    currentSampler: TaskDto = new TaskDto();
    currentFunction: TaskDto = new TaskDto();
    currentModel: TaskModel = new TaskModel();
    currentTrainValidate: TaskDto = new TaskDto();
    currentPosition: number = 0;
    taskElements: any[] = [];//preprocesing
    taskElements1: any[] = [];//processing
    validateElements: any[] = [];
    modelRunningStatus: boolean = false;
    finalModel: CreatemodelDto;
    updateModel: CreatemodelDto;
    clearAll() {
        this.modelRunningStatus = false;
        this.isEdit = false;
        this.isValidate = false;
        this.createResult = new ModelStudioResult();
        this.finalModel = new CreatemodelDto();
        this.updateModel = null;
        this.taskType = null;
        this.currentCleanser = null;
        this.currentFunction = null;
        this.currentModel = null;
        this.currentPosition = 0;
        this.currentReader = null;
        this.currentTrainValidate = null;
        this.taskElements = [];
        this.taskElements1 = [];
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


export class ModelRunLogDetails {
    status: string;
    startDate: string;
    endDate: string;
    taskType: string;
    analysisKey: string;
    taskName: string;

    constructor(data?: any) {
        debugger;
        if (data !== undefined) {
            this.status = data["status"] !== undefined ? data["status"] : null;
            this.startDate = data["startDate"] !== undefined ? data["startDate"] : null;
            this.endDate = data["endDate"] !== undefined ? data["endDate"] : null;
            this.taskType = data["taskType"] !== undefined ? data["taskType"] : null;
            //this.analysisKey = data["analysisKey"] !== undefined ? data["analysisKey"] : null;
            this.taskName = data["taskName"] !== undefined ? data["taskName"] : null;

        }
    }

    static fromJS(data: any): ModelRunLogDetails {
        return new ModelRunLogDetails(data);
    }
    toJS(data?: any) {

    }
}


export class TaskDto {
    id: number = 0;
    tType: string;
    className: string;
    operationClass: string;
    definateOprVar: boolean;
    entityName: string;
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
    cleanseText: Variables = new Variables(0, "", "", "", "", "", "", false);
    classText: Variables = new Variables(0, "", "", "", "", "", "", false);
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
    noOfEstimators: string = "";

    tolerance: string = "";
    testDatasetId: string = "";
    testDatasetName: string = "";
    testSubDatasetId: string = "";
    filePath: string = "NA";
    algorithmTypeKey_id: string;
    variableList: Variables[] = [];

    selectedVariable: Variables[] = [];
    allVariables: Variables[] = [];

    leftVariables: Variables[] = [];
    rightVariables: Variables[] = [];
    operationalVariables: Variables[] = [];

    taskProperties: TaskProperties;
    mapping: Mapping[] = [];
    //-----Kanchan------------------------
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

    constructor(data?: any) {
        // debugger;
        if (data !== undefined) {
            this.className = data["className"] !== undefined ? data["className"] : "";
            this.algorithmTypeKey_id = data["algorithmTypeKey_id"] !== undefined ? data["algorithmTypeKey_id"] : "";
            this.operationClass = data["operationClass"] !== undefined ? data["operationClass"] : "";
            this.definateOprVar = data["definateOprVar"] !== undefined ? data["definateOprVar"] : null;
            this.entityName = data["entityName"] !== undefined ? data["entityName"] : null;
            this.tType = data["className"] !== undefined ? data["className"] : null;
            this.entityType = data["entityType"] !== undefined ? data["entityType"] : null;
            this.inputOprVarSameAsOutputOprVarFlag = data["inputOprVarSameAsOutputOprVarFlag"] !== undefined ? data["inputOprVarSameAsOutputOprVarFlag"] : null;
            if (data["entityType"] !== undefined)
                if ((<string>data["entityType"]).toLowerCase() === "cleanser")
                    this.taskType = TaskType.CLEANSER;
                else if ((<string>data["entityType"]).toLowerCase() === "sampler")
                    this.taskType = TaskType.SAMPLER;
                else if ((<string>data["entityType"]).toLowerCase() === "function")
                    this.taskType = TaskType.FUNCTION;
            if (data["taskType"] !== undefined)
                if ((<string>data["taskType"]).toLowerCase() === "traintest")
                    this.taskType = TaskType.TRAINTEST;
                else if ((<string>data["taskType"]).toLowerCase() === "validate")
                    this.taskType = TaskType.VALIDATE;

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
            this.noOfIteration = data["numberOfIterations"] !== undefined ? data["numberOfIterations"] : "";
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
            this.noOfEstimators = data["noOfEstimators"] !== undefined ? data["noOfEstimators"] : "";
        }
    }
    get compare() {
        if (this.taskType === TaskType.READER)
            return this.entityKey + "Reader"+this.id;
        else if (this.taskType === TaskType.CLEANSER)
            return this.entityKey + "Cleanser"+this.id;
        else if (this.taskType === TaskType.FUNCTION)
            return this.entityKey + "Function" + this.id;
        else if (this.taskType === TaskType.SAMPLER)
            return this.entityKey + "Sampler" + this.id;
        else if (this.taskType === TaskType.TRAINTEST)
            return "TrainTestModel";
        else if (this.taskType === TaskType.VALIDATE)
            return "ValidateModel";
    }
    static fromJS(data: any): TaskDto {
        return new TaskDto(data);
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        if (this.tType == "TrainTest" || this.tType == "Validate") {
            data["entityName"] = this.entityName !== undefined ? this.entityName : "";
            data["taskType"] = this.tType !== undefined ? this.tType : "";
        } else {
            data["entityName"] = this.entityName !== undefined ? this.entityName : "";
            data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
            data["entityType"] = this.entityType !== undefined ? this.entityType : "";
            data["entityKey"] = this.entityKey !== undefined ? this.entityKey : "";
            data["testDatasetId"] = this.testDatasetId !== undefined ? this.testDatasetId : "";
            data["testDatasetName"] = this.testDatasetName !== undefined ? this.testDatasetName : "";
            data["operationClass"] = this.className !== undefined ? this.className : "";
            data["testSubDatasetId"] = this.testSubDatasetId !== undefined ? this.testSubDatasetId : "";
            debugger;
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
                    data["numberOfIterations"] = this.noOfIteration !== undefined ? this.noOfIteration : "";
                    data["numberOfClusters"] = this.noOfCluster !== undefined ? this.noOfCluster : "";
                    data["toleranceValue"] = this.tolerance !== undefined ? this.tolerance : "";
                }
                if (this.className === "DensityAlgorithm") {
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
                    data["frequencyType"] = "word";
                    data["frequencyPOS"] = "adjective";
                    data["numberOfWords"] = this.noOfWords !== undefined ? this.noOfWords : "";
                } else if (this.className === "AdjectiveFrequencyAlgorithm") {
                    data["frequencyType"] = "word";
                    data["frequencyPOS"] = "adjective";
                } else if (this.className === "VerbFrequencyAlgorithm") {
                    data["frequencyType"] = "word";
                    data["frequencyPOS"] = "verb";
                }
                //Step 3:JSON Generation



                if (this.className === "SKLinearRegression") {

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
                else if (this.className === "SKRandomForestClassification") {
                  data["noOfEstimators"] = this.noOfEstimators !== undefined ? this.noOfEstimators : "";

                }

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
    modelTaken: boolean = false;
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
    cleanseText: Variables = new Variables(0, "", "", "", "", "", "", false);
    classText: Variables = new Variables(0, "", "", "", "", "", "", false);
    selectedField: DatasetFieldDto[] = [];
    fields: DatasetFieldDto[] = [];
    processingTask: any;
    selectedFieldItem: any;
    noOfIteration: string = "";

    //swapping list while selecting variables
    leftVariables: Variables[] = [];
    rightVariables: Variables[] = [];
    variableList: Variables[] = [];
    selectedVariable: Variables[] = [];
    allVariables: Variables[] = [];
    taskProperties: TaskProperties;
    mapping: Mapping[] = [];
    operationalVariables: Variables[] = [];
    // static flagsrue
    inputVarCarryFwdFlag: boolean = true;
    definateOprVar: boolean = true;
    reqOprInputVarNumSelection: boolean = false;
    inputOprVarSameAsOutputOprVarFlag: boolean = false;
    processing: any;
    modelVariable: Variables[] = [];
    constructor(data?: any) {
        // debugger;
        if (data !== undefined) {
            this.processId = data["processId"] !== undefined ? data["processId"] : null;
            this.operationClass = data["operationClass"] !== undefined ? data["operationClass"] : null;
            this.lastRunDate = data["lastRunDate"] !== undefined ? data["lastRunDate"] : null;
            this.entityName = data["entityName"] !== undefined ? data["entityName"] : null;
            this.entityType = data["entityType"] !== undefined ? data["entityType"] : null;
            this.Results = TaskModelResult.fromJS(data["results"]);
            this.modelType = data["modelType"] !== undefined ? data["modelType"] : null;
            this.entityKey = data["entityKey"] !== undefined ? data["entityKey"] : null;
            this.className = data["className"] !== undefined ? data["className"] : null;
            this.entityDescription = data["entityDescription"] !== undefined ? data["entityDescription"] : null;
            this.runFlag = data["runFlag"] !== undefined ? data["runFlag"] : null;
            this.readyFlag = data["readyFlag"] !== undefined ? data["readyFlag"] : null;
            this.modelVariable = data["modelVariable"] !== undefined ? data["modelVariable"] : null;
        }
    }
    get compare() {
        return this.entityKey + "Model"+this.id;
    }
    static fromJS(data: any): TaskModel {
        return new TaskModel(data);
    }
    //create json object for same class
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["operationClass"] = this.className !== undefined ? this.className : "";
        data["entityKey"] = this.entityKey !== undefined ? this.entityKey : "";
        data["processingTasks"] = this.processingTask !== undefined ? this.processingTask.modelData.Tasks : {};
        return data;
    }
    toJSON() {
        return JSON.stringify(this.toJS());
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

export class Reader {
    id: number = 0;
    connectionString: string;
    entityName: string;
    analysis: string;
    entityType: string;
    entityKey: string;
    className: string;
    entityDescription: string;
    parentKey: string;
    workspaceKey: string;
    columnDelimiter: string;
    workspaceName: string;
    rowDelimiter: string;
    filePath: string;
    datasetType: string;
    dashboardKey: string;
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
    // static flags
    inputVarCarryFwdFlag: boolean = false;
    definateOprVar: boolean = false;
    reqOprInputVarNumSelection: boolean = true;
    inputOprVarSameAsOutputOprVarFlag: boolean = false;

    constructor(data?: any) {
        // debugger;
        if (data !== undefined) {
            this.connectionString = data["connectionString"] !== undefined ? data["connectionString"] : null;
            this.datasetType = data["datasetType"] !== undefined ? data["datasetType"] : null;
            this.dashboardKey = data["dashboardKey"] !== undefined ? data["dashboardKey"] : null;
            this.columnDelimiter = data["columnDelimiter"] !== undefined ? data["columnDelimiter"] : null;
            this.workspaceKey = data["workspaceKey"] !== undefined ? data["workspaceKey"] : null;
            this.filePath = data["filePath"] !== undefined ? data["filePath"] : null;
            this.rowDelimiter = data["rowDelimiter"] !== undefined ? data["rowDelimiter"] : null;
            this.workspaceName = data["workspaceName"] !== undefined ? data["workspaceName"] : null;
            this.entityName = data["entityName"] !== undefined ? data["entityName"] : null;
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
    get compare() {
        return this.entityKey + "Reader"+this.id;
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
        data["dashboardKey"] = this.dashboardKey !== undefined ? this.dashboardKey : "";
        data["datasetType"] = this.datasetType !== undefined ? this.datasetType : "";
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["filePath"] = this.filePath !== undefined ? this.filePath : "";
        data["entityKey"] = this.entityKey !== undefined ? this.entityKey : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["className"] = this.className !== undefined ? this.className : "";
        data["operationClass"] = this.className !== undefined ? this.className : "";
        data["connectionString"] = this.connectionString !== undefined ? this.connectionString : "";
        data["rowDelimiter"] = this.rowDelimiter !== undefined ? this.rowDelimiter : "";
        data["workspaceKey"] = this.workspaceKey !== undefined ? this.workspaceKey : "";
        data["columnDelimiter"] = this.columnDelimiter !== undefined ? this.columnDelimiter : "";
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

export class Task {
    entityName: string;
    taskType: string;
    taskId: string;
    operationDict: any;
    predecessorID: string[] = [];
    successorID: string[] = [];
    predecessorName: string[] = [];
    successorName: string[] = [];
    mapping: string[] = [];
    variables: Variables[] = [];
    taskProperties: TaskProperties;
    constructor() {
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

        data["mapping"] = this.mapping !== undefined ? this.mapping : "";
        data["variables"] = [];
        if (this.variables && this.variables.constructor === Array) {
            for (let item of this.variables)
                data["variables"].push(item.toJS());
        }
        data["taskProperties"] = this.taskProperties.toJS();
        return data;
    }
}
export class TaskProperties {
    definateOprVar: boolean;
    inputOperationVariablesSameAsOutputOperationVariablesFlag: boolean;
    inputVarCarryFwdFlag: boolean;
    reqOprInputVarNumSelection: boolean;
    constructor(ov: boolean, vf: boolean, ff: boolean, ns: boolean) {
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
    constructor(id: any, dt: any, iof: string, idf: string, nm: string, vc: string, vt: string, isSelected: boolean) {
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
export class DeleteModelDto {
    sessionKey: string;
    entityList: string[] = [];
    constructor(data?: any) {
    }
    static fromJS(data: any): ModelListDto {
        return new ModelListDto(data);
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

export class ModelListDto {
    processId: string;
    lastRunDate: string;
    entityName: string;
    entityType: string;
    Results: string;
    modelType: string;
    entityKey: string;
    className: string;
    entityDescription: string;
    runFlag: string;
    parentKey: string;
    readyFlag: string;
    listResult: ModelAccuracy = new ModelAccuracy();
    modelHistory: AnalysisModelHistory = new AnalysisModelHistory();
    constructor(data?: any) {
        debugger;
        if (data !== undefined) {
            this.processId = data["processId"] !== undefined ? data["processId"] : null;
            this.lastRunDate = data["lastRunDate"] !== undefined ? data["lastRunDate"] : null;
            this.entityName = data["entityName"] !== undefined ? data["entityName"] : null;
            this.entityType = data["entityType"] !== undefined ? data["entityType"] : null;
            this.Results = data["Results"] !== undefined ? data["Results"] : null;
            this.modelType = data["modelType"] !== undefined ? data["modelType"] : null;
            this.entityKey = data["entityKey"] !== undefined ? data["entityKey"] : null;
            this.className = data["className"] !== undefined ? data["className"] : null;
            this.entityDescription = data["entityDescription"] !== undefined ? data["entityDescription"] : null;
            this.runFlag = data["runFlag"] !== undefined ? data["runFlag"] : null;
            this.parentKey = data["parentKey"] !== undefined ? data["parentKey"] : null;
            this.readyFlag = data["readyFlag"] !== undefined ? data["readyFlag"] : null;
            this.listResult = ModelAccuracy.fromJS(data["results"]);

        }
    }
    static fromJS(data: any): ModelListDto {
        return new ModelListDto(data);
    }

}

export class ModelIteration {
    iterationAccuracy: string;
    iterationF1Score: string;
    iterationPrecision: string;
    iterationRecall: string;
    iterationSupport: string;

    constructor(data?: any) {
        // debugger;
        if (data !== undefined) {
            this.iterationAccuracy = data["iterationAccuracy"] !== undefined ? data["iterationAccuracy"] : null;
            this.iterationF1Score = data["iterationF1Score"] !== undefined ? data["iterationF1Score"] : null;
            this.iterationPrecision = data["iterationPrecision"] !== undefined ? data["iterationPrecision"] : null;
            this.iterationRecall = data["iterationRecall"] !== undefined ? data["iterationRecall"] : null;
            this.iterationSupport = data["iterationSupport"] !== undefined ? data["iterationSupport"] : null;

        }
    }
    static fromJS(data: any): ModelIteration {
        return new ModelIteration(data);
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["iterationAccuracy"] = this.iterationAccuracy !== undefined ? this.iterationAccuracy : "";
        data["iterationF1Score"] = this.iterationF1Score !== undefined ? this.iterationF1Score : "";
        data["iterationPrecision"] = this.iterationPrecision !== undefined ? this.iterationPrecision : "";
        data["iterationRecall"] = this.iterationRecall !== undefined ? this.iterationRecall : "";
        data["iterationSupport"] = this.iterationSupport !== undefined ? this.iterationSupport : "";
        return data;
    }
}

export class ModelIteration1 {
    accuracy: string;
    f1Score: string;
    precision: string;
    recall: string;
    support: string;

    constructor(data?: any) {
        // debugger;
        if (data !== undefined) {
            this.accuracy = data["accuracy"] !== undefined ? data["accuracy"] : null;
            this.f1Score = data["f1Score"] !== undefined ? data["f1Score"] : null;
            this.precision = data["precision"] !== undefined ? data["precision"] : null;
            this.recall = data["recall"] !== undefined ? data["recall"] : null;
            this.support = data["support"] !== undefined ? data["support"] : null;

        }
    }
    static fromJS(data: any): ModelIteration1 {
        return new ModelIteration1(data);
    }

}
export class ModelAccuracy {
    finalAccuracy: number = 0;
    iteratationAccuracy: number[] = [];
    constructor(data?: any) {
        // debugger;
        if (data !== undefined) {
            this.finalAccuracy = data["finalAccuracy"] !== undefined ? data["finalAccuracy"] : 0;
            if (data["iterartionAccuracy"]) {
                let str = Object.keys(data["iterartionAccuracy"]);
                for (let x of str)
                    this.iteratationAccuracy.push(data["iterartionAccuracy"][x]);
            }
        }
    }
    static fromJS(data: any): ModelAccuracy {
        return new ModelAccuracy(data);
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["finalAccuracy"] = this.finalAccuracy !== undefined ? this.finalAccuracy : "";
        data["iteratationAccuracy"] = {};
        this.iteratationAccuracy.forEach((item, index) => {
            data["" + index + ""] = item;
        });
        return data;
    }
}

export class ModelResult {
    modelAccuracy: number = 0;
    modelF1Score: string;
    modelPrecision: string;
    modelRecall: string;
    modelSupport: string;
    iterate: ModelIteration[] = [];
    constructor(data?: any) {
        // debugger;
        if (data !== undefined) {
            this.modelAccuracy = data["modelResult"] !== undefined ? data["modelResult"]["modelAccuracy"] : 0;
            this.modelF1Score = data["modelResult"] !== undefined ? data["modelResult"]["modelF1Score"] : null;
            this.modelPrecision = data["modelResult"] !== undefined ? data["modelResult"]["modelPrecision"] : null;
            this.modelRecall = data["modelResult"] !== undefined ? data["modelResult"]["modelRecall"] : null;
            this.modelSupport = data["modelResult"] !== undefined ? data["modelResult"]["modelSupport"] : null;
            if (data["iterationWiseResult"] !== undefined)
                for (let x of data["iterationWiseResult"])
                    this.iterate.push(ModelIteration.fromJS(x));
        }
    }
    static fromJS(data: any): ModelResult {
        return new ModelResult(data);
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["modelResult"] = {};
        data["modelResult"]["modelAccuracy"] = this.modelAccuracy !== undefined ? this.modelAccuracy : "";
        data["modelResult"]["modelPrecision"] = this.modelPrecision !== undefined ? this.modelPrecision : "";
        data["modelResult"]["modelRecall"] = this.modelRecall !== undefined ? this.modelRecall : "";
        data["modelResult"]["modelF1Score"] = this.modelF1Score !== undefined ? this.modelF1Score : "";
        data["modelResult"]["modelSupport"] = this.modelSupport !== undefined ? this.modelSupport : "";
        data["iterationWiseResult"] = [];
        this.iterate.forEach((item, index) => {
            data["iterationWiseResult"].push(item.toJS());
        });
        return data;
    }
}
export class ModelCreateResult {
    accuracy: string;
    accuracyIteration1: string;
    accuracyIteration2: string;
    autoFlag: string;
    fScore: string;
    precision: string;
    recall: string;

    iterate: ModelIteration[] = [];
    constructor(data?: any) {
        // debugger;
        if (data !== undefined) {
            this.accuracy = data["accuracy"] !== undefined ? data["accuracy"] : null;
            this.accuracyIteration1 = data["accuracyIteration1"] !== undefined ? data["accuracyIteration1"] : null;
            this.autoFlag = data["autoFlag"] !== undefined ? data["autoFlag"] : null;
            this.fScore = data["fScore"] !== undefined ? data["fScore"] : null;
            this.precision = data["precision"] !== undefined ? data["precision"] : null;
            this.recall = data["recall"] !== undefined ? data["recall"] : null;

        }
    }
    static fromJS(data: any): ModelCreateResult {
        return new ModelCreateResult(data);
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;

        data["accuracy"] = this.accuracy !== undefined ? this.accuracy : "";
        data["accuracyIteration1"] = this.accuracyIteration1 !== undefined ? this.accuracyIteration1 : "";
        data["autoFlag"] = this.autoFlag !== undefined ? this.autoFlag : "";
        //data["operationClass"] = this.operationClass !== undefined ? this.operationClass : "";
        //data["correlationType1"] = this.correlationType1 !== undefined ? this.correlationType1 : "";
        //data["correlationType2"] = this.correlationType2 !== undefined ? this.correlationType2 : "";
        data["fScore"] = this.fScore !== undefined ? this.fScore : "";
        data["precision"] = this.precision !== undefined ? this.precision : "";
        data["recall"] = this.recall !== undefined ? this.recall : "";
        return data;
    }
}
export class ModelListResult {
    r0: ModelIteration;
    r1: ModelIteration;
    r2: ModelIteration;
    r3: ModelIteration1;
    r4: ModelIteration;
    modelResult: ModelResult;

    constructor(data?: any) {
        // debugger;
        if (data !== undefined) {
            this.r0 = ModelIteration.fromJS(data["r0"]);
            this.r1 = ModelIteration.fromJS(data["r1"]);
            this.r2 = ModelIteration.fromJS(data["r2"]);
            this.r3 = ModelIteration1.fromJS(data["r3"]);
            this.r4 = ModelIteration.fromJS(data["r4"]);
            this.modelResult = ModelResult.fromJS(data["modelResult"]);

        }
    }
    static fromJS(data: any): ModelListResult {
        return new ModelListResult(data);
    }

}

export enum TaskType {
    CLEANSER = 1,
    SAMPLER,
    FUNCTION,
    MODEL,
    READER,
    TRAINTEST,
    VALIDATE,
    BLANK
}
export class ModelStudioResult {
    status_code: number = -1;
    string_message: string;
    detail: CreateModelResult;
    constructor(data?: any) {
        if (data !== undefined) {
            this.status_code = data["statusCode"] !== undefined ? data["statusCode"] : -1;
            this.string_message = data["statusMessage"] !== undefined ? data["statusMessage"] : "";
            this.detail = CreateModelResult.fromJS(data["resultData"]);
        }
    }
    static fromJS(data: any): ModelStudioResult {
        return new ModelStudioResult(data);
    }
}

export class CreateModelResult {
    entityKey: string;
    entityName: string;
    constructor(data?: any) {
        if (data !== undefined) {
            this.entityKey = data["entityKey"] !== undefined ? data["entityKey"] : "";
            this.entityName = data["entityName"] !== undefined ? data["entityName"] : "";

        }
    }
    static fromJS(data: any): CreateModelResult {
        return new CreateModelResult(data);
    }
}

export class CreatemodelDto {
    entityName: string;
    entityKey: string;
    entityDescription: string;
    entityType: string = "Model";
    modelType: string = "Model";
    lastRunDate: string;
    readyFlag: string = "False";
    srcDatasetName: string;
    srcDatasetId: string;
    parentKey: string;
    runFlag: string;
    changeFlag: string;
    processId: string;
    tasksPre: ModelTask[] = [];
    tasksPro: ModelTask[] = [];
    taskElements: any[] = [];
    taskElements1: any[] = [];
   // result: ModelResult = new ModelResult();
    result: ModelAccuracy = new ModelAccuracy();
    constructor(data?: any) {
        debugger;
        if (data !== undefined) {
            this.entityDescription = data["processId"] !== undefined ? data["processId"] : null;
            this.entityDescription = data["entityDescription"] !== undefined ? data["entityDescription"] : null;
            this.entityName = data["entityName"] !== undefined ? data["entityName"] : null;
            this.entityKey = data["entityKey"] !== undefined ? data["entityKey"] : null;
            this.entityType = data["entityType"] !== undefined ? data["entityType"] : null;
            this.runFlag = data["runFlag"] !== undefined ? data["runFlag"] : null;
            this.srcDatasetId = data["srcDatasetId"] !== undefined ? data["srcDatasetId"] : null;
            this.srcDatasetName = data["srcDatasetName"] !== undefined ? data["srcDatasetName"] : null;
            this.modelType = data["modelType"] !== undefined ? data["modelType"] : null;
            this.lastRunDate = data["lastRunDate"] !== undefined ? data["lastRunDate"] : null;
            this.readyFlag = data["readyFlag"] !== undefined ? data["readyFlag"] : null;
            this.parentKey = data["parentKey"] !== undefined ? data["parentKey"] : null;
            //this.result = ModelResult.fromJS(data["results"]);
            this.result = ModelAccuracy.fromJS(data["results"]);
            let i: number = Object.keys(data["Tasks"]["preprocessingTasks"]).length;
            for (let index: number = 1; index <= i; index++) {
                let nm: string = "taskID" + index;
                this.parseTaskPre(data["Tasks"]["preprocessingTasks"][nm]);
            }
            let j: number = Object.keys(data["Tasks"]["processingTasks"]).length;
            for (let index: number = i + 1; index <= (j + i); index++) {
                let nm: string = "taskID" + index;
                this.parseTaskPro(data["Tasks"]["processingTasks"][nm]);
            }
        }
    }
    parseTaskPre(data: any) {
        //parse all tasks to edit
        let task: any;
        if (data !== undefined) {
            if (data["taskType"].toLowerCase() == "reader") {
                task = Reader.fromJS(data["operationDict"]);
            } else if (data["taskType"].toLowerCase() == "sampler") {
                task = TaskDto.fromJS(data["operationDict"]);
            } else if (data["taskType"].toLowerCase() == "cleanser") {
                task = TaskDto.fromJS(data["operationDict"]);
            } else if (data["taskType"].toLowerCase() == "function") {
                task = TaskDto.fromJS(data["operationDict"]);
            } else if (data["taskType"].toLowerCase() == "model") {
                task = TaskModel.fromJS(data["operationDict"]);
            } else if (data["taskType"].toLowerCase() == "TrainTest") {
                task = TaskDto.fromJS(data);
                task.entityName = data["entityName"];
                task.taskType = TaskType.TRAINTEST;
            } else task = TaskDto.fromJS(data);
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
                    task.taskProperties = new TaskProperties((data["taskProperties"]["definateOprVar"] === "True"),
                        (data["taskProperties"]["inputOperationVariablesSameAsOutputOperationVariablesFlag"] === "True"),
                        (data["taskProperties"]["inputVarCarryFwdFlag"] === "True"),
                        (data["taskProperties"]["reqOprInputVarNumSelection"] === "True"));
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
                this.taskElements.push(task);
            }
        }
    }
    parseTaskPro(data: any) {
        //parse all tasks to edit
        let task: any;
        if (data !== undefined) {
            if (data["taskType"].toLowerCase() == "reader") {
                task = Reader.fromJS(data["operationDict"]);
            } else if (data["taskType"].toLowerCase() == "sampler") {
                task = TaskDto.fromJS(data["operationDict"]);
            } else if (data["taskType"].toLowerCase() == "cleanser") {
                task = TaskDto.fromJS(data["operationDict"]);
            } else if (data["taskType"].toLowerCase() == "function" || data["taskType"].toLowerCase() == "algorithm") {
                task = TaskDto.fromJS(data["operationDict"]);
            } else if (data["taskType"].toLowerCase() == "model") {
                task = TaskModel.fromJS(data["operationDict"]);
            } else {
                task = TaskDto.fromJS(data);
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
                    task.taskProperties = new TaskProperties((data["taskProperties"]["definateOprVar"] === "True"),
                        (data["taskProperties"]["inputOperationVariablesSameAsOutputOperationVariablesFlag"] === "True"),
                        (data["taskProperties"]["inputVarCarryFwdFlag"] === "True"),
                        (data["taskProperties"]["reqOprInputVarNumSelection"] === "True"));
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
                this.taskElements1.push(task);
            }
        }
    }
    static fromJS(data: any): CreatemodelDto {
        return new CreatemodelDto(data);
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["srcDatasetName"] = this.srcDatasetName !== undefined ? this.srcDatasetName : "";
        data["srcDatasetId"] = this.srcDatasetId !== undefined ? this.srcDatasetId : "";
        data["modelType"] = this.modelType !== undefined ? this.modelType : "";
        data["lastRunDate"] = this.lastRunDate !== undefined ? this.lastRunDate : "";
        data["readyFlag"] = this.readyFlag !== undefined ? this.readyFlag : "";
        data["parentKey"] = this.parentKey !== undefined ? this.parentKey : "";
        // data["runFlag"] = this.runFlag !== undefined ? this.runFlag : "";
        data["changeFlag"] = this.changeFlag !== undefined ? this.changeFlag : "";
        let data1: any = {}
        if (this.tasksPre && this.tasksPre.constructor === Array) {
            let i: number = 1;
            for (let item of this.tasksPre)
                data1["taskID" + (i++)] = item.toJS();
        }
        data["preprocessingTasks"] = data1;
        let data2: any = {}
        if (this.tasksPro && this.tasksPro.constructor === Array) {
            let i: number = this.tasksPre.length + 1;
            for (let item of this.tasksPro)
                data2["taskID" + (i++)] = item.toJS();
        }
        data["processingTasks"] = data2;
        data["results"] = this.result.toJS();
       // data["results"] = this.result.toJS();
        return data;
    }
    toUpdateJS(data?: any) {
        data = data === undefined ? {} : data;
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["changeFlag"] = "True";
        data["entityKey"] = this.entityKey !== undefined ? this.entityKey : "";
        data["processId"] = this.processId !== undefined ? this.processId : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        //data["entityKey"] = this.entityKey !== undefined ? this.entityKey : "";
        //data["srcDatasetId"] = this.srcDatasetId !== undefined ? this.srcDatasetId : "";
        data["modelType"] = this.modelType !== undefined ? this.modelType : "";
        data["lastRunDate"] = this.lastRunDate !== undefined ? this.lastRunDate : "";
        data["readyFlag"] = this.readyFlag !== undefined ? this.readyFlag : "";
        data["parentKey"] = this.parentKey !== undefined ? this.parentKey : "";
        data["runFlag"] = this.runFlag !== undefined ? this.runFlag : "";
        //data["changeFlag"] = this.changeFlag !== undefined ? this.changeFlag : "";
        let data1: any = {}
        if (this.tasksPre && this.tasksPre.constructor === Array) {
            let i: number = 1;
            for (let item of this.tasksPre)
                data1["taskID" + (i++)] = item.toJS();
        }
        data["preprocessingTasks"] = data1;
        let data2: any = {}
        if (this.tasksPro && this.tasksPro.constructor === Array) {
            let i: number = this.tasksPre.length + 1;
            for (let item of this.tasksPro)
                data2["taskID" + (i++)] = item.toJS();
        }
        data["processingTasks"] = data2;
        data["results"] = this.result.toJS();
        return data;
    }
    toJSON() {
        return JSON.stringify(this.toJS());
    }
    toUpdateJSON() {
        return JSON.stringify(this.toUpdateJS());
    }
}

export class ModelTask {
    entityName: string;
    taskType: string;
    taskId: string;
    operationDict: any;
    predecessorID: string[] = [];
    successorID: string[] = [];
    predecessorName: string[] = [];
    successorName: string[] = [];
    mapping: Mapping[] = [];
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
        if (this.taskType === "TrainTest" || this.taskType === "Validate") {

        } else
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

export class ModelVariables {
    checked: boolean = false;
    id: any;
    dataType: string;
    inOutFlag: string;
    isDefaultFlag: string;
    name: string;
    variableCategory: string;
    variableType: string;
    constructor(id: any, dt: string, iof: string, idf: string, nm: string, vc: string, vt: string) {
        this.id = id;
        this.dataType = dt;
        this.inOutFlag = iof;
        this.isDefaultFlag = idf;
        this.name = nm;
        this.variableCategory = vc;
        this.variableType = vt;
    }

    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["dataType"] = this.dataType !== undefined ? this.dataType : "";
        data["inOutFlag"] = this.inOutFlag !== undefined ? this.inOutFlag : "";
        data["isDefaultFlag"] = this.isDefaultFlag !== undefined ? this.isDefaultFlag : "";
        data["name"] = this.name !== undefined ? this.name : "";
        data["variableCategory"] = this.variableCategory !== undefined ? this.variableCategory : "";
        data["variableType"] = this.variableType !== undefined ? this.variableType : "";
        data["selected"] = this.checked !== undefined ? String(this.checked) : "False";
        return data;
    }
    static get getRandomNumber(): any {
        var randomnumber = Math.ceil(Math.random() * 1000);
        return randomnumber;
    }
}

export class ModelTaskProperties {
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
        data["definateOprVar"] = this.definateOprVar !== undefined ? this.definateOprVar : "";
        data["inputOperationVariablesSameAsOutputOperationVariablesFlag"] = this.inputOperationVariablesSameAsOutputOperationVariablesFlag !== undefined ? this.inputOperationVariablesSameAsOutputOperationVariablesFlag : "";
        data["inputVarCarryFwdFlag"] = this.inputVarCarryFwdFlag !== undefined ? this.inputVarCarryFwdFlag : "";
        data["reqOprInputVarNumSelection"] = this.reqOprInputVarNumSelection !== undefined ? this.reqOprInputVarNumSelection : "";
        return data;
    }
}


export class AlgorithmInstance {
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
    defaultFlag: false;
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
    static fromJS(data: any): AlgorithmInstance {
        return new AlgorithmInstance(data);
    }
}

export class AlgorithmParameters {
    type: string;
    typeKey: string;
    cls: string = "";
    analysisMappingVariableKey: string;
    algorithmTypeKey: string;
    analysisMappingVariableName: string;
    datatype: string;
    iotype: string;
    constructor(data?: any) {
        if (data !== undefined) {
            this.analysisMappingVariableKey = data["analysisMappingVariableKey"] !== undefined ? data["analysisMappingVariableKey"] : null;
            this.algorithmTypeKey = data["algorithmTypeKey"] !== undefined ? data["algorithmTypeKey"] : null;
            this.analysisMappingVariableName = data["analysisMappingVariableName"] !== undefined ? data["analysisMappingVariableName"] : null;
            this.datatype = data["datatype"] !== undefined ? data["datatype"] : null;
            this.iotype = data["iotype"] !== undefined ? data["iotype"] : null;

        }
    }
    static fromJS(data: any): AlgorithmParameters {
        return new AlgorithmParameters(data);
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


export class AverageAccuracy {

    averageAccuracy: number;
    finalEvaluationReport: string;
    iterationAccuracy: number[] = [];

    constructor(data?: any) {
        if (data !== undefined) {
            this.averageAccuracy = data["AverageAccuracy"] !== undefined ? data["AverageAccuracy"] : null;
            this.finalEvaluationReport = data["FinalEvaluationReport"] !== undefined ? data["FinalEvaluationReport"] : null;
            for (let x of data["iterationAccuracy"])
                this.iterationAccuracy.push(x);
        }

    }

    static fromJS(data: any): AverageAccuracy {
        return new AverageAccuracy(data);
    }
}
