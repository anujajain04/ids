import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthRouteGuard } from '@app/shared/common/auth/auth-route-guard';
import { TwitterDatasetComponent } from './dataset/twitter/create-twitter.component';
import { CreateRDBMSComponent } from './dataset/rdbms/create-rdbms.component';
import { CreateRSSComponent } from './dataset/create-rss.component';
import { FBComponent } from './dataset/facebook/create-facebook.component';
import { CreateEXCELComponent } from './dataset/Excel/create-excel.component';
import { DatasetListComponent } from './dataset/dataset-list.component';
import { ExploreDatasetComponent } from './dataset/explore-dataset.component';
import { CreateCSVComponent } from './dataset/create-delimitedfile.component';
import { DataSetComponent } from './getting-started/dataset.component';
import { ModelListComponent } from './model/model-list.component';
import { WorkspaceListComponent } from './workspaces/workspace-list.component';
import { CreateWorksapceComponent } from './workspaces/create-workspace.component';
import { AnalysisListComponent } from './analysis/analysis-list.component';
import { GettingStartedComponent } from './getting-started/getting-started.component';
import { SubTwitterDatasetComponent } from './dataset/twitter/twitter-sub-dataset.component';
import { TokenTwitterDatasetComponent } from './dataset/twitter/twitter-token.component';
import { SubFacebookDatasetComponent } from './dataset/facebook/facebook-sub-dataset.component';
import { TokenFacebookDatasetComponent } from './dataset/facebook/facebook-token.component';
import { SubRDBMSComponent } from './dataset/rdbms/rdbms-subdataset.component';
import { chartComponent } from './getting-started/chart.component';
import { SubExcelDatasetComponent } from './dataset/Excel/excel-sub-dataset.component';
import { CreateAnalysisComponent } from './analysis/create-analysis-studio';
//import { CreateModelAnalysisComponent } from './model/create-model-analysis-studio';
import { DashboardListComponent } from './dashboard/dashboard-list.component';
import { CreateDashboardComponent } from './dashboard/create-dashboard.component';
import { scheduledDashboardcomponent } from './dashboard/scheduled-dashboard.component';
import { CreateModelAnalysisComponent } from './model/create-model-analysis-studio';
import { LineChartComponent } from './all-charts/line-chart';
import { DashboardListConfiguration } from './dashboard/dashboard-configuration.component';
import { DashboardTitleConfiguration } from './dashboard/dashboard-title-configuration';
import { DashboardTitleConfiguration7 } from './dashboard/dashboard-title-configuration7';
import { ChartResultComponent } from './analysis/chartResult-component';


import { DashboardStudioComponent } from './dashboard/create-dashboard-studio';
import { CustomDasboardComponent } from './dashboard/custom-dashboard.component';
import { UseCaseComponent } from './dashboard/use-cases.component';
import { IotDashboardComponent } from './dashboard/iot-dashboard.component';
import { WealthManagementComponent } from './dashboard/wealth-management.component';
import { NavigatorDashboardComponent } from './dashboard/navigator-dashboard.component';
import { PreviewDashBoard } from './dashboard/previewDash.component';
import { DemoDashboard } from './dashboard/DemoDashboard.component';

//import { twitterDashboardTemplateComponent } from './all-charts/twitterDashboardTemplate';
//import { ResetPasswordComponent } from '../../account/password/reset-password.component';


