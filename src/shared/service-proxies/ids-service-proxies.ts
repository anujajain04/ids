import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Injectable, Inject, Optional, OpaqueToken } from '@angular/core';
import { Http, Headers, Response, RequestOptionsArgs, RequestOptions } from '@angular/http';
import { TokenService } from '@abp/auth/token.service';
import { AnalysisDtoDetails } from '@shared/service-proxies/ids-analysis-service-proxies';
import { WorkspaceService, WorkspaceDto } from '@shared/service-proxies/ids-workspace-service-proxies';
// all API request for ids 
@Injectable()
export class AccountService {

}
@Injectable()
export class DatasetService {
    debugger
    private http: Http = null;
    protected jsonParseReviver: (key: string, value: any) => any = undefined;
    constructor( @Inject(Http) http: Http, private _session: TokenService, public workspace: WorkspaceService) {
        this.http = http;
    }
    //access get dataset api => 
    getDatasetList(): Observable<DatasetDto[]> {
        debugger
        const _content = JSON.stringify({
            workspaceKey: WorkspaceService.WorkSpaceKey,
            sessionKey: this._session.getToken()
        });
        return this.http.request(TempBaseUrl.BASE_URL + "datasets/listdataset/", {
            body: _content,
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            //alert(response.text());
            return this.processDatasetList(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processDatasetList(response));
                } catch (e) {
                    return <Observable<DatasetDto[]>><any>Observable.throw(e);
                }
            } else
                return <Observable<DatasetDto[]>><any>Observable.throw(response);
        });
    }
    protected processDatasetList(response: Response): DatasetDto[] {
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: DatasetDto[] = [];
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver)
            let js = result200['datasetList'];
            for (let r of js['RDBMS']) {
                let d = DatasetDto.fromJS(r);
                d.className = "RDBMS";
                result.push(d);
            }
            for (let r of js['Twitter']) {
                let d = DatasetDto.fromJS(r);
                d.className = "Twitter";
                result.push(d);
            }
            for (let r of js['Excel']) {
                let d = DatasetDto.fromJS(r);
                d.className = "Excel";
                result.push(d);
            }
            for (let r of js['Facebook']) {
                let d = DatasetDto.fromJS(r);
                d.className = "Facebook";
                result.push(d);
            }
            for (let r of js['File']) {
                let d = DatasetDto.fromJS(r);
                d.className = "CSV";
                result.push(d);
            }
            for (let r of js['RSS']) {
                let d = DatasetDto.fromJS(r);
                d.className = "RSS";
                result.push(d);
            }
            return result;
        }
        return null;
    }
    //get subdatasets data
    getSubDatasetData(trgSubDatasetKey: string, targetDatasetKey: string): Observable<any> {
        const _content = JSON.stringify({
            subDatasetKey: trgSubDatasetKey,
            datasetKey: targetDatasetKey,
            sessionKey: this._session.getToken()
        });
        debugger;
        console.log('request' + _content);

        return this.http.request(TempBaseUrl.BASE_URL + "datasets/viewData/", {
            body: _content,
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return JSON.parse(response.text())
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
    // create Csv dataset 
    createCsvDataset(input: CSVDatasetDto): Observable<DatasetResultModel> {
        debugger;
        const _content = input ? input.toJSON().toString() : null;
        return this.http.request(TempBaseUrl.BASE_URL + "datasets/", {
            body: _content,
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            return this.processDatasetResult(response, DatasetState.CSV);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processDatasetResult(response, DatasetState.CSV));
                } catch (e) {
                    return <Observable<DatasetResultModel>><any>Observable.throw(e);
                }
            } else
                return <Observable<DatasetResultModel>><any>Observable.throw(response);
        });
    }
    // create Facebook dataset 
    createFacebookDataset(input: FacebookDatasetDto): Observable<DatasetResultModel> {
        const _content = input ? input.toJSON().toString() : null;
        debugger;
        return this.http.request(TempBaseUrl.BASE_URL + "datasets/", {
            body: _content,
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processDatasetResult(response, DatasetState.FACEBOOK);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processDatasetResult(response, DatasetState.FACEBOOK));
                } catch (e) {
                    return <Observable<DatasetResultModel>><any>Observable.throw(e);
                }
            } else
                return <Observable<DatasetResultModel>><any>Observable.throw(response);
        });
    }
    protected processDatasetResult(response: Response, d: DatasetState): DatasetResultModel {
        debugger;
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: DatasetResultModel = null;
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver)
            result = DatasetResultModel.fromJS(result200, d);
            return result;
        }
        return null;
    }
    createExcelDataset(input: ExcelDatasetDto): Observable<DatasetResultModel> {
        const _content = input ? input.toJSON().toString() : null;
        debugger;
        console.log('result' + _content);
        return this.http.request(TempBaseUrl.BASE_URL + "datasets/", {
            body: _content,
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            //    alert(response.text());
            return this.processDatasetResult(response, DatasetState.EXCEL);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processDatasetResult(response, DatasetState.EXCEL));
                } catch (e) {
                    return <Observable<DatasetResultModel>><any>Observable.throw(e);
                }
            } else
                return <Observable<DatasetResultModel>><any>Observable.throw(response);
        });
    }
    //create rss dataset
    // create Facebook dataset
    createRSSDataset(input: RSSDatasetDto): Observable<DatasetResultModel> {
        const _content = input ? input.createJS() : null;
        debugger;
        //  alert('result' + _content);
        return this.http.request(TempBaseUrl.BASE_URL + "datasets/", {
            body: _content,
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            return this.processDatasetResult(response, DatasetState.RSS);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processDatasetResult(response, DatasetState.RSS));
                } catch (e) {
                    return <Observable<DatasetResultModel>><any>Observable.throw(e);
                }
            } else
                return <Observable<DatasetResultModel>><any>Observable.throw(response);
        });
    }

    createTwitterDataset(input: TwitterDatasetDto): Observable<DatasetResultModel> {
        const _content = input ? input.toJSON().toString() : null;
        debugger;
        return this.http.request(TempBaseUrl.BASE_URL + "datasets/", {
            body: _content,
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processDatasetResult(response, DatasetState.TWITTER);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processDatasetResult(response, DatasetState.TWITTER));
                } catch (e) {
                    return <Observable<DatasetResultModel>><any>Observable.throw(e);
                }
            } else
                return <Observable<DatasetResultModel>><any>Observable.throw(response);
        });
    }
    createRDBMSDataset(input: RDBMSDatasetDto): Observable<DatasetResultModel> {
        const _content = input ? input.toJSON().toString() : null;
        debugger;
        return this.http.request(TempBaseUrl.BASE_URL + "datasets/", {
            body: _content,
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processDatasetResult(response, DatasetState.RDBMS);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processDatasetResult(response, DatasetState.RDBMS));
                } catch (e) {
                    return <Observable<DatasetResultModel>><any>Observable.throw(e);
                }
            } else
                return <Observable<DatasetResultModel>><any>Observable.throw(response);
        });
    }
    // get dataset types

    getDatasetTypes(): Observable<DatasetType[]> {

        return this.http.request(TempBaseUrl.BASE_URL + "datasets/get_datasets_type_list/", {
            method: "get",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            return this.processDatasetTypeList(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processDatasetTypeList(response));
                } catch (e) {
                    return <Observable<DatasetType[]>><any>Observable.throw(e);
                }
            } else
                return <Observable<DatasetType[]>><any>Observable.throw(response);
        });
    }
    protected processDatasetTypeList(response: Response): DatasetType[] {
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: DatasetType[] = [];
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            if (result200 && result200.constructor === Array) {
                for (let item of result200) {
                    result.push(DatasetType.fromJS(item));
                }
                return result;
            }
        }
        return null;
    }
    /// get dataset count
    getDatasetCount(): Observable<DatasetCountDto> {

        return this.http.request(TempBaseUrl.BASE_URL + "datasets/get_dataset_count_list/", {
            method: "get",
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
                    return <Observable<DatasetCountDto>><any>Observable.throw(e);
                }
            } else
                return <Observable<DatasetCountDto>><any>Observable.throw(response);
        });
    }
    protected processDatasetCount(response: Response): DatasetCountDto {
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: DatasetCountDto;
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            if (result200["statusCode"] === 1) {
                return DatasetCountDto.fromJS(result200["Dataset_count_list"]);
            }
        }
        return null;
    }
    //get subdatasets
    getSubDataset(input: string): Observable<SubDatasetDto[]> {
        const _content = JSON.stringify({
            datasetKey: input,
            sessionKey: this._session.getToken()
        });
        debugger;
        console.log('request' + _content);

        return this.http.request(TempBaseUrl.BASE_URL + "subdatasets/get_subdatasets_list/", {
            body: _content,
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processSubDatasetList(response, input);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processSubDatasetList(response, input));
                } catch (e) {
                    return <Observable<SubDatasetDto[]>><any>Observable.throw(e);
                }
            } else
                return <Observable<SubDatasetDto[]>><any>Observable.throw(response);
        });
    }
    protected processSubDatasetList(response: Response, dataKey: string): SubDatasetDto[] {
        const responseText = response.text();
        const status = response.status;

        if (status === 200) {
            let result: SubDatasetDto[] = [];
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            if (result200["statusCode"] === 1) {
                if (result200["subdatasetList"] && result200["subdatasetList"].constructor === Array) {
                    for (let item of result200["subdatasetList"]) {
                        result.push(SubDatasetDto.fromJS(item, dataKey));
                    }
                    return result;
                }
            }
        }
        return null;
    }
    
    //get subdatasets fields
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
            if (result200["statusCode"] === 1) {
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

    // delete dataset
    deleteDataset(input: string, name: string): Observable<DatasetResultModel> {
        const _content = JSON.stringify({ className: name });
        let d = this.getDatasetState(name);
        return this.http.request(TempBaseUrl.BASE_URL + "datasets/" + input + "/deleteDataset/", {
            body: _content,
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            // alert(response);
            return this.processDatasetResult(response, d);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processDatasetResult(response, d));
                } catch (e) {
                    return <Observable<DatasetResultModel>><any>Observable.throw(e);
                }
            } else
                return <Observable<DatasetResultModel>><any>Observable.throw(response);
        });
    }
    deleteMultipleDataset(input: DeleteDatasetDto): Observable<any> {
        debugger;
        input.sessionKey = this._session.getToken();
        const _content = input ? input.toJSON().toString() : null;
        return this.http.request(TempBaseUrl.BASE_URL + "datasets/delete_multiple_datasets/", {
            body: _content,
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            // alert(response);
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
    getDatasetState(str: string): DatasetState {
        if (str.toLowerCase() == "csv")
            return DatasetState.CSV;
        if (str.toLowerCase() == "excel")
            return DatasetState.EXCEL;
        if (str.toLowerCase() == "twitter")
            return DatasetState.TWITTER;
        if (str.toLowerCase() == "facebook")
            return DatasetState.FACEBOOK;
        if (str.toLowerCase() == "rss")
            return DatasetState.RSS;
        if (str.toLowerCase() == "rdbms")
            return DatasetState.RDBMS;
        return 0;
    }
    /**
    * get dataset history ie. all the details of perticular dataset
    */
    datasetHistory(input: string): Observable<DatasetHistoryDto> {
        const _content = JSON.stringify({
            datasetKey: input,
            sessionKey: this._session.getToken()
        });
        return this.http.request(TempBaseUrl.BASE_URL + "datasets/get_dataset_history/", {
            body: _content,
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            return this.processDatasetHistory(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processDatasetHistory(response));
                } catch (e) {
                    return <Observable<DatasetHistoryDto>><any>Observable.throw(e);
                }
            } else
                return <Observable<DatasetHistoryDto>><any>Observable.throw(response);
        });
    }
    protected processDatasetHistory(response: Response): DatasetHistoryDto {
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: DatasetHistoryDto;
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            if (result200["statusCode"] === 1) {
                return DatasetHistoryDto.fromJS(result200["Dataset_history"]);
            }
        }
        return null;
    }
    /**
    * Validate RDBMS user
        * parameter input is a json string.
    */
    validateRDBMSUser(input: string): Observable<AuthenticateDto> {

        const _content = input;
        return this.http.request(TempBaseUrl.BASE_URL + "datasets/validate_user_for_rdbms_server/", {
            body: _content,
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            //debugger;
            return this.processvalidateRDBMSUser(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processvalidateRDBMSUser(response));
                } catch (e) {
                    return <Observable<AuthenticateDto>><any>Observable.throw(e);
                }
            } else
                return <Observable<AuthenticateDto>><any>Observable.throw(response);
        });
    }
    protected processvalidateRDBMSUser(response: Response): AuthenticateDto {
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            return AuthenticateDto.fromJS(result200);
        }
        return null;
    }
    // get rss dataset fields
    getRssFields(input: string): Observable<string[]> {
        const _content = input;
        return this.http.request(TempBaseUrl.BASE_URL + "datasets/get_rss_fields/", {
            body: _content,
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            return this.processRssFieldList(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processRssFieldList(response));
                } catch (e) {
                    return <Observable<string[]>><any>Observable.throw(e);
                }
            } else
                return <Observable<string[]>><any>Observable.throw(response);
        });
    }
    protected processRssFieldList(response: Response): string[] {
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: string[] = [];
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            if (result200["statusCode"] === 1) {
                if (result200["RssFields"] && result200["RssFields"].constructor === Array) {
                    for (let item of result200["RssFields"]) {
                        result.push(item);
                    }
                    return result;
                }
            }
        }
        return null;
    }

    getFacebookFields(): Observable<string[]> {

        return this.http.request(TempBaseUrl.BASE_URL + "datasets/get_dataset_fields_facebook/", {
            method: "get",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            return this.processFieldList(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processFieldList(response));
                } catch (e) {
                    return <Observable<string[]>><any>Observable.throw(e);
                }
            } else
                return <Observable<string[]>><any>Observable.throw(response);
        });
    }
    getTwitterFields(): Observable<string[]> {

        return this.http.request(TempBaseUrl.BASE_URL + "datasets/get_dataset_fields_twitter/", {
            method: "get",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            return this.processFieldList(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processFieldList(response));
                } catch (e) {
                    return <Observable<string[]>><any>Observable.throw(e);
                }
            } else
                return <Observable<string[]>><any>Observable.throw(response);
        });
    }
    protected processFieldList(response: Response): string[] {
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: string[] = [];
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            if (result200["statusCode"] === 1) {
                if (result200["datasetFields"] && result200["datasetFields"].constructor === Array) {
                    for (let item of result200["datasetFields"]) {
                        result.push(item);
                    }
                    return result;
                }
            }
        }
        return null;
    }
    getDatabaseDriver(): Observable<DatabaseDriver[]> {

        return this.http.request(TempBaseUrl.BASE_URL + "datasets/get_database_driver_list/", {
            method: "get",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processDriverList(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processDriverList(response));
                } catch (e) {
                    return <Observable<DatabaseDriver[]>><any>Observable.throw(e);
                }
            } else
                return <Observable<DatabaseDriver[]>><any>Observable.throw(response);
        });
    }
    processDriverList(response: Response): DatabaseDriver[] {
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: DatabaseDriver[] = [];
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            if (result200["statusCode"] === 1) {
                if (result200["driverList"] && result200["driverList"].constructor === Array) {
                    for (let item of result200["driverList"]) {
                        let d: DatabaseDriver = new DatabaseDriver();
                        item.forEach((i, index) => {
                            if (index == 0)
                                d.key = i;
                            else d.value = i;
                        });
                        result.push(d);
                    }
                    return result;
                }
            }
        }
        return null;
    }
    getDatabaseList(input: string): Observable<string[]> {
        debugger;
        const _content = input;
        return this.http.request(TempBaseUrl.BASE_URL + "datasets/get_databases_list/", {
            body: _content,
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processDatabaseList(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processDatabaseList(response));
                } catch (e) {
                    return <Observable<string[]>><any>Observable.throw(e);
                }
            } else
                return <Observable<string[]>><any>Observable.throw(response);
        });
    }
    processDatabaseList(response: Response): string[] {
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: string[] = [];
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            if (result200["statusCode"] === 1) {
                if (result200["database_list"] && result200["database_list"].constructor === Array) {
                    for (let item of result200["database_list"]) {
                        result.push(item["name"]);
                    }
                    return result;
                }
            }
        }
        return null;
    }

    getTableList(input: string): Observable<string[]> {
        debugger;
        const _content = input;
        return this.http.request(TempBaseUrl.BASE_URL + "datasets/get_database_table_list/", {
            body: _content,
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processTableList(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processTableList(response));
                } catch (e) {
                    return <Observable<string[]>><any>Observable.throw(e);
                }
            } else
                return <Observable<string[]>><any>Observable.throw(response);
        });
    }
    processTableList(response: Response): string[] {
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: string[] = [];
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            if (result200["statusCode"] === 1) {
                if (result200["table_list"] && result200["table_list"].constructor === Array) {
                    for (let item of result200["table_list"]) {
                        if (item["TABLE_NAME"] !== undefined)
                            result.push(item["TABLE_NAME"]);
                        else
                            result.push(item["table_name"]);
                    }
                    return result;
                }
            }
        }
        return null;
    }

    //Edit dataset
    editDataset(input: string, key: string): Observable<any> {
        debugger;
        const _content = JSON.stringify({
            className: input,
            sessionKey: this._session.getToken()
        });
        return this.http.request(TempBaseUrl.BASE_URL + "datasets/" + key + "/editDataset/", {
            body: _content,
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processEditDataset(response, input);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processEditDataset(response, input));
                } catch (e) {
                    return <Observable<string[]>><any>Observable.throw(e);
                }
            } else
                return <Observable<string[]>><any>Observable.throw(response);
        });
    }
    processEditDataset(response: Response, key: string): any {
        debugger;
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: any = null;
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            if (result200["statusCode"] === 1) {
                if (key.toLowerCase() == "rss")
                    result = RSSDatasetDto.fromJS(result200["datasetObjdict"]);
                else if (key.toLowerCase() == "twitter")
                    result = TwitterDatasetDto.fromJS(result200["datasetObjdict"]);
                else if (key.toLowerCase() == "facebook")
                    result = FacebookDatasetDto.fromJS(result200["datasetObjdict"]);
                else if (key.toLowerCase() == "csv")
                    result = CSVDatasetDto.fromJS(result200["datasetObjdict"]);
                else if (key.toLowerCase() == "excel") {
                    result = ExcelDatasetDto.fromJS(result200["datasetObjdict"]);
                    Object.keys(result200["fileDataHeaders"]).forEach((item, index) => {
                        let tempSheet: ExcelSheet = new ExcelSheet();
                        ///get sheet name and its header fields
                        tempSheet.header = item;
                        for (let x of result200["fileDataHeaders"][item]) {
                            //get column headers
                            let d: DatasetFieldDto = new DatasetFieldDto();
                            d.entityType = "DatasetField";
                            d.entityName = x;
                            d.entityDescription = x;
                            tempSheet.fields.push(d);
                        }
                        result.excelSheet.push(tempSheet);
                    });

                }
                else if (key.toLowerCase() == "rdbms")
                    result = RDBMSDatasetDto.fromJS(result200["datasetObjdict"]);
                return result;
            }
        }
        return null;
    }

    updateDataset(input: any, className: DatasetState, key: string): Observable<DatasetResultModel> {
        debugger;
        return this.http.request(TempBaseUrl.BASE_URL + "datasets/" + key + "/", {
            body: input,
            method: "put",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processDatasetResult(response, className);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processDatasetResult(response, className));
                } catch (e) {
                    return <Observable<DatasetResultModel>><any>Observable.throw(e);
                }
            } else
                return <Observable<DatasetResultModel>><any>Observable.throw(response);
        });
    }
}

