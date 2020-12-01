import { Component, ViewEncapsulation, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "highlighted-dates",
  templateUrl: "./date-picker.component.html",
  styleUrls: ["./date-picker.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class HighlightedDatesComponent {

  @Output() dateEvent = new EventEmitter<Date>();
  // Sending the chosen date
  sendShippingDate() {
    this.dateEvent.emit(this.shippingDate);
  }
  public shippingDate: Date;
  constructor() { }
  dateClass: (d: Date) => any;

}
