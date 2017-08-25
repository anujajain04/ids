import { Component, Injector, Output, EventEmitter } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DatasetService, TempBaseUrl, PassService, TwitterDatasetDto, DatasetState, LoadingService } from '@shared/service-proxies/ids-service-proxies'
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TokenService } from '@abp/auth/token.service';
import { Location } from '@angular/common';
@Component({
    selector: 'mytwitter',
    templateUrl: './create-twitter.component.html',
    animations: [appModuleAnimation()]
})
export class TwitterDatasetComponent {
    twDataset: TwitterDatasetDto = new TwitterDatasetDto();
    complexForm: FormGroup;
    key: string;
    private height1: number;
    constructor(private _session: TokenService, private service: DatasetService,
        private _router: Router, fb: FormBuilder, route: ActivatedRoute,
        private pass: PassService, private _location: Location,
        private load: LoadingService) {
        this.complexForm = fb.group({
            'name': [null, Validators.required],
            'description': [null, Validators.required]
        });
        debugger;
        this.key = route.snapshot.params['key'];
        try {
            this.key = route.snapshot.params['key'];
            if (this.key !== "" && this.key !== null && this.key !== undefined) {
                if (this.pass.isUpdate && this.pass.passValue !== undefined && this.pass.passValue !== null) {
                    this.twDataset = this.pass.passValue;
                } {
                    this.pass.isUpdate = true;
                    this.pass.passId = this.key;
                    this.complexForm.controls["name"].disable();
                    if (this.pass.passValue !== undefined && this.pass.passValue !== null) {
                        this.twDataset = this.pass.passValue;
                    } else this.getDatasetDetails();
                }
            } else {
                if (this.pass.passValue !== undefined && this.pass.passValue !== null) {
                    this.twDataset = this.pass.passValue;
                } else {
                    this.pass.isUpdate = false;
                    this.twDataset = new TwitterDatasetDto();
                }
            }
        } catch (e) {
            console.error("Error at facebook");
        }
    }

    ngOnInit() {
        this.height1 = window.innerHeight-40;
    }
    getDatasetDetails() {
        if (this.pass.passId !== null) {
          this.load.start()
            //this.fbDataset = new FacebookDatasetDto();
            this.service.editDataset("Twitter", this.pass.passId).subscribe(res => {
                debugger;
                this.load.stop()
                this.twDataset = res;
                this.complexForm.controls["name"].setValue(this.twDataset.entityName);
                this.complexForm.controls["name"].disable();
            });
        }
    }
    save() {
        debugger;
      this.load.start()
        if (!this.pass.isUpdate) {
            this.service.createTwitterDataset(this.twDataset).subscribe(res => {
                this.load.stop()
                if (res.statusCode == 1) {
                    abp.notify.success(res.statusMessage);
                    this._location.back();
                    //this._router.navigate['dataset'];
                } else {
                    abp.notify.error(res.statusMessage);
                }
            });
        } else {
            this.twDataset.changeFlag = "true";
            this.twDataset.entityName = this.complexForm.controls['name'].value;
            this.twDataset.entityDescription = this.complexForm.controls['description'].value;

            this.service.updateDataset(this.twDataset.toUpdateJSON().toString(), DatasetState.TWITTER, this.twDataset.entityKey).subscribe(res => {
                debugger;
                if (res.statusCode == 1) {
                    abp.notify.success(res.statusMessage);
                    this._location.back();
                } else abp.notify.error(res.statusMessage);
            });
        }
    }
    submitForm(value: any): void {
        this.twDataset.entityDescription = value.description;
        this.twDataset.entityType = "Dataset";
        this.twDataset.className = "Twitter";
        this.twDataset.dashboardKey = "";
        this.twDataset.workspaceKey = TempBaseUrl.WORKSPACEKEY;
        this.twDataset.workspaceName = "W1";
        this.twDataset.sessionKey = this._session.getToken();
        this.pass.passValue = this.twDataset;
        debugger;
        this.subtwitter();
    }

    subtwitter() {
        this._router.navigate(['sub-twitter']);
    }

    tokentwitter() {
        this._router.navigate(['token-twitter']);
    }
    isEmpty(): boolean {
        if (this.twDataset !== undefined && this.twDataset !== null) {
            if (this.twDataset.subDatasets !== undefined && this.twDataset.subDatasets !== null) {
                if (this.twDataset.subDatasets.length > 0)
                    return false;
            }
        }
        return true;
    }
}