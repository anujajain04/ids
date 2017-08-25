import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AnalysisService, GSAnalysisChart, GettingStartedService, DatasetService, GSDatasetDto, AnalysisDto, TempBaseUrl, MappingDto, DatasetResultModel, LoadingService } from '@shared/service-proxies/ids-service-proxies';
import { Router } from '@angular/router';
@Component({
    selector: 'gssentimentdetection-app',
    templateUrl: './sentiment-detection.component.html',
    animations: [appModuleAnimation()]
})
export class GSSentimentDetectionComponent implements OnInit{
    complexForm: FormGroup;
    @Input() gsDataset: GSDatasetDto;
    gsAnalysis: AnalysisDto;
    modelFiledList: string[];
    private height: number;
    protected jsonParseReviver: (key: string, value: any) => any = undefined;
    constructor(fb: FormBuilder, private gsService: AnalysisService, private gService: GettingStartedService, private dsService: DatasetService, private _route: Router, private load: LoadingService) {
        if (this.gService.globalGSDataset !== undefined) {
            this.gsDataset = this.gService.globalGSDataset;
        }
        this.complexForm = fb.group({
            'name': [null, Validators.required],
            'description': [null, Validators.required],
            'Dataset_fields': [null, Validators.required]
        });
    }
    enableError() {
        this.complexForm.controls['name'].markAsTouched();
        this.complexForm.controls['description'].markAsTouched();
        this.complexForm.controls['Dataset_fields'].markAsTouched();
        if (this.complexForm.valid) {
            this.submitForm(this.complexForm.value);
        }
    }
    ngOnInit() {
        debugger;
        this.height = window.innerHeight - 300;
        if (this.gsDataset !== undefined) {
            debugger;
            if (this.gsDataset.className.toLowerCase() === "twitter") {
                this.dsService.getTwitterFields().subscribe(res => {
                    this.modelFiledList = res;
                });

            } else if (this.gsDataset.className.toLowerCase() === "facebook") {
                this.dsService.getFacebookFields().subscribe(res => {
                    this.modelFiledList = res;
                });

            } else if (this.gsDataset.className.toLowerCase() === "file" || this.gsDataset.className.toLowerCase() === "excel") {
                this.modelFiledList = this.gsDataset.mapData;
            } else if (this.gsDataset.className.toLowerCase() === "rss") {
                this.modelFiledList = this.gsDataset.mapData;
            }
        }
    }
    submitForm(value: any): AnalysisDto {
        if (this.gsAnalysis === undefined)
            this.gsAnalysis = new AnalysisDto();
        if (this.gsDataset !== undefined) {
            this.gsAnalysis.analysisName = value.name;
            this.gsAnalysis.analysisDesc = value.description;
            this.gsAnalysis.AnalysisType = "Sentiment Detection";
            this.gsAnalysis.datasetKey = this.gsDataset.entityKey;
            this.gsAnalysis.workspaceKey = TempBaseUrl.WORKSPACEKEY;
            let m = new MappingDto();
            m.DatasetField = value.Dataset_fields.toLowerCase();
            m.ModelField = "Text";
            this.gsAnalysis.subdatasetKey = "";
            this.gsAnalysis.Mappings.push(m);
            return this.gsAnalysis;
        }
    }
}