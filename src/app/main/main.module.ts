import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { routing } from './main-routing.module'
import { MainComponent } from './main.component'
import { DashboardComponent } from './dashboard/dashboard.component';
import { ModalModule, TabsModule, TooltipModule } from 'ng2-bootstrap';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { GSFBComponent } from './getting-started/facebook-dataset.component';
import { GSRSSComponent } from './getting-started/rss.component';
import { GSCSVComponent } from './getting-started/delimit-file.component';
import { GSExcelComponent } from './getting-started/excel-dataset.component';
import { GSClassificationComponent } from './getting-started/classification.component';
import { GSClusteringComponent } from './getting-started/clustering.component';
import { GSFrequencyAnalysisComponent } from './getting-started/frequency-analysis.component';
import { GSCorrelationComponent } from './getting-started/correlation-analysis.component';
import { GSSentimentDetectionComponent } from './getting-started/sentiment-detection.component';
import { DataSetComponent } from './getting-started/dataset.component';
import { GettingStartedComponent } from './getting-started/getting-started.component';
import { GSTwitterDatasetComponent } from './getting-started/twitter-dataset.component';
import { CreateRDBMSComponent } from './dataset/rdbms/create-rdbms.component';
import { CreateRSSComponent } from './dataset/create-rss.component';
import { CreateEXCELComponent } from './dataset/Excel/create-excel.component';
import { CreateWorksapceComponent } from './workspaces/create-workspace.component';
import { CreateCSVComponent } from './dataset/create-delimitedfile.component';
import { ExploreDatasetComponent } from './dataset/explore-dataset.component';
import { DatasetListComponent } from './dataset/dataset-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ModelListComponent } from './model/model-list.component';
import { AnalysisListComponent } from './analysis/analysis-list.component';
import { FBComponent } from './dataset/facebook/create-facebook.component';
import { ConfigureAnalysisComponent } from './analysis/configure-analysis.component';
import { SubFacebookDatasetComponent } from './dataset/facebook/facebook-sub-dataset.component';
import { TokenFacebookDatasetComponent } from './dataset/facebook/facebook-token.component';
import { TwitterDatasetComponent } from './dataset/twitter/create-twitter.component';
import { SubTwitterDatasetComponent } from './dataset/twitter/twitter-sub-dataset.component';
import { TokenTwitterDatasetComponent } from './dataset/twitter/twitter-token.component';
import { SubRDBMSComponent } from './dataset/rdbms/rdbms-subdataset.component';
import { WorkspaceListComponent } from './workspaces/workspace-list.component';
import { chartComponent } from './getting-started/chart.component';

