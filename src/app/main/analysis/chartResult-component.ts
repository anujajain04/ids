import { Component, Input, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ActivatedRoute, Router } from '@angular/router';

import { ChartType, PieChartOptions, ChordChartOptions, WorldCloudOptions, ChordChart, Pie, Donut, AnalysisChart, AnalysisService } from '@shared/service-proxies/ids-analysis-service-proxies';
import { TempBaseUrl, LoadingService } from '@shared/service-proxies/ids-service-proxies';
//import { CreateAnalysisComponent } from './create-analysis-studio';
@Component({
    selector: 'chart-result',
    templateUrl: './chartResult-component.html',
    animations: [appModuleAnimation()]
})
export class ChartResultComponent {

    gsDataset: any;
    //gsAnalysis: AnalysisDto;
    finalChart: AnalysisChart = new AnalysisChart();
    chartNumber: number;
    chartData: any;
    labelData: any;
    key: string;
    private height: number;
    protected jsonParseReviver: (key: string, value: any) => any = undefined;
    constructor(private aService: AnalysisService, route: ActivatedRoute, private load: LoadingService) {
        debugger;
        this.key = route.snapshot.params['key'];
        this.chartNumber = 0;
        //if (this.key !== undefined && this.key !== null && this.key !== "") {
        try {
            this.getChartData();
        } catch (e) {
            console.error("Chart");
        }
        // }
        //this.gsDataset = gService.globalGSDataset;
        //this.gsAnalysis = gService.globalGSAnalysis;
        //this.finalChart = gService.globalGSCharts;

    }
    ngOnInit() {
        this.height = window.innerHeight - 42;
    }
    getChartData() {
        //this.key = "24b1e2e3-e7e2-489e-a463-75faf6eea2f8";
      this.load.start()
        this.aService.getChartForAnalysis(this.key).subscribe(res => {
            debugger;
            this.finalChart = res;
            this.showChart();
            this.load.stop()
        });
    }
    showChart() {
        if (this.finalChart !== undefined) {
            if (this.finalChart.chartJson.type === ChartType.WORD) {
                let Stats: Pie[] = [];
                //let word: WorldCloudOptions = this.finalChart.chartSpecificOptions;
                for (let p of this.finalChart.chartJson.chartData) {
                    let f: Pie = { label: p.word, measure: (+p.size) - ((+p.size) * 50 / 100) };
                    Stats.push(f);
                }
                this.chartData = Stats;
                this.chartNumber = 1;
            }
            else if (this.finalChart.chartJson.type === ChartType.CHORD) {
                //let chord: ChordChartOptions = this.finalChart.chartSpecificOptions;
                for (let c of this.finalChart.chartJson.chartData) {
                    this.chartData = c;
                }

                this.chartNumber = 2;
            }
            else if (this.finalChart.chartJson.type === ChartType.PIE) {
                let Stats: Pie[] = [];
                //let pie: PieChartOptions = this.finalChart.chartSpecificOptions;
                for (let p of this.finalChart.chartJson.chartData) {
                    let f: Pie = { label: p.label, measure: +p.measure };
                    Stats.push(f);
                }
                this.chartData = Stats;
                this.chartNumber = 3;
            }

            else if (this.finalChart.chartJson.type === ChartType.DONUT) {
                let Stats: Donut[] = [];
                for (let b of this.finalChart.chartJson.chartData) {
                    let f: Donut = { name: b.name, count: +b.count, percentage: +b.percentage, color: +b.color };
                    Stats.push(f);
                }
                this.chartData = Stats;
                this.chartNumber = 4;
            }
            else if (this.finalChart.chartJson.type === ChartType.LINE) {
                for (let l of this.finalChart.chartJson.chartData) {
                    this.chartData = l;
                }
                this.chartNumber = 5;
            }
            else if (this.finalChart.chartJson.type === ChartType.BAR) {
                let Stats: Pie[] = [];
                for (let b of this.finalChart.chartJson.chartData) {
                    let f: Pie = { label: b.label, measure: +b.value };
                    Stats.push(f);
                }
                this.chartData = Stats;
                this.chartNumber = 6;
            }
            else if (this.finalChart.chartJson.type === ChartType.HORIZONTALBAR) {
                let Stats: Pie[] = [];
                for (let b of this.finalChart.chartJson.chartData) {
                    let f: Pie = { label: b.letter, measure: +b.frequency };
                    Stats.push(f);
                }
                this.chartData = Stats;
                this.chartNumber = 7;
            }

        }
    }
}