@Injectable()
export class GettingStartedService {
    globalGSDataset: any;
    globalGSAnalysis: AnalysisDto;
    globalGSCharts: GSAnalysisChart;

    private http: Http = null;
    protected jsonParseReviver: (key: string, value: any) => any = undefined;
    constructor( @Inject(Http) http: Http) {
        this.http = http;
        this.globalGSAnalysis = new AnalysisDto();
        this.globalGSDataset = new GSDatasetDto();
    }
    saveGettingStartedDataset(input: GSDatasetDto): Observable<DatasetResultModel> {
        const _content = input ? input.toJSON().toString() : null;
        // alert(_content);
        debugger;
        let d = this.getDatasetState(input.className);
        return this.http.request(TempBaseUrl.BASE_URL + "datasets/", {
            body: _content,
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            //  alert(response.text());
            debugger;
            return this.processDatasetResult(response, d);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processDatasetResult(response, d));
                } catch (e) {
                    return <Observable<DatasetResultModel>><any>Observable.throw(e);
                }
            } else
                return <Observable<DatasetResultModel>><any>Observable.throw(response);
        });
    }
    saveChart(_content: any): Observable<AuthenticateDto> {
        return this.http.request(TempBaseUrl.BASE_URL + "gettingStarted/save_gs_page/", {
            body: _content,
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processChart(response);
        }).catch((response: any, processChart: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processChart(response));
                } catch (e) {
                    return <Observable<AuthenticateDto>><any>Observable.throw(e);
                }
            } else
                return <Observable<AuthenticateDto>><any>Observable.throw(response);
        });
    }
    protected processChart(response: Response): AuthenticateDto {
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: AuthenticateDto = null;
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            result = AuthenticateDto.fromJS(result200);
            return result;
        }
        return null;
    }
    getDatasetState(str: string): DatasetState {
        if (str.toLowerCase() == "file")
            return DatasetState.CSV;
        if (str.toLowerCase() == "excel")
            return DatasetState.EXCEL;
        if (str.toLowerCase() == "twitter")
            return DatasetState.TWITTER;
        if (str.toLowerCase() == "facebook")
            return DatasetState.FACEBOOK;
        if (str.toLowerCase() == "rss")
            return DatasetState.RSS;
        if (str.toLowerCase() == "rdbms")
            return DatasetState.RDBMS;
        return 0;
    }
    protected processDatasetResult(response: Response, d: DatasetState): DatasetResultModel {
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: DatasetResultModel = null;
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            result = DatasetResultModel.fromJS(result200, d);
            return result;
        }
        return null;
    }
    uploadFile(file: any,a:any,b:any): Observable<any> {
        debugger;
        let formData: FormData = new FormData();
        formData.append('file', file, file.name);
        formData.append('datasetType',a);
        formData.append('columnDelimiter',b);
        debugger;
        return this.http.request(TempBaseUrl.BASE_URL + "datasets/uploadFile/", {
            body: formData,
            method: "post",
            headers: new Headers({
            })  
        }).map((response) => {
             // alert(response.text());
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
}

@Injectable()
export class AnalysisService {
    private http: Http = null;
    protected jsonParseReviver: (key: string, value: any) => any = undefined;
    constructor( @Inject(Http) http: Http) {
        this.http = http;

    }

    //access get analysis api => 
    // getAnalysisList(): Observable<AnalysisTypeDto[]> {
    //     const _content = JSON.stringify({ workspaceKey: TempBaseUrl.WORKSPACEKEY });
    //     return this.http.request(TempBaseUrl.BASE_URL + "datasets/listdataset/", {
    //         body: _content,
    //         method: "get",
    //         headers: new Headers({
    //             "Content-Type": "application/json; charset=UTF-8",
    //             "Accept": "application/json; charset=UTF-8"
    //         })
    //     }).map((response) => {
    //         //alert(response.text());
    //         return this.processAnalysisList(response);
    //     }).catch((response: any, caught: any) => {
    //         if (response instanceof Response) {
    //             try {
    //                 return Observable.of(this.processAnalysisList(response));
    //             } catch (e) {
    //                 return <Observable<AnalysisTypeDto[]>><any>Observable.throw(e);
    //             }
    //         } else
    //             return <Observable<AnalysisTypeDto[]>><any>Observable.throw(response);
    //     });
    // }

    // protected processAnalysisList(response: Response): AnalysisTypeDto[] {
    //     const responseText = response.text();
    //     const status = response.status;
    //     if (status === 200) {
    //         let result: AnalysisTypeDto[] = [];
    //         let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver)
    //         let js = result200['AnalysisTypeList'];
    //         if (result200['statusCode'] === 1)
    //             if (js && js.constructor === Array)
    //                 for (let r of js) {
    //                     let d = AnalysisTypeDto.fromJS(r);
    //                     result.push(d);
    //                 }

    //         return result;
    //     }
    //     return null;
    // }

    // get Analysis types

    getAnalysisTypes(): Observable<AnalysisTypeDto[]> {

        return this.http.request(TempBaseUrl.BASE_URL + "analysis/get_analysis_types_list/", {
            method: "get",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {

            return this.processAnalysisTypeList(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processAnalysisTypeList(response));
                } catch (e) {
                    return <Observable<AnalysisTypeDto[]>><any>Observable.throw(e);
                }
            } else
                return <Observable<AnalysisTypeDto[]>><any>Observable.throw(response);
        });
    }
    protected processAnalysisTypeList(response: Response): AnalysisTypeDto[] {

        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: AnalysisTypeDto[] = [];
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            if (result200 && result200.constructor === Array) {
                for (let item of result200) {
                    result.push(AnalysisTypeDto.fromJS(item));
                }
                return result;
            }
        }
        return null;
    }
    saveGSAnalysis(input: AnalysisDto): Observable<ChartResultModel> {
        debugger;
        const _content = input ? input.toJSON().toString() : null;

        //  alert('result' + _content);
        return this.http.request(TempBaseUrl.BASE_URL + "analysis/runAnalysis/", {
            body: _content,
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json; charset=UTF-8"
            })
        }).map((response) => {
            return this.processResult(response);
        }).catch((response: any, caught: any) => {
            if (response instanceof Response) {
                try {
                    return Observable.of(this.processResult(response));
                } catch (e) {
                    return <Observable<ChartResultModel>><any>Observable.throw(e);
                }
            } else
                return <Observable<ChartResultModel>><any>Observable.throw(response);
        });
    }
    protected processResult(response: Response): ChartResultModel {
        debugger;
        const responseText = response.text();
        const status = response.status;
        if (status === 200) {
            let result: ChartResultModel = null;
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver)
            result = ChartResultModel.fromJS(result200);
            return result;
        }
        return null;
    }
   
}

