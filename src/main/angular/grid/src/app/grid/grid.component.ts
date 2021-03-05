import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {GridModel, GridService} from './grid.service';
import * as xlsx from 'xlsx';

@Component({
  templateUrl: './grid.component.html',
  selector: 'grid',
  styleUrls: ['./grid.component.less']
})
export class GridComponent implements OnInit {
  @ViewChild('basicTable', {static: false}) basicTable: ElementRef;
  formatterPercent = (value: number) => `${value} %`;
  parserPercent = (value: string) => value.replace(' %', '');

  name = '华宝油气';
  currentPrice = 0.455;
  perGrid = 5;
  maxGridPrice = 0.600;
  maxLoss = 40;
  buyAmount = 10000;
  loading = false;

  // 利润奔跑
  profitRun = false;
  maxProfitRunPrice = 0.700;
  maxProfitRunPercent = 40;
  leftProfitMul = 1;

  // 逐层加码
  weightMore = false;
  weight = 5;
  weightStart = 2;

  // 一网打尽
  allInOneGo = false;
  tableData: Array<GridModel> = [];

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
      buyAmount: this.buyAmount,
      profitRun: this.profitRun,
      weightMore: this.weightMore,
      weight: this.weight,
      weightStart: this.weightStart,
      allInOneGo: this.allInOneGo,
      maxProfitRunPercent: this.maxProfitRunPercent,
      maxProfitRunPrice: this.maxProfitRunPrice,
      leftProfitMul: this.leftProfitMul,
    });
    this.tableData = grids;
    this.loading = false;
  }

  exportToExcel() {
    const rowData = this.getExcelRowData();
    const ws: xlsx.WorkSheet =
      xlsx.utils.json_to_sheet(rowData);
    // 数字格式化 参见https://github.com/rockboom/SheetJS-docs-zh-CN中 默认的数字格式 部分
    Object.keys(ws).forEach(key => {
      // 非标题行才设置数字格式化
      if (!/^[A-Z]+1$|^!.*$/.test(key)) {
        ws[key].z = '0.00';
      }
    });
    // 每列指定宽度
    const col = {width: 20};
    const allCols = [];
    for (let i = 0; i < Object.keys(rowData[0]).length; i++) {
      allCols.push(col);
    }
    ws['!cols'] = allCols;
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, this.name);
    xlsx.writeFile(wb, `${this.name}.xlsx`);
  }

  getExcelRowData(): any {
    return this.tableData.map(value => {
      const res: any = {};
      res['与基准比较'] = value.level;
      res['买入价格'] = value.buyPrice;
      res['买入数量'] = value.buyNum;
      res['买入价格合计'] = value.buyPriceSum;
      res['卖出价格'] = value.sellPrice;
      res['卖出数量'] = value.sellNum;
      res['卖出价格合计'] = value.sellPriceSum;
      if (this.profitRun) {
        res['本期留存数量'] = value.leftNum;
        res['留存卖出价格'] = value.leftProfitSellPrice;
        res['本期留存利润'] = value.leftProfitSum;
      }
      res['盈利'] = value.profit;
      res['盈利百分比'] = value.profitPercentage;
      return res;
    });


  }
}
