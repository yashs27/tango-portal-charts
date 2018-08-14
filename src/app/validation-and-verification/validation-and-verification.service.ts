import { Injectable } from "@angular/core";
import { ConfigService } from "../shared/services/config/config.service";
import { AuthService } from "../authentication/auth.service";

import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class ValidationAndVerificationPlatformService {
  authHeaders: HttpHeaders;
  request_uuid: string;
  // pagination: string = "?page_size=20&page_number=1";

  constructor(
    private authService: AuthService,
    private config: ConfigService,
    private http: HttpClient
  ) {}

  /**
   * Retrieves a list of tests.
   * Either following a search pattern or not.
   *
   * @param search [Optional] Test attributes that must be
   *                          matched by the returned list of
   *                          tests.
   */

  getTests(search?): any {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
      let url =
        search != undefined
          ? this.config.baseVNV + this.config.tests + search
          : this.config.baseVNV + this.config.tests;

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
                  name: item.testd.name,
                  vendor: item.testd.vendor,
                  version: item.testd.version,
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
   * Retrieves a Test by UUID
   *
   * @param uuid UUID of the desired Test.
   */

  getOneTest(uuid: string) {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
        this.http
        .get(this.config.baseVNV + this.config.tests + "/" + uuid, { headers: headers }) 
        .toPromise()
        .then(response => { resolve({
            uuid: response["uuid"],
            name: response["testd"]["name"],
            vendor: response["testd"]["vendor"],
            version: response["testd"]["version"],
            // timesExecuted: response["testd"]
            timesExecuted: "20",
            author: response["testd"]["author"],
            description: response["testd"]["description"],
            createdAt: response["created_at"],
            status: response["status"],
            // lastTimeExecuted: response["testd"]
            lastTimeExecuted: "this is date",
            // services: response["testd"]
            services: [
              {
                sVendor: "svendor",
                sName: "sname",
                sVersion: "0.3"
              },
              {
                sVendor: "svendor2",
                sName: "sname2",
                sVersion: "0.2"
              }
            ]
          });
        })
        .catch(err => reject(err.statusText)); 
    });    
  }

  getRslTest() {
    return new Promise((resolve, reject) => {
      let headers = this.authService.getAuthHeaders();
        this.http 
        .get(this.config.baseVNV2 + this.config.tests2, { headers: headers }) 
        .toPromise()
        .then(response => { resolve({ 
          "data":         response,
          // "data":         response[1]["details"]["graphs"][0]["data"],
          // "graphs-title": response[1]["details"]["graphs"][0]["title"],
          // "x-axis-title": response[1]["details"]["graphs"][0]["x-axis-title"],
          // "y-axis-title": response[1]["details"]["graphs"][0]["y-axix-title"],
         }); 
        })
        .catch(err => reject(err.statusText));
    });    
  }

}