@Injectable()
export class DashboardService {

}
@Injectable()
export class ModelService {

}

export class DatasetListDto {
    statusCode: number;
    datasetType: string = "RSS";
    datasetList: DatasetDto[] = [];
    protected jsonParseReviver: (key: string, value: any) => any = undefined;
    constructor(data?: any) {
        if (data !== undefined) {
            this.statusCode = data["statusCode"] !== undefined ? data["statusCode"] : null;
            if (data["datasetList"] && data["datasetList"].constructor === Array) {
                for (let item of data["datasetList"]) {
                    let d = DatasetDto.fromJS(item);
                    d.className = this.datasetType;
                    this.datasetList.push(d);
                }
            }
        }
    }
    static fromJS(data: any): DatasetListDto {
        return new DatasetListDto(data);
    }
}
export class DatabaseDriver {
    key: string;
    value: string;
    constructor() {
    }

}
export class ExcelSheet {
    header: string="";
    fields: DatasetFieldDto[]=[];
    constructor() {
    }

}
export class DatasetDto {
    entityName: string;
    entityDescription: string;
    entityType: string = "Dataset";
    entityKey: string;
    className: string;
    dashboardKey: string;
    parentKey: string;
    icon: string;
    src: any;
    subDatasets: SubDatasetDto[] = [];
    analysislist: AnalysisDtoDetails[] = [];
    constructor(data?: any) {
        if (data !== undefined) {
            this.entityName = data["entityName"] !== undefined ? data["entityName"] : null;
            this.entityDescription = data["entityDescription"] !== undefined ? data["entityDescription"] : null;
            this.entityType = data["entityType"] !== undefined ? data["entityType"] : null;
            this.entityKey = data["entityKey"] !== undefined ? data["entityKey"] : null;
            this.className = data["className"] !== undefined ? data["className"] : null;
            this.dashboardKey = data["dashboardKey"] !== undefined ? data["dashboardKey"] : null;
            this.parentKey = data["parentKey"] !== undefined ? data["parentKey"] : null;

            if (data["datasetList"] && data["datasetList"].constructor === Array) {
                for (let item of data["datasetList"]) {
                    this.subDatasets.push(SubDatasetDto.fromJS(item, ""));
                }
            }
        }
    }
    getIcon(): string {
        if (this.className == "Twitter")
            return "fa fa-twitter fa-mid";
        else if (this.className == "Facebook")
            return "fa fa-facebook-square fa-mid";
        else if (this.className == "RSS")
            return "fa fa-rss fa-mid";
        else if (this.className == "Excel")
            return "fa fa-file-excel-o fa-mid";
        else if (this.className == "RDBMS")
            return "fa fa-database fa-mid";
        else if (this.className == "CSV")
            return "fa fa-file-o fa-mid";
        return null;
    }
    static fromJS(data: any): DatasetDto {
        return new DatasetDto(data);
    }

}
export class FacebookDatasetDto {
    entityName: string;
    changeFlag: string;
    entityKey: string;
    sessionKey: string;
    entityDescription: string;
    entityType: string;
    className: string = "Facebook";
    dashboardKey: string;
    workspaceKey: string;
    workspaceName: string;
    subDatasets: SubDatasetDto[] = [];
    constructor(data?: any) {
        debugger;
        if (data !== undefined) {
            this.entityName = data["entityName"] !== undefined ? data["entityName"] : null;
            this.entityKey = data["entityKey"] !== undefined ? data["entityKey"] : null;
            this.entityDescription = data["entityDescription"] !== undefined ? data["entityDescription"] : null;
            this.entityType = data["entityType"] !== undefined ? data["entityType"] : null;
            this.className = data["className"] !== undefined ? data["className"] : null;
            this.dashboardKey = data["dashboardKey"] !== undefined ? data["dashboardKey"] : null;
            this.workspaceKey = data["workspaceKey"] !== undefined ? data["workspaceKey"] : null;
            this.workspaceName = data["workspaceName"] !== undefined ? data["workspaceName"] : "";
            // this.datasetTypeKey = data["Dataset_Type_Key"] !== undefined ? data["Dataset_Type_Key"] : null;
            if (data["subDatasets"] && data["subDatasets"].constructor === Array) {
                for (let item of data["subDatasets"]) {
                    this.subDatasets.push(SubDatasetDto.fromJS(item, this.entityName));
                }
            }
        }
    }
    static fromJS(data: any): FacebookDatasetDto {
        return new FacebookDatasetDto(data);
    }
    //create json object for same class
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["sessionKey"] = this.sessionKey !== undefined ? this.sessionKey : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["className"] = this.className !== undefined ? this.className : "";
        data["dashboardKey"] = this.dashboardKey !== undefined ? this.dashboardKey : "";
        data["workspaceKey"] = WorkspaceService.WorkSpaceKey;
        data["workspaceName"] = this.workspaceName !== undefined ? this.workspaceName : "";
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
    toUpdateJSON() {
        return JSON.stringify(this.toUpdateJS());
    }
    toUpdateJS(data?: any) {
        data = data === undefined ? {} : data;
        data["entityKey"] = this.entityKey !== undefined ? this.entityKey : "";
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["className"] = this.className !== undefined ? this.className : "";
        data["workspaceKey"] = WorkspaceService.WorkSpaceKey;
        data["changeFlag"] = this.changeFlag;
        data["workspaceName"] = this.workspaceName !== undefined ? this.workspaceName : "";
        data["subDatasets"] = [];
        if (this.subDatasets && this.subDatasets.constructor === Array) {
            for (let item of this.subDatasets)
                data["subDatasets"].push(item.toUpdateTWJS());
        }
        return data;
    }
}
export class DeleteDatasetDto {
    sessionKey: string;
    entityList: string[] = [];
    constructor(data?: any) {
    }
    static fromJS(data: any): FacebookDatasetDto {
        return new FacebookDatasetDto(data);
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
//################################################## DATASET DTO START#############################################################
//Twitter dataset dto
export class TwitterDatasetDto {
    entityName: string;
    analysis: any;
    entityKey: string = "";
    entityDescription: string;
    entityType: string;
    changeFlag: string;
    className: string;
    dashboardKey: string;
    sessionKey: string;
    workspaceKey: string;
    workspaceName: string;
    subDatasets: SubDatasetDto[] = [];
    constructor(data?: any) {
        if (data !== undefined) {
            this.entityName = data["entityName"] !== undefined ? data["entityName"] : null;
            this.entityKey = data["entityKey"] !== undefined ? data["entityKey"] : null;
            this.entityDescription = data["entityDescription"] !== undefined ? data["entityDescription"] : null;
            this.entityType = data["entityType"] !== undefined ? data["entityType"] : null;
            this.className = data["className"] !== undefined ? data["className"] : null;
            this.dashboardKey = data["dashboardKey"] !== undefined ? data["dashboardKey"] : null;
            this.workspaceKey = data["workspaceKey"] !== undefined ? data["workspaceKey"] : null;
            this.workspaceName = data["workspaceName"] !== undefined ? data["workspaceName"] : "";
            // this.datasetTypeKey = data["Dataset_Type_Key"] !== undefined ? data["Dataset_Type_Key"] : null;
            if (data["subDatasets"] && data["subDatasets"].constructor === Array) {
                for (let item of data["subDatasets"]) {
                    this.subDatasets.push(SubDatasetDto.fromJS(item, ""));
                }
            }
        }
    }
    static fromJS(data: any): TwitterDatasetDto {
        return new TwitterDatasetDto(data);
    }
    //create json object for same class
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["className"] = this.className !== undefined ? this.className : "";
        data["sessionKey"] = this.sessionKey !== undefined ? this.sessionKey : "";
        data["dashboardKey"] = this.dashboardKey !== undefined ? this.dashboardKey : "";
        data["workspaceKey"] = this.workspaceKey !== undefined ? this.workspaceKey : "";
        data["workspaceName"] = this.workspaceName !== undefined ? this.workspaceName : "";
        data["subDatasets"] = [];
        if (this.subDatasets && this.subDatasets.constructor === Array) {
            for (let item of this.subDatasets)
                data["subDatasets"].push(item.toTwittJS());
        }
        return data;
    }

    toJSON() {
        return JSON.stringify(this.toJS());
    }
    toUpdateJSON() {
        return JSON.stringify(this.toUpdateJS());
    }
    toUpdateJS(data?: any) {
        data = data === undefined ? {} : data;
        data["entityKey"] = this.entityKey !== undefined ? this.entityKey : "";
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["className"] = this.className !== undefined ? this.className : "";
        data["workspaceKey"] = WorkspaceService.WorkSpaceKey;
        data["changeFlag"] = this.changeFlag;
        data["workspaceName"] = this.workspaceName !== undefined ? this.workspaceName : "";
        data["subDatasets"] = [];
        if (this.subDatasets && this.subDatasets.constructor === Array) {
            for (let item of this.subDatasets)
                data["subDatasets"].push(item.toUpdateJS());
        }
        return data;
    }
}
export class TwitterDays {
    since: string;
    _until: string;
    window: TwitterWindow;
    constructor(data?: any) {
        if (data !== undefined) {
            this.since = data["since"] !== undefined ? data["since"] : null;
            this._until = data["until"] !== undefined ? data["until"] : null;
            if (data["Window"] !== undefined) {
                this.window = TwitterWindow.fromJS(data["Window"]);
            }

        }
    }
    static fromJS(data: any): TwitterDays {
        return new TwitterDays(data);
    }
    //create json object for same class
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["since"] = this.since !== undefined ? this.since : null;
        data["until"] = this._until !== undefined ? this._until : null;
        data["Window"] = this.window !== undefined ? this.window : null;
        return data;
    }