import { piechartComponent } from './all-charts/pie-chart';
import { chartRootComponent } from './all-charts/chart-root1';
import { twitterDashboardTemplateComponent } from './all-charts/twitterDashboardTemplate';
import { donutChartComponent } from './all-charts/donut-chart';
import { columnChartComponent } from './all-charts/column-chart';
import { chordDiagramComponent } from './all-charts/chord-chart';
import { barChartComponent } from './all-charts/bar-chart';
import { wordcloudComponent } from './all-charts/word-chart';
import { SubExcelDatasetComponent } from './dataset/Excel/excel-sub-dataset.component';
import { DashboardListComponent } from './dashboard/dashboard-list.component';
import { SamplerComponent } from './analysis/property-pane/sampler.component';
import { CleanserComponent } from './analysis/property-pane/cleanser.component';
import { ModelComponent } from './analysis/property-pane/model.component';
import { FunctionComponent } from './analysis/property-pane/function.component';
import { WriterDatasetComponent } from './analysis/property-pane/writer.component';
import { ReaderDatasetComponent } from './analysis/property-pane/reader.component';
import { BlankComponent } from './analysis/property-pane/blank.component';
import { CreateDashboardComponent } from './dashboard/create-dashboard.component';
import { InroductionComponent } from './dashboard/Introduction';
import { LayoutComponent } from './dashboard/Layout-selection';
import { DashboardStylingComponent } from './dashboard/Dashboard-styling';
import { CreateModelAnalysisComponent } from './model/create-model-analysis-studio';
import { DashboardPieComponent } from './dashboard/create-pie-dash';
import { DashboardDonutComponent } from './dashboard/create-donut-dash';
import { DashboardChordComponent } from './dashboard/create-chord-dash';
import { DashboardLineComponent } from './dashboard/create-line-dash';
import { DashboardVerticalBarComponent } from './dashboard/create-verticalbar-dash';
import { DashboardHorizontalBarComponent } from './dashboard/create-horizontalbar-dash';
import { DashboardWordComponent } from './dashboard/create-word-dash';
import { scheduledDashboardcomponent } from './dashboard/scheduled-dashboard.component';
import { ModelReaderDatasetComponent } from './model/Model properties/model-reader.component';
import { modelcleanserComponent } from './model/Model properties/Model-Cleanser.component';
import { ModelSamplerComponent } from './model/Model properties/Model-Sampler.Component';
import { ModelFunctionComponent } from './model/Model properties/Model-Function.Component';
import { ModelTrainValidateComponent } from './model/Model properties/Model-TrainValidate.component';
import { ModelAnalysisComponent } from './model/Model properties/Model-Model.component';
import { ChartResultComponent } from './analysis/chartResult-component';
import { LineChartComponent } from './all-charts/line-chart';
import { DashboardListConfiguration } from './dashboard/dashboard-configuration.component';
import { DashboardTitleConfiguration } from './dashboard/dashboard-title-configuration';
import { DashboardTitleConfiguration7 } from './dashboard/dashboard-title-configuration7';
import { DashboardStudioComponent } from './dashboard/create-dashboard-studio';
import { CustomDasboardComponent } from './dashboard/custom-dashboard.component';
import { UseCaseComponent } from './dashboard/use-cases.component';
import { IotDashboardComponent } from './dashboard/iot-dashboard.component';
import { WealthManagementComponent } from './dashboard/wealth-management.component';
import { NavigatorDashboardComponent } from './dashboard/navigator-dashboard.component';
import { PreviewDashBoard } from './dashboard/previewDash.component';
import { ResetPasswordComponent } from '../../account/password/reset-password.component';
import { DemoDashboard } from './dashboard/DemoDashboard.component';
@NgModule({
    imports: [
        CommonModule,
        routing,
        BrowserModule,
        FormsModule,
        ModalModule,
        TabsModule,
        TooltipModule,
        AppCommonModule,
        UtilsModule,
        ReactiveFormsModule,
    ],
    declarations: [
        DemoDashboard,
        ResetPasswordComponent,
        PreviewDashBoard,
        MainComponent,
        DashboardComponent,
        DataSetComponent,
        ModelListComponent,
        AnalysisListComponent,
        TwitterDatasetComponent,
        GSFBComponent,
        GSRSSComponent,
        GSCSVComponent,
        GSExcelComponent,
        GSClassificationComponent,
        GSClusteringComponent,
        GSSentimentDetectionComponent,
        GSFrequencyAnalysisComponent,
        GSCorrelationComponent,
        GSTwitterDatasetComponent,
        DatasetListComponent,
        CreateEXCELComponent,
        CreateRSSComponent,
        ExploreDatasetComponent,
        CreateRDBMSComponent,
        CreateCSVComponent,
        DataSetComponent,
        ConfigureAnalysisComponent,
        GettingStartedComponent,
        CreateWorksapceComponent,
        FBComponent,
        SubTwitterDatasetComponent,
        TokenTwitterDatasetComponent,
        SubFacebookDatasetComponent,
        TokenFacebookDatasetComponent,
        SubRDBMSComponent,
        WorkspaceListComponent,
        chartComponent,
        SubExcelDatasetComponent,
        chartRootComponent,
        twitterDashboardTemplateComponent,
        piechartComponent,
        donutChartComponent,
        chordDiagramComponent,
        wordcloudComponent,
        DashboardListComponent,
        LineChartComponent,
        SamplerComponent,
        CleanserComponent,
        ModelComponent,
        FunctionComponent,
        WriterDatasetComponent,
        ReaderDatasetComponent,
       // BlankComponent,
        ModelReaderDatasetComponent,
        ModelSamplerComponent,
        modelcleanserComponent,
        ModelFunctionComponent,
        ModelTrainValidateComponent,
        ModelAnalysisComponent,
        CreateModelAnalysisComponent,
        CreateDashboardComponent,
        //piechartComponent12,
        barChartComponent,
        columnChartComponent,
        InroductionComponent,
        LayoutComponent,
        DashboardStylingComponent,
        //PollingComponent,

        DashboardPieComponent,
        DashboardDonutComponent,
        DashboardChordComponent,
        DashboardLineComponent,
        DashboardVerticalBarComponent,
        DashboardHorizontalBarComponent,
        DashboardWordComponent,

        ChartResultComponent,

        CreateModelAnalysisComponent,
        scheduledDashboardcomponent,
        DashboardListConfiguration,
        DashboardTitleConfiguration,
        DashboardTitleConfiguration7,

        DashboardStudioComponent,
        CustomDasboardComponent,
        UseCaseComponent,
        IotDashboardComponent,
        WealthManagementComponent,
        NavigatorDashboardComponent
       

    ],
    exports: [ReaderDatasetComponent,
    ModelReaderDatasetComponent,
        SamplerComponent,
        CleanserComponent,
        ModelComponent,
        FunctionComponent,
        WriterDatasetComponent]
})
export class MainModule { }