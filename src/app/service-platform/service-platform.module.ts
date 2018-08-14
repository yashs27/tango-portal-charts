import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { AppRoutingModule } from "../app-routing.module";
import { AngularMaterialModule } from "../angular-material/angular-material.module";
import { SharedModule } from "../shared/shared.module";

import { ServicePlatformService } from "./service-platform.service";

import { PackagesComponent } from "./packages/packages.component";
import { PackagesDetailComponent } from "./packages-detail/packages-detail.component";
import { SpNetworkServicesComponent } from "./sp-network-services/sp-network-services.component";
import { SpNetworkServicesDetailComponent } from "./sp-network-services-detail/sp-network-services-detail.component";
import { FunctionsComponent } from "./functions/functions.component";
import { FunctionsDetailComponent } from "./functions-detail/functions-detail.component";
import { PlacementPolicyComponent } from "./placement-policy/placement-policy.component";
import { RuntimePoliciesComponent } from "./runtime-policies/runtime-policies.component";
import { RuntimePolicyBindDialogComponent } from "./runtime-policy-bind-dialog/runtime-policy-bind-dialog.component";
import { RuntimePoliciesDetailComponent } from "./runtime-policies-detail/runtime-policies-detail.component";
import { RuntimePoliciesCreateComponent } from "./runtime-policies-create/runtime-policies-create.component";
import { SlaTemplatesComponent } from "./sla-templates/sla-templates.component";
import { SlaTemplatesDetailComponent } from "./sla-templates-detail/sla-templates-detail.component";
import { SlaTemplatesCreateComponent } from "./sla-templates-create/sla-templates-create.component";
import { SlaAgreementsComponent } from "./sla-agreements/sla-agreements.component";
import { SlaAgreementsDetailComponent } from "./sla-agreements-detail/sla-agreements-detail.component";
import { SlaViolationsComponent } from "./sla-violations/sla-violations.component";
import { SlicesTemplatesComponent } from "./slices-templates/slices-templates.component";
import { SlicesTemplatesDetailComponent } from "./slices-templates-detail/slices-templates-detail.component";
import { SlicesInstancesComponent } from "./slices-instances/slices-instances.component";
import { SlicesInstancesDetailComponent } from "./slices-instances-detail/slices-instances-detail.component";
import { SlicesInstancesCreateComponent } from "./slices-instances-create/slices-instances-create.component";

@NgModule({
  declarations: [
    PackagesComponent,
    PackagesDetailComponent,
    SpNetworkServicesComponent,
    SpNetworkServicesDetailComponent,
    FunctionsComponent,
    FunctionsDetailComponent,
    PlacementPolicyComponent,
    RuntimePoliciesComponent,
    RuntimePolicyBindDialogComponent,
    RuntimePoliciesDetailComponent,
    RuntimePoliciesCreateComponent,
    SlaTemplatesComponent,
    SlaTemplatesDetailComponent,
    SlaTemplatesCreateComponent,
    SlaAgreementsComponent,
    SlaAgreementsDetailComponent,
    SlaViolationsComponent,
    SlicesTemplatesComponent,
    SlicesTemplatesDetailComponent,
    SlicesInstancesComponent,
    SlicesInstancesDetailComponent,
    SlicesInstancesCreateComponent
  ],
  entryComponents: [RuntimePolicyBindDialogComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ],
  providers: [ServicePlatformService]
})
export class ServicePlatformModule {}
