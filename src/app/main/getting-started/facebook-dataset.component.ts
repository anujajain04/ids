import { Component } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { GettingStartedService, SubDatasetDto, GSDatasetDto, FacebookDatasetDto, TempBaseUrl, DatasetResultModel } from '@shared/service-proxies/ids-service-proxies'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TokenService } from '@abp/auth/token.service';
@Component({
    selector: 'gsfb-app',
    templateUrl: './facebook-dataset.component.html',
    animations: [appModuleAnimation()]
})
export class GSFBComponent {
    gsDataset: GSDatasetDto = GSDatasetDto.fromJS();
    complexForm: FormGroup;
    private height: number;
    constructor(private gService: GettingStartedService, fb: FormBuilder, private _session: TokenService) {
        debugger;
        if (this.gService.globalGSDataset !== undefined) {
            if (this.gService.globalGSDataset instanceof (FacebookDatasetDto)) {
                this.gsDataset.entityName = this.gService.globalGSDataset.entityName;
                this.gsDataset.entityDescription = this.gService.globalGSDataset.entityDescription;
                this.gsDataset.subDatasets = this.gService.globalGSDataset.subDatasets;
                this.gsDataset.isBack = true;
            }
        }
        this.complexForm = fb.group({
            'name': [null, Validators.required],
            'description': [null, Validators.required],
            'page': [null, Validators.required]
        });
    }
    ngOnInit() {
        this.height = window.innerHeight - 300;
    }
    enableError() {
        this.complexForm.controls['name'].markAsTouched();
        this.complexForm.controls['description'].markAsTouched();
        this.complexForm.controls['page'].markAsTouched();
        if (this.complexForm.valid) {
            this.submitForm(this.complexForm.value);
        }
    }
    submitForm(value: any): GSDatasetDto {
        if (this.gsDataset !== undefined) {
            this.gsDataset.entityName = value.name;
            this.gsDataset.entityDescription = value.description;
            this.gsDataset.entityType = "Dataset";
            this.gsDataset.className = "Facebook";
            this.gsDataset.dashboardKey = "";
            this.gsDataset.workspaceKey = TempBaseUrl.WORKSPACEKEY;
            this.gsDataset.workspaceName = "workspaceName";
            this.gsDataset.sessionKey = this._session.getToken();
            let s: SubDatasetDto = new SubDatasetDto();
            s.className = "SubDataset";
            s.entityType = "SubDataset";
            s.entityName = value.name;
            s.entityDescription = value.description;
            s.isCustom = "false";
            s.query = value.page;
            this.gsDataset.subDatasets.push(s);
            return this.gsDataset;
        }

    }
    getPageId(): string {
        if (this.gsDataset !== undefined) {
            if (this.gsDataset.subDatasets !== undefined)
                if (this.gsDataset.subDatasets.length > 0)
                    return this.gsDataset.subDatasets[0].query;
        }
        return "";
    }
}