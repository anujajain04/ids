import { Component, Input, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { GSDatasetDto, ChartType, GettingStartedService, PieChartOptions, ChordChartOptions, WorldCloudOptions, ChordChart, Pie, GSAnalysisChart, AnalysisDto, TempBaseUrl } from '@shared/service-proxies/ids-service-proxies';
import { ActivatedRoute, Router } from '@angular/router';
//declare var chart:any;
@Component({
    
    selector: 'chart-root',
    templateUrl: './chart.component.html',
    animations: [appModuleAnimation()]
})
export class chartComponent implements OnInit {
    gsDataset: any;
    gsAnalysis: AnalysisDto;
    finalChart: GSAnalysisChart; 
    chartNumber: number;
    chartData: any;
    labelData: any;
    private height: number;
    protected jsonParseReviver: (key: string, value: any) => any = undefined;
    constructor(private gService: GettingStartedService) {
        this.chartNumber = 0;
        this.gsDataset = gService.globalGSDataset;
        this.gsAnalysis = gService.globalGSAnalysis;
        this.finalChart = gService.globalGSCharts;
    }
    ngOnInit() {
        //this.chartNumber = 2;
        debugger;
        this.height = window.innerHeight - 62;
        if (this.finalChart !== undefined) {
            if (this.finalChart.type === ChartType.WORD) {
                let Stats: Pie[] = [];
                //let word: WorldCloudOptions = this.finalChart.chartSpecificOptions;
                for (let p of this.finalChart.chartData) {
                    let f: Pie = { label: p.word, measure: (+p.size) - ((+p.size)*50/100) };
                    Stats.push(f);
                }
                this.chartData = Stats;
                this.chartNumber = 1;
            }
            else if (this.finalChart.type === ChartType.CHORD) {
                //let chord: ChordChartOptions = this.finalChart.chartSpecificOptions;
                for (let c of this.finalChart.chartData) {
                    this.chartData = c;
                }
                
                this.chartNumber = 2;
            }
            else if (this.finalChart.type === ChartType.PIE) {
                let Stats: Pie[] = [];
                //let pie: PieChartOptions = this.finalChart.chartSpecificOptions;
                for (let p of this.finalChart.chartData) {
                    let f: Pie = { label: p.label, measure: +p.measure };
                    Stats.push(f);
                }
                this.chartData = Stats;
                this.chartNumber = 3;
            }
        }
    }
}
