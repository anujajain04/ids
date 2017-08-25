import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { SideBarMenu } from '../../app/shared/layout/side-bar-menu';
import { SideBarMenuItem } from '../../app/shared/layout/side-bar-menu-item';
import { Injectable, Inject, Optional, OpaqueToken } from '@angular/core';
import { Http, Headers, Response, RequestOptionsArgs, RequestOptions } from '@angular/http';
import { TokenService } from '@abp/auth/token.service';
import { TempBaseUrl } from '@shared/service-proxies/ids-service-proxies';


@Injectable()
export class WorkspaceService {
    debugger
    workspacelist: WorkspaceDto[] = [];
    editKey: any;
    update: boolean;
    static WorkSpaceKey: string = "6ab6344c-a5f0-4a70-864d-6d37c1d6d7b7";
    private http: Http = null;
    workDataset: WorkspaceDto = WorkspaceDto.fromJS();
    tempList: SideBarMenuItem[] = [];
    menu: SideBarMenu = new SideBarMenu("MainMenu", "MainMenu", [
        new SideBarMenuItem("Studio", null, "../../../assets/global/img/Black chevron icon.svg", "", "", this.tempList),
        new SideBarMenuItem("Dashboard", null, "../../../assets/global/img/Black dashborad icon.svg", "", "/dashboard"),
        new SideBarMenuItem("Dataset Channel", null, "../../../assets/global/img/Black data channel icon.svg", "", "/dataset"),
        //new SideBarMenuItem("Analysis", null, "../../../assets/global/img/Dashboard icon white.svg","", "/analysis"),
        new SideBarMenuItem("Models", null, "../../../assets/global/img/Black models icon.svg", "", "/model"),
        new SideBarMenuItem("Use Cases", null, "../../../assets/global/img/Black models icon.svg", "", "/useCases"),
         //new SideBarMenuItem("Workspace", null, "work", "/workspaces"),

    ]);
    protected jsonParseReviver: (key: string, value: any) => any = undefined;
    constructor( @Inject(Http) http: Http, private _session: TokenService) {
        this.http = http;
    }
    ////Woekspace api access here
    CreateWorkspace(value: any): Observable<WorkspaceDto> {
        debugger;
        //const _content = JSON.stringify({
        //    workspaceKey: TempBaseUrl.WORKSPACEKEY,
        //    sessionKey: this._session.getToken()
        //});
        return this.http.request(TempBaseUrl.BASE_URL + "workspace/", {
            body: JSON.stringify(value),
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json;charset=UTF-8",
                "Accept": "application/json;charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processCreateWorkPace(response);
        }).catch((responce: any, caught: any) => {
            if (responce instanceof Response) {
                try {
                    return Observable.of(this.processCreateWorkPace(responce));
                } catch (e) {
                    return <Observable<WorkspaceDto>><any>Observable.throw(e);
                }
            } else
                return <Observable<WorkspaceDto>><any>Observable.throw(responce);
        });
    }
    protected processCreateWorkPace(responce: Response): WorkspaceDto {
        debugger;
        const responseText = responce.text();
        const status = responce.status;
        if (status === 200) {
            let result: WorkspaceDto;
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            result = WorkspaceDto.fromJS(result200["workspace"]);
            return result;
        }
        return null;
    }


    changeWorkspace(): Observable<WorkspaceDto> {
        debugger;
        const _content = JSON.stringify({
            workspaceKey: WorkspaceService.WorkSpaceKey,
            sessionKey: this._session.getToken()
        });
        return this.http.request(TempBaseUrl.BASE_URL + "workspace/changeWorkspace/", {
            body: _content,
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json;charset=UTF-8",
                "Accept": "application/json;charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processchangeWorkspace(response);
        }).catch((responce: any, caught: any) => {
            if (responce instanceof Response) {
                try {
                    return Observable.of(this.processchangeWorkspace(responce));
                } catch (e) {
                    return <Observable<WorkspaceDto>><any>Observable.throw(e);
                }
            } else
                return <Observable<WorkspaceDto>><any>Observable.throw(responce);
        });
    }
    protected processchangeWorkspace(responce: Response): WorkspaceDto {
        debugger;
        const responseText = responce.text();
        const status = responce.status;
        if (status === 200) {
            let result: WorkspaceDto;
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            result = WorkspaceDto.fromJS(result200);
            return result;
        }
        return null;
    }


