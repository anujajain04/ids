import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Injectable, Inject, Optional, OpaqueToken } from '@angular/core';
import { Http, Headers, Response, RequestOptionsArgs } from '@angular/http';
import { TokenService } from '@abp/auth/token.service';
import { TempBaseUrl, LoadingService, SubDatasetDto, DatasetFieldDto, DatasetResultModel } from '@shared/service-proxies/ids-service-proxies';
import { FormControl, FormGroup, Validators } from '@angular/forms';
// all API request for ids
@Injectable()
export class DashboardService {

    globalGSCharts: GSAnalysisChart;
    static isdashboardPage: boolean = false;
    key: number;
    private http: Http = null;
    protected jsonParseReviver: (key: string, value: any) => any = undefined;
    constructor( @Inject(Http) http: Http, private _session: TokenService) {
        this.http = http;
    }
    getDashboardList(input: any): Observable<any[]> {
        //const _content = JSON.stringify({
        //    workspaceKey: TempBaseUrl.WORKSPACEKEY,
        //    sessionKey: this._session.getToken()
        //});
        debugger;
        return this.http.request(TempBaseUrl.BASE_URL + "dashboard/", {
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
        debugger;

        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: any[] = [];
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            debugger;
            if (result200["dashboardList"] && result200["dashboardList"].constructor === Array) {
                for (let x of result200["dashboardList"]) {
                    result.push(DashboardDto.fromJS(x));
                }
            }
            return result;
        }
        return null;
    }

    createDashboard(input: any): Observable<DashboardResultModel> {
        debugger;
        return this.http.request(TempBaseUrl.BASE_URL + "dashboard/", {
            body: input,
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processCreateDash(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processCreateDash(response));
                } catch (e) {
                    return <Observable<DashboardResultModel>><any>Observable.throw(e);
                }
            } else
                return <Observable<DashboardResultModel>><any>Observable.throw(response);
        });
    }
    protected processCreateDash(response: Response): DashboardResultModel {
        debugger;
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: DashboardResultModel;
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            result = DashboardResultModel.fromJS(result200);
            return result;
        }
        return null;
    }

    updateDashBoard(): Observable<UpdateDashBoardDto> {
        return this.http.request(TempBaseUrl.BASE_URL + "dashboard", {
            method: "put",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            return this.processUpdateDash(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processUpdateDash(response));
                } catch (e) {
                    return <Observable<UpdateDashBoardDto>><any>Observable.throw(e);
                }
            } else
                return <Observable<UpdateDashBoardDto>><any>Observable.throw(response);
        });
    }

    protected processUpdateDash(response: Response): UpdateDashBoardDto {
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: UpdateDashBoardDto;
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            result = UpdateDashBoardDto.fromJS(result200);
            return result;
        }
        return null;
    }
    //Author : Kanchan
    //Purpose : Preview Chart

    previewChart(input: any): Observable<ChartWidgets> {
        debugger;
        const _content = JSON.stringify(input);
        debugger;
        return this.http.request(TempBaseUrl.BASE_URL + "chart/previewChart/", {
            body: _content,
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processsaveWidgets(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processsaveWidgets(response));
                } catch (e) {
                    return <Observable<ChartWidgets>><any>Observable.throw(e);
                }
            } else
                return <Observable<ChartWidgets>><any>Observable.throw(response);
        });
    }



    protected processsaveWidgets(response: Response): ChartWidgets {
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            debugger;
            let result: ChartWidgets;
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            result = ChartWidgets.fromJS(result200.previewChartJson);
            debugger;
            return result;
        }
        return null;
    }


    deleteDashboard(input: string): Observable<any> {
        debugger;

        return this.http.request(TempBaseUrl.BASE_URL + "dashboard/" + input, {
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
    protected processDeleteDashboard(response: Response): DatasetResultModel {
        debugger;
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

    /*   getDashboard   */
    //getDashboard(input: string): Observable<getDashboardDtoDetails[]> {
    //    debugger;
    //    return this.http.request(TempBaseUrl.BASE_URL + "dashboard/" + input , {
    //        method: "get",
    //        headers: new Headers({
    //            "Content-Type": "application/json; charset=UTF-8",
    //            "Accept": "application/json; charset=UTF-8"
    //        })
    //    }).map((response) => {
    //        debugger;
    //        return this.processgetDashboard(response);
    //    }).catch((response: any, caught: any) => {
    //        debugger;
    //        if (response instanceof Response) {
    //            try {
    //                return Observable.of(this.processgetDashboard(response));
    //            } catch (e) {
    //                return <Observable<getDashboardDtoDetails[]>><any>Observable.throw(e);
    //            }
    //        } else
    //            return <Observable<getDashboardDtoDetails[]>><any>Observable.throw(response);
    //    });
    //}
    //protected processgetDashboard(response: Response): getDashboardDtoDetails[] {
    //    debugger;
    //    const responseText = response.text();
    //    const status = response.status;
    //    if (status === 200) {
    //        let result: getDashboardDtoDetails[] = [];
    //        let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
    //        if (result200["DashboardDetails"] && result200["DashboardDetails"].constructor === Array) {
    //            let p = result200["DashboardDetails"];
    //            for (let item of p) {
    //                result.push(getDashboardDtoDetails[0].fromJS(item));
    //            }
    //            return result;
    //        }
    //    }
    //    return null;
    //}


    editDashboard(input: string): Observable<getDashboardDtoDetails[]> {
        debugger;
        return this.http.request(TempBaseUrl.BASE_URL + "dashboard/" + input, {
            method: "get",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processeditDashboard(response);
        }).catch((response: any, caught: any) => {
            debugger;
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processeditDashboard(response));
                } catch (e) {
                    return <Observable<getDashboardDtoDetails[]>><any>Observable.throw(e);
                }
            } else
                return <Observable<getDashboardDtoDetails[]>><any>Observable.throw(response);
        });
    }
    protected processeditDashboard(response: Response): getDashboardDtoDetails[] {
        debugger;
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: getDashboardDtoDetails[] = [];
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            if (result200["DashboardDetails"] && result200["DashboardDetails"].constructor === Array) {
                let p = result200["DashboardDetails"];
                for (let item of p) {
                    result.push(getDashboardDtoDetails[0].fromJS(item));
                }
                return result;
            }
        }
        return null;
    }

    viewDashboard(input: string): Observable<CreateDashBoardDto> {
        debugger;
        return this.http.request(TempBaseUrl.BASE_URL + "dashboard/" + input + "/viewDashboard/", {
            method: "get",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processviewDashboard(response);
        }).catch((response: any, caught: any) => {
            debugger;
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processviewDashboard(response));
                } catch (e) {
                    return <Observable<CreateDashBoardDto>><any>Observable.throw(e);
                }
            } else
                return <Observable<CreateDashBoardDto>><any>Observable.throw(response);
        });
    }
    protected processviewDashboard(response: Response): CreateDashBoardDto {
        debugger;
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: CreateDashBoardDto;
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
                result = CreateDashBoardDto.fromJS(result200["DashboardDetails"]);
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

    //Author : Kanchan
    //Purpose : Get Chart Type List
    getChartTypeList(): Observable<ChartTypeListDto[]> {
        debugger;
        return this.http.request(TempBaseUrl.BASE_URL + "chart/getChartTypeList/", {
            method: "get",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processChartTypeList(response);
        }).catch((response: any, caught: any) => {
            debugger;
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processChartTypeList(response));
                } catch (e) {
                    return <Observable<ChartTypeListDto[]>><any>Observable.throw(e);
                }
            } else
                return <Observable<ChartTypeListDto[]>><any>Observable.throw(response);
        });
    }







    //Author : Kanchan
    //Purpose : Get Chart Variable List

    getChartVariableList(input: any): Observable<ChartVariable[]> {
        debugger;
        return this.http.request(TempBaseUrl.BASE_URL + "chart/getChartVariableList/", {
            body: input,
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processChartVariableList(response);
            // return(response.text())
        }).catch((response: any, caught: any) => {
            debugger;
            // return(response)
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processChartVariableList(response));
                } catch (e) {
                    return <Observable<ChartVariable[]>><any>Observable.throw(e);
                }
            } else
                return <Observable<ChartVariable[]>><any>Observable.throw(response);
        });
    }

    protected processChartVariableList(response: Response): ChartVariable[] {
        debugger;
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: ChartVariable[] = [];
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            if (result200["chartVariableList"] && result200["chartVariableList"].constructor === Array) {
                let p = result200["chartVariableList"];
                for (let item of p) {
                    result.push(ChartVariable.fromJS(item));
                }
                
            }
            return result;
        }
        return null;
    }


    protected processChartTypeList(response: Response): ChartTypeListDto[] {
        debugger;
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: ChartTypeListDto[] = [];
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            if (result200["chartVariableList"] && result200["chartVariableList"].constructor === Array) {
                let p = result200["chartVariableList"];
                for (let item of p) {
                    result.push(ChartTypeListDto.fromJS(item));
                }
                return result;
            }
        }
        return null;
    }


    getDatasetFields(sds: string): Observable<DatasetFieldDto[]> {
        debugger;
        const _content = JSON.stringify({ subDatasetKey: sds });
        return this.http.request(TempBaseUrl.BASE_URL + "datasets/get_dataset_fields_list/", {
            body: _content,
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processDatasetFieldList(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processDatasetFieldList(response));
                } catch (e) {
                    return <Observable<DatasetFieldDto[]>><any>Observable.throw(e);
                }
            } else
                return <Observable<DatasetFieldDto[]>><any>Observable.throw(response);
        });
    }
    protected processDatasetFieldList(response: Response): DatasetFieldDto[] {
        debugger;
        const responseText = response.text();
        const status = response.status;

        if (status === 200) {
            let result: DatasetFieldDto[] = [];
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            if (result200["status_code"] === 1) {
                let list = result200["fieldObjList"];
                if (list && list.constructor === Array) {
                    for (let item of list) {
                        result.push(DatasetFieldDto.fromJS(item));
                    }
                    return result;
                }
            }
        }
        return null;
    }

    schedule(input: string): Observable<scheduleDto[]> {
        debugger;
        return this.http.request(TempBaseUrl.BASE_URL + "schedule/" + input, {
            method: "get",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processgetschedule(response);
        }).catch((response: any, caught: any) => {
            debugger;
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processgetschedule(response));
                } catch (e) {
                    return <Observable<scheduleDto[]>><any>Observable.throw(e);
                }
            } else
                return <Observable<scheduleDto[]>><any>Observable.throw(response);
        });
    }
    protected processgetschedule(response: Response): scheduleDto[] {
        debugger;
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: scheduleDto[] = [];
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            if (result200["scheduleList"] && result200["scheduleList"].constructor === Array) {
                let p = result200["scheduleList"];
                for (let item of p) {
                    result.push(scheduleDto[0].fromJS(item));
                }
                return result;
            }
        }
        return null;
    }

    previewchart(value: any): Observable<PreViewChartDto[]> {
        return this.http.request(TempBaseUrl.BASE_URL + "dashboard/", {
            body: value,
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processPreviewChart(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processPreviewChart(response));
                } catch (e) {
                    return <Observable<PreViewChartDto[]>><any>Observable.throw(e);
                }
            } else
                return <Observable<PreViewChartDto[]>><any>Observable.throw(response);
        });
    }
    protected processPreviewChart(response: Response): PreViewChartDto[] {
        debugger;
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: PreViewChartDto[] = [];
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            if (result200["chartWidgetKey"] && result200["chartWidgetKey"].constructor === Array) {
                let p = result200["chartWidgetKey"];
                for (let item of p) {
                    result.push(PreViewChartDto[0].fromJS(item));
                }
                return result;
            }
        }
        return null;
    }

    filterLocal(value: any): Observable<LocalFilter[]> {
        return this.http.request(TempBaseUrl.BASE_URL + "dashboard/", {
            body: value,
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processLocalFilter(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processLocalFilter(response));
                } catch (e) {
                    return <Observable<LocalFilter[]>><any>Observable.throw(e);
                }
            } else
                return <Observable<LocalFilter[]>><any>Observable.throw(response);
        });
    }
    protected processLocalFilter(response: Response): LocalFilter[] {
        debugger;
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: LocalFilter[] = [];
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            if (result200["localFilter"] && result200["localFilter"].constructor === Array) {
                let p = result200["localFilter"];
                for (let item of p) {
                    result.push(LocalFilter[0].fromJS(item));
                }
                return result;
            }
        }
        return null;
    }




}
@Injectable()
export class DashboardStudioConfig {
    key: number;
    selectedItem: string;
    removeError: boolean;
    taskType: TaskType = null;
    currentReader: Reader = new Reader();
    currentModel: TaskModel = new TaskModel();
    currentPosition: number = 0;
    taskElements: any[] = [];
    createDashboard: CreateDashBoardDto = new CreateDashBoardDto();
    //createResult: CreateDashBoard;
}

