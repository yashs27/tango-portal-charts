import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ValidationAndVerificationPlatformService } from "../validation-and-verification.service";
import { ChartService } from "../chart/chart.service";

@Component({
  selector: "app-tests-detail",
  templateUrl: "./tests-detail.component.html",
  styleUrls: ["./tests-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class TestsDetailComponent implements OnInit {
  loading: boolean;
  detail = {};
  displayedColumns = ["vendor", "name", "version"];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private verificationAndValidationPlatformService: ValidationAndVerificationPlatformService,
    private chartService: ChartService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.requestTest(params["id"]);
    });
  }

  /**
   * Generates the HTTP request of a Slices instance by UUID.
   *
   * @param uuid ID of the selected instance to be displayed.
   *             Comming from the route.
   */
  requestTest(uuid) {
    this.loading = true;
    this.verificationAndValidationPlatformService
      .getOneTest(uuid)
      .then(response => {
        this.loading = false;
        this.detail = response;
        this.requestTestResult();
      })
      .catch(err => console.error(err));
  }

  requestTestResult() {                                              // ! charts 
    this.loading = true;
    this.verificationAndValidationPlatformService
      .getRslTest()
      .then(response => {
        this.loading = false;



        let x = [], 
            y = 3;

          x.push(y);
          console.log('​TestsDetailComponent -> requestTestResult -> x', x);

        let version = +this.detail["version"] * 10 - 1,
            details = response["data"][version]; 

        if (details !== undefined && details["details"] !== null) { // details !== undefined 
          let graphs = response["data"][version]["details"]["graphs"],
              chart = {
                title: graphs[0]["title"], 
                xAxis: {
                  title: graphs[0]["x-axis-title"], 
                  data : [],
                },
                yAxis: {
                  title: graphs[0]["y-axix-title"], 
                  data : [],
                }
              };
          for (var j = 0; j < graphs[0]["data"].length; j++) {
            chart.xAxis["data"].push(graphs[0]["data"][j]["x-axis"]);
            chart.yAxis["data"].push(graphs[0]["data"][j]["y-axis"]);
          }
          this.chartService.chartBar(chart.title, chart.xAxis["title"], chart.xAxis["data"], chart.yAxis["title"], chart.yAxis["data"]); 
        } else {
          // this.chartService.chartBar("Latency Distribution", "Percentile", [0], "Latency", [0]); 
        }
      })

      .catch(err => console.error(err));
  }
  close() { this.router.navigate(["validation-and-verification/tests"]); }
}