    toJSON() {
        return JSON.stringify(this.toJS());
    }
}
export class TwitterWindow {
    constructor(data?: any) {
        if (data !== undefined) {
        }
    }

    static fromJS(data: any): TwitterWindow {
        return new TwitterWindow(data);
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        return data;
    }

    toJSON() {
        return JSON.stringify(this.toJS());
    }
}
// rdbms
export class RDBMSDatasetDto {
    isLogin: boolean = false;
    entityName: string;
    changeFlag: boolean = false;
    entityKey: string;
    entityDescription: string;
    entityType: string;
    className: string;
    connectionString: string;
    password: string;
    userName: string;
    driverKey: string;
    sessionKey: string;
    serverName: string;
    schemaName: string;
    databaseName: string;
    workspaceKey: string;
    workspaceName: string;
    isDestinationFlag: string;
    queryType: string = "st";
    database: string;
    sid: string;
    subDatasets: SubDatasetDto[] = [];
    constructor(data?: any) {
        if (data !== undefined) {
            this.entityName = data["entityName"] !== undefined ? data["entityName"] : null;
            this.entityKey = data["entityKey"] !== undefined ? data["entityKey"] : null;
            this.entityDescription = data["entityDescription"] !== undefined ? data["entityDescription"] : null;
            this.entityType = data["entityType"] !== undefined ? data["entityType"] : null;
            this.className = data["className"] !== undefined ? data["className"] : null;
            this.connectionString = data["connectionString"] !== undefined ? data["connectionString"] : null;
            this.workspaceKey = data["workspaceKey"] !== undefined ? data["workspaceKey"] : null;
            this.workspaceName = data["workspaceName"] !== undefined ? data["workspaceName"] : "";
            this.password = data["password"] !== undefined ? data["password"] : "";
            this.userName = data["userName"] !== undefined ? data["userName"] : "";
            this.driverKey = data["driverKey"] !== undefined ? data["driverKey"] : "";
            this.serverName = data["serverName"] !== undefined ? data["serverName"] : "";
            this.schemaName = data["schemaName"] !== undefined ? data["schemaName"] : "";
            this.databaseName = data["databaseName"] !== undefined ? data["databaseName"] : "";
            this.isDestinationFlag = data["isDestinationFlag"] !== undefined ? data["isDestinationFlag"] : "";
            this.queryType = data["queryType"] !== undefined ? data["queryType"] : "";
            this.sid = data["sid"] !== undefined ? data["sid"] : "";
            // this.datasetTypeKey = data["Dataset_Type_Key"] !== undefined ? data["Dataset_Type_Key"] : null;
            if (data["subDatasets"] && data["subDatasets"].constructor === Array) {
                for (let item of data["subDatasets"]) {
                    this.subDatasets.push(SubDatasetDto.fromJS(item, ""));
                }
            }
        }
    }
    getConnection(): 
        string {
        return "DRIVER={" + this.driverKey + "};DATABASE=" + this.databaseName + ";UID=" + this.userName + ";PWD=" + this.password + ";SERVER=" + this.serverName + ";SID=" + this.sid + ";";
    }
    
    getPostConnection(): 
        string {
        return "DRIVER={" + this.driverKey + "};DATABASE=" + this.databaseName + ";UID=" + this.userName + ";PWD=" + this.password + ";SERVER=" + this.serverName + ";SID=" + this.sid + ";PORT=5432;";
        };
    
    static fromJS(data: any): RDBMSDatasetDto {
        return new RDBMSDatasetDto(data);
    }
    //create json object for same class
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["className"] = this.className !== undefined ? this.className : "";
        data["connectionString"] = this.driverKey.toLowerCase() == "postgresql unicode" ? this.getPostConnection() : this.getConnection();
        data["userName"] = this.userName !== undefined ? this.userName : "";
        data["password"] = this.password !== undefined ? this.password : "";
        data["driverKey"] = this.driverKey !== undefined ? this.driverKey : "";
        data["sessionKey"] = this.sessionKey !== undefined ? this.sessionKey : "";
        data["serverName"] = this.serverName !== undefined ? this.serverName : "";
        data["schemaName"] = this.schemaName !== undefined ? this.schemaName : "";
        data["databaseName"] = this.databaseName !== undefined ? this.databaseName : "";
        data["workspaceKey"] = this.workspaceKey !== undefined ? this.workspaceKey : "";
        data["workspaceName"] = this.workspaceName !== undefined ? this.workspaceName : "";
        data["isDestinationFlag"] = this.isDestinationFlag !== undefined ? this.isDestinationFlag : "";

        if (this.subDatasets && this.subDatasets.constructor === Array) {
            data["subDatasets"] = [];
            for (let item of this.subDatasets)
                data["subDatasets"].push(item.toJS());
        }
        return data;
    }

    toJSON() {
        return JSON.stringify(this.toJS());
    }
    toUpdateJSON() {
        return JSON.stringify(this.toUpdateJS());
    }
    toUpdateJS(data?: any) {
        data = data === undefined ? {} : data;
        data["entityKey"] = this.entityKey !== undefined ? this.entityKey : "";
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["className"] = this.className !== undefined ? this.className : "";
        data["userName"] = this.userName !== undefined ? this.userName : "";
        data["password"] = this.password !== undefined ? this.password : "";
        data["driverKey"] = this.driverKey !== undefined ? this.driverKey : "";
        data["serverName"] = this.serverName !== undefined ? this.serverName : "";
        data["schemaName"] = this.schemaName !== undefined ? this.schemaName : "";
        data["databaseName"] = this.databaseName !== undefined ? this.databaseName : "";
        data["isDestinationFlag"] = this.isDestinationFlag !== undefined ? this.isDestinationFlag : "";
        data["connectionString"] = this.driverKey === "postgresql unicode" ? this.getPostConnection() : this.getConnection();
        data["workspaceKey"] = WorkspaceService.WorkSpaceKey;
        data["changeFlag"] = this.changeFlag;
        data["workspaceName"] = this.workspaceName !== undefined ? this.workspaceName : "";
        data["sid"] = this.sid !== undefined ? this.sid : "";
        data["subDatasets"] = [];
        if (this.subDatasets && this.subDatasets.constructor === Array) {
            for (let item of this.subDatasets)
                data["subDatasets"].push(item.toUpdateJS());
        }
        return data;
    }
}
// 
//rss dto
export class RSSDatasetDto {
    entityName: string;
    changeFlag: string = "true";
    entityKey: string;
    sessionKey: string;
    entityDescription: string;
    url: string;
    entityType: string = "Dataset";
    className: string = "RSS";
    dashboardKey: string;
    workspaceKey: string;
    workspaceName: string;
    subDatasets: SubDatasetDto[] = [];
    constructor(data?: any) {
        if (data !== undefined) {
            this.entityName = data["entityName"] !== undefined ? data["entityName"] : null;
            this.entityKey = data["entityKey"] !== undefined ? data["entityKey"] : null;
            this.entityDescription = data["entityDescription"] !== undefined ? data["entityDescription"] : null;
            this.url = data["url"] !== undefined ? data["url"] : null;
            this.entityType = data["entityType"] !== undefined ? data["entityType"] : null;
            this.className = data["className"] !== undefined ? data["className"] : null;
            this.dashboardKey = data["dashboardKey"] !== undefined ? data["dashboardKey"] : null;
            this.workspaceKey = data["workspaceKey"] !== undefined ? data["workspaceKey"] : null;
            this.workspaceName = data["workspaceName"] !== undefined ? data["workspaceName"] : null;
            // this.datasetTypeKey = data["Dataset_Type_Key"] !== undefined ? data["Dataset_Type_Key"] : null;
            if (data["subDatasets"] && data["subDatasets"].constructor === Array) {
                for (let item of data["subDatasets"]) {
                    this.subDatasets.push(SubDatasetDto.fromJS(item, ""));
                }
            }
        }
    }
    static fromJS(data: any): RSSDatasetDto {
        return new RSSDatasetDto(data);
    }
    createJS(data?: any) {
        data = data === undefined ? {} : data;
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["sessionKey"] = this.sessionKey !== undefined ? this.sessionKey : null;
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["className"] = this.className !== undefined ? this.className : "";
        data["dashboardKey"] = this.dashboardKey !== undefined ? this.dashboardKey : "";
        data["workspaceName"] = this.workspaceName !== undefined ? this.workspaceName : "";
        data["workspaceKey"] = this.workspaceKey !== undefined ? this.workspaceKey : "";
        data["subDatasets"] = [];

        if (this.subDatasets && this.subDatasets.constructor === Array) {
            for (let item of this.subDatasets)
                data["subDatasets"].push(item.createJS());
        }
        return data;
    }
    //create json object for same class
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["sessionKey"] = this.sessionKey !== undefined ? this.sessionKey : null;
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["className"] = this.className !== undefined ? this.className : "";
        data["dashboardKey"] = this.dashboardKey !== undefined ? this.dashboardKey : "";
        data["workspaceName"] = this.workspaceName !== undefined ? this.workspaceName : "";
        data["workspaceKey"] = this.workspaceKey !== undefined ? this.workspaceKey : "";
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
    toUpdateJSON() {
        return JSON.stringify(this.toUpdateJS());
    }
    toUpdateJS(data?: any) {
        data = data === undefined ? {} : data;
        data["entityKey"] = this.entityKey !== undefined ? this.entityKey : "";
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["className"] = this.className !== undefined ? this.className : "";
        data["workspaceKey"] = WorkspaceService.WorkSpaceKey;
        data["changeFlag"] = this.changeFlag;
        data["workspaceName"] = this.workspaceName !== undefined ? this.workspaceName : "";
        data["subDatasets"] = [];
        if (this.subDatasets && this.subDatasets.constructor === Array) {
            for (let item of this.subDatasets)
                data["subDatasets"].push(item.toUpdateTWJS());
        }
        return data;
    }
}
// csv dto
export class CSVDatasetDto {
    columnList: DatasetFieldDto[] = [];
    entityName: string;
    entityKey: string;
    entityDescription: string;
    entityType: string;
    sessionKey: string;
    className: string = "File";
    datasetType: string = "CSV";
    dashboardKey: string;
    workspaceKey: string;
    workspaceName: string;
    filePath: string;
    rowDelimiter: string;
    columnDelimiter: string;
    subDatasets: SubDatasetDto[] = [];
    constructor(data?: any) {
        debugger;
        if (data !== undefined) {
            this.entityName = data["entityName"] !== undefined ? data["entityName"] : null;
            this.entityKey = data["entityKey"] !== undefined ? data["entityKey"] : null;
            this.entityDescription = data["entityDescription"] !== undefined ? data["entityDescription"] : null;
            this.entityType = data["entityType"] !== undefined ? data["entityType"] : null;
            this.className = data["className"] !== undefined ? data["className"] : null;
            this.datasetType = data["datasetType"] !== undefined ? data["datasetType"] : null;
            this.dashboardKey = data["dashboardKey"] !== undefined ? data["dashboardKey"] : null;
            this.workspaceKey = data["workspaceKey"] !== undefined ? data["workspaceKey"] : null;
            this.filePath = data["filePath"] !== undefined ? data["filePath"] : null;
            this.rowDelimiter = data["rowDelimiter"] !== undefined ? data["rowDelimiter"] : null;
            this.columnDelimiter = data["columnDelimiter"] !== undefined ? data["columnDelimiter"] : null;
            // this.datasetTypeKey = data["Dataset_Type_Key"] !== undefined ? data["Dataset_Type_Key"] : null;
            if (data["subDatasets"] && data["subDatasets"].constructor === Array) {
                for (let item of data["subDatasets"]) {
                    this.subDatasets.push(SubDatasetDto.fromJS(item, ""));
                }
            }
        }
    }
    toUpdateJSON() {
        return JSON.stringify(this.toUpdateJS());
    }
    toUpdateJS(data?: any) {
        data = data === undefined ? {} : data;
        data["entityKey"] = this.entityKey !== undefined ? this.entityKey : "";
        data["filePath"] = this.filePath !== undefined ? this.filePath : "";
        data["datasetType"] = this.datasetType !== undefined ? this.datasetType : "";
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["className"] = this.className !== undefined ? this.className : "";
        data["workspaceKey"] = WorkspaceService.WorkSpaceKey;
        data["changeFlag"] = "True";
        data["workspaceName"] = this.workspaceName !== undefined ? this.workspaceName : "";
        data["subDatasets"] = [];
        if (this.subDatasets && this.subDatasets.constructor === Array) {
            for (let item of this.subDatasets)
                data["subDatasets"].push(item.toUpdateCSVJS());
        }
        return data;
    }
    static fromJS(data: any): CSVDatasetDto {
        return new CSVDatasetDto(data);
    }
    //create json object for same class
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["className"] = this.className !== undefined ? this.className : "";
        data["datasetType"] = this.datasetType !== undefined ? this.datasetType : "";
        data["dashboardKey"] = this.dashboardKey !== undefined ? this.dashboardKey : "";
        data["workspaceKey"] = this.workspaceKey !== undefined ? this.workspaceKey : "";
        data["filePath"] = this.filePath !== undefined ? this.filePath : "";
        data["sessionKey"] = this.sessionKey !== undefined ? this.sessionKey : "";
        data["rowDelimiter"] = this.rowDelimiter !== undefined ? this.rowDelimiter : "";
        data["columnDelimiter"] = this.columnDelimiter !== undefined ? this.columnDelimiter : "";
        data["subDatasets"] = [];
        if (this.subDatasets && this.subDatasets.constructor === Array) {
            for (let item of this.subDatasets)
                data["subDatasets"].push(item.toFileJS());
        }
        return data;
    }

    toJSON() {
        return JSON.stringify(this.toJS());
    }
}
export class DataColumn {
    name: string;
    value: string;
    dataType: string;
    constructor(data?: any) {
        if (data !== undefined) {
            this.name = data["column_name"] !== undefined ? data["column_name"] : null;
            this.value = data["value"] !== undefined ? data["value"] : null;
            this.dataType = data["datatype"] !== undefined ? data["datatype"] : null;
        }
    }
    static fromJS(data: any): DataColumn {
        return new DataColumn(data);
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["column_name"] = this.name !== undefined ? this.name : null;
        data["value"] = this.value !== undefined ? this.value : null;
        data["datatype"] = this.dataType !== undefined ? this.dataType : null;
        return data;
    }

