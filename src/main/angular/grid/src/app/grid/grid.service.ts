import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GridService {

  constructor() {
  }

  public genGrid(gridConfig: GridConfig): Array<GridModel> {
    let res: Array<GridModel> = [];
    // res.push(...this.genPricesGtCurrentPrice(gridConfig));
    res.push(...this.genPricesLteCurrentPrice(gridConfig));
    res.sort((o1, o2) => o1.level - o2.level);
    if (gridConfig.profitRun) {
      res = res.map(grid => this.profitRun(grid, gridConfig));
    }
    res.push(this.genSum(res));
    return res;
  }

  /**
   * 生成小于等于当前价格的网格
   *
   * @return
   */
  private genPricesLteCurrentPrice(gridConfig: GridConfig): Array<GridModel> {
    const gridModels: Array<GridModel> = [];
    const grids = gridConfig.maxLoss / gridConfig.perGrid;
    for (let i = 0; i < grids; i++) {
      const gridBuyLevel = 1.0 - gridConfig.perGrid * i / 100;
      const gridSellLevel = 1.0 - gridConfig.perGrid * (i - 1) / 100;
      const buyPrice = gridConfig.currentPrice * gridBuyLevel;
      const sellPrice = gridConfig.currentPrice * gridSellLevel;
      gridModels.push(this.createOneGrid(buyPrice, sellPrice, gridBuyLevel, gridConfig));
    }
    gridModels[0].benchmark = true;
    return gridModels;
  }

  /**
   * 生成合计栏
   *
   * @param gridModels
   * @return
   */
  private genSum(gridModels: Array<GridModel>): GridModel {
    const gridModel: GridModel = {
      level: '合计',
      buyNum: gridModels.map(model => model.buyNum).reduce(((previousValue, currentValue) => previousValue + currentValue)),
      buyPriceSum: gridModels.map(model => model.buyPriceSum).reduce(((previousValue, currentValue) => previousValue + currentValue)),
      sellPriceSum: gridModels.map(model => model.sellPriceSum).reduce(((previousValue, currentValue) => previousValue + currentValue)),
      sellNum: gridModels.map(model => model.sellNum).reduce(((previousValue, currentValue) => previousValue + currentValue)),
      profit: gridModels.map(model => model.profit).reduce(((previousValue, currentValue) => previousValue + currentValue)),
      leftProfitSum: gridModels.map(model => model.leftProfitSum).reduce(((previousValue, currentValue) => previousValue + currentValue)),
    };
    gridModel.profitPercentage = gridModel.profit / gridModel.buyPriceSum * 100;
    return gridModel;
  }

  private profitRun({...grid}: GridModel, gridConfig: GridConfig): GridModel {
    const leftNum = this.calLeftProfitNum(grid.buyPrice, grid.sellPrice, gridConfig, grid.buyNum);
    grid.leftNum = leftNum;
    grid.sellNum = grid.buyNum - leftNum;
    grid.sellPriceSum = grid.sellPrice * grid.sellNum;
    grid.leftProfitSellPrice = this.calLeftProfitSellPrice(grid.sellPrice, gridConfig);
    grid.leftProfitSum = grid.leftNum * grid.leftProfitSellPrice;
    grid.profit = leftNum * grid.leftProfitSellPrice + grid.sellPrice * grid.sellNum - grid.buyPriceSum;
    grid.profitPercentage = grid.profit / grid.buyPriceSum * 100;
    return grid;
  }

  /**
   * 留利润数量
   * @return
   */
  private calLeftProfitNum(buyPrice: number, sellPrice: number, gridConfig: GridConfig, buyNum: number): number {
    const spread = sellPrice - buyPrice;
    const profit = spread * buyNum;
    return parseInt((profit / sellPrice).toFixed(0), 10) * gridConfig.leftProfitMul;
  }

  /**
   * 获取保留利润的出售价格
   */
  private calLeftProfitSellPrice(sellPrice: number, gridConfig: GridConfig): number {
    console.log(gridConfig);
    const leftSellPrice = sellPrice * (100 + gridConfig.maxProfitRunPercent) / 100;
    return Math.min(leftSellPrice, gridConfig.maxProfitRunPrice);
  }

  private createOneGrid(buyPrice: number, sellPrice, buyLevel, gridConfig: GridConfig) : GridModel{
    const buyNum: number = this.genBuyNum(buyLevel, buyPrice, gridConfig);
    const gridModel: GridModel = {
      level: buyLevel,
      buyPrice,
      buyNum,
      buyPriceSum: buyPrice * buyNum,
      sellPrice,
      sellNum: buyNum,
      sellPriceSum: buyNum * sellPrice,
    };
    gridModel.profit = gridModel.sellPriceSum - gridModel.buyPriceSum;
    // gridModel.profitPercentage = (gridModel.profit / (gridModel.buyNum * gridConfig.currentPrice)) * 100;
    return gridModel;
  }

  private genBuyNum(buyLevel: number, buyPrice: number, gridConfig: GridConfig): number {
    let buyNum: number = Math.floor(gridConfig.buyAmount / buyPrice);
    if (gridConfig.weightMore) {
      const currentLevel = Math.floor((100 - buyLevel * 100) / gridConfig.perGrid);
      if (currentLevel >= gridConfig.weightStart) {
        const extraBuyNum = Math.floor(buyNum * (currentLevel - gridConfig.weightStart + 1) * gridConfig.weight / 100);
        buyNum += extraBuyNum;
      }
    }
    return buyNum;
  }
}

export interface GridModel {
  level?: any;
  buyPrice?: number;
  buyNum?: number;
  buyPriceSum?: number;
  sellPrice?: number;
  sellNum?: number;
  sellPriceSum?: number;
  profit?: number;
  profitPercentage?: number;
  leftNum?: number;
  leftProfitSellPrice?: number;
  leftProfitSum?: number;
  benchmark?: boolean;
}

export interface GridConfig {
  currentPrice?: number;
  maxProfitRunPrice?: number;
  maxProfitRunPercent?: number;
  maxGridPrice?: number;
  perGrid?: number;
  maxLoss?: number;
  buyAmount?: number;
  leftProfitMul?: number,
  // 利润奔跑
  profitRun: boolean;
  // 逐层加码
  weightMore: boolean;
  // 一网打尽
  allInOneGo: boolean;

  [propName: string]: any;
}
