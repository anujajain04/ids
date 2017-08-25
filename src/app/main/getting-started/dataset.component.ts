import { Component, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DatasetService, GSDatasetDto, GSAnalysisChart, WorldCloudChart, GettingStartedService, LoadingService, DatasetType, DatasetDto, DatasetState, AnalysisDto, AnalysisTypeDto, AnalysisService } from '@shared/service-proxies/ids-service-proxies';
import { NavigationEnd } from '@angular/router';
import { GSCSVComponent } from './delimit-file.component';
import { GSExcelComponent } from './excel-dataset.component';
import { GSFBComponent } from './facebook-dataset.component';
import { GSTwitterDatasetComponent } from './twitter-dataset.component';
import { GSRSSComponent } from './rss.component';
import { GSFrequencyAnalysisComponent } from './frequency-analysis.component';
import { GSCorrelationComponent } from './correlation-analysis.component';
import { GSSentimentDetectionComponent } from './sentiment-detection.component';
import { TokenService } from '@abp/auth/token.service';
@Component({
    templateUrl: './dataset.component.html',
    animations: [appModuleAnimation()]
})
export class DataSetComponent {
    @ViewChild(GSCSVComponent) csv: GSCSVComponent;
    @ViewChild(GSExcelComponent) excel: GSExcelComponent;
    @ViewChild(GSFBComponent) fb: GSFBComponent;
    @ViewChild(GSTwitterDatasetComponent) twitter: GSTwitterDatasetComponent;
    @ViewChild(GSRSSComponent) rss: GSRSSComponent;
    @ViewChild(GSFrequencyAnalysisComponent) frq: GSFrequencyAnalysisComponent;
    @ViewChild(GSCorrelationComponent) cor: GSCorrelationComponent;
    @ViewChild(GSSentimentDetectionComponent) sent: GSSentimentDetectionComponent;
    buttonText: string = "NEXT";
    stepNumber: number;
    datasetStage: number;
    analysisStage: number;
    finalChart: GSAnalysisChart;
    datatypes: DatasetType[] = null;
    analysistype: AnalysisTypeDto[] = null;
    gsDataset: GSDatasetDto;
    gsAnalysis: AnalysisDto;
    protected jsonParseReviver: (key: string, value: any) => any = undefined;
    constructor(private datasetService: DatasetService,
        private analysiService: AnalysisService,
        private gService: GettingStartedService, private _session: TokenService, private load: LoadingService) {
            debugger;
        this.stepNumber = 1;
        this.datasetStage = 1;
        this.analysisStage = 4;
        this.getDatasetType();
        this.getAnalysisType();
        gService.globalGSAnalysis = null;
        gService.globalGSCharts = null;
        gService.globalGSDataset = null;
      
    }
    analysisClick(i: AnalysisTypeDto) {
        debugger;
        if (i.getNumber() !== 1 && i.getNumber() !== 2 && i.getNumber() !== 6 && i.getNumber()!==7)
            this.analysisStage = i.getNumber();
    }
    back() {
        if (this.stepNumber === 2) {
            this.stepNumber = 1;
        }
    }
    getDatasetType() {
      this.load.start()
        this.datasetService.getDatasetTypes()
            .subscribe(res => {
                this.datatypes = res;
                this.datatypes = this.datatypes.filter(it => it.type !== "Database");
                this.datasetStage = 4;
                this.load.stop()

            });
    }

    getAnalysisType() {
        this.analysiService.getAnalysisTypes().subscribe(res => {
            this.analysistype = res;
            this.analysistype = this.analysistype.filter(it => it.analysisType != "Entity Extraction");
            this.analysistype = this.analysistype.filter(i => i.analysisType != "Preprocessor");
            this.analysisStage = 3;
        });
    }


    dataSrc(i: DatasetType): string {
        return i.getIcon();
    }
    isStepSelected(v: any): boolean {
        if (this.stepNumber == v)
            return true;
        return false;
    }

