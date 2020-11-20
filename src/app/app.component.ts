import { Component, VERSION } from "@angular/core";
import { interval, Observable, Subject, Subscription } from "rxjs";
import { mergeMap, switchMap, take } from "rxjs/operators";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  name = "Angular " + VERSION.major;

  subject$ = new Subject<number>();
  values: (number | string)[] = [];
  mapType: "mergeMap" | "concatMap" | "exhaustMap" | "switchMap" = "switchMap";

  mapTitle = "";
  subscription: Subscription;
  interval1000: Observable<number> = interval(1000);

  constructor() {
    this.setSwitchMap();
  }

  changeMap() {
    switch (this.mapType) {
      case "mergeMap":
        this.setMergeMap();
        break;
      default:
        this.setSwitchMap();
    }
  }

  trigger() {
    this.values.push("Trigger clicked");
    console.log("Trigger clicked");
    this.subject$.next();
  }

  private setMergeMap() {
    /*
     Its behaviour allows multiple observable values to be merged and 
     ... all to be ran at the concurrently. 
     Sometimes this behaviour is needed but 
     ... proceeds very carefully with mergeMap. 
     In many times, mergeMap causes race condition. 
     Use this map only if you know that 
     ... your incoming data will not override each other.

    This operator is best used when 
    ... you wish to flatten an inner observable but 
    ... want to manually control the number of inner subscriptions.
    `mergeMap` allows for multiple inner subscriptions 
    ... to be active at a time. 
     */
    this.initializeOperator("MergeMap");
    this.subscription = this.subject$
      .pipe(mergeMap(_ => this.interval1000.pipe(take(5))))
      .subscribe(num => this.action(num));
  }
  private setSwitchMap() {
    /*
     When a next value pushed to the observable, 
     ... it will cancel previous observable and take the current one instead.

     The main difference between switchMap and other flattening operators is 
     ... the cancelling effect. 
     When using `switchMap` 
     ... each inner subscription is completed when the source emits, 
     ... allowing only one active inner subscription.

     Every time `Trigger!` is clicked 
     ... the currently running interval is canceled and
     ... a new interval is started. 
     */
    this.initializeOperator("SwitchMap");
    this.subscription = this.subject$
      .pipe(switchMap(_ => this.interval1000.pipe(take(5))))
      .subscribe(num => this.action(num));
  }

  private initializeOperator(title: string) {
    this.mapTitle = title;
    this.values = [];
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private action(n: number) {
    console.log(n);
    this.values.push(n);
  }
}
