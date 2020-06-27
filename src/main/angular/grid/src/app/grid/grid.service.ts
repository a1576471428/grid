import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class GridService {

  constructor() {
  }

  public genGrids(gridConfig: GridConfig): Array<GridModel> {
    let res: Array<GridModel> = [];
    res.push(...this.genPricesGtCurrentPrice(gridConfig));
    res.push(...this.genPricesLteCurrentPrice(gridConfig));
    res.sort((o1, o2) => o1.level - o2.level);
    if (gridConfig.profitRun) {
      res = res.map(grid => this.profitRun(grid, gridConfig));
    }
    res.push(this.genSum(res));
    return res;
  }

  /**
   * 生成大于当前价格的网格
   *
   * @return
   */
  private genPricesGtCurrentPrice(gridConfig: GridConfig): Array<GridModel> {
    const gridModels: Array<GridModel> = [];
    let nextBuyPrice;
    let level = 1;
    do {
      const gridBuyLevel = 1.0 + gridConfig.perGrid * level / 100;
      const gridSellLevel = 1.0 + gridConfig.perGrid * (level + 1) / 100;
      nextBuyPrice = gridConfig.currentPrice * gridBuyLevel;
      const nextSellPrice = gridConfig.currentPrice * gridSellLevel;
      level++;
      gridModels.push(GridService.createOneGrid(nextBuyPrice, nextSellPrice, gridBuyLevel, gridConfig));
    } while (nextBuyPrice < gridConfig.maxGridPrice);
    return gridModels;
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
      gridModels.push(GridService.createOneGrid(buyPrice, sellPrice, gridBuyLevel, gridConfig));
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
    const leftNum = GridService.calLeftProfitNum(grid.buyPrice, grid.sellPrice, gridConfig);
    grid.leftNum = leftNum;
    grid.sellNum = grid.buyNum - leftNum;
    grid.sellPriceSum = grid.sellPrice * grid.sellNum;
    grid.leftProfitSellPrice = GridService.calLeftProfitSellPrice(grid.sellPrice, gridConfig);
    grid.leftProfitSum = grid.leftNum * grid.leftProfitSellPrice;
    grid.profit = leftNum * grid.leftProfitSellPrice + grid.sellPrice * grid.sellNum - grid.buyPriceSum;
    grid.profitPercentage = grid.profit / grid.buyPriceSum * 100;
    return grid;
  }

  /**
   * 留利润数量
   * @return
   */
  private static calLeftProfitNum(buyPrice: number, sellPrice: number, gridConfig: GridConfig): number {
    const spread = sellPrice - buyPrice;
    const profit = spread * gridConfig.buyNum;
    return parseInt((profit / sellPrice).toFixed(0), 10) * gridConfig.leftProfitMul;
  }

  /**
   * 获取保留利润的出售价格
   */
  private static calLeftProfitSellPrice(sellPrice: number, gridConfig: GridConfig): number {
    console.log(gridConfig)
    const leftSellPrice = sellPrice * (100 + gridConfig.maxProfitRunPercent) / 100;
    return Math.min(leftSellPrice, gridConfig.maxProfitRunPrice);
  }

  private static createOneGrid(buyPrice, sellPrice, buyLevel, gridConfig: GridConfig) {
    const gridModel: GridModel = {
      level: buyLevel,
      buyPrice: buyPrice,
      buyNum: gridConfig.buyNum,
      buyPriceSum: buyPrice * gridConfig.buyNum,
      sellPrice: sellPrice,
      sellNum: gridConfig.buyNum,
      sellPriceSum: gridConfig.buyNum * sellPrice,
    };
    gridModel.profit = gridModel.sellPriceSum - gridModel.buyPriceSum;
    gridModel.profitPercentage = (gridModel.profit / gridModel.buyPriceSum * 100);
    return gridModel;
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
  buyNum?: number;
  leftProfitMul?: number,
  // 利润奔跑
  profitRun: boolean;
  // 逐层加码
  weightMore: boolean;
  // 一网打尽
  allInOneGo: boolean;

  [propName: string]: any;
}