export class customDashboardParameters {
    datasetkeyForDashboard: string;
    targetDatasetKey: string;
    trgSubDatasetKey: string;
    analysisName: string;
}


export class DashboardDto {
    tType: string;
    className: string;
    dashboardTitle: string;
    dashboardType: string;
    entityDescription: string;
    entityKey: string;
    entityName: string;
    entityType: string;
    parentKey: string;
    readWriteFlag: boolean;
    constructor(data?: any) {
        // debugger;
        if (data !== undefined) {
            this.className = data["className"] !== undefined ? data["className"] : null;
            this.dashboardTitle = data["dashboardTitle"] !== undefined ? data["dashboardTitle"] : null;
            this.dashboardType = data["dashboardType"] !== undefined ? data["dashboardType"] : null;
            this.entityDescription = data["entityDescription"] !== undefined ? data["entityDescription"] : null;
            this.entityKey = data["entityKey"] !== undefined ? data["entityKey"] : null;
            this.entityName = data["entityName"] !== undefined ? data["entityName"] : null;
            this.parentKey = data["parentKey"] !== undefined ? data["parentKey"] : null;
            this.readWriteFlag = data["readWriteFlag"] !== undefined ? data["readWriteFlag"] : null;
        }
    }

    static fromJS(data: any): DashboardDto {
        return new DashboardDto(data);
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

export class TaskModel {

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

    selectedField: DatasetFieldDto[] = [];
    fields: DatasetFieldDto[] = [];


    noOfIteration: string = "";
    constructor(data?: any) {
        // debugger;
        if (data !== undefined) {
            this.processId = data["processId"] !== undefined ? data["processId"] : null;
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
        }
    }
    get compare() {
        return this.entityKey + "Model";
    }
    static fromJS(data: any): TaskModel {
        return new TaskModel(data);
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
    connectionString: string;
    entityName: string;
    analysis: string;
    entityType: string;
    entityKey: string;
    className: string;
    entityDescription: string;
    parentKey: string;
    subDatasets: SubDatasetDto[] = [];
    constructor(data?: any) {
        // debugger;
        if (data !== undefined) {
            this.connectionString = data["connectionString"] !== undefined ? data["connectionString"] : null;
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
        return this.entityKey + "Reader";
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
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["className"] = this.className !== undefined ? this.className : "";
        data["connectionString"] = this.connectionString !== undefined ? this.connectionString : "";
        data["parentKey"] = this.parentKey !== undefined ? this.parentKey : "";
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


export class Variables {
    dataType: string;
    inOutFlag: string;
    isDefaultFlag: string;
    name: string;
    variableCategory: string;
    variableType: string;
    constructor(dt: string, iof: string, idf: string, nm: string, vc: string, vt: string) {
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
        return data;
    }
}
export class SamplerDict {
    entityName: string;
    entityType: string = "sampler";
    entityDescription: string;
    operationClass: string;
    samplerType: string;
    numberPercentageFlag: string;
    sampleNumber: string;
    samplePercentage: string;
    constructor(en, ed, oc, st, npf, sn, sp) {
        this.entityName = en;
        this.entityDescription = ed;
        this.operationClass = oc;
        this.samplerType = st;
        this.numberPercentageFlag = npf;
        this.sampleNumber = sn;
        this.samplePercentage = sp;
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["operationClass"] = this.operationClass !== undefined ? this.operationClass : "";
        data["samplerType"] = this.samplerType !== undefined ? this.samplerType : "";
        data["numberPercentageFlag"] = this.numberPercentageFlag !== undefined ? this.numberPercentageFlag : "";
        data["sampleNumber"] = this.sampleNumber !== undefined ? this.sampleNumber : "";
        data["samplePercentage"] = this.samplePercentage !== undefined ? this.samplePercentage : "";
        return data;
    }

    toJSON() {
        return JSON.stringify(this.toJS());
    }
}
export class CleanserDict {
    operationClass: string;
    entityName: string;
    entityDescription: string;
    entityType: string = "Cleanser";
    cleanserType: string;
    customizationDoneFlag: string;
    filePath: string;
    constructor(oc, en, ed, ct, cdf, fp) {
        this.operationClass = oc;
        this.entityName = en;
        this.entityDescription = ed;
        this.cleanserType = ct;
        this.customizationDoneFlag = cdf;
        this.filePath = fp;
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["operationClass"] = this.operationClass !== undefined ? this.operationClass : "";
        data["cleanserType"] = this.cleanserType !== undefined ? this.cleanserType : "";
        data["customizationDoneFlag"] = this.customizationDoneFlag !== undefined ? this.customizationDoneFlag : "";
        data["filePath"] = this.filePath !== undefined ? this.filePath : "";
        return data;
    }

    toJSON() {
        return JSON.stringify(this.toJS());
    }
}
export class FunctionDict {
    operationClass: string;
    entityName: string;
    entityDescription: string;
    entityType: string = "Algorithm";
    correlationType1: string;
    correlationType2: string;
    correlationPos1: string;
    correlationPos2: string;
    testDatasetId: string;
    testDatasetName: string;
    testSubDatasetId: string;
    constructor(oc, en, ed, tdi, tdn, tsdi) {
        this.operationClass = oc;
        this.entityName = en;
        this.entityDescription = ed;
        this.testDatasetId = tdi;
        this.testDatasetName = tdn;
        this.testSubDatasetId = tsdi;
        this.entityType = "Algorithm";
    }
    static fromJS(): Reader {
        return new Reader();
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        //data["operationClass"] = this.operationClass !== undefined ? this.operationClass : "";
        //data["correlationType1"] = this.correlationType1 !== undefined ? this.correlationType1 : "";
        //data["correlationType2"] = this.correlationType2 !== undefined ? this.correlationType2 : "";
        data["testDatasetId"] = this.testDatasetId !== undefined ? this.testDatasetId : "";
        data["testDatasetName"] = this.testDatasetName !== undefined ? this.testDatasetName : "";
        data["testSubDatasetId"] = this.testSubDatasetId !== undefined ? this.testSubDatasetId : "";
        return data;
    }

    toJSON() {
        return JSON.stringify(this.toJS());
    }
}


export class DeletedashboardDto {
    sessionKey: string;
    entityList: string[] = [];
    constructor(data?: any) {
    }
    static fromJS(data: any): DashboardDto {
        return new DashboardDto(data);
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


export enum TaskType {
    CLEANSER = 1,
    SAMPLER,
    FUNCTION,
    MODEL,
    READER
}


export class getDashboardDtoDetails {
    entityType: string;
    chartAssociationMatrixFlag: string;
    dashboardTitle: string;
    entityName: string;
    entityKey: string;
    chartWidgets: string[] = [];
    entityDescription: string;
    dashboardType: string;
    parentKey: string;


    static fromJS(): Reader {
        return new Reader();
    }
    toJS(data?: any) {

        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["chartAssociationMatrixFlag"] = this.chartAssociationMatrixFlag !== undefined ? this.chartAssociationMatrixFlag : "";
        data["dashboardTitle"] = this.dashboardTitle !== undefined ? this.dashboardTitle : "";
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["entityKey"] = this.entityKey !== undefined ? this.entityKey : "";
        data["chartWidgets"] = this.chartWidgets !== undefined ? this.chartWidgets : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["dashboardType"] = this.dashboardType !== undefined ? this.dashboardType : "";
        data["parentKey"] = this.parentKey !== undefined ? this.parentKey : "";
        return data;
    }

    toJSON() {
        return JSON.stringify(this.toJS());
    }
}


export class viewDashboardDtoDetails {
    gridStackWidth: string;
    chartPositionTop: string;
    data: Data[] = [];
    chartWidgetName: string;
    gridStackHeight: string;
    chartWidgetWidth: string[] = [];
    chartSpecificOptions: ChartSpecificationDetails;
    chartWidgetTitle: string;
    chartPositionLeft: string;
    chartWidgetIdentifier: string;
    chartType: string;
    chartWidgetHeight: string;

    static fromJS(): Reader {
        return new Reader();
    }
    toJS(data?: any) {

        data["gridStackWidth"] = this.gridStackWidth !== undefined ? this.gridStackWidth : "";
        data["chartPositionTop"] = this.chartPositionTop !== undefined ? this.chartPositionTop : "";
        data["data"] = this.data !== undefined ? this.data : "";
        data["chartWidgetName"] = this.chartWidgetName !== undefined ? this.chartWidgetName : "";
        data["gridStackHeight"] = this.gridStackHeight !== undefined ? this.gridStackHeight : "";
        data["chartWidgetWidth"] = this.chartWidgetWidth !== undefined ? this.chartWidgetWidth : "";
        data["chartSpecificOptions"] = this.chartSpecificOptions !== undefined ? this.chartSpecificOptions : "";
        data["chartWidgetTitle"] = this.chartWidgetTitle !== undefined ? this.chartWidgetTitle : "";
        data["chartPositionLeft"] = this.chartPositionLeft !== undefined ? this.chartPositionLeft : "";
        data["chartWidgetIdentifier"] = this.chartWidgetIdentifier !== undefined ? this.chartWidgetIdentifier : "";
        data["chartType"] = this.chartType !== undefined ? this.chartType : "";
        data["chartWidgetHeight"] = this.chartWidgetHeight !== undefined ? this.chartWidgetHeight : "";


        return data;
    }

    toJSON() {
        return JSON.stringify(this.toJS());
    }
}

export class UpdateDashBoardDto {
    entityName: string;
    entityDescription: string;
    entityType: string;
    dashboardTitle: string;
    dashboardType: string;
    chartAssociationMatrixFlag: string;
    readWriteFlag: string;
    entityKey: string;
    changeFlag: string;
    parentKey: string;
    layoutSelection: string;
    dashboardTitleFontSize: string;
    dashboardFontFamily: string;
    chartWidgets: ChartWidgets[] = [];
    constructor(data?: any) {
        // debugger;

        if (data !== undefined) {
            this.entityName = data["entityName"] !== undefined ? data["entityName"] : "";
            this.entityDescription = data["entityDescription"] !== undefined ? data["entityDescription"] : "";
            this.entityType = data["entityType"] !== undefined ? data["entityType"] : "";
            this.dashboardTitle = data["dashboardTitle"] !== undefined ? data["dashboardTitle"] : "";
            this.dashboardType = data["dashboardType"] !== undefined ? data["dashboardType"] : "";
            this.chartAssociationMatrixFlag = data[""] !== undefined ? data[""] : "";
            this.readWriteFlag = data["readWriteFlag"] !== undefined ? data["readWriteFlag"] : "";
            this.entityKey = data["entityKey"] !== undefined !== undefined ? data["entityKey"] : "";
            this.changeFlag = data["changeFlag"] !== undefined !== undefined ? data["changeFlag"] : "";
            this.parentKey = data["parentKey"] !== undefined !== undefined ? data["parentKey"] : "";
            this.layoutSelection = data["layoutSelection"] !== undefined !== undefined ? data["layoutSelection"] : "";
            this.dashboardTitleFontSize = data["dashboardTitleFontSize"] !== undefined !== undefined ? data["dashboardTitleFontSize"] : "";
            this.dashboardFontFamily = data["dashboardFontFamily"] !== undefined !== undefined ? data["dashboardFontFamily"] : "";
            if (data["chartWidgets"] && data["chartWidgets"].constructor === Array) {
                for (let item of data["chartWidgets"])
                    this.chartWidgets.push(item);
            }
        }

    }
    static fromJS(data: any): UpdateDashBoardDto {
        return new UpdateDashBoardDto(data);
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        return data;
    }
    toJSON() {
        return JSON.stringify(this.toJS());
    }

}

export class CreateDashBoardDto {
    layoutID: number=0;
    numberOfTiles: number=0;
    statusCode: number = 1;
    statusMessage: string;
    entityName: string;
    entityDescription: string;
    entityType: string = "Dashboard";
    dashboardTitle: string;
    dashboardType: string = "custom";
    associationFlag: string = "custom";
    readWriteFlag: string;
    parentKey: string = TempBaseUrl.WORKSPACEKEY;
    layoutSelection: string;
    LayoutID: number;
    dashboardTitleFontSize: string;
    dashboardFontFamily: string;
    //chartAssociationMatrix
    chartmatrix: ChartAssociationMatrix = new ChartAssociationMatrix();
    //globalFilter
    globalFilter: GlobalFilters[] = [];
    //chartWidgets
    chartWidgets: ChartWidgets[] = [];
    constructor(data?: any) {
        debugger
        if (data !== undefined) {
            this.statusCode = data["statusCode"] !== undefined ? data["statusCode"] : 1;
            this.statusMessage = data["statusMessage"] !== undefined ? data["statusMessage"] : "";
            this.entityName = data["entityName"] !== undefined ? data["entityName"] : "";
            this.entityDescription = data["entityDescription"] !== undefined ? data["entityDescription"] : "";
            this.entityType = data["entityType"] !== undefined ? data["entityType"] : "";
            this.dashboardTitle = data["dashboardTitle"] !== undefined ? data["dashboardTitle"] : "";
            this.dashboardType = data["dashboardType"] !== undefined ? data["dashboardType"] : "";
            this.associationFlag = data["associationFlag"] !== undefined ? data["associationFlag"] : "";
            this.readWriteFlag = data["readWriteFlag"] !== undefined ? data["readWriteFlag"] : "";
            this.parentKey = data["parentKey"] !== undefined ? data["parentKey"] : "";
            this.layoutSelection = data["layoutSelection"] !== undefined ? data["layoutSelection"] : "";
            this.dashboardTitleFontSize = data["dashboardTitleFontSize"] !== undefined ? data["dashboardTitleFontSize"] : "";
            this.dashboardFontFamily = data["dashboardFontFamily"] !== undefined ? data["dashboardFontFamily"] : "";
            this.chartmatrix = ChartAssociationMatrix.fromJS(data["chartAssociationMatrix"]);
            if (data["globalFilter"] !== undefined) {
                if (data["globalFilter"]["Globalfilter"] && data["globalFilter"]["Globalfilter"].constructor === Array) {
                    for (let item of data["globalFilter"]["Globalfilter"])
                        this.globalFilter.push(item);

                }
            }
            if (data["chartWidgets"] && data["chartWidgets"].constructor === Array) {
                for (let item of data["chartWidgets"])
                    this.chartWidgets.push(ChartWidgets.fromJS(item));
            }
        }
    }
    static fromJS(data: any): CreateDashBoardDto {
        return new CreateDashBoardDto(data);
    }
    toJS(data?: any) {
        debugger
        data = data === undefined ? {} : data;
        // data["statusCode"] = this.statusCode !== undefined ? this.statusCode : "";
        //data["stausMessage"] = this.statusMessage !== undefined ? this.statusMessage : "";
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["dashboardTitle"] = this.dashboardTitle !== undefined ? this.dashboardTitle : "";
        data["dashboardType"] = this.dashboardType !== undefined ? this.dashboardType : "";
        data["associationFlag"] = this.associationFlag !== undefined ? this.associationFlag : "";
        data["readWriteFlag"] = this.readWriteFlag !== undefined ? this.readWriteFlag : "";
        data["parentKey"] = this.parentKey !== undefined ? this.parentKey : "";
        data["layoutSelection"] = this.layoutSelection !== undefined ? this.layoutSelection : "";
        data["dashboardTitleFontSize"] = this.dashboardTitleFontSize !== undefined ? this.dashboardTitleFontSize : "";
        data["dashboardFontFamily"] = this.dashboardFontFamily !== undefined ? this.dashboardFontFamily : "";
        data["chartAssociationMatrix"] = this.chartmatrix.toJS();
        data["globalFilter"] = [];
        if (this.globalFilter && this.globalFilter.constructor === Array) {
            for (let item of this.globalFilter)
                data["globalFilter"].push(item.toJS());
        }

        data["chartWidgets"] = [];
        if (this.chartWidgets && this.chartWidgets.constructor === Array) {
            for (let item of this.chartWidgets)
                data["chartWidgets"].push(item);//.toJS());umesh
        }

        return data;
    }
    toJSON() {
        return JSON.stringify(this.toJS());
    }

}


export class ChartAssociationMatrix {
    confirmed_dim: string[] = [];
    chart1: string[] = [];
    chart2: string[] = [];


    constructor(data?: any) {
        if (data !== undefined) {

            if (data["confirmed_dim"] && data["confirmed_dim"].constructor === Array) {
                for (let item of data["confirmed_dim"])
                    this.confirmed_dim.push(item);
            }

            if (data["chart1"] && data["chart1"].constructor === Array) {
                for (let item of data["chart1"])
                    this.chart1.push(item);
            }
            if (data["chart2"] && data["chart2"].constructor === Array) {
                for (let item of data["chart2"])
                    this.chart2.push(item);
            }

        }
    }


    static fromJS(data: any): ChartAssociationMatrix {
        return new ChartAssociationMatrix(data);
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;

        data["confirmed_dim"] = [];
        for (let x of this.confirmed_dim)
            data["confirmed_dim"].push(x);

        data["chart1"] = [];
        for (let x of this.chart1)
            data["chart1"].push(x);

        data["chart2"] = [];
        for (let x of this.chart2)
            data["chart2"].push(x);

        return data;
    }
}




export class GlobalFilters {
    dim: string;
    operator: string;
    value: number[] = [];
    rule: string;
    constructor(data?: any) {
        if (data !== undefined) {
            this.dim = data["dim"] !== undefined ? data["dim"] : null;
            this.operator = data["operator"] !== undefined ? data["operator"] : null;
            //this.value = data["value"] !== undefined ? data["value"] : null;
            if (data["value"] && data["value"].constructor === Array) {
                for (let item of data["value"])
                    this.value.push(item);
            }
            this.rule = data["rule"] !== undefined ? data["rule"] : null;
        }
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;

        data["dim"] = this.dim !== undefined ? this.dim : "";
        data["operator"] = this.operator !== undefined ? this.operator : "";

        data["value"] = [];
        for (let p of this.value)
            data["value"].push(p);

        data["rule"] = this.rule !== undefined ? this.rule : "";

    }
    static fromJS(data: any): GlobalFilters {
        return new GlobalFilters(data);
    }
}

export class ChartWidgets {
    Charttype: ChartType;
    dashboardLayoutID: any;
    chartWidgetLocation: any;
    chartWidgetName: string;
    chartWidgetTitle: string;
    chartWidgetDescription: string;
    chartType: string;
    chartWidgetIdentifier: string;
    chartWidgetHeight: string;
    chartWidgetWidth: string;
    gridStackHeight: string;
    gridStackWidth: string;
    chartPositionTop: string;
    chartPositionLeft: string;
    chartSpecificOptions: ChartSpecificOptions = new ChartSpecificOptions();
    constructor(data?: any) {
        debugger
        if (data !== undefined) {
            this.chartWidgetName = data["chartWidgetName"] !== undefined ? data["chartWidgetName"] : "";
            this.chartWidgetTitle = data["chartWidgetTitle"] !== undefined ? data["chartWidgetTitle"] : "";
            this.chartType = data["chartType"] !== undefined ? data["chartType"] : "";
            this.chartWidgetIdentifier = data["chartWidgetIdentifier"] !== undefined ? data["chartWidgetIdentifier"] : "";
            this.chartWidgetHeight = data["chartWidgetHeight"] !== undefined ? data["chartWidgetHeight"] : "";
            this.chartWidgetWidth = data["chartWidgetWidth"] !== undefined ? data["chartWidgetWidth"] : "";
            this.chartPositionTop = data["chartPositionTop"] !== undefined ? data["chartPositionTop"] : "";
            this.chartPositionLeft = data["chartPositionLeft"] !== undefined ? data["chartPositionLeft"] : "";
            this.chartWidgetLocation = data["chartWidgetLocation"] !== undefined ? data["chartWidgetLocation"] : "";
            this.dashboardLayoutID = data["dashboardLayoutID"] !== undefined ? data["dashboardLayoutID"] : "";
            this.chartSpecificOptions = ChartSpecificOptions.fromJS(data["chartSpecificOptions"]);
           

        }
    }
    getType(value: any): any {
        debugger
        let s: string = value["chartVisualizationType"];
        if (s.toLowerCase() === "word cloud") {
            this.chartSpecificOptions.type = ChartType.WORD;
            this.Charttype = ChartType.WORD;
            return WorldCloudOptions.fromJS(value);
        } else if (s.toLowerCase() === "pie chart") {
            this.chartSpecificOptions.type = ChartType.PIE;
            this.Charttype = ChartType.PIE;
            return PieChartOptions.fromJS(value);
        } else if (s.toLowerCase() === "chord chart") {
            this.chartSpecificOptions.type = ChartType.CHORD;
            this.Charttype = ChartType.CHORD;
            return ChordChartOptions.fromJS(value);
        }
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["chartWidgetName"] = this.chartWidgetName !== undefined ? this.chartWidgetName : "";
        data["chartWidgetTitle"] = this.chartWidgetTitle !== undefined ? this.chartWidgetTitle : "";
        data["chartType"] = this.chartType !== undefined ? this.chartType : "";
        data["chartWidgetIdentifier"] = this.chartWidgetIdentifier !== undefined ? this.chartWidgetIdentifier : "";
        data["chartWidgetHeight"] = this.chartWidgetHeight !== undefined ? this.chartWidgetHeight : "";
        data["chartWidgetWidth"] = this.chartWidgetWidth !== undefined ? this.chartWidgetWidth : "";
        data["chartPositionTop"] = this.chartPositionTop !== undefined ? this.chartPositionTop : "";
        data["chartPositionLeft"] = this.chartPositionLeft !== undefined ? this.chartPositionLeft : "";
        data["chartSpecificOptions"] = this.chartSpecificOptions.toJS();
        data["chartWidgetLocation"] = this.chartWidgetLocation !== undefined ? this.chartWidgetLocation : "";
        data["dashboardLayoutID"] = this.dashboardLayoutID !== undefined ? this.dashboardLayoutID : "";
        return data;
    }
    static fromJS(data: any): ChartWidgets {
        debugger;
        return new ChartWidgets(data);
    }
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

export class WorldCloudOptions {
    type: ChartType;
    chartData: WorldCloudChart[] = [];
    chartVariable: ChartVariable[] = [];
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
                    this.chartVariable.push(ChartVariable.fromJS(item));
                }
            }
            if (data["ChartMapping"]) {
                var jsonKeys = Object.keys(data["ChartMapping"]);
                for (let key of jsonKeys) {
                    this.chartMapping.push(ChartMapping.fromJS(data["ChartMapping"][key]));
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

export class ChordChartOptions {
    type: ChartType;
    chartData: any[] = [];
    chartVariable: ChartVariable[] = [];
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
                    this.chartVariable.push(ChartVariable.fromJS(item));
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

export enum ChartType {
    WORD = 1,
    CHORD,
    PIE,
    DONUT,
    LINE,
    BAR,
    HORIZONTALBAR
}
//umesh
export class ChartSpecificOptions {
    chartVisualizationType: string;
    type: ChartType;
    AnalysisDatasetFlag: string;
    datasetKey: string;
    subDatasetKey: string;
    ChartWidgetLabel: string;
    ChartWidgetMeasure: string;
    AnalysisKey: string;
    chartVariable: ChartVariable[] = [];
    chartMapping: ChartMapping;//umesh[] = [];
    pieChartWidth: string;
    pieChartTitle: string;
    pieChartHeight: string;
    pieChartLegendFlag: string;
    pieChartLabelFontSize: string;
    pieChartLabelFontType: string;
    pieChartLabelFontColour: string;
    pieChartLabel: string;
    pieChartRadius: string;
    chartData: any[] = [];

    constructor(data?: any) {
        if (data !== undefined) {
            debugger
            this.chartVisualizationType = data["chartVisualizationType"] !== undefined ? data["chartVisualizationType"] : "";
            this.AnalysisDatasetFlag = data["AnalysisDatasetFlag"] !== undefined ? data["AnalysisDatasetFlag"] : "";
            this.datasetKey = data["datasetKey"] !== undefined ? data["datasetKey"] : "";
            this.subDatasetKey = data["subDatasetKey"] !== undefined ? data["subDatasetKey"] : "";
            this.AnalysisKey = data["AnalysisKey"] !== undefined ? data["AnalysisKey"] : "";
            this.pieChartWidth = data["pieChartWidth"] !== undefined ? data["pieChartWidth"] : "";
            this.pieChartTitle = data["pieChartTitle"] !== undefined ? data["pieChartTitle"] : "";
            this.pieChartHeight = data["pieChartHeight"] !== undefined ? data["pieChartHeight"] : "";
            this.pieChartLegendFlag = data["pieChartLegendFlag"] !== undefined ? data["pieChartLegendFlag"] : "";
            this.pieChartLabelFontSize = data["pieChartLabelFontSize"] !== undefined ? data["pieChartLabelFontSize"] : "";
            this.pieChartLabelFontType = data["pieChartLabelFontType"] !== undefined ? data["pieChartLabelFontType"] : "";
            this.pieChartLabelFontColour = data["pieChartLabelFontColour"] !== undefined ? data["pieChartLabelFontColour"] : "";
            this.pieChartLabel = data["pieChartLabel"] !== undefined ? data["pieChartLabel"] : "";
            this.pieChartRadius = data["pieChartRadius"] !== undefined ? data["pieChartRadius"] : "";
            this.chartData = data["chartData"] !== undefined ? data["chartData"] : "";
            if (data["chartVariable"]["ChartVariable"] && data["chartVariable"]["ChartVariable"].constructor === Array) {
                for (let item of data["chartVariable"]["ChartVariable"])
                    this.chartVariable.push(item);
            }
            /*if (data["chartMapping"]["ChartMapping"] && data["chartMapping"]["ChartMapping"].constructor === Array) {
                for (let item of data["chartMapping"]["ChartMapping"])
                    this.chartMapping.push(item);
            }*/
            //umesh
            this.chartMapping = data["chartMapping"]["ChartMapping"];//umesh
        }
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["chartVisualizationType"] = this.chartVisualizationType !== undefined ? this.chartVisualizationType : "";
        data["AnalysisDatasetFlag"] = this.AnalysisDatasetFlag !== undefined ? this.AnalysisDatasetFlag : "";
        data["datasetKey"] = this.datasetKey !== undefined ? this.datasetKey : "";
        data["subDatasetKey"] = this.subDatasetKey !== undefined ? this.subDatasetKey : "";
        data["AnalysisKey"] = this.AnalysisKey !== undefined ? this.AnalysisKey : "";
        data["pieChartWidth"] = this.pieChartWidth !== undefined ? this.pieChartWidth : "";
        data["pieChartTitle"] = this.pieChartTitle !== undefined ? this.pieChartTitle : "";
        data["pieChartHeight"] = this.pieChartHeight !== undefined ? this.pieChartHeight : "";
        data["pieChartLegendFlag"] = this.pieChartLegendFlag !== undefined ? this.pieChartLegendFlag : "";
        data["pieChartLabelFontSize"] = this.pieChartLabelFontSize !== undefined ? this.pieChartLabelFontSize : "";
        data["pieChartLabelFontType"] = this.pieChartLabelFontType !== undefined ? this.pieChartLabelFontType : "";
        data["pieChartLabelFontColour"] = this.pieChartLabelFontColour !== undefined ? this.pieChartLabelFontColour : "";
        data["pieChartLabel"] = this.pieChartLabel !== undefined ? this.pieChartLabel : "";
        data["pieChartRadius"] = this.pieChartRadius !== undefined ? this.pieChartRadius : "";
        data["chartVariable"] = [];
        data["chartData"] = this.chartData !== undefined ? this.chartData : [];
        if (this.chartVariable && this.chartVariable.constructor === Array) {
            for (let item of this.chartVariable)
                data["chartVariable"].push(item.toJS());
        }
        /*data["chartMapping"] = [];
        if (this.chartMapping && this.chartMapping.constructor === Array) {
            for (let item of this.chartMapping)
                data["chartMapping"].push(item.toJS());
        }*/
        data["chartMapping"] = this.chartMapping.toJS();//umesh
        return data;
    }
    static fromJS(data: any): ChartSpecificOptions {
        debugger;
        return new ChartSpecificOptions(data);
    }
}


export class PreViewChartDto {
    chartWidgetName: string;
    chartWidgetTitle: string;
    chartType: string;
    chartWidgetIdentifier: string;
    chartWidgetHeight: string;
    chartWidgetWidth: string;
    gridStackHeight: string;
    gridStackWidth: string;
    chartPositionTop: string;
    chartPositionLeft: string;
    ChartSpecificPreview: ChartSpecificOptionsPreviewChart[] = [];
    constructor(data?: any) {
        if (data !== undefined) {
            this.chartWidgetName = data["chartWidgetName"] !== undefined ? data["chartWidgetName"] : "";
            this.chartWidgetTitle = data["chartWidgetTitle"] !== undefined ? data["chartWidgetTitle"] : "";
            this.chartType = data["chartType"] !== undefined ? data["chartType"] : "";
            this.chartWidgetIdentifier = data["chartWidgetIdentifier"] !== undefined ? data["chartWidgetIdentifier"] : "";
            this.chartWidgetHeight = data["chartWidgetHeight"] !== undefined ? data["chartWidgetHeight"] : "";
            this.chartWidgetWidth = data["chartWidgetWidth"] !== undefined ? data["chartWidgetWidth"] : "";
            this.gridStackHeight = data["gridStackHeight"] !== undefined ? data["gridStackHeight"] : "";
            this.gridStackWidth = data["gridStackWidth"] !== undefined ? data["gridStackWidth"] : "";
            this.chartPositionTop = data["chartPositionTop"] !== undefined ? data["chartPositionTop"] : "";
            this.chartPositionLeft = data["chartPositionLeft"] !== undefined ? data["chartPositionLeft"] : "";
            if (data["ChartSpecificPreview"]["ChartSpecificOptionsPreviewChart"] && data["ChartSpecificPreview"]["ChartSpecificOptionsPreviewChart"].constructor === Array) {
                for (let item of data["ChartSpecificPreview"]["ChartSpecificOptionsPreviewChart"])
                    this.ChartSpecificPreview.push(item);
            }
        }
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        this.chartWidgetName = data["chartWidgetName"] !== undefined ? data["chartWidgetName"] : "";
        this.chartWidgetTitle = data["chartWidgetTitle"] !== undefined ? data["chartWidgetTitle"] : "";
        this.chartType = data["chartType"] !== undefined ? data["chartType"] : "";
        this.chartWidgetIdentifier = data["chartWidgetIdentifier"] !== undefined ? data["chartWidgetIdentifier"] : "";
        this.chartWidgetHeight = data["chartWidgetHeight"] !== undefined ? data["chartWidgetHeight"] : "";
        this.chartWidgetWidth = data["chartWidgetWidth"] !== undefined ? data["chartWidgetWidth"] : "";
        this.gridStackHeight = data["gridStackHeight"] !== undefined ? data["gridStackHeight"] : "";
        this.gridStackWidth = data["gridStackWidth"] !== undefined ? data["gridStackWidth"] : "";
        this.chartPositionTop = data["chartPositionTop"] !== undefined ? data["chartPositionTop"] : "";
        this.chartPositionLeft = data["chartPositionLeft"] !== undefined ? data["chartPositionLeft"] : "";
        data["chartSpecificOptions"] = [];
        if (this.ChartSpecificPreview && this.ChartSpecificPreview.constructor === Array) {
            for (let item of this.ChartSpecificPreview)
                data["chartSpecificOptions"].push(item.toJS());
        }
    }
}


export class ChartSpecificOptionsPreviewChart {
    chartVisualizationType: string;
    AnalysisDatasetFlag: string;
    datasetKey: string;
    subDatasetKey: string;
    AnalysisKey: string;
    chartVariable: ChartVariable[] = [];
    chartMapping: ChartMapping[] = [];
    constructor(data?: any) {
        if (data !== undefined) {
            this.chartVisualizationType = data["chartVisualizationType"] !== undefined ? data["chartVisualizationType"] : "";
            this.AnalysisDatasetFlag = data["AnalysisDatasetFlag"] !== undefined ? data["AnalysisDatasetFlag"] : "";
            this.datasetKey = data["datasetKey"] !== undefined ? data["datasetKey"] : "";
            this.subDatasetKey = data["subDatasetKey"] !== undefined ? data["subDatasetKey"] : "";
            this.AnalysisKey = data["AnalysisKey"] !== undefined ? data["AnalysisKey"] : "";
            if (data["chartVariable"]["ChartVariable"] && data["chartVariable"]["ChartVariable"].constructor === Array) {
                for (let item of data["chartVariable"]["ChartVariable"])
                    this.chartVariable.push(item);
            }
            if (data["chartMapping"]["ChartMapping"] && data["chartMapping"]["ChartMapping"].constructor === Array) {
                for (let item of data["chartMapping"]["ChartMapping"])
                    this.chartMapping.push(item);
            }
        }
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["chartVisualizationType"] = this.chartVisualizationType !== undefined ? this.chartVisualizationType : "";
        data["AnalysisDatasetFlag"] = this.AnalysisDatasetFlag !== undefined ? this.AnalysisDatasetFlag : "";
        data["datasetKey"] = this.datasetKey !== undefined ? this.datasetKey : "";
        data["subDatasetKey"] = this.subDatasetKey !== undefined ? this.subDatasetKey : "";
        data["AnalysisKey"] = this.AnalysisKey !== undefined ? this.AnalysisKey : "";
        data["chartVariable"] = [];
        if (this.chartVariable && this.chartVariable.constructor === Array) {
            for (let item of this.chartVariable)
                data["chartVariable"].push(item.toJS());
        }
        data["chartMapping"] = [];
        if (this.chartMapping && this.chartMapping.constructor === Array) {
            for (let item of this.chartMapping)
                data["chartMapping"].push(item.toJS());
        }
    }
}
export class ChartVariable {

    chartVariableName: string;
    chartVariableType: string;
    chartVariableKey: any;
    chartType: any;
    chartTypeName: string;
    chartVariableDescription: string;

    constructor(data?: any) {
        if (data !== undefined) {
            this.chartVariableName = data["chartVariableName"] !== undefined ? data["chartVariableName"] : data["variableName"];
            this.chartVariableType = data["chartVariableType"] !== undefined ? data["chartVariableType"] : data["type"];
            this.chartVariableKey = data["chartVariableKey"] !== undefined ? data["chartVariableKey"] : "";
            this.chartType = data["chartType"] !== undefined ? data["chartType"] : "";
            this.chartTypeName = data["chartTypeName"] !== undefined ? data["chartTypeName"] : "";
            this.chartVariableDescription = data["chartVariableDescription"] !== undefined ? data["chartVariableDescription"] : "";


        }
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["chartVariableName"] = this.chartVariableName !== undefined ? this.chartVariableName : "";
        data["chartVariableType"] = this.chartVariableType !== undefined ? this.chartVariableType : "";
        data["chartVariableKey"] = this.chartVariableKey !== undefined ? this.chartVariableKey : "";
        data["chartType"] = this.chartType !== undefined ? this.chartType : "";
        data["chartTypeName"] = this.chartTypeName !== undefined ? this.chartTypeName : "";
        data["chartVariableDescription"] = this.chartVariableDescription !== undefined ? this.chartVariableDescription : "";

    }
    static fromJS(data: any): ChartVariable {
        return new ChartVariable(data);
    }
}

export class ChartMapping {
    measures: Measures[] = [];
    dimesnsion: Dimension[] = [];

    constructor(data?: any) {
        if (data !== undefined) {

            if (data["measures"] && data["measures"].constructor === Array) {
                for (let item of data["measures"])
                    this.measures.push(Measures.fromJS(item));
            }
            if (data["dimesnsion"] && data["dimesnsion"].constructor === Array) {
                for (let item of data["dimesnsion"])
                    this.dimesnsion.push(Dimension.fromJS(item));
            }
        }
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["measures"] = [];
        if (this.measures && this.measures.constructor === Array) {
            for (let item of this.measures)
                data["measures"].push(item.toJS());
        }

        data["chartVariable"] = [];
        if (this.dimesnsion && this.dimesnsion.constructor === Array) {
            for (let item of this.dimesnsion)
                data["dimesnsion"].push(item.toJS());
        }

    }
    static fromJS(data: any): ChartMapping {
        return new ChartMapping(data);
    }

}

export class Measures {
    variableName: string;
    mapping: string;
    aggregation: string;
    constructor(data?: any) {
        if (data !== undefined) {
            this.variableName = data["variableName"] !== undefined ? data["variableName"] : "";
            this.mapping = data["mapping"] !== undefined ? data["mapping"] : "";
            this.aggregation = data["aggregation"] !== undefined ? data["aggregation"] : "";
        }
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["variableName"] = this.variableName !== undefined ? this.variableName : "";
        data["mapping"] = this.mapping !== undefined ? this.mapping : "";
        data["aggregation"] = this.aggregation !== undefined ? this.aggregation : "";
    }
    static fromJS(data: any): Measures {
        return new Measures(data);
    }
}

export class Dimension {
    variableName: string;
    mapping: string;
    legendRule: LegendRule;

    constructor(data?: any) {
        if (data !== undefined) {
            this.variableName = data["variableName"] !== undefined ? data["variableName"] : "";
            this.mapping = data["mapping"] !== undefined ? data["mapping"] : "";
            this.legendRule = LegendRule.fromJS(data["legendRule"]);

        }
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["variableName"] = this.variableName !== undefined ? this.variableName : "";
        data["mapping"] = this.mapping !== undefined ? this.mapping : "";
        data["legendRule"] = this.legendRule.toJS();
    }
    static fromJS(data: any): Dimension {
        return new Dimension(data);
    }
}


export class LegendRule {
    rule: string;
    legendFlag: string;
    legendName: string;
    legendColour: string;
    legendFont: string;
    constructor(data?: any) {
        if (data !== undefined) {
            this.rule = data["rule"] !== undefined ? data["rule"] : "";
            this.legendFlag = data["legendFlag"] == undefined ? data["legendFlag"] : "";
            this.legendName = data["legendName"] == undefined ? data["legendName"] : "";
            this.legendColour = data["legendColour"] == undefined ? data["legendColour"] : "";
            this.legendFont = data["legendFont"] == undefined ? data["legendFont"] : "";
        }
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["rule"] = this.rule !== undefined ? this.rule : "";
        data["legendFlag"] = this.legendFlag !== undefined ? this.legendFlag : "";
        data["legendName"] = this.legendName !== undefined ? this.legendName : "";
        data["legendColour"] = this.legendColour !== undefined ? this.legendColour : "";
        data["legendFont"] = this.legendFont !== undefined ? this.legendFont : "";
    }
    static fromJS(data: any): LegendRule {
        return new LegendRule(data);
    }
}


export class LocalFiltersChart {
    localFilter: LocalFilter[] = [];
    dashboardKey: string;
    chartWidgetName: string;
    constructor(data?: any) {
        if (data !== undefined) {
            if (data["localFilter"]["LocalFilter"] && data["localFilter"]["LocalFilter"].constructor === Array) {
                for (let item of data["localFilter"]["LocalFilter"])
                    this.localFilter.push(item);
            }
            this.dashboardKey = data["dashboardKey"] !== undefined ? data["dashboardKey"] : "";
            this.chartWidgetName = data["chartWidgetName"] !== undefined ? data["chartWidgetName"] : "";
        }
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        this.dashboardKey = data["dashboardKey"] !== undefined ? data["dashboardKey"] : "";
        this.chartWidgetName = data["chartWidgetName"] !== undefined ? data["chartWidgetName"] : "";
        data = data === undefined ? {} : data;
        data["localFilter"] = [];
        if (this.localFilter && this.localFilter.constructor === Array) {
            for (let item of this.localFilter)
                data["localFilter"].push(item.toJS());
        }

    }
    static fromJS(data: any): LocalFiltersChart {
        return new LocalFiltersChart(data);
    }
}

export class LocalFilter {
    dim: string;
    operator: string;
    value: string;
    constructor(data?: any) {
        if (data !== undefined) {
            this.dim = data["dim"] !== undefined ? data["dim"] : "";
            this.operator = data["operator"] !== undefined ? data["operator"] : "";
            this.value = data["value"] !== undefined ? data["value"] : "";
        }
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        this.dim = data["dim"] !== undefined ? data["dim"] : "";
        this.operator = data["operator"] !== undefined ? data["operator"] : "";
        this.value = data["value"] !== undefined ? data["value"] : "";
    }
    static fromJS(data: any): LocalFilter {
        return new LocalFilter(data);
    }
}
export class CreateDashBoard {
    statusCode: number = 1;
    statusMessage: string;
    Dashboard: CreateDashBoardResult;
    constructor(data?: any) {
        if (data !== undefined) {
            this.statusCode = data["statusCode"] !== undefined ? data["statusCode"] : 1;
            this.statusMessage = data["statusMessage"] !== undefined ? data["statusMessage"] : "";
            this.Dashboard = CreateDashBoardResult.fromJS(data["Dashboard"]);
        }
    }
    static fromJS(data: any): CreateDashBoard {
        return new CreateDashBoard(data);
    }
}

export class CreateDashBoardResult {
    entityName: string;
    entityKey: string;
    constructor(data?: any) {
        if (data !== undefined) {
            this.entityName = data["entityName"] !== undefined ? data["entityName"] : "";
            this.entityKey = data["entityKey"] !== undefined ? data["entityKey"] : "";
        }
    }
    static fromJS(data: any): CreateDashBoardResult {
        return new CreateDashBoardResult(data);
    }
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
    // analysisHistory: AnalysisModelHistory = new AnalysisModelHistory();
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



export class ChartTypeListDto {
    chartTypeKey: string;
    chartTypeName: string;
    constructor(data?: any) {
        if (data !== undefined) {
            this.chartTypeKey = data["chartTypeKey"] !== undefined ? data["chartTypeKey"] : "";
            this.chartTypeName = data["chartTypeName"] !== undefined ? data["chartTypeName"] : "";
        }
    }
    static fromJS(data: any): ChartTypeListDto {
        return new ChartTypeListDto(data);
    }
}





export class Data {
    measure: string;
    label: string;
    constructor(data?: any) {
        if (data !== undefined) {
            this.measure = data["measure"] !== undefined ? data["measure"] : "";
            this.label = data["label"] !== undefined ? data["label"] : "";
        }
    }
    static fromJS(data: any): Data {
        return new Data(data);
    }
}




export class ChartSpecificationDetails {
    analysisDatasetFlag: string;
    analysisKey: string;
    ChartMapping: chartMappingDetails;
    ChartVariable: chartVariableDetails[] = [];
    chartVisualizationType: string;
    datasetKey: string;
    pieChartHeight: string;
    pieChartLabel: string;
    pieChartLabelFontColour: string;
    pieChartLabelFontSize: string;
    pieChartLabelFontType: string;
    pieChartLegendFlag: string;
    pieChartRadius: string;
    pieChartTitle: string;
    pieChartWidth: string;
    subDatasetKey: string;
    chartWidgetTitle: string;
    chartPositionLeft: string;
    chartWidgetIdentifier: string;
    chartType: string;
    chartWidgetHeight: string;
    // analysisHistory: AnalysisModelHistory = new AnalysisModelHistory();
    isRunning: boolean = true;
    chartWidgetKey: string;
    constructor(data?: any) {
        // debugger;
        if (data !== undefined) {
            this.analysisDatasetFlag = data["analysisDatasetFlag"] !== undefined ? data["analysisDatasetFlag"] : null;
            this.analysisKey = data["analysisKey"] !== undefined ? data["analysisKey"] : null;
            this.ChartMapping = data["ChartMapping"] !== undefined ? data["ChartMapping"] : null;
            this.ChartVariable = data["ChartVariable"] !== undefined ? data["ChartVariable"] : null;
            this.chartVisualizationType = data["chartVisualizationType"] !== undefined ? data["chartVisualizationType"] : null;
            this.datasetKey = data["datasetKey"] !== undefined ? data["datasetKey"] : null;
            this.pieChartHeight = data["pieChartHeight"] !== undefined ? data["pieChartHeight"] : null;
            this.pieChartLabel = data["pieChartLabel"] !== undefined ? data["pieChartLabel"] : null;
            this.pieChartLabelFontColour = data["pieChartLabelFontColour"] !== undefined ? data["pieChartLabelFontColour"] : null;
            this.pieChartLabelFontSize = data["pieChartLabelFontSize"] !== undefined ? data["pieChartLabelFontSize"] : null;
            this.pieChartLabelFontType = data["pieChartLabelFontType"] !== undefined ? data["pieChartLabelFontType"] : null;
            this.pieChartLegendFlag = data["pieChartLegendFlag"] !== undefined ? data["pieChartLegendFlag"] : null;
            this.pieChartRadius = data["pieChartRadius"] !== undefined ? data["pieChartRadius"] : null;
            this.pieChartTitle = data["pieChartTitle"] !== undefined ? data["pieChartTitle"] : null;
            this.pieChartWidth = data["pieChartWidth"] !== undefined ? data["pieChartWidth"] : null;
            this.subDatasetKey = data["subDatasetKey"] !== undefined ? data["subDatasetKey"] : null;
            this.chartWidgetTitle = data["chartWidgetTitle"] !== undefined ? data["chartWidgetTitle"] : null;
            this.chartPositionLeft = data["chartPositionLeft"] !== undefined ? data["chartPositionLeft"] : null;
            this.chartWidgetIdentifier = data["chartWidgetIdentifier"] !== undefined ? data["chartWidgetIdentifier"] : null;
            this.chartType = data["chartType"] !== undefined ? data["chartType"] : null;
            this.chartWidgetHeight = data["chartWidgetHeight"] !== undefined ? data["chartWidgetHeight"] : null;
        }
    }

    static fromJS(data: any): ChartSpecificationDetails {
        return new ChartSpecificationDetails(data);
    }
    toJS(data?: any) {

    }
}


export class chartVariableDetails {
    type: string;
    variableName: string;
    constructor(data?: any) {
        if (data !== undefined) {
            this.type = data["type"] !== undefined ? data["type"] : "";
            this.variableName = data["variableName"] !== undefined ? data["variableName"] : "";
        }
    }
    static fromJS(data: any): chartVariableDetails {
        return new chartVariableDetails(data);
    }
}



export class chartMappingDetails {
    measures: MeasureDetails[] = [];
    dimension: dimensionDetails[] = [];
    constructor(data?: any) {
        if (data !== undefined) {
            this.measures = data["measures"] !== undefined ? data["measures"] : "";
            this.dimension = data["dimension"] !== undefined ? data["dimension"] : "";
        }
    }
    static fromJS(data: any): chartMappingDetails {
        return new chartMappingDetails(data);
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


export class dimensionDetails {
    legendRule: legendRuleDetails;
    mapping: string;
    variableName: string;
    constructor(data?: any) {
        if (data !== undefined) {
            this.legendRule = data["legendRule"] !== undefined ? data["legendRule"] : "";
            this.mapping = data["mapping"] !== undefined ? data["mapping"] : "";
            this.variableName = data["variableName"] !== undefined ? data["variableName"] : "";

        }
    }
    static fromJS(data: any): dimensionDetails {
        return new dimensionDetails(data);
    }
}


export class legendRuleDetails {
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
            this.rule = data["rule"] !== undefined ? data[" rule"] : "";
            this.legendColour = data["legendColour"] !== undefined ? data["legendColour"] : "";

        }
    }
    static fromJS(data: any): legendRuleDetails {
        return new legendRuleDetails(data);
    }
}

//create classes for (analysisScheduleList),(dashboardScheduleList),(modelScheduleList)
export class scheduleDto {
    scheduleType: string;
    from: string;
    to: string;
    basis: string;
    day: string;
    time: any;
    status: string;
    analysisScheduleList: string[] = [];
    dashboardScheduleList: string[] = [];
    modelScheduleList: string[] = [];

    constructor(data?: any) {
        if (data !== undefined) {
            this.from = data["from"] !== undefined ? data["from"] : "";
            this.to = data["to"] !== undefined ? data["to"] : "";
            this.basis = data["basis"] !== undefined ? data["basis"] : "";
            this.day = data["day"] !== undefined ? data["day"] : "";
            this.time = data["time"] !== undefined ? data["time"] : "";
            this.status = data["status"] !== undefined ? data["status"] : "";

        }
    }
    static fromJS(data: any): scheduleDto {
        return new scheduleDto(data);
    }

}


export class DashboardResultModel {
    statusCode: number;
    statusMessage: string;
    Dashboard: any;
    constructor(data?: any) {
        if (data !== undefined) {
            this.statusCode = data["statusCode"] !== undefined ? data["statusCode"] : null;
            this.statusMessage = data["statusMessage"] !== undefined ? data["statusMessage"] : null;
            this.Dashboard = data["Dashboard"] !== undefined ? data["Dashboard"] : null;
        }
    }
    static fromJS(data: any): DashboardResultModel {
        return new DashboardResultModel(data);
    }
}


export class GSAnalysisChart {
    // type: ChartType;
    chartVisualizationType: string;
    // chartData: any[] = [];
    chartWidgetName: string;
    gridStackHeight: string;
    chartWidgetWidth: string;
    chartType: string;
    //chartWidgetKey: string;
    gridStackWidth: string;
    chartPositionTop: string;
    chartSpecificOptions: any;
    chartWidgetTitle: string;
    chartPositionLeft: string;
    chartWidgetIdentifier: string;
    chartWidgetHeight: string;
    constructor(data?: any) {

        if (data !== undefined) {
            this.chartWidgetName = data["chartWidgetName"] !== undefined ? data["chartWidgetName"] : null;
            this.chartWidgetName = data["chartWidgetName"] !== undefined ? data["chartWidgetName"] : null;
            this.chartWidgetWidth = data["chartWidgetWidth"] !== undefined ? data["chartWidgetWidth"] : null;
            this.chartType = data["chartType"] !== undefined ? data["chartType"] : null;
            //this.chartWidgetKey = data["chartWidgetKey"] !== undefined ? data["chartWidgetKey"] : null;
            this.gridStackWidth = data["gridStackWidth"] !== undefined ? data["gridStackWidth"] : null;
            this.chartPositionTop = data["chartPositionTop"] !== undefined ? data["chartPositionTop"] : null;
            this.chartWidgetTitle = data["chartWidgetTitle"] !== undefined ? data["chartWidgetTitle"] : null;
            this.chartPositionLeft = data["chartPositionLeft"] !== undefined ? data["chartPositionLeft"] : null;
            this.chartWidgetIdentifier = data["chartWidgetIdentifier"] !== undefined ? data["chartWidgetIdentifier"] : null;
            this.chartWidgetHeight = data["chartWidgetHeight"] !== undefined ? data["chartWidgetHeight"] : null;
            this.chartSpecificOptions = data["chartSpecificOptions"] !== undefined ? data["chartSpecificOptions"] : null;
            // this.chartVisualizationType = data["chartSpecificOptions"]["chartVisualizationType"] !== undefined ? data["chartSpecificOptions"]["chartVisualizationType"]: null;
            this.chartVisualizationType = data["chartVisualizationType"] !== undefined ? data["chartVisualizationType"] : '';

            // this.chartData =  this.chartSpecificOptions.chartData

            //            if (this.chartSpecificOptions !== undefined) {
            //                debugger;
            //                if (data["chartSpecificOptions"]["chartData"]) {
            //                    if (this.chartVisualizationType === "pie chart") {
            //                        debugger;
            //
            ////
            //                    }
            // //                        else if (this.type === ChartType.PIE) {
            ////                        let w = data["chartSpecificOptions"]["chartData"];
            ////                        if (w && w.constructor === Array) {
            ////                            for (let item of w) {
            ////                                this.chartData.push(PieChart.fromJS(item));
            ////                            }
            ////                        }
            ////                    } else if (this.type === ChartType.CHORD) {
            ////                        let w = data["chartSpecificOptions"]["chartData"];
            ////                         w = JSON.parse(w, this.jsonParseReviver);
            ////                        if (w) {
            ////                            this.chartData.push(ChordChart.fromJS(w));
            ////                        }
            ////                    }
            //                }
            //            }
        }

    }
    //
    static fromJS(data?: any): GSAnalysisChart {
        return new GSAnalysisChart(data);
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


export class PieChartOptions {
    chartData: PieChart[] = [];
    ChartVariable: ChartVariables[] = [];
    ChartMapping: string[] = [];// pending some fields
    type: ChartType;
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
                    this.ChartVariable.push(ChartVariables.fromJS(item));
                }
            }
            if (data["chartData"] && data["chartData"].constructor === Array) {
                for (let item of data["chartData"]) {
                    this.chartData.push(PieChart.fromJS(item));
                }
            }
            //if (data["chartData"] && data["chartData"].constructor === Array) {
            //    for (let item of data["chartData"]) {
            //        this.chartData.push(PieChart.fromJS(item));
            //    }
            //}
        }
    }
    static fromJS(data?: any): PieChartOptions {
        return new PieChartOptions(data);
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
