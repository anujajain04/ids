import { Component, Input, Output, OnDestroy } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { TempBaseUrl, DatasetService, FacebookDatasetDto, PassService, DatasetState, LoadingService } from '@shared/service-proxies/ids-service-proxies'
import { Router, ActivatedRoute } from '@angular/router';
import { TokenService } from '@abp/auth/token.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
    selector: 'fb-app',
    templateUrl: './create-facebook.component.html',
    animations: [appModuleAnimation()]
})
export class FBComponent {
    fbDataset: FacebookDatasetDto = new FacebookDatasetDto();
    complexForm: FormGroup;
    key: string;
    private height: number;
    private height1: number;
    private height2: number;
    constructor(private _router: Router, private _session: TokenService,
        private _location: Location, fb: FormBuilder, route: ActivatedRoute,
        private pass: PassService, private dsService: DatasetService,
        private load: LoadingService) {
        this.complexForm = fb.group({
            'name': [null, Validators.required],
            'description': [null, Validators.required]
        });
        debugger;
        try {
            this.key = route.snapshot.params['key'];
            if (this.key !== "" && this.key !== null && this.key !== undefined) {
                if (this.pass.isUpdate && this.pass.passValue !== undefined && this.pass.passValue !== null) {
                    this.fbDataset = this.pass.passValue;
                } {
                    this.pass.isUpdate = true;
                    this.pass.passId = this.key;
                    this.complexForm.controls["name"].disable();
                    if (this.pass.passValue !== undefined && this.pass.passValue !== null) {
                        this.fbDataset = this.pass.passValue;
                    } else this.getDatasetDetails();
                }
            } else {
                if (this.pass.passValue !== undefined && this.pass.passValue !== null) {
                    this.fbDataset = this.pass.passValue;
                } else {
                    this.pass.isUpdate = false;
                    this.fbDataset = new FacebookDatasetDto();
                }
            }
        } catch (e) {
            console.error("Error at facebook");
        }
    }

    ngOnInit() {
        this.height = window.innerHeight - 65;
        this.height1 = window.innerHeight - 75;
        this.height2 = window.innerHeight - 245;
    }
    change(i: number) {
    }
    getDatasetDetails() {
        if (this.key !== null) {
          this.load.start()
            //this.fbDataset = new FacebookDatasetDto();
            this.dsService.editDataset("Facebook", this.key).subscribe(res => {
                this.load.stop()
                if (res !== null && res !== undefined)
                    this.fbDataset = res;
            });
        }
    }
    submitForm(value: any): void {
        debugger;
        //this.fbDataset.entityName = value.name;
        this.fbDataset.entityDescription = value.description;
        this.fbDataset.entityType = "Dataset";
        this.fbDataset.workspaceKey = TempBaseUrl.WORKSPACEKEY;
        this.fbDataset.className = "Facebook";
        this.fbDataset.dashboardKey = "";
        this.fbDataset.workspaceName = "W1";
        this.fbDataset.sessionKey = this._session.getToken();
        this.pass.passValue = this.fbDataset;
        this.subfacebook();
    }
    subfacebook() {
        this._router.navigate(['sub-facebook']);
    }
    save() {
        debugger;
        if (this.fbDataset !== undefined) {
          this.load.start()
            if (!this.pass.isUpdate) {
                //this.load.start();
                this.dsService.createFacebookDataset(this.fbDataset).subscribe(res => {
                    this.load.stop()
                    if (res.statusCode == 1) {
                     //   toastr.success(res.statusMessage);
                        abp.notify.success(res.statusMessage, ""); 
                        this._location.back();
                        //this._router.navigate(['dataset']);
                    } else {
                        abp.notify.error(res.statusMessage);
                    }
                });
            } else {
                this.fbDataset.changeFlag = "true";
                this.fbDataset.entityName = this.complexForm.controls['name'].value;
                this.fbDataset.entityDescription = this.complexForm.controls['description'].value;

                this.dsService.updateDataset(this.fbDataset.toUpdateJSON().toString(), DatasetState.FACEBOOK, this.fbDataset.entityKey).subscribe(res => {
                    debugger;
                    this.load.stop();
                    if (res.statusCode == 1) {
                        abp.notify.success(res.statusMessage);
                        this._location.back();
                    } else abp.notify.error(res.statusMessage);
                });
            }
        }

    }
    tokenfacebook() {
        this._router.navigate(['token-facebook']);
    }
}