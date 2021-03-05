import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {GridModel, GridService} from './grid.service';
import * as xlsx from 'xlsx';
import {stream} from 'xlsx';
import {stringify} from '@angular/compiler/src/util';

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
  gridMetas: Array<GridMeta> = [{
    name: '%5网格',
    perGrid: 5
  }];
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
  gridNum = 1;

  grids: Array<Grid> = [];

  constructor(private gridService: GridService) {
  }

  ngOnInit(): void {
  }

  calc() {
    this.loading = true;
    this.grids = this.gridMetas.map(gridMeta => {
      const grid = this.gridService.genGrid({
        currentPrice: this.currentPrice,
        maxGridPrice: this.maxGridPrice,
        perGrid: gridMeta.perGrid,
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
      return {
        name: gridMeta.name,
        data: grid
      };
    });

    this.loading = false;
  }

  exportToExcel() {
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    this.grids.forEach(grid => {
      const rowData = this.getExcelRowData(grid.data);
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
      xlsx.utils.book_append_sheet(wb, ws, grid.name);
    });

    xlsx.writeFile(wb, `${this.name}.xlsx`);
  }

  getExcelRowData(data: Array<GridModel>): any {
    return data.map(value => {
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

  gridsChange() {
    if (this.gridNum > this.gridMetas.length) {
      const addNum = this.gridNum - this.gridMetas.length;
      for (let i = 0; i < addNum; i++) {
        this.gridMetas.push(this.genOneGridMeta(this.gridMetas.length + 1));
      }
    } else if (this.gridNum < this.gridMetas.length) {
      this.gridMetas = this.gridMetas.splice(0, this.gridNum);
    }
  }

  genOneGridMeta(index: number): GridMeta {
    return {
      name: `网格${index}`,
      perGrid: 5
    };
  }
}

interface Grid {
  name: string;
  data: Array<GridModel>;
}

interface GridMeta {
  name: string;
  perGrid: number;
}
