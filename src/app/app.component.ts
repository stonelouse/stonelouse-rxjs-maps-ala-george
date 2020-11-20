import { Component, VERSION } from "@angular/core";
import { interval, Observable, Subject, Subscription } from "rxjs";
import { switchMap, take } from "rxjs/operators";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  name = "Angular " + VERSION.major;

  subject$ = new Subject<number>();
  values: number[] = [];
  mapType: "mergeMap" | "concatMap" | "exhaustMap" | "switchMap" = "switchMap";

  mapTitle = "Switch Map";
  subscription: Subscription;
  interval100: Observable<number> = interval(1000);

  constructor() {
    this.subscription = this.subject$
      .pipe(switchMap(_ => this.interval100.pipe(take(5))))
      .subscribe(num => this.action(num));
  }

  changeMap() {}

  trigger() {}

  private action(n: number) {
    console.log(n);
    this.values.push(n);
  }
}
