import { NgModule } from '@angular/core';

import * as ApiServiceProxies from './service-proxies';
import * as ApiServiceProxiesPrats from '../../app/main/dashboard/posts.service';
import * as IdsServiceProxies from './ids-service-proxies';
import * as IdsAnalysisServiceProxies from './ids-analysis-service-proxies';
import * as IdsModelServiceProxies from './ids-model-service-proxies';
import * as IdsdashboardServiceProxies from './ids-dashboard-service-proxies';
import * as IdsWorksPaceServiceProxies from './ids-workspace-service-proxies';
import { LoginService } from '../../account/login/login.service';

@NgModule({
    providers: [
        ApiServiceProxies.AuditLogServiceProxy,
        ApiServiceProxies.CachingServiceProxy,
        ApiServiceProxies.ChatServiceProxy,
        ApiServiceProxies.CommonLookupServiceProxy,
        ApiServiceProxies.EditionServiceProxy,
        ApiServiceProxies.FriendshipServiceProxy,
        ApiServiceProxies.HostSettingsServiceProxy,
        ApiServiceProxies.LanguageServiceProxy,
        ApiServiceProxies.NotificationServiceProxy,
        ApiServiceProxies.OrganizationUnitServiceProxy,
        ApiServiceProxies.PermissionServiceProxy,
        ApiServiceProxies.ProfileServiceProxy,
        ApiServiceProxies.RoleServiceProxy,
        ApiServiceProxies.SessionServiceProxy,
        ApiServiceProxies.TenantServiceProxy,
        ApiServiceProxies.TenantDashboardServiceProxy,
        ApiServiceProxies.TenantSettingsServiceProxy,
        ApiServiceProxies.TimingServiceProxy,
        ApiServiceProxies.UserServiceProxy,
        ApiServiceProxies.UserLinkServiceProxy,
        ApiServiceProxies.UserLoginServiceProxy,
        ApiServiceProxies.WebLogServiceProxy,
        ApiServiceProxies.AccountServiceProxy,
        ApiServiceProxies.TokenAuthServiceProxy,
        ApiServiceProxiesPrats.PostService,
        IdsServiceProxies.AccountService,
        IdsServiceProxies.DashboardService,
        IdsServiceProxies.DatasetService,
        IdsServiceProxies.ModelService,
        IdsServiceProxies.GettingStartedService,
        IdsServiceProxies.PassService,
        IdsServiceProxies.AnalysisService,
        IdsServiceProxies.LoadingService,
        IdsWorksPaceServiceProxies.WorkspaceService,
        IdsAnalysisServiceProxies.AnalysisService,
        IdsAnalysisServiceProxies.AnalysisStudioConfig,
        IdsModelServiceProxies.ModelService,
        IdsModelServiceProxies.ModelStudioConfig,
        IdsdashboardServiceProxies.DashboardService,
        IdsdashboardServiceProxies.DashboardStudioConfig,
        IdsdashboardServiceProxies.customDashboardParameters,
        LoginService,

    ]
})
export class ServiceProxyModule { }