    toJSON() {
        return JSON.stringify(this.toJS());
    }
}
//dataset fields to read
export class DatasetFieldDto {
    fieldType: string = "";
    checked: boolean = false;
    entityName: string;
    entityDescription: string;
    entityType: string;
    dataType: string;
    entityKey: string;
    subDatasetId: string;
    datasetName: string;
    className: string;
    subDatasetName: string;
    parentKey: string;
    datasetId: string;
    variableType: string;
    constructor(data?: any) {
        if (data !== undefined) {
            this.entityName = data["entityName"] !== undefined ? data["entityName"] : null;
            this.entityDescription = data["entityDescription"] !== undefined ? data["entityDescription"] : null;
            this.datasetName = data["datasetName"] !== undefined ? data["datasetName"] : null;
            this.entityType = data["entityType"] !== undefined ? data["entityType"] : null;
            this.dataType = data["dataType"] !== undefined ? data["dataType"] : null;
            this.variableType = data["variableType"] !== undefined ? data["variableType"] : null;
            this.entityKey = data["entityKey"] !== undefined ? data["entityKey"] : null;
            this.className = data["className"] !== undefined ? data["className"] : null;
            this.entityType = data["entityType"] !== undefined ? data["entityType"] : null;
            this.subDatasetName = data["subDatasetName"] !== undefined ? data["subDatasetName"] : null;
            this.subDatasetId = data["subDatasetId"] !== undefined ? data["subDatasetId"] : null;
            this.parentKey = data["parentKey"] !== undefined ? data["parentKey"] : null;
            this.datasetId = data["datasetId"] !== undefined ? data["datasetId"] : null;
        }
    }
    static fromJS(data: any): DatasetFieldDto {
        return new DatasetFieldDto(data);
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["entityName"] = this.entityName !== undefined ? this.entityName : null;
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : null;
        //data["datasetName"] = this.datasetName !== undefined ? this.datasetName : null;
        data["entityType"] = this.entityType !== undefined ? this.entityType : null;
        data["dataType"] = this.dataType !== undefined ? this.dataType : null;

        //data["entityType"] = this.entityType !== undefined ? this.entityType : null;
        //data["subDatasetName"] = this.subDatasetName !== undefined ? this.subDatasetName : null;
        //data["subDatasetId"] = this.subDatasetId !== undefined ? this.subDatasetId : null;
        //data["parentKey"] = this.parentKey !== undefined ? this.parentKey : null;
        //data["datasetId"] = this.datasetId !== undefined ? this.datasetId : null;
        return data;
    }
    toFileJS(data?: any) {
        data = data === undefined ? {} : data;
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["entityDescription"] = this.entityName !== undefined ? this.entityName : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["dataType"] = this.dataType !== undefined ? this.dataType : "";
        return data;
    }
    toAnalysisJS(data?: any) {
        data = data === undefined ? {} : data;
        data["entityName"] = this.entityName !== undefined ? this.entityName : null;
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : null;
        data["datasetName"] = this.datasetName !== undefined ? this.datasetName : null;
        data["entityType"] = this.entityType !== undefined ? this.entityType : null;
        data["entityKey"] = this.entityKey !== undefined ? this.entityKey : null;
        data["dataType"] = this.dataType !== undefined ? this.dataType : null;
        data["subDatasetName"] = this.subDatasetName !== undefined ? this.subDatasetName : null;
        data["subDatasetId"] = this.subDatasetId !== undefined ? this.subDatasetId : null;
        data["parentKey"] = this.parentKey !== undefined ? this.parentKey : null;
        data["datasetId"] = this.datasetId !== undefined ? this.datasetId : null;
        return data;
    }
    toUpdateCsvJS(data?: any) {
        data = data === undefined ? {} : data;
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["changeFlag"] = "True";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["datasetName"] = this.datasetName !== undefined ? this.datasetName : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["entityKey"] = this.entityKey !== undefined ? this.entityKey : "";
        data["dataType"] = this.dataType !== undefined ? this.dataType : "";
        data["subDatasetName"] = this.subDatasetName !== undefined ? this.subDatasetName : "";
        data["subDatasetId"] = this.subDatasetId !== undefined ? this.subDatasetId : "";
        data["parentKey"] = this.parentKey !== undefined ? this.parentKey : "";
        data["datasetId"] = this.datasetId !== undefined ? this.datasetId : "";
        return data;
    }
    toJSON() {
        return JSON.stringify(this.toJS());
    }
}
export class DatasetResultModel {

