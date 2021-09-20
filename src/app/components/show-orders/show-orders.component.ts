import { Component, OnInit } from '@angular/core';
import { ConvertOrdersService } from 'src/app/services/convert-orders.service';

@Component({
  selector: 'app-show-orders',
  templateUrl: './show-orders.component.html',
  styleUrls: ['./show-orders.component.scss'],
})
export class ShowOrdersComponent implements OnInit {
  constructor(private convertOrders: ConvertOrdersService) {}

  convertedOrders: any = [];

  ngOnInit() {
    // Take data from Json and convert
    this.convertOrders.getOrders().subscribe((data) => {
      this.convertedOrders = this.convertOrders.convertedJson(data);
    });
  }
}
