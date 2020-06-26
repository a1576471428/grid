import {Injectable} from "@angular/core";
import {GridModule} from "./grid.module";

@Injectable({
  providedIn: 'root'
})
export class GridService {

  constructor() {
  }

  public genGrids(gridConfig: GridConfig): Array<GridModel> {
    const res: Array<GridModel> = [];
    res.push(...this.genPricesGtCurrentPrice(gridConfig));
    res.push(...this.genPricesLteCurrentPrice(gridConfig));
    res.sort((o1, o2) => o1.level - o2.level);
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
    };
    gridModel.profitPercentage = gridModel.profit / gridModel.buyPriceSum * 100;
    return gridModel;
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
}

export interface GridConfig {
  currentPrice?: number;
  maxProfitRunPrice?: number;
  maxProfitRunPercent?: number;
  maxGridPrice?: number;
  perGrid?: number;
  maxLoss?: number;
  buyNum?: number;
}