const routes: Routes = [
    {
                path: '',
                component: MainComponent,
                canActivateChild: [AuthRouteGuard],
                children: [  
                    //{ path: 'dash-studio', component: DashboardStudioComponent, data: { breadcrumb: "Dashboard" } },
                    //{ path: 'dash-studio/:key', component: DashboardStudioComponent, data: { breadcrumb: "Dashboard" } },
                    //{ path: 'reset-password', component: ResetPasswordComponent, data: { breadcrumb: "Reset Password" } },
                   
                    { path: 'previewDashboard/:key', component: PreviewDashBoard, data: { breadcrumb: "previewDashboard" } },
                    { path: 'dashboard', component: DashboardListComponent, data: { breadcrumb: "Dashboard" } },
                    { path: 'dashboard/:key', component: DashboardComponent, data: { breadcrumb: "Dashboard" } },
                    //{ path: 'dashboard', component: DashboardComponent, data: { breadcrumb: "Dashboard" } },
                    { path: 'analysis', component: AnalysisListComponent, data: { breadcrumb: "Analysis"} },
                    { path: 'model', component: ModelListComponent, data: { breadcrumb: "Model" } },
                    { path: 'dataset', component: DatasetListComponent, data: { breadcrumb: "Dataset Channel" } },
                    { path: 'create_analysis/:parent/:key', component: CreateAnalysisComponent, data: { breadcrumb: "Configure Analysis" } },
                    { path: 'create_analysis/:parent', component: CreateAnalysisComponent, data: { breadcrumb: "Configure Analysis" } },
                    { path: 'create_analysis', component: CreateAnalysisComponent, data: { breadcrumb: "Configure Analysis" } },
                    { path: 'CreateModel/:key', component: CreateModelAnalysisComponent, data: { breadcrumb: "Configure Model"} },
                    { path: 'workspaces', component: WorkspaceListComponent, data: { breadcrumb: "Workspaces" } },
                    { path: 'getting-started', component: DataSetComponent, data: { breadcrumb: "Getting-started" } },
                    { path: 'create_twitter/:key', component: TwitterDatasetComponent, data: { breadcrumb: "Configure Twitter"} },
                    { path: 'create_twitter', component: TwitterDatasetComponent, data: { breadcrumb: "Configure Twitter"} },
                    { path: 'create_excel/:key', component: CreateEXCELComponent, data: { breadcrumb: "Configure Excel"} },
                    { path: 'create_excel', component: CreateEXCELComponent, data: { breadcrumb: "Create Excel"} },
                    { path: 'create_fb/:key', component: FBComponent, data: { breadcrumb: "Configure Facebook"} },
                    { path: 'create_fb', component: FBComponent, data: { breadcrumb: "Configure Facebook"} },
                    { path: 'create_csv/:key', component: CreateCSVComponent, data: { breadcrumb: "Configure Csv"} },
                    { path: 'create_rss/:key', component: CreateRSSComponent, data: { breadcrumb: "Configure Rss" } },
                    { path: 'create_rdbms/:key', component: CreateRDBMSComponent, data: { breadcrumb: "Configure Rdbms"} },
                    { path: 'create_rdbms', component: CreateRDBMSComponent, data: { breadcrumb: "Configure Rdbms"} },
                    { path: 'explore_dataset/:key', component: ExploreDatasetComponent, data: { breadcrumb: "Explore Dataset"} },
                    { path: 'dataset/:key', component: DataSetComponent, data: { breadcrumb: "dataset" } },
                    { path: 'createworkspaces', component: CreateWorksapceComponent, data: { breadcrumb: "Create Workspaces" } },
                    { path: 'createworkspaces/:key', component: CreateWorksapceComponent, data: { breadcrumb: "Create Workspaces"} },
                    { path: 'getting-started', component: GettingStartedComponent, data: { breadcrumb: "Getting Started"} },
                    { path: 'sub-twitter', component: SubTwitterDatasetComponent, data: { breadcrumb: "Twitter Sub Dataset"} },
                    { path: 'token-twitter', component: TokenTwitterDatasetComponent, data: { breadcrumb: "Token Twitter"} },
                    { path: 'sub-facebook', component: SubFacebookDatasetComponent, data: { breadcrumb: "Facebook Sub Dataset"} },
                    { path: 'token-facebook', component: TokenFacebookDatasetComponent, data: { breadcrumb: "Token Facebook"} },
                    { path: 'sub-rdbms', component: SubRDBMSComponent, data: { breadcrumb: "Rdbms Sub Dataset"} },
                    { path: 'gochart', component: chartComponent, data: { breadcrumb: "Chart"} },
                    { path: 'sub-Excel', component: SubExcelDatasetComponent, data: { breadcrumb: "Excel Sub Dataset"} },
                    { path: 'dashlist', component: DashboardListComponent, data: { breadcrumb: "Dashboard List"} },
                    { path: 'createdash', component: CreateDashboardComponent, data: { breadcrumb: "Configure Dashboard"} },
                    { path: 'editdash/:key', component: CreateDashboardComponent, data: { breadcrumb: "Edit Dashboard"} },
                    { path: 'scheduled-dash', component: scheduledDashboardcomponent, data: { breadcrumb: "Schedule Dashboard"} },
                    //{ path: 'scheduled-dash/:key', component: scheduledDashboardcomponent, data: {} },
                    { path: 'CreateModel', component: CreateModelAnalysisComponent, data: { breadcrumb: "Configure Model"} },
                    { path: 'createanalysis', component: CreateAnalysisComponent, data: { breadcrumb: "Configure Analysis"}},
                    //{ path: 'polling', component: PollingComponent, data: {} },
                    //{ path: 'CreateModel', component: CreateModelAnalysisComponent, data: {} },
                    { path: 'home-dash', component: DashboardListConfiguration, data: {} },
                    { path: 'dash-title-config/:key', component: DashboardTitleConfiguration, data: {} },
                    { path: 'dash-title-config7', component: DashboardTitleConfiguration7, data: {} },
                    { path: 'create-dashStudio', component: DashboardStudioComponent, data: { breadcrumb:"Create Dashboard"} },
                    { path: 'create-dashStudio/:key', component: DashboardStudioComponent, data: {} },
                    { path: 'chart-result', component: ChartResultComponent, data: { breadcrumb: "Chart Result"} },
                    { path: 'chart-result/:key', component: ChartResultComponent, data: { breadcrumb: "Chart Result"} },

                    { path: 'customDashboard', component: CustomDasboardComponent, data: { breadcrumb: "Custom Dashboard"} },
                    { path: 'useCases', component: UseCaseComponent, data: { breadcrumb: "Use Cases"} },
                    { path: 'iot', component: IotDashboardComponent, data: { breadcrumb: "IOT"} },
                    { path: 'wealthManagemant', component: WealthManagementComponent, data: { breadcrumb: "Wealth Managemant"} },
                    { path: 'navigatorDashboard', component: NavigatorDashboardComponent, data: { breadcrumb: "Navigator Dashboard" } },
                    { path: 'demodashboard', component: DemoDashboard,data: { breadcrumb: "Navigator Dashboard" }} 
                    
                   
                ]
            }
     
]
export const routing: ModuleWithProviders = RouterModule.forRoot(routes);