    breadCrumbClick(v: number) {
        if (this.stepNumber == 2)
            this.stepNumber = 1;
    }
    validate() {
        switch (this.stepNumber) {
            case 1: //Dataset page
                this.datasetPage();
                break;
            case 2: //Analysis Page
                this.analysisPage();
                break;
            case 3: //Chart Page
                this.saveChart();
                break;
            default://none
        }
    }
    datasetPage() {
        switch (this.datasetStage) {
            case 1: //twitter
                if (this.twitter !== undefined) {
                    if (this.twitter.gsDataset.isBack) {
                        this.stepNumber = 2;
                    } else
                        if (this.twitter.complexForm.valid) {
                            this.saveDataset(this.twitter.submitForm(this.twitter.complexForm.value));
                        } else {
                            this.twitter.enableError();
                        }
                }
                break;
            case 2: //fb
                if (this.fb !== undefined) {
                    if (this.fb.gsDataset.isBack) {
                        this.stepNumber = 2;
                    } else
                        if (this.fb.complexForm.valid) {
                            this.saveDataset(this.fb.submitForm(this.fb.complexForm.value));
                        } else {
                            this.fb.enableError();
                        }
                }
                break;
            case 3: //rss
                if (this.rss !== undefined) {
                    if (this.rss.gsDataset.isBack) {
                        this.stepNumber = 2;
                    } else
                        if (this.rss.complexForm.valid) {
                            this.saveDataset(this.rss.submitForm(this.rss.complexForm.value));
                        } else {
                            this.rss.enableError();
                        }
                }
                break;
            case 4: //csv
                debugger;
                if (this.csv !== undefined) {
                    if (this.csv.gsDataset.isBack) {
                        this.stepNumber = 2;
                    } else
                        if (this.csv.complexForm.valid && this.csv.filePath !== undefined) {
                            this.saveCSVDataset(this.csv.submitForm(this.csv.complexForm.value));
                        } else {
                            this.csv.enableError();
                        }
                }
                break;
            case 5: //excel
                if (this.excel !== undefined) {
                    if (this.excel.gsDataset.isBack) {
                        this.stepNumber = 2;
                    } else
                        if (this.excel.complexForm.valid && this.excel.filePath !== undefined) {
                            this.saveExelDataset(this.excel.submitForm(this.excel.complexForm.value));
                        } else {
                            this.excel.enableError();
                        }
                }
                break;
            default://none
        }
    }
    analysisPage() {
        switch (this.analysisStage) {
            case 1:
                break;
            case 2:
                break;
            case 3: //freq
                if (this.frq.complexForm.valid) {
                    this.saveAnalysis(this.frq.submitForm(this.frq.complexForm.value));
                } else {
                    this.frq.enableError();
                }
                break;
            case 4: //coorelation
                debugger;
                if (this.cor.complexForm.valid) {
                    this.saveAnalysis(this.cor.submitForm(this.cor.complexForm.value));
                } else {
                    this.cor.enableError();
                }
                break;
            case 5: //sentiment
            debugger;
                if (this.sent.complexForm.valid) {
                    this.saveAnalysis(this.sent.submitForm(this.sent.complexForm.value));
                } else {
                    this.sent.enableError();
                }
                break;
            default://none
        }
    }

    saveCSVDataset(result: GSDatasetDto) {
      this.load.start()
        this.gService.saveGettingStartedDataset(result).subscribe(rs => {
            this.load.stop()
            if (rs.statusCode == 1) {
                abp.notify.success(rs.statusMessage);
                this.gsDataset = rs.resultData;
                this.gsDataset.mapData = result.mapData;
                this.gService.globalGSDataset = this.gsDataset;
                this.stepNumber = 2;
            } else {
                abp.notify.error(rs.statusMessage);
            }
        });
    }
    saveExelDataset(result: GSDatasetDto) {
        debugger;
      this.load.start()
        this.gService.saveGettingStartedDataset(result).subscribe(rs => {
            this.load.stop()
            if (rs.statusCode == 1) {
                abp.notify.success("Dataset Saved Successfully.");
                this.gsDataset = rs.resultData;
                this.gsDataset.mapData = result.mapData;
                this.gService.globalGSDataset = this.gsDataset;
                this.stepNumber = 2;
            } else {
                abp.notify.error("Unable to save dataset");
            }
        });
    }
    saveDataset(result: GSDatasetDto) {
        debugger
      this.load.start()
        this.gService.saveGettingStartedDataset(result).subscribe(rs => {
            this.load.stop()
            if (rs.statusCode == 1) {
                abp.notify.success(rs.statusMessage);
                this.gsDataset = rs.resultData;
                if (this.rss !== undefined)
                    this.gsDataset.mapData = this.rss.selectedField;
                this.gService.globalGSDataset = this.gsDataset;
                this.stepNumber = 2;
            } else {
                abp.notify.error(rs.statusMessage);
            }
        });
    }

    saveAnalysis(result: AnalysisDto) {
        debugger;
        result.subdatasetKey = this.gService.globalGSDataset.subDatasets[0].entityKey;
      this.load.start()
        this.gService.globalGSAnalysis = result;
        this.analysiService.saveGSAnalysis(result).subscribe(res => {
            this.load.stop()
            if (res.statusCode === 1) {
                abp.notify.success(res.statusMessage);
                this.gService.globalGSCharts = res.chart;
                this.buttonText = "SAVE";
                this.stepNumber = 3;
            } else {
                if (this.analysisStage === 3)
                    this.frq.gsAnalysis.Mappings = [];
                if (this.analysisStage === 4)
                    this.cor.gsAnalysis.Mappings = [];
                if (this.analysisStage === 5)
                    this.sent.gsAnalysis.Mappings = [];
                abp.notify.error(res.statusMessage);
            }
        });
    }
    saveChart() {
        abp.notify.success("Analysis Saved Successfully.");
        this.gService.globalGSAnalysis = null;
        this.gService.globalGSCharts = null;
        this.gService.globalGSDataset = null;
        this.buttonText = "NEXT";
        this.stepNumber = 1;
        this.datasetStage = 4;
        this.analysisStage = 4;

        //let _content = JSON.stringify({
        //    analysisName: this.gService.globalGSAnalysis.analysisName,
        //    datasetName: this.gService.globalGSDataset.entityName,
        //    sessionKey: this._session.getToken()
        //});
        //this.gService.saveChart(_content).subscribe(res => {
        //    if (res.statusCode == 1) {
        //        abp.notify.success("Analysis Saved Successfully.");
        //        this.gService.globalGSAnalysis = null;
        //        this.gService.globalGSCharts = null;
        //        this.gService.globalGSDataset = null;
        //        this.buttonText = "NEXT";
        //        this.stepNumber = 1;
        //        this.datasetStage = 1;
        //        this.analysisStage = 3;
        //    } else abp.notify.error("Unable to save analysis.");
        //});
    }
}