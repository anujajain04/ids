import { Component, Injector, Output, EventEmitter, OnDestroy } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { TokenService } from '@abp/auth/token.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DatasetService, DatabaseDriver, TempBaseUrl, DatasetState, RDBMSDatasetDto, DatasetResultModel, PassService, LoadingService } from '@shared/service-proxies/ids-service-proxies';
import { WorkspaceService, WorkspaceDto } from '@shared/service-proxies/ids-workspace-service-proxies';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
@Component({
    selector: 'Create-rdbms',
    templateUrl: './create-rdbms.component.html',
    animations: [appModuleAnimation()]
})
export class CreateRDBMSComponent {
    driverList: DatabaseDriver[] = null;
    databaseList: string[] = null;
    isLogin: boolean = false;
    error: boolean = false;
    isPost: boolean = false;
    isMySql: boolean = false;
    isOracle: boolean = false;
    loginForm: FormGroup;
    complexForm: FormGroup;
    rdbms: RDBMSDatasetDto = new RDBMSDatasetDto();
    key: string;
    private height: number;
    private height1: number;
    private height2: number;
    selectedDriver: string = "";
    selectedDatabase: string = "";
    constructor(private _session: TokenService,
        route: ActivatedRoute, private _router: Router, private service: DatasetService, private wService: WorkspaceService,
        private fbBuilder: FormBuilder, private dsService: DatasetService,
        private pass: PassService, private _loc: Location, private load: LoadingService) {
        this.loginForm = fbBuilder.group({
            'username': [null, Validators.required],
            'password': [null, Validators.required]
        });
        this.complexForm = fbBuilder.group({
            'name': [null, Validators.required],
            'description': [null, Validators.required],
            'server': [null, Validators.required],
            'driver': [null, Validators.required],
            'database': [null],
            'database1': [null],
            'sid': [null],

        });
        debugger;
        this.getDriverList();
        try {
            this.key = route.snapshot.params['key'];
            if (this.key !== "" && this.key !== null && this.key !== undefined) {

                this.complexForm.controls['name'].disable();
                if (this.pass.isUpdate && this.pass.passValue !== undefined && this.pass.passValue !== null) {
                    this.rdbms = this.pass.passValue;
                    this.selectedDriver = this.rdbms.driverKey;
                    this.selectedDatabase = this.rdbms.databaseName;
                    this.getDatabaseList("");
                } else {
                    this.pass.isUpdate = true;
                    this.pass.passId = this.key;
                    this.complexForm.controls["name"].disable();
                    if (this.pass.passValue !== undefined && this.pass.passValue !== null) {
                        this.rdbms = this.pass.passValue;
                        this.selectedDriver = this.rdbms.driverKey;
                        this.selectedDatabase = this.rdbms.databaseName;
                    } else this.getDatasetDetails();
                }
            } else {
                if (this.pass.passValue !== undefined && this.pass.passValue !== null) {
                    this.rdbms = this.pass.passValue;
                    if (this.rdbms.isLogin || this.pass.isUpdate)
                        this.getDatabaseList("");
                } else {
                    this.pass.isUpdate = false;
                    this.rdbms = new RDBMSDatasetDto();
                }
            }

            this.removeEmptySubDataset();
        } catch (e) {
            console.error("Error at facebook");
        }
    }
    removeEmptySubDataset() {
        //remove empty subdatasets

        for (let s of this.rdbms.subDatasets) {
            if (s.entityName === null || s.entityName === "" || s.entityName === undefined ||
                s.entityDescription === null || s.entityDescription === "" || s.entityDescription === undefined)
                this.rdbms.subDatasets.splice(this.rdbms.subDatasets.indexOf(s), 1);
        }
    }
    ngOnInit() {
        this.height1 = window.innerHeight - 22;
        this.height2 = window.innerHeight - 113;
    }