    /**
    *CSV=1,
    *EXCEL=2,
    *TWITTER=3,
    *FACEBOOK=4,
    *RDBMS=4
    */
    statusCode: number;
    statusMessage: string;
    resultData: any;
    constructor(d: DatasetState, data?: any) {
        if (data !== undefined) {
            this.statusCode = data["statusCode"] !== undefined ? data["statusCode"] : null;
            this.statusMessage = data["statusMessage"] !== undefined ? data["statusMessage"] : null;
            // this.resultData = data["resultData"] !== undefined ? data["resultData"] : null;
            if (d === DatasetState.CSV)
                this.resultData = CSVDatasetDto.fromJS(data["resultData"]);
            else if (d === DatasetState.EXCEL)
                this.resultData = ExcelDatasetDto.fromJS(data["resultData"]);
            else if (d === DatasetState.TWITTER)
                this.resultData = TwitterDatasetDto.fromJS(data["resultData"]);
            else if (d === DatasetState.FACEBOOK)
                this.resultData = FacebookDatasetDto.fromJS(data["resultData"]);
            else if (d === DatasetState.RSS)
                this.resultData = RSSDatasetDto.fromJS(data["resultData"]);
            else if (d === DatasetState.RDBMS)
                this.resultData = RDBMSDatasetDto.fromJS(data["resultData"]);
        }
    }
    static fromJS(data: any, d: DatasetState): DatasetResultModel {
        return new DatasetResultModel(d, data);
    }
}
export class DatasetType {
    type: string;
    typeKey: string;
    cls: string = "";
    constructor(data?: any, ) {
        if (data !== undefined) {
            this.type = data["dataset_type"] !== undefined ? data["dataset_type"] : null;
            this.typeKey = data["dataset_type_key"] !== undefined ? data["dataset_type_key"] : null;
        }
    }
    static fromJS(data: any): DatasetType {
        return new DatasetType(data);
    }
    getNumber(): number {
        //alert(this.typeKey);
        if (this.type === "Twitter")
            return 1;
        else if (this.type === "Facebook")
            return 2;
        else if (this.type === "RSS")
            return 3;
        else if (this.type === "Delimited File")
            return 4;
        else if (this.type === "Excel")
            return 5;
        else return 6;
    }
    getIcon(): string {

        switch (this.getNumber()) {
            case 1:
                this.cls = "../../../assets/global/img/Twitter gray.svg";
                break;
            case 2:
                this.cls = "../../../assets/global/img/FB gray.svg";
                break;
            case 3:
                this.cls = "../../../assets/global/img/RSS gray.svg";
                break;
            case 4:
                this.cls = "../../../assets/global/img/CSV gray.svg";
                break;
            case 5:
                this.cls = "../../../assets/global/img/XL gray.svg";
                break;
            default:
                this.cls = "../../../assets/img/img/RDBMS.svg";
                break;
        }
        return this.cls;
    }
    getColorIcon(): string {
        switch (this.getNumber()) {
            case 1:
                this.cls = "../../../assets/global/img/Twitter color.svg";
                break;
            case 2:
                this.cls = "../../../assets/global/img/Facebook color.svg";
                break;
            case 3:
                this.cls = "../../../assets/global/img/RSS color.svg";
                break;
            case 4:
                this.cls = "../../../assets/global/img/CSV color.svg";
                break;
            case 5:
                this.cls = "../../../assets/global/img/Excel color.svg";
                break;
            default:
                this.cls = "../../../assets/img/img/RDBMS.svg";
                break;
        }
        return this.cls;
    }
}
export class DatasetViewData {
    dataArray: string[] = [];
    constructor(data?: any, headers?: any) {
        if (data !== undefined) {
            for (let item of headers) {
                this.dataArray.push(data[item]);
            }
        }
    }

}
export class ExcelDatasetDto {
    excelSheet:ExcelSheet[]=[];
    entityName: string;
    entityKey: string;
    sessionKey: string;
    entityDescription: string;
    entityType: string;
    className: string = "Facebook";
    dashboardKey: string = "Excel";
    datasetType: string = "Excel";
    workspaceKey: string;
    workspaceName: string;
    filePath: string;
    subDatasets: SubDatasetDto[] = [];
    columnList: DatasetFieldDto[] = [];
    constructor(data?: any) {
        if (data !== undefined) {
            this.entityName = data["entityName"] !== undefined ? data["entityName"] : null;
            this.entityKey = data["entityKey"] !== undefined ? data["entityKey"] : null;
            this.entityDescription = data["entityDescription"] !== undefined ? data["entityDescription"] : null;
            this.entityType = data["entityType"] !== undefined ? data["entityType"] : null;
            this.className = data["className"] !== undefined ? data["className"] : null;
            this.dashboardKey = data["dashboardKey"] !== undefined ? data["dashboardKey"] : null;
            this.datasetType = data["datasetType"] !== undefined ? data["datasetType"] : null;
            this.filePath = data["filePath"] !== undefined ? data["filePath"] : null;
            this.workspaceKey = data["workspaceKey"] !== undefined ? data["workspaceKey"] : null;
            this.workspaceName = data["workspaceName"] !== undefined ? data["workspaceName"] : null;
            // this.datasetTypeKey = data["Dataset_Type_Key"] !== undefined ? data["Dataset_Type_Key"] : null;
            if (data["subDatasets"] && data["subDatasets"].constructor === Array) {
                for (let item of data["subDatasets"]) {
                    this.subDatasets.push(SubDatasetDto.fromJS(item, ""));
                }
            }
        }
    }
    static fromJS(data: any): ExcelDatasetDto {
        return new ExcelDatasetDto(data);
    }
    //create json object for same class
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["className"] = this.className !== undefined ? this.className : "";
        data["sessionKey"] = this.sessionKey !== undefined ? this.sessionKey : "";
        data["filePath"] = this.filePath !== undefined ? this.filePath : "";
        data["dashboardKey"] = this.dashboardKey !== undefined ? this.dashboardKey : "";
        data["workspaceKey"] = this.workspaceKey !== undefined ? this.workspaceKey : "";
        data["datasetType"] = this.datasetType !== undefined ? this.datasetType : "";
        data["workspaceName"] = this.workspaceName !== undefined ? this.workspaceName : "";
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
    toUpdateJSON() {
        return JSON.stringify(this.toUpdateJS());
    }
    toUpdateJS(data?: any) {
        data = data === undefined ? {} : data;
        data["entityKey"] = this.entityKey !== undefined ? this.entityKey : "";
        data["filePath"] = this.filePath !== undefined ? this.filePath : "";
        data["datasetType"] = this.datasetType !== undefined ? this.datasetType : "";
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["className"] = this.className !== undefined ? this.className : "";
        data["workspaceKey"] = WorkspaceService.WorkSpaceKey;
        data["changeFlag"] = "True";
        data["workspaceName"] = this.workspaceName !== undefined ? this.workspaceName : "";
        data["subDatasets"] = [];
        if (this.subDatasets && this.subDatasets.constructor === Array) {
            for (let item of this.subDatasets)
                data["subDatasets"].push(item.toUpdateCSVJS());
        }
        return data;
    }
}
export class SubDatasetDto {
    globalNumber: number;
    readOrWrite: string;
    changeFlag: boolean = false;
    datasetKey: string;
    datasetName: string;
    entityName: string;
    className: string;
    entityType: string;
    entityKey: string;
    entityDescription: string;
    isCustom: string;
    query: string;
    tweetType: string;
    language: string;
    sinceDate: string;
    untilDate: string;
    datasetFields: DatasetFieldDto[] = [];
    selectedField: DatasetFieldDto[] = [];
    fields: DatasetFieldDto[] = [];
    constructor(data?: any, dataset?: string, gl?: number) {
        if (data !== undefined)
            this.globalNumber = gl;
        if (data !== undefined) {
            this.datasetKey = dataset;
            this.datasetName = data["datasetName"] !== undefined ? data["datasetName"] : null;
            this.entityName = data["entityName"] !== undefined ? data["entityName"] : null;
            this.className = data["className"] !== undefined ? data["className"] : null;
            this.entityType = data["entityType"] !== undefined ? data["entityType"] : null;
            this.entityKey = data["entityKey"] !== undefined ? data["entityKey"] : null;
            this.entityDescription = data["entityDescription"] !== undefined ? data["entityDescription"] : null;
            this.isCustom = data["isCustom"] !== undefined ? data["isCustom"] : null;
            this.query = data["query"] !== undefined ? data["query"] : null;

            if (data["datasetFields"] && data["datasetFields"].constructor === Array) {
                for (let item of data["datasetFields"]) {
                    this.datasetFields.push(DatasetFieldDto.fromJS(item));
                }
            }
           
        }
    }
    get compare() {
        return this.entityKey + this.readOrWrite;
    }
    static fromJS(data: any, key: string): SubDatasetDto {
        return new SubDatasetDto(data, key);
    }
    static fromJS1(data: any, key: string, n: number): SubDatasetDto {
        return new SubDatasetDto(data, key, n);
    }
    createJS(data?: any) {
        data = data === undefined ? {} : data;
        //  data["datasetName"] = this.datasetName !== undefined ? this.datasetName : null;
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["className"] = this.className !== undefined ? this.className : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        //data["entityKey"] = this.entityKey !== undefined ? this.entityKey : null;
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["isCustom"] = this.isCustom !== undefined ? this.isCustom : "";
        data["query"] = this.query !== undefined ? this.query : "";

        if (this.datasetFields && this.datasetFields.constructor === Array) {
            if (this.datasetFields.length < 1)
                data["datasetFields"] = "";
            data["datasetFields"] = [];
            for (let item of this.datasetFields)
                data["datasetFields"].push(item.toJS());
        } else {
            data["datasetFields"] = "";

        }
        return data;
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        //  data["datasetName"] = this.datasetName !== undefined ? this.datasetName : null;
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["className"] = this.className !== undefined ? this.className : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        //data["entityKey"] = this.entityKey !== undefined ? this.entityKey : null;
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["isCustom"] = this.isCustom !== undefined ? this.isCustom : "";
        data["query"] = this.query !== undefined ? this.query : "";

        if (this.datasetFields && this.datasetFields.constructor === Array) {
            if (this.datasetFields.length < 1)
                data["datasetFields"] = "";
            data["datasetFields"] = [];
            for (let item of this.datasetFields)
                data["datasetFields"].push(item.toJS());
        } else {
            data["datasetFields"] = "";

        }
        return data;
    }
    toAnalysisJS(data?: any) {
        data = data === undefined ? {} : data;
        data["datasetName"] = this.datasetName !== undefined ? this.datasetName : null;
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["className"] = this.className !== undefined ? this.className : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["entityKey"] = this.entityKey !== undefined ? this.entityKey : null;
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["isCustom"] = this.isCustom !== undefined ? this.isCustom : "";
        data["query"] = this.query !== undefined ? this.query : "";

        if (this.datasetFields && this.datasetFields.constructor === Array) {
            if (this.datasetFields.length < 1)
                data["datasetFields"] = "";
            data["datasetFields"] = [];
            for (let item of this.datasetFields)
                data["datasetFields"].push(item.toAnalysisJS());
        } else {
            data["datasetFields"] = "";

        }
        return data;
    }
    toFileJS(data?: any) {
        data = data === undefined ? {} : data;
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["className"] = this.className !== undefined ? this.className : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["isCustom"] = this.isCustom !== undefined ? this.isCustom : "";
        data["query"] = this.query !== undefined ? this.query : "";
        if (this.datasetFields && this.datasetFields.constructor === Array) {
            if (this.datasetFields.length < 1)
                data["datasetFields"] = "";
            data["datasetFields"] = [];
            for (let item of this.datasetFields)
                data["datasetFields"].push(item.toFileJS());
        } else {
            data["datasetFields"] = "";

        }
        return data;
    }
    toUpdateJSON() {
        return JSON.stringify(this.toUpdateJS());
    }
    toUpdateJS(data?: any) {
        data = data === undefined ? {} : data;
        data["datasetName"] = this.datasetName !== undefined ? this.datasetName : "";
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["changeFlag"] = this.changeFlag ? "True" : "False";
        data["className"] = this.className !== undefined ? this.className : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["entityKey"] = this.entityKey !== undefined ? this.entityKey : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["isCustom"] = this.isCustom !== undefined ? this.isCustom : "";
        data["query"] = this.query !== undefined ? this.query : "";
        //data["datasetFields"] = "";
        //data["datasetFields"] = [];

        // if (this.datasetFields && this.datasetFields.constructor === Array) {
        //     for (let item of this.datasetFields)
        //         data["datasetFields"].push(item.toJS());
        // }
        return data;
    }
    toUpdateCSVJS(data?: any) {
        data = data === undefined ? {} : data;
        data["datasetName"] = this.datasetName !== undefined ? this.datasetName : "";
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["changeFlag"] = this.changeFlag ? "True" : "False";
        data["className"] = this.className !== undefined ? this.className : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["entityKey"] = this.entityKey !== undefined ? this.entityKey : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["isCustom"] = this.isCustom !== undefined ? this.isCustom : "";
        data["query"] = this.query !== undefined ? this.query : "";
        //data["datasetFields"] = "";
        data["datasetFields"] = [];

         if (this.datasetFields && this.datasetFields.constructor === Array) {
             for (let item of this.datasetFields)
                 data["datasetFields"].push(item.toUpdateCsvJS());
         }
        return data;
    }
    toUpdateTWJS(data?: any) {
        data = data === undefined ? {} : data;
        data["datasetName"] = this.datasetName !== undefined ? this.datasetName : "";
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["changeFlag"] = this.changeFlag ? "True" : "False";
        data["className"] = this.className !== undefined ? this.className : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["entityKey"] = this.entityKey !== undefined ? this.entityKey : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["isCustom"] = this.isCustom !== undefined ? this.isCustom : "";
        data["query"] = this.query !== undefined ? this.query : "";
        //data["datasetFields"] = "";
        data["datasetFields"] = [];

        if (this.datasetFields && this.datasetFields.constructor === Array) {
            for (let item of this.datasetFields)
                data["datasetFields"].push(item.toUpdateCsvJS());
        }
        return data;
    }
    toTwittJS(data?: any) {
        data = data === undefined ? {} : data;
        //  data["datasetName"] = this.datasetName !== undefined ? this.datasetName : null;
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["className"] = this.className !== undefined ? this.className : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        // data["entityKey"] = this.entityKey !== undefined ? this.entityKey : null;
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["isCustom"] = this.isCustom !== undefined ? this.isCustom : "";
        data["query"] = this.query !== undefined ? this.query : "";

        data["tweetType"] = this.tweetType !== undefined ? this.tweetType : "null";
        data["language"] = this.language !== undefined ? this.language : "null";
        data["sinceDate"] = this.sinceDate !== undefined ? this.sinceDate : "null";
        data["untilDate"] = this.untilDate !== undefined ? this.untilDate : "null";
        if (this.datasetFields && this.datasetFields.constructor === Array) {
            if (this.datasetFields.length < 1)
                data["datasetFields"] = "";
            data["datasetFields"] = [];
            for (let item of this.datasetFields)
                data["datasetFields"].push(item.toJS());
        } else {
            data["datasetFields"] = "";

        }
        return data;
    }
}
export class DatasetHistoryDto {
    dsName: string;
    dsKey: string;
    dstype: string;
    dsModifiedDate: string;
    dsRefreshDate: string;
    dsCreateDate: string;
    constructor(data?: any, ) {
        if (data !== undefined) {
            this.dsName = data["Dataset_name"] !== undefined ? data["Dataset_name"] : null;
            this.dsKey = data["Dataset_key"] !== undefined ? data["Dataset_key"] : null;
            this.dstype = data["Dataset_type"] !== undefined ? data["Dataset_type"] : null;
            this.dsModifiedDate = data["Dataset_modified_on"] !== undefined ? data["Dataset_modified_on"] : null;
            this.dsRefreshDate = data["Last_Refreshed_date"] !== undefined ? data["Last_Refreshed_date"] : null;
            this.dsCreateDate = data["Dataset_created_on"] !== undefined ? data["Dataset_created_on"] : null;
        }
    }
    static fromJS(data: any): DatasetHistoryDto {
        return new DatasetHistoryDto(data);
    }
}
export class DatasetCountDto {
    total: number;
    excel: number;
    facebook: number;
    rdbms: number;
    rss: number;
    twitter: number;
    dlatfile: number;
    constructor(data?: any, ) {
        if (data !== undefined) {
            this.total = data["Total_Dataset"] !== undefined ? data["Total_Dataset"] : null;
            this.excel = data["Excel_Dataset"] !== undefined ? data["Excel_Dataset"] : null;
            this.facebook = data["Facebook_dataset"] !== undefined ? data["Facebook_dataset"] : null;
            this.rdbms = data["RDBMS_Dataset"] !== undefined ? data["RDBMS_Dataset"] : null;
            this.rss = data["RSS_Dataset"] !== undefined ? data["RSS_Dataset"] : null;
            this.twitter = data["Dlatfile_Dataset"] !== undefined ? data["Dlatfile_Dataset"] : null;
            this.dlatfile = data["Twitter_Dataset"] !== undefined ? data["Twitter_Dataset"] : null;
        }
        alert('All Done');
    }
    static fromJS(data: any): DatasetCountDto {
        return new DatasetCountDto(data);
    }
}
export class DatasetTables {
    tables: string[] = [];
    constructor(data?: any, ) {
        if (data !== undefined) {
            if (data["Dataset_fields_to_be_read"] && data["Dataset_fields_to_be_read"].constructor === Array) {
                for (let item of data["Dataset_fields_to_be_read"]) {
                    this.tables.push(item);
                }
            }
        }
    }
    static fromJS(data: any): DatasetTables {
        return new DatasetTables(data);
    }
}


