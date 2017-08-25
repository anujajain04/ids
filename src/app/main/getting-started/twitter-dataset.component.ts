import { Component, ElementRef, ViewChild, AfterViewInit, OnInit, Directive, Input,EventEmitter,Output} from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { GettingStartedService, SubDatasetDto,TwitterDatasetDto, GSDatasetDto, GSTwitterDto, TempBaseUrl, DatasetResultModel, LoadingService } from '@shared/service-proxies/ids-service-proxies'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({ 
    selector: 'gsmytwitter',
    templateUrl: './twitter-dataset.component.html',
    animations: [appModuleAnimation()]
})
export class GSTwitterDatasetComponent {
      @Output() onClick=new EventEmitter();
        gsDataset:GSDatasetDto=GSDatasetDto.fromJS();
        isSubmit:boolean=false;
        complexForm: FormGroup;
        private height: number;
        constructor(private gService: GettingStartedService, fb: FormBuilder, private load: LoadingService) {

            if (this.gService.globalGSDataset !== undefined) {
                if (this.gService.globalGSDataset instanceof (TwitterDatasetDto)) {
                    this.gsDataset.entityName = this.gService.globalGSDataset.entityName;
                    this.gsDataset.entityDescription = this.gService.globalGSDataset.entityDescription;
                    this.gsDataset.subDatasets = this.gService.globalGSDataset.subDatasets;
                    this.gsDataset.isBack = true;
                }
            }
                this.complexForm=fb.group({
                        'name':[null,Validators.required],
                        'description':[null,Validators.required],
                        'tag':[null,Validators.required]
            });

        }

        ngOnInit() {
            this.height = window.innerHeight-300;
        }
        enableError() {
            this.complexForm.controls['name'].markAsTouched();
            this.complexForm.controls['description'].markAsTouched();
            this.complexForm.controls['tag'].markAsTouched();
            if (this.complexForm.valid) {
                this.submitForm(this.complexForm.value);
            }
        }
        submitForm(value: any): GSDatasetDto{
           
               this.gsDataset.entityName=value.name;
                this.gsDataset.entityDescription=value.description;
                this.gsDataset.entityType="Dataset";
                this.gsDataset.className="Twitter";
                this.gsDataset.dashboardKey="";
                this.gsDataset.workspaceKey=TempBaseUrl.WORKSPACEKEY;
                this.gsDataset.workspaceName = "workspaceName";
                let s: SubDatasetDto = new SubDatasetDto();
                s.className = "SubDataset";
                s.entityType = "SubDataset";
                s.entityName = value.name;
                s.entityDescription = value.description;
                s.isCustom = "false";
                s.query = value.tag;
                this.gsDataset.subDatasets.push(s);
                return this.gsDataset;
        }
        getHash(): string {
            if (this.gsDataset !== undefined) {
                if (this.gsDataset.subDatasets !== undefined)
                    if (this.gsDataset.subDatasets.length > 0)
                        return this.gsDataset.subDatasets[0].query;
            }
            return "";
        }
}