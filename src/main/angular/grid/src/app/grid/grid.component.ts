import {Component, OnInit} from "@angular/core";
import {GridModel, GridService} from "./grid.service";

@Component({
  templateUrl: './grid.component.html',
  selector: 'grid',
  styleUrls: ['./grid.component.less']
})
export class GridComponent implements OnInit {
  formatterPercent = (value: number) => `${value} %`;
  parserPercent = (value: string) => value.replace(' %', '');

  name = '华宝油气';
  currentPrice = 0.455;
  maxProfitRunPrice = 0.700;
  maxProfitRunPercent = 40;
  maxGridPrice = 0.600;
  perGrid = 5;
  maxLoss = 40;
  buyNum = 10000;
  loading = false;
  // 利润奔跑
  profitRun = false;
  // 逐层加码
  weightMore = false;
  // 一网打尽
  allInOneGo = false;
  tableData:Array<GridModel>=[]
  constructor(private gridService: GridService) {
  }

  ngOnInit(): void {
  }

  calc() {
    this.loading = true;
    const grids = this.gridService.genGrids({
      currentPrice: this.currentPrice,
      maxGridPrice: this.maxGridPrice,
      perGrid: this.perGrid,
      maxLoss: this.maxLoss,
      buyNum: this.buyNum,
    });
    console.log(grids);
    this.tableData = grids;
    this.loading = false;
  }
}