    getDriverList() {
        this.service.getDatabaseDriver().subscribe(res => {
            debugger;
            this.driverList = res;
        });
    }
    submitLogin(value: any) {
        //  alert(this.loginForm.controls(''))
        debugger;
        if (this.loginForm.valid) {
            let param = JSON.stringify({
                driver: this.complexForm.controls['driver'].value,
                server_name: this.complexForm.controls['server'].value,
                user_name: this.rdbms.userName,
                password: this.rdbms.password,
                databaseName: this.isPost || this.isMySql || this.isOracle ? this.complexForm.controls['database1'].value : "",
                sid: this.isOracle ? this.complexForm.controls['sid'].value : "",
                sessionKey: this._session.getToken()
            });
          this.load.start()
            this.service.validateRDBMSUser(param).subscribe(res => {
                this.load.stop()
                if (res.statusCode === 1) {
                    this.error = false;
                    this.rdbms.isLogin = true;
                    //this.rdbms.userName = value.username;
                    //this.rdbms.password = value.password;
                    this.getDatabaseList(value);
                } else {
                    this.error = true;
                    this.rdbms.isLogin = false;
                }
            });
        }
    }
    //isPresent(value: string): Boolean {
    //    debugger;
    //    if (this.driverList !== undefined) {
    //        if (this.rdbms.driverKey === "" || this.rdbms.driverKey == null)
    //            return null;
    //        if (this.rdbms.driverKey.toLowerCase() === value.toLowerCase()) {
    //            // alert("match");
    //            return true;
    //        }
    //    }
    //    return null;
    //}
    getDatasetDetails() {
        if (this.key !== null) {
          this.load.start()
            this.dsService.editDataset("RDBMS", this.key).subscribe(res => {
                debugger;
                this.load.stop()
                this.rdbms = res;
                this.complexForm.controls["name"].setValue(this.rdbms.entityName);
                this.complexForm.controls["description"].setValue(this.rdbms.entityDescription);
                this.complexForm.controls["server"].setValue(this.rdbms.serverName);
                this.onDriver(this.rdbms.driverKey);
                this.complexForm.controls["database1"].setValue(this.rdbms.databaseName);
                this.complexForm.controls["sid"].setValue(this.rdbms.sid);
                this.complexForm.controls["driver"].setValue(this.rdbms.driverKey);
                this.loginForm.controls["username"].setValue(this.rdbms.userName);
                this.loginForm.controls["password"].setValue(this.rdbms.password);
                if (this.pass.isUpdate)
                    this.submitLogin(this.complexForm);
            });
        }
    }
    submit() {
        /// this.rdbms.subDatasets.pop();
      this.load.start()
        debugger;
        if (!this.pass.isUpdate) {
            this.service.createRDBMSDataset(this.pass.passValue).subscribe(res => {
                debugger;
                this.load.stop()
                if (res.statusCode === 1) {
                    abp.notify.success(res.statusMessage);
                    this._loc.back();
                } else {
                    abp.notify.error(res.statusMessage);
                }
            });
        } else {
            this.rdbms.changeFlag = true;
            this.rdbms.entityDescription = this.complexForm.controls['description'].value;
            this.rdbms.driverKey = this.complexForm.controls['driver'].value;
            this.rdbms.serverName = this.complexForm.controls['server'].value;
           // this.rdbms.databaseName = this.complexForm.controls['database1'].value;
            this.dsService.updateDataset(this.rdbms.toUpdateJSON().toString(), DatasetState.RDBMS, this.key).subscribe(res => {
                debugger;
                this.load.stop()
                if (res.statusCode == 1) {
                    abp.notify.success(res.statusMessage);
                    this._loc.back();
                } else abp.notify.error(res.statusMessage);
            });
        }
    }
    submitForm(value: any) {
        if (this.complexForm.valid) {
            debugger;
            this.rdbms.entityName = value.name;
            this.rdbms.entityDescription = value.description;
            this.rdbms.serverName = value.server;
            this.rdbms.driverKey = value.driver;
            this.rdbms.entityType = "Dataset";
            this.rdbms.className = "RDBMS";
            this.rdbms.workspaceKey = WorkspaceService.WorkSpaceKey;
            this.rdbms.workspaceName = "test_ids";
            this.rdbms.schemaName = "Workspace";
            this.rdbms.isDestinationFlag = "false";
            this.rdbms.sessionKey = this._session.getToken();
            this.rdbms.databaseName = value.database1;
            this.rdbms.sid = value.sid;
        }
    }
    subrdbms() {
        debugger;
        this.rdbms.databaseName = this.isPost ? this.complexForm.controls['database1'].value : this.complexForm.controls['database'].value;
        this.rdbms.sid = this.isOracle ? this.complexForm.controls['sid'].value : this.complexForm.controls['sid'].value;
        this.rdbms.driverKey = this.complexForm.controls['driver'].value;
        this.rdbms.entityName = this.complexForm.controls['name'].value;
        this.rdbms.entityDescription = this.complexForm.controls['description'].value;
        this.rdbms.serverName = this.complexForm.controls['server'].value;
        this.rdbms.entityType = "Dataset";
        this.rdbms.className = "RDBMS";
        this.rdbms.workspaceKey = WorkspaceService.WorkSpaceKey;
        this.rdbms.workspaceName = "Workspace";
        this.rdbms.isDestinationFlag = "false";
        this.rdbms.sessionKey = this._session.getToken();
        if (!this.pass.isUpdate) {
            this.rdbms.userName = this.loginForm.controls['username'].value;
            this.rdbms.password = this.loginForm.controls['password'].value;
        }
        this.pass.passValue = this.rdbms;
        if (this.rdbms !== undefined) {
            this._router.navigate(['sub-rdbms']);
        }
    }
    getDatabaseList(value: any) {
        debugger;
        let param = JSON.stringify({
            driverKey: this.rdbms.driverKey,
            serverName: this.rdbms.serverName,
            userName: this.rdbms.userName,
            password: this.rdbms.password,
            databaseName: this.rdbms.databaseName,
        });
      this.load.start()
        this.service.getDatabaseList(param).subscribe(res => {
            debugger;
            this.load.stop()
            this.databaseList = res;

        });
    }
    onChange(value: string) {
        if (this.rdbms !== undefined) {
            this.rdbms.queryType = value;
        }
    }
    onselect(value: string) {
        if (this.rdbms !== undefined) {
            this.rdbms.driverKey = value;
        }
    }
    onData(value: string) {
        this.selectedDatabase = value;
        //if (this.rdbms !== undefined) {
        //    this.rdbms.databaseName = value;
        //}
    }



    onDriver(value: string) {
        debugger;
        //value = "oracle connection"
        this.selectedDriver = value
        //if (!this.pass.isUpdate) {
        //    this.selectedDatabase = this.rdbms.databaseName = "";
        //    this.rdbms.serverName = "";
        //}
        if (value.toLocaleLowerCase() === "postgresql unicode")
            this.isPost = true
        else this.isPost = false;

        if (value.toLocaleLowerCase() === "mysql odbc 5.3 unicode driver")
            this.isMySql = true
        else this.isMySql = false;

      if (value === "oracle connection")
        this.isOracle = true
      else this.isOracle = false;
    }
    isSelected(val: any): Boolean {
        debugger;
        if (this.rdbms !== undefined) {
            if (val === this.rdbms.driverKey) {
                return true;
            }
        }
        return null;
    }
}