//############################
// GETTING STARTED DATASET DTO
export class GSDatasetDto {
    isBack: boolean = false;
    datasetType: string;
    mapData: string[] = [];
    entityName: string;
    entityDescription: string;
    entityType: string;
    entityKey: string;
    sessionKey: string;
    className: string;
    dashboardKey: string;
    workspaceKey: string;
    workspaceName: string;
    filePath: string;
    rowDelimiter: string;
    columnDelimiter: string;
    subDatasets: SubDatasetDto[] = [];
    constructor(data?: any) {
        if (data !== undefined) {
            this.entityName = data["entityName"] !== undefined ? data["entityName"] : null;
            this.entityDescription = data["entityDescription"] !== undefined ? data["entityDescription"] : null;
            this.entityType = data["entityType"] !== undefined ? data["entityType"] : null;
            this.entityKey = data["entityKey"] !== undefined ? data["entityKey"] : null;
            this.className = data["className"] !== undefined ? data["className"] : null;
            this.dashboardKey = data["dashboardKey"] !== undefined ? data["dashboardKey"] : null;
            this.workspaceKey = data["workspaceKey"] !== undefined ? data["workspaceKey"] : null;
            this.workspaceName = data["workspaceName"] !== undefined ? data["workspaceName"] : null;
            this.filePath = data["filePath"] !== undefined ? data["filePath"] : null;
            this.rowDelimiter = data["rowDelimiter"] !== undefined ? data["rowDelimiter"] : null;
            this.columnDelimiter = data["columnDelimiter"] !== undefined ? data["columnDelimiter"] : null;

            if (data["subDatasets"] && data["subDatasets"].constructor === Array) {
                for (let item of data["subDatasets"]) {
                    this.subDatasets.push(item);
                }
            }
        }
    }
    static fromJS(data?: any): GSDatasetDto {
        return new GSDatasetDto(data);
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["className"] = this.className !== undefined ? this.className : "";
        data["dashboardKey"] = this.dashboardKey !== undefined ? this.dashboardKey : "";
        data["workspaceKey"] = this.workspaceKey !== undefined ? this.workspaceKey : "";
        data["workspaceName"] = this.workspaceName !== undefined ? this.workspaceName : "";
        if (this.filePath != null) {
            data["filePath"] = this.filePath !== undefined ? this.filePath : "";
            data["rowDelimiter"] = this.rowDelimiter !== undefined ? this.rowDelimiter : "";
            data["columnDelimiter"] = this.columnDelimiter !== undefined ? this.columnDelimiter : "";
        }
        if (this.datasetType === "CSV")
            data["datasetType"] = this.datasetType !== undefined ? this.datasetType : "";
        data["subDatasets"] = [];
        if (this.subDatasets && this.subDatasets.constructor === Array) {
            for (let item of this.subDatasets)
                data["subDatasets"].push(item.toJS());
        }
        return data;
    }
    toJSON() {
        return JSON.stringify(this.toJS1());
    }
    toJS1(data?: any) {
        data = data === undefined ? {} : data;
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["entityType"] = this.entityType !== undefined ? this.entityType : "";
        data["className"] = this.className !== undefined ? this.className : "";
        data["dashboardKey"] = this.dashboardKey !== undefined ? this.dashboardKey : "";
        data["workspaceKey"] = this.workspaceKey !== undefined ? this.workspaceKey : "";
        data["workspaceName"] = this.workspaceName !== undefined ? this.workspaceName : "";
        if (this.filePath != null) {
            data["filePath"] = this.filePath !== undefined ? this.filePath : "";
            data["rowDelimiter"] = this.rowDelimiter !== undefined ? this.rowDelimiter : "";
            data["columnDelimiter"] = this.columnDelimiter !== undefined ? this.columnDelimiter : "";
        }
        if (this.datasetType === "CSV" || this.datasetType === "Excel")
            data["datasetType"] = this.datasetType !== undefined ? this.datasetType : "";
        data["subDatasets"] = [];
        if (this.subDatasets && this.subDatasets.constructor === Array) {
            for (let item of this.subDatasets)
                data["subDatasets"].push(item.toJS());
        }
        return data;
    }
}
//Getting started CSV dto
export class GSCSVDto {
    datasetTypeKey: string = "41b7f571e8c4472397eef1df60e6b0d3";
    type: string = "CSV";
    name: string;
    description: string;
    delimiter: string;
    filePath: string;
    constructor() {

    }
    static fromJS(): GSCSVDto {
        return new GSCSVDto();
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["Dataset_type_key"] = this.datasetTypeKey !== undefined ? this.datasetTypeKey : null;
        data["Dataset_type"] = this.type !== undefined ? this.type : null;
        data["Name"] = this.name !== undefined ? this.name : null;
        data["Description"] = this.description !== undefined ? this.description : null;
        data["Delimiter"] = this.delimiter !== undefined ? this.delimiter : null;
        data["FilePath"] = this.filePath !== undefined ? this.filePath : null;
        return data;
    }
    toJSON() {
        return JSON.stringify(this.toJS());
    }
}
export class GSExcelDto {
    datasetTypeKey: string = "41b7f571e8c4472397eef1df60e6b0d2";
    type: string = "Excel";
    name: string;
    description: string;
    delimiter: string;
    filePath: string;
    constructor() {

    }
    static fromJS(): GSExcelDto {
        return new GSExcelDto();
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["Dataset_type_key"] = this.datasetTypeKey !== undefined ? this.datasetTypeKey : null;
        data["Dataset_type"] = this.type !== undefined ? this.type : null;
        data["Name"] = this.name !== undefined ? this.name : null;
        data["Description"] = this.description !== undefined ? this.description : null;
        data["Delimiter"] = this.delimiter !== undefined ? this.delimiter : null;
        data["FilePath"] = this.filePath !== undefined ? this.filePath : null;
        return data;
    }
    toJSON() {
        return JSON.stringify(this.toJS());
    }
}

// Getting started Facebook dto
export class GSFacebookDto {

    datasetTypeKey: string = "41b7f571e8c4472397eef1df60e6b0d3";
    type: string = "facebook";
    name: string;
    description: string;
    page: string;
    statusCode: number;
    constructor() {

    }
    static fromJS(): GSFacebookDto {
        return new GSFacebookDto();
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["Dataset_type_key"] = this.datasetTypeKey !== undefined ? this.datasetTypeKey : null;
        data["Dataset_type"] = this.type !== undefined ? this.type : null;
        data["Name"] = this.name !== undefined ? this.name : null;
        data["Description"] = this.description !== undefined ? this.description : null;
        data["Page"] = this.page !== undefined ? this.page : null;

        return data;
    }
    toJSON() {
        return JSON.stringify(this.toJS());
    }
}

// Getting started Twitter dto
export class GSTwitterDto {
    datasetTypeKey: string = "41b7f571e8c4472397eef1df60e6b0d5";
    type: string = "Twitter";
    name: string;
    description: string;
    tag: string;
    constructor() {

    }
    static fromJS(): GSTwitterDto {
        return new GSTwitterDto();
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["Dataset_type_key"] = this.datasetTypeKey !== undefined ? this.datasetTypeKey : null;
        data["Dataset_type"] = this.type !== undefined ? this.type : null;
        data["Name"] = this.name !== undefined ? this.name : null;
        data["Description"] = this.description !== undefined ? this.description : null;
        data["search"] = this.tag !== undefined ? this.tag : null;

        return data;
    }
    toJSON() {
        return JSON.stringify(this.toJS());
    }
}