    getWorkspacelist(): Observable<WorkspaceDto[]> {
        debugger;
        //const _content = JSON.stringify({
        //    workspaceKey: TempBaseUrl.WORKSPACEKEY,
        //    sessionKey: this._session.getToken()
        //});
        return this.http.request(TempBaseUrl.BASE_URL + "workspace/", {
       
            method: "get",
            headers: new Headers({
                "Content-Type": "application/json;charset=UTF-8",
                "Accept": "application/json;charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processworkspacelist(response);
        }).catch((responce: any, caught: any) => {
            if (responce instanceof Response) {
                try {
                    return Observable.of(this.processworkspacelist(responce));
                } catch (e) {
                    return <Observable<WorkspaceDto[]>><any>Observable.throw(e);
                }
            } else
                return <Observable<WorkspaceDto[]>><any>Observable.throw(responce);
        });
    }
    protected processworkspacelist(responce: Response): WorkspaceDto[] {
        debugger;
        const responseText = responce.text();
        const status = responce.status;
        if (status === 200) {
            let result: WorkspaceDto[]=[];
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            for (let item of result200["workspaceList"])
                result.push(WorkspaceDto.fromJS(item));

            return result;
        }
        return null;
    }



    deleteWorkspace(input:any): Observable<WorkspaceDto> {
        debugger;
        //const _content = JSON.stringify({
        //    workspaceKey: TempBaseUrl.WORKSPACEKEY,
        //    sessionKey: this._session.getToken()
        //});
        return this.http.request(TempBaseUrl.BASE_URL + "workspace/" + input, {

            method: "delete",
            headers: new Headers({
                "Content-Type": "application/json;charset=UTF-8",
                "Accept": "application/json;charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processdeleteWorkspace(response);
        }).catch((responce: any, caught: any) => {
            if (responce instanceof Response) {
                try {
                    return Observable.of(this.processdeleteWorkspace(responce));
                } catch (e) {
                    return <Observable<WorkspaceDto>><any>Observable.throw(e);
                }
            } else
                return <Observable<WorkspaceDto>><any>Observable.throw(responce);
        });
    }
    protected processdeleteWorkspace(responce: Response): WorkspaceDto {
        debugger;
        const responseText = responce.text();
        const status = responce.status;
        if (status === 200) {
            let result: WorkspaceDto;
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            result = WorkspaceDto.fromJS(result200);

            return result;
        }
        return null;
    }

    editWorkspace(input: any): Observable<WorkspaceDto> {
        debugger;
        //const _content = JSON.stringify({
        //    workspaceKey: TempBaseUrl.WORKSPACEKEY,
        //    sessionKey: this._session.getToken()
        //});
        return this.http.request(TempBaseUrl.BASE_URL + "workspace/" + input, {

            method: "get",
            headers: new Headers({
                "Content-Type": "application/json;charset=UTF-8",
                "Accept": "application/json;charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processeditWorkspace(response);
        }).catch((responce: any, caught: any) => {
            if (responce instanceof Response) {
                try {
                    return Observable.of(this.processeditWorkspace(responce));
                } catch (e) {
                    return <Observable<WorkspaceDto>><any>Observable.throw(e);
                }
            } else
                return <Observable<WorkspaceDto>><any>Observable.throw(responce);
        });
    }
    protected processeditWorkspace(responce: Response): WorkspaceDto {
        debugger;
        const responseText = responce.text();
        const status = responce.status;
        if (status === 200) {
            let result: WorkspaceDto;
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            var item = result200["workspaceDetails"];
           result = WorkspaceDto.fromJS(item);

            return result;
        }
        return null;
    }


    updateWorkspace(input: any): Observable<WorkspaceDto> {
        debugger;
        //const _content = JSON.stringify({
        //    workspaceKey: TempBaseUrl.WORKSPACEKEY,
        //    sessionKey: this._session.getToken()
        //});
        const _content = JSON.stringify(input);
        return this.http.request(TempBaseUrl.BASE_URL + "workspace/" + input.entityKey, {
            body: _content,
            method: "put",
            headers: new Headers({
                "Content-Type": "application/json;charset=UTF-8",
                "Accept": "application/json;charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processupdateWorkspace(response);
        }).catch((responce: any, caught: any) => {
            if (responce instanceof Response) {
                try {
                    return Observable.of(this.processupdateWorkspace(responce));
                } catch (e) {
                    return <Observable<WorkspaceDto>><any>Observable.throw(e);
                }
            } else
                return <Observable<WorkspaceDto>><any>Observable.throw(responce);
        });
    }
    protected processupdateWorkspace(responce: Response): WorkspaceDto {
        debugger;
        const responseText = responce.text();
        const status = responce.status;
        if (status === 200) {
            let result: WorkspaceDto;
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            var item = result200["resultData"];
            result = WorkspaceDto.fromJS(item);

            return result;
        }
        return null;
    }


    copyMoveObject(input: any): Observable<WorkspaceDto> {
        debugger;
        //const _content = JSON.stringify({
        //    workspaceKey: TempBaseUrl.WORKSPACEKEY,
        //    sessionKey: this._session.getToken()
        //});
        return this.http.request(TempBaseUrl.BASE_URL + "workspace/copyMoveObject/", {
            body: JSON.stringify(input),
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json;charset=UTF-8",
                "Accept": "application/json;charset=UTF-8"
            })
        }).map((response) => {
            debugger;
            return this.processcopyMoveObject(response);
        }).catch((responce: any, caught: any) => {
            if (responce instanceof Response) {
                try {
                    return Observable.of(this.processcopyMoveObject(responce));
                } catch (e) {
                    return <Observable<WorkspaceDto>><any>Observable.throw(e);
                }
            } else
                return <Observable<WorkspaceDto>><any>Observable.throw(responce);
        });
    }
    protected processcopyMoveObject(responce: Response): WorkspaceDto {
        debugger;
        const responseText = responce.text();
        const status = responce.status;
        if (status === 200) {
            let result: WorkspaceDto;
            let result200 = responseText == "" ? null : JSON.parse(responseText, this.jsonParseReviver);
            result = WorkspaceDto.fromJS(result200["workspace"]);
            return result;
        }
        return null;
    }
}


//############################
// WORKSPACE DTO

export class WorkspaceDto {
    statusCode: number;
    statusMessage: string;
    entityName: string;
    entityDescription: string;
    entityType: string;
    entityKey: string;
    parentKey: string;
    changeFlag: string;
    workspaceKey: string;
    workspaceName: string;
    constructor(data?: any) {
        if (data !== undefined) {
            this.statusCode = data["statusCode"] !== undefined ? data["statusCode"] : null;
            this.statusMessage = data["statusMessage"] !== undefined ? data["statusMessage"] : null;
            this.entityName = data["entityName"] !== undefined ? data["entityName"] : null;
            this.entityDescription = data["entityDescription"] !== undefined ? data["entityDescription"] : null;
            this.entityType = data["entityType"] !== undefined ? data["entityType"] : null;
            this.entityKey = data["entityKey"] !== undefined ? data["entityKey"] : null;
            this.parentKey = data["parentKey"] !== undefined ? data["parentKey"] : null;
            this.workspaceKey = data["workspaceKey"] !== undefined ? data["workspaceKey"] : null;
            this.workspaceName = data["workspaceName"] !== undefined ? data["workspaceName"] : "";
        }
    }
    static fromJS(data?: any): WorkspaceDto {
        return new WorkspaceDto(data);
    }
    toJS(data?: any) {
        data = data === undefined ? {} : data;
        data["entityName"] = this.entityName !== undefined ? this.entityName : "";
        data["entityDescription"] = this.entityDescription !== undefined ? this.entityDescription : "";
        data["entityType"] ="Workspace"// this.entityType !== undefined ? this.entityType : ""; /*"Workspace"*/
        data["parentKey"] = this.parentKey !== undefined ? this.parentKey : "";
        data["changeFlag"] = this.changeFlag !== undefined ? this.changeFlag : "";
        data["entityKey"] = this.entityKey !== undefined ? this.entityKey : "";
        return data;
    }
    toJSON() {
        return JSON.stringify(this.toJS());
    }
}
