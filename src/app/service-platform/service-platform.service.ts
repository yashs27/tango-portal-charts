import { Injectable } from "@angular/core";
import { ConfigService } from "../shared/services/config/config.service";
import { AuthService } from "../authentication/auth.service";

import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class ServicePlatformService {
  authHeaders: HttpHeaders;
  request_uuid: string;
  // pagination: string = "?page_size=20&page_number=1";

  constructor(
    private authService: AuthService,
    private config: ConfigService,
    private http: HttpClient
  ) {}

  /**
   * Retrieves a list of Packages.
   * Either following a search pattern or not.
   *
   * @param search [Optional] Packages attributes that must be
   *                          matched by the returned list of
   *                          packages.
   */
  getPackages(search?): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      let url =
        search != undefined
          ? this.config.baseSP + this.config.packages + search
          : this.config.baseSP + this.config.packages;

      this.http
        .get(url, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          if (response instanceof Array) {
            resolve(
              response.map(item => {
                return {
                  uuid: item.uuid,
                  name: item.pd.name,
                  vendor: item.pd.vendor,
                  createdAt: item.created_at,
                  version: item.pd.version,
                  type: "public"
                };
              })
            );
          } else {
            reject();
          }
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Retrieves a Package by UUID
   *
   * @param uuid UUID of the desired Package.
   */
  getOnePackage(uuid: string): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      this.http
        .get(this.config.baseSP + this.config.packages + "/" + uuid, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          resolve({
            uuid: response["uuid"],
            name: response["pd"]["name"],
            author: response["pd"]["maintainer"],
            createdAt: response["created_at"],
            vendor: response["pd"]["vendor"],
            version: response["pd"]["version"],
            type: "public",
            package_file_id: response["package_file_id"]
          });
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Retrieves a list of Functions.
   * Either following a search pattern or not.
   *
   * @param search [Optional] Packages attributes that must be
   *                          matched by the returned list of
   *                          packages.
   */
  getFunctions(search?): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      let url =
        search != undefined
          ? this.config.baseSP + this.config.functions + search
          : this.config.baseSP + this.config.functions;

      this.http
        .get(url, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          if (response instanceof Array) {
            resolve(
              response.map(item => {
                return {
                  uuid: item.uuid,
                  name: item.vnfd.name,
                  vendor: item.vnfd.vendor,
                  status: item.status,
                  version: item.vnfd.version,
                  type: "public"
                };
              })
            );
          } else {
            reject();
          }
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Retrieves a Function by UUID
   *
   * @param uuid UUID of the desired Function.
   */
  getOneFunction(uuid: string): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      this.http
        .get(this.config.baseSP + this.config.functions + "/" + uuid, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          resolve({
            uuid: response["uuid"],
            name: response["vnfd"]["name"],
            author: response["vnfd"]["author"],
            createdAt: response["created_at"],
            updatedAt: response["updated_at"],
            vendor: response["vnfd"]["vendor"],
            version: response["vnfd"]["version"],
            type: "public",
            status: response["status"],
            description: response["vnfd"]["description"]
          });
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Retrieves a SLA Template by UUID
   *
   * @param uuid UUID of the desired SLA Template.
   */
  getOneSLATemplate(uuid): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      this.http
        .get(this.config.baseSP + this.config.slaTemplates + "/" + uuid, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          resolve({
            uuid: response["uuid"],
            name: response["slad"]["name"],
            author: response["slad"]["author"],
            createdAt: response["created_at"],
            expirationDate: new Date(
              Date.parse(response["slad"]["sla_template"]["valid_until"])
            ),
            ns: response["slad"]["sla_template"]["ns"]["ns_name"],
            storedGuarantees:
              response["slad"]["sla_template"]["ns"]["guaranteeTerms"]
          });
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Retrieves a list with all the service guarantees
   */
  getServiceGuarantees(): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();

      this.http
        .get(this.config.baseSP + this.config.guarantees, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          resolve(response["guaranteeTerms"]);
        })
        .catch(err => {
          reject(err.statusText);
        });
    });
  }

  /**
   * Creates a new SLA Template.
   *
   * @param template Object containing the nsd_uuid, guaranteeId, expireDate
   *                 and templateName for the creation of a new template.
   */
  postOneSLATemplate(template): any {
    return new Promise((resolve, reject) => {
      this.http
        .post(
          this.config.baseSP + this.config.slaTemplates,
          this.urlEncode(template),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .toPromise()
        .then(response => {
          resolve();
        })
        .catch(err => reject(err));
    });
  }

  urlEncode(obj: Object): string {
    let str: string = "";
    Object.keys(obj).forEach(key => {
      if (obj[key] instanceof Array) {
        obj[key].forEach(item => {
          str +=
            (str.length > 0 ? "&" : "") +
            encodeURI(key) +
            "=" +
            encodeURI(item);
        });
      } else {
        str +=
          (str.length > 0 ? "&" : "") +
          encodeURI(key) +
          "=" +
          encodeURI(obj[key]);
      }
    });
    return str;
  }

  /**
   * Removes the specified template from the database
   *
   * @param uuid UUID of the desired SLA Template.
   */
  deleteOneSLATemplate(uuid: string): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();

      this.http
        .delete(this.config.baseSP + this.config.slaTemplates + "/" + uuid, {
          headers: headers,
          responseType: "text"
        })
        .toPromise()
        .then(response => {
          resolve();
        })
        .catch(err => {
          reject(err.statusText);
        });
    });
  }

  /**
   * Retrieves a list of SLA Agreements.
   * Either following a search pattern or not.
   *
   * @param search [Optional] Agreement attributes that must be
   *                          matched by the returned list of
   *                          SLA Agreements.
   */
  getSLAAgreements(search?): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      let url =
        search != undefined
          ? this.config.baseSP + this.config.slaAgreements + search
          : this.config.baseSP + this.config.slaAgreements;

      this.http
        .get(url, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          resolve(
            response["agreements"].map(item => {
              return {
                uuid: item.sla_uuid,
                name: item.sla_name,
                ns: item.ns_name,
                ns_uuid: item.ns_uuid, //----
                customer: item.cust_email,
                date: new Date(Date.parse(item.sla_date))
                  .toISOString()
                  .replace(/T.*/, "")
                  .split("-")
                  .reverse()
                  .join("/"),
                status: item.sla_status
              };
            })
          );
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Retrieves a SLA Agreement by UUID
   *
   * @param uuid UUID of the desired SLA Agreement.
   */
  getOneSLAAgreement(sla_uuid: string, ns_uuid: string): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      this.http
        .get(
          this.config.baseSP +
            this.config.slaAgreements +
            "/" +
            sla_uuid +
            "/" +
            ns_uuid,
          {
            headers: headers
          }
        )
        .toPromise()
        .then(response => {
          resolve({
            uuid: response["uuid"],
            name: response["slad"]["name"],
            author: response["slad"]["author"],
            date: response["updated_at"],
            ns: response["slad"]["sla_template"]["ns"]["ns_name"],
            customer:
              response["slad"]["sla_template"]["customer_info"]["cust_email"],
            status: response["status"],
            propertyList:
              response["slad"]["sla_template"]["ns"]["guaranteeTerms"]
            // availability: response["availability"],
            // cost: response["cost"]
          });
        })
        .catch(err => reject(err));
    });
  }

  /**
   * Retrieves a list of SLA Violations.
   * Either following a search pattern or not.
   *
   * @param search [Optional] Violation attributes that must be
   *                          matched by the returned list of
   *                          SLA Violations.
   */
  getSLAViolations(search?): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      let url =
        search != undefined
          ? this.config.baseSP + this.config.slaViolations + search
          : this.config.baseSP + this.config.slaViolations;

      this.http
        .get(url, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          if (response instanceof Array) {
            resolve(
              response.map(item => {
                return {
                  nsInstanceUUID: item.nsi_uuid,
                  slaUUID: item.sla_uuid,
                  date: new Date(Date.parse(item.violation_time)).toUTCString(),
                  customerUUID: item.cust_uuid
                };
              })
            );
          } else {
            reject();
          }
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Retrieves a list of Runtime Policies.
   * Either following a search pattern or not.
   *
   * @param search [Optional] Policy attributes that must be
   *                          matched by the returned list of
   *                          Runtime Policies.
   */
  getRuntimePolicies(search?): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      let url =
        search != undefined
          ? this.config.baseSP + this.config.runtimePolicies + search
          : this.config.baseSP + this.config.runtimePolicies;

      this.http
        .get(url, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          if (response instanceof Array) {
            resolve(
              response.map(item => {
                return {
                  uuid: item.uuid,
                  name: item.pld.name,
                  version: item.pld.version,
                  vendor: item.pld.vendor,
                  ns: item.pld.network_service,
                  ns_uuid: item.pld.network_service,
                  date: item.updated_at,
                  default: item.pld.default_policy || false,
                  enforced: item.enforced ? "Yes" : "No"
                };
              })
            );
          } else {
            reject();
          }
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Retrieves a Runtime Policy by UUID
   *
   * @param uuid UUID of the desired Runtime Policy.
   */
  getOneRuntimePolicy(uuid: string) {
    return new Promise((resolve, reject) => {
      // let headers = this.authService.getAuthHeaders();

      // this.http
      //   .get(this.config.baseSP + this.config.runtimePolicies + "/" + uuid, {
      //     headers: headers
      //   })
      //   .toPromise()
      //   .then(response => {
      //     resolve({
      //       uuid: response["uuid"],
      //       name: response["pld"]["name"],
      //       author: response["pld"]["author"],
      //       date: response["updated_at"],
      //       nsUUID: response["pld"]["network_service"],
      //       version: response["pld"]["version"],
      //       default: response["pld"]["default_policy"] || false,
      //       enforced: response["enforced"] ? "Yes" : "No",
      //       sla: response["sla"],
      //       policyRules: [],
      //       monitoringRules: []
      //     });
      //   })
      //   .catch(err => reject(err));

      setTimeout(() => {
        resolve({
          uuid: "uuid",
          name: "name",
          author: "author",
          date: "updated_at",
          nsUUID: "b4baff48-bf3a-4b36-ada7-e2d5120ba858",
          version: "0.1",
          default: true,
          enforced: "Yes",
          sla: null,
          policyRules: [],
          monitoringRules: []
        });
      }, 500);
    });
  }

  /**
   * Generates a Runtime Policy
   *
   * @param policy Data of the desired Runtime Policy
   */
  postOneRuntimePolicy(policy): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();

      this.http
        .post(this.config.baseSP + this.config.runtimePolicies, policy, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          resolve();
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Edits a Runtime Policy
   *
   * @param uuid UUID of the desired Runtime Policy
   * @param slaid UUID of the sla template associated
   * @param defaultPolicy Boolean setting the binding with its ns
   * @param nsid UUID of the ns associated
   */
  patchRuntimePolicy(uuid, slaid, defaultPolicy, nsid) {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();

      let data = {
        slaid,
        defaultPolicy,
        nsid
      };

      this.http
        .patch(
          this.config.baseSP + this.config.runtimePolicies + "/" + uuid,
          data,
          {
            headers: headers
          }
        )
        .toPromise()
        .then(response => {
          resolve(response);
        })
        .catch(err => reject(err));
    });
  }

  /**
   * Removes the specified runtime policy from the database
   *
   * @param uuid UUID of the desired Runtime Policy.
   */
  deleteOneRuntimePolicy(uuid: string): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();

      this.http
        .delete(this.config.baseSP + this.config.runtimePolicies + "/" + uuid, {
          headers: headers,
          responseType: "text"
        })
        .toPromise()
        .then(response => {
          resolve();
        })
        .catch(err => {
          reject(err.statusText);
        });
    });
  }

  /**
   * Retrieves a list of Slices Templates.
   * Either following a search pattern or not.
   *
   * @param search [Optional] Template attributes that must be
   *                          matched by the returned list of
   *                          Slices Templates.
   */
  getSlicesTemplates(search?): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      let url =
        search != undefined
          ? this.config.baseSP + this.config.slicesTemplates + search
          : this.config.baseSP + this.config.slicesTemplates;

      this.http
        .get(url, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          if (response instanceof Array) {
            resolve(
              response.map(item => {
                return {
                  uuid: item.uuid,
                  name: item.nstd.name,
                  version: item.nstd.version,
                  vendor: item.nstd.vendor,
                  usageState: item.nstd.usageState,
                  author: item.nstd.author,
                  status: item.status
                };
              })
            );
          } else {
            reject();
          }
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Removes the specified template from the database
   *
   * @param uuid UUID of the desired Slices Template.
   */
  deleteOneSlicesTemplate(uuid: string): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();

      this.http
        .delete(this.config.baseSP + this.config.slicesTemplates + "/" + uuid, {
          headers: headers,
          responseType: "text"
        })
        .toPromise()
        .then(response => {
          resolve();
        })
        .catch(err => {
          reject(err.statusText);
        });
    });
  }

  /**
   * Retrieves a Slices Template by UUID
   *
   * @param uuid UUID of the desired Slices Template.
   */
  getOneSliceTemplate(uuid): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();

      this.http
        .get(this.config.baseSP + this.config.slicesTemplates + "/" + uuid, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          resolve({
            uuid: response["uuid"],
            status: response["status"],
            name: response["nstd"]["name"],
            author: response["nstd"]["author"],
            createdAt: response["created_at"],
            version: response["nstd"]["version"],
            vendor: response["nstd"]["vendor"],
            notificationType: response["nstd"]["notificationTypes"],
            userDefinedData: response["nstd"]["userDefinedData"],
            usageState: response["nstd"]["usageState"],
            onboardingState: response["nstd"]["onboardingState"],
            operationalState: response["nstd"]["operationalState"],
            nstNsdIds: response["nstd"]["nstNsdIds"]
          });
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Retrieves a list of Slices Instances.
   * Either following a search pattern or not.
   *
   * @param search [Optional] Instances attributes that must be
   *                          matched by the returned list of
   *                          Slices instances.
   */
  getSlicesInstances(search?): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      let url =
        search != undefined
          ? this.config.baseSP + this.config.slicesInstances + search
          : this.config.baseSP + this.config.slicesInstances;

      this.http
        .get(url, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          if (response instanceof Array) {
            resolve(
              response.map(item => {
                return {
                  uuid: item.uuid,
                  name: item.name,
                  vendor: item.vendor,
                  version: item.nstVersion,
                  state: item.nsiState
                };
              })
            );
          } else {
            reject();
          }
        })
        .catch(err => {
          reject(err.statusText);
        });
    });
  }

  /**
   * Retrieves a Slices Instances by UUID
   *
   * @param uuid UUID of the desired Slices Instance.
   */
  getOneSliceInstance(uuid): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();

      this.http
        .get(this.config.baseSP + this.config.slicesInstances + "/" + uuid, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          resolve({
            uuid: response["uuid"],
            name: response["name"],
            vendor: response["vendor"],
            state: response["nsiState"],
            description: response["description"],
            netServInstanceUUID: response["netServInstance_Uuid"],
            nstName: response["nstName"],
            version: response["nstVersion"]
          });
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Generates a Slice Instance
   *
   * @param instance Data of the desired Slice Instance.
   */
  postOneSliceInstance(instance): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();

      this.http
        .post(this.config.baseSP + this.config.slicesInstances, instance, {
          headers: headers
        })
        .toPromise()
        .then(response => {
          resolve();
        })
        .catch(err => reject(err.statusText));
    });
  }

  /**
   * Terminates a Slice Instance by UUID
   *
   * @param uuid UUID of the desired Slices Instance.
   */
  postOneSliceInstanceTermination(uuid): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      const terminateTime = {
        terminateTime: "0"
      };

      this.http
        .post(
          this.config.baseSP +
            this.config.slicesInstances +
            "/" +
            uuid +
            "/terminate",
          terminateTime,
          {
            headers: headers
          }
        )
        .toPromise()
        .then(response => {
          resolve();
        })
        .catch(err => reject(err.statusText));
    });
  }
}