// Getting started Rss dto
export class GSRssDto {
    datasetTypeKey: string = "RSS";
    type: string = "RSS";
    name: string;
    description: string;
    url: string;
    constructor() {

    }
    static fromJS(): GSRssDto {
        return new GSRssDto();
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["Dataset_type_key"] = this.datasetTypeKey !== undefined ? this.datasetTypeKey : null;
        data["Dataset_type"] = this.type !== undefined ? this.type : null;
        data["Name"] = this.name !== undefined ? this.name : null;
        data["Description"] = this.description !== undefined ? this.description : null;
        data["URL"] = this.url !== undefined ? this.url : null;

        return data;
    }
    toJSON() {
        return JSON.stringify(this.toJS());
    }
}
//################################################## DATASET DTO END#############################################################
//#################################### COMMAN #################################
export class AuthenticateDto {
    statusCode: number;
    statusMessage: string;
    constructor(data?: any) {
        if (data !== undefined) {
            this.statusCode = data["statusCode"] !== undefined ? data["statusCode"] : null;
            this.statusMessage = data["statusMessage"] !== undefined ? data["statusMessage"] : null;
        }
    }
    static fromJS(data: any): AuthenticateDto {
        return new AuthenticateDto(data);
    }
}
export class TempBaseUrl {
  static BASE_URL: string = "http://localhost:8000/";
   //static BASE_URL: string = "http://114.143.21.250:8003/";
   // static BASE_URL: string = "http://192.168.10.40:8000/";
    //static BASE_URL1: string = "http://114.143.21.250:8002/";
    static WORKSPACEKEY: string = "6ab6344c-a5f0-4a70-864d-6d37c1d6d7b7";
    ///static WORKSPACEKEY: string = "94072a559f3347c89f3336031e7b8d5b";
}
export class AlertKeys {
    //to style the alert message
    alertClass: string;
    //alert msg to be shown
    alertMessage: string;
    //status for showing alert
    isShowAlert: boolean = false;
    //request gets data
    isSuccess: boolean = false;
    reset() {
        this.isShowAlert = false;
        this.isSuccess = false;
        this.alertClass = null;
        this.alertMessage = null;
    }
}
//#################################### END COMMAN #################################

//#################################### ANALYSIS #################################
export class AnalysisTypeDto {
    analysisType: string;
    analysisKey: string;
    cls: string = "";
    constructor(data?: any, ) {
        if (data !== undefined) {
            this.analysisType = data["algorithmType"] !== undefined ? data["algorithmType"] : null;
            this.analysisKey = data["algorithmTypeKey"] !== undefined ? data["algorithmTypeKey"] : null;
        }
    }
    static fromJS(data: any): AnalysisTypeDto {
        return new AnalysisTypeDto(data);
    }

    getName(): any {
        if (this.analysisType === "Classification")
            return "Classification";
        else if (this.analysisType === "Clustering")
            return "Clustering";
        else if (this.analysisType === "Frequency Analysis")
            return "Frequency";
        else if (this.analysisType === "Correlation Analysis")
            return "Correlation";
        else if (this.analysisType === "Sentiment Detection")
            return "Sentiment";
        else if (this.analysisType === "Entity Extraction")
            return "Entity";
        else if (this.analysisType === "Preprocessor")
            return "Preprocessor";
        else return null;
    }
    getNumber(): number {
        //alert(this.typeKey);
        if (this.analysisType === "Classification")
            return 1;
        else if (this.analysisType === "Clustering")
            return 2;
        else if (this.analysisType === "Frequency Analysis")
            return 3;
        else if (this.analysisType === "Correlation Analysis")
            return 4;
        else if (this.analysisType === "Sentiment Detection")
            return 5;
        else if (this.analysisType === "Entity Extraction")
            return 6;
        else if (this.analysisType === "Preprocessor")
            return 7;
        else return null;
    }
    getIcon(): string {

        switch (this.getNumber()) {
            case 1:
                this.cls = "../../../assets/global/img/Classification gray.svg";
                break;
            case 2:
                this.cls = "../../../assets/global/img/Clustering gray.svg";
                break;
            case 3:
                this.cls = "../../../assets/global/img/word fqncy gray.svg";
                break;
            case 4:
                this.cls = "../../../assets/global/img/Correlation gray.svg";
                break;
            case 5:
                this.cls = "../../../assets/global/img/Sentiment gray.svg";
                break;
            default:null;
                break;
        }
        return this.cls;
    }
    getColorIcon(): string {
        switch (this.getNumber()) {
            case 1:
                this.cls = "../../../assets/global/img/Classification icon in Orange.svg";
                break;
            case 2:
                this.cls = "../../../assets/global/img/Clustering icon in Orange.svg";
                break;
            case 3:
                this.cls = "../../../assets/global/img/Word Frequency icon in Orange.svg";
                break;
            case 4:
                this.cls = "../../../assets/global/img/Correlation icon in Orange.svg";
                break;
            case 5:
                this.cls = "../../../assets/global/img/Sentiment Detection icon in Orange.svg";
                break;
            default:null;

                break;
        }
        return this.cls;
    }
}

export class AnalysisDto {
    AnalysisType: string;
    datasetKey: string;
    sessionKey: string;
    subdatasetKey: string;
    analysisName: string;
    analysisDesc: string;
    workspaceKey: string;
    Mappings: MappingDto[] = [];
    constructor(data?: any, ) {
        if (data !== undefined) {
            this.AnalysisType = data["AnalysisType"] !== undefined ? data["AnalysisType"] : null;
            this.datasetKey = data["datasetKey"] !== undefined ? data["datasetKey"] : null;
            this.subdatasetKey = data["subdatasetKey"] !== undefined ? data["subdatasetKey"] : null;
            this.analysisName = data["analysisName"] !== undefined ? data["analysisName"] : null;
            this.analysisDesc = data["analysisDesc"] !== undefined ? data["analysisDesc"] : null;
            this.workspaceKey = data["workspaceKey"] !== undefined ? data["workspaceKey"] : null;
        }
    }
    static fromJS(data: any): AnalysisDto {
        return new AnalysisDto(data);
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["AnalysisType"] = this.AnalysisType !== undefined ? this.AnalysisType : "";
        data["datasetKey"] = this.datasetKey !== undefined ? this.datasetKey : "";
        //data["sessionKey"] = this.sessionKey !== undefined ? this.sessionKey : "";
        data["subdatasetKey"] = this.subdatasetKey !== undefined ? this.subdatasetKey : "";
        data["analysisName"] = this.analysisName !== undefined ? this.analysisName : "";
        data["analysisDesc"] = this.analysisDesc !== undefined ? this.analysisDesc : "";
        data["workspaceKey"] = this.workspaceKey !== undefined ? this.workspaceKey : "";
        data["Mappings"] = [];
        if (this.Mappings && this.Mappings.constructor === Array) {
            for (let item of this.Mappings)
                data["Mappings"].push(item.toJS());
        }
        return data;
    }
    toJSON() {
        return JSON.stringify(this.toJS());
    }
}
export class ColumnDto {
    isEnabled: boolean = true;
    columnName: string = "";
    columnType: string = "text";
    constructor(data?: any, ) {
        if (data !== undefined) {
            this.columnName = data["columnName"] !== undefined ? data["columnName"] : null;
            this.columnType = data["columnType"] !== undefined ? data["columnType"] : null;
        }
    }
    static fromJS(data: any): ColumnDto {
        return new ColumnDto(data);
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["columnType"] = this.columnType !== undefined ? this.columnType : "";
        data["columnName"] = this.columnName !== undefined ? this.columnName : "";
        return data;
    }
}
export class MappingDto {
    ModelField: string;
    DatasetField: string;
    constructor(data?: any, ) {
        if (data !== undefined) {
            this.ModelField = data["ModelField"] !== undefined ? data["ModelField"] : null;
            this.DatasetField = data["DatasetField"] !== undefined ? data["DatasetField"] : null;
        }
    }
    static fromJS(data: any): AnalysisDto {
        return new AnalysisDto(data);
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["ModelField"] = this.ModelField !== undefined ? this.ModelField : "";
        data["DatasetField"] = this.DatasetField !== undefined ? this.DatasetField : "";
        return data;
    }
}

//#################################### END ANALYSIS #################################
@Injectable()
export class PassService {
    isUpdate: boolean = false;
    passId: any = null;
    passName: any = null;
    passValue: any = null;
    clearAll() {
        this.isUpdate = false;
        this.passId = null;
        this.passValue = null;
        this.passName = null;
    }
}
export enum DatasetState {
    CSV = 1,
    EXCEL,
    TWITTER,
    FACEBOOK,
    RSS,
    RDBMS
}
export enum ChartType {
    WORD = 1,
    CHORD,
    PIE
}
export class GSAnalysisChart {
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
                if (data["chartSpecificOptions"]["chartData"]) {
                    if (this.type === ChartType.WORD) {
                        let w = JSON.parse(JSON.stringify(data["chartSpecificOptions"]["chartData"]), this.jsonParseReviver);
                        if (w && w.constructor === Array) {
                            for (let item of w) {
                                this.chartData.push(WorldCloudChart.fromJS(item));
                            }
                        }
                    } else if (this.type === ChartType.PIE) {
                        let w = data["chartSpecificOptions"]["chartData"];
                        if (w && w.constructor === Array) {
                            for (let item of w) {
                                this.chartData.push(PieChart.fromJS(item));
                            }
                        }
                    } else if (this.type === ChartType.CHORD) {
                        let w = data["chartSpecificOptions"]["chartData"];
                        // w = JSON.parse(w, this.jsonParseReviver);
                        if (w) {
                            this.chartData.push(ChordChart.fromJS(w));
                        }
                    }
                }
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
    static fromJS(data?: any): GSAnalysisChart {
        return new GSAnalysisChart(data);
    }
}
export class WorldCloudOptions {
    //chartData: WorldCloudChart[] = [];
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
            //if (data["chartData"] && data["chartData"].constructor === Array) {
            //    for (let item of data["chartData"]) {
            //        this.chartData.push(WorldCloudChart.fromJS(item));
            //    }
            //}
        }
    }
    static fromJS(data?: any): WorldCloudOptions {
        return new WorldCloudOptions(data);
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
export class PieChartOptions {
    //chartData: PieChart[] = [];
    ChartVariable: ChartVariables[] = [];
    ChartMapping: string[] = [];// pending some fields

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
export class ChordChartOptions {
    //chartData: ChordChart[] = [];
    ChartVariable: ChartVariables[] = [];
    ChartMapping: string[] = [];// pending some fields
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
                    this.ChartVariable.push(ChartVariables.fromJS(item));
                }
            }
            //if (data["chartData"] && data["chartData"].constructor === Array) {
            //    for (let item of data["chartData"]) {
            //        this.chartData.push(ChordChart.fromJS(item));
            //    }
            //}
        }
    }
    static fromJS(data?: any): ChordChartOptions {
        return new ChordChartOptions(data);
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
}
export class ChartResultModel {
    statusCode: number;
    statusMessage: string;
    chart: GSAnalysisChart;
    constructor(data?: any) {
        debugger;
        if (data !== undefined) {
            this.statusCode = data["statusCode"] !== undefined ? data["statusCode"] : null;
            this.statusMessage = data["statusMessage"] !== undefined ? data["statusMessage"] : null;
            this.chart = GSAnalysisChart.fromJS(data["chartData"]);
        }
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
    }
    static fromJS(data: any): ChartResultModel {
        return new ChartResultModel(data);
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

@Injectable()
export class LoadingService {
    isLoading: boolean = false;
    public constructor() { }

    change(b: boolean) {
        this.isLoading = b;
    }
    start() {
        this.isLoading = true;
    }
    stop() {
        this.isLoading = false;
    }

}





