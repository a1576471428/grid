package org.xiaochao.model;

import cn.hutool.setting.Setting;
import cn.hutool.setting.SettingUtil;

/**
 * @Author jiang_ruixin
 * @Date 2019/6/25 20:35
 **/
public class GridModel {
    private static final int BUY_NUM;
    private static final double MAX_PROFIT_RUN_PRICE;
    private static final double MAX_PROFIT_RUN_PERCENT;

    static {
        Setting setting = SettingUtil.get("grid.properties");
        BUY_NUM = setting.getInt("buy_num");
        MAX_PROFIT_RUN_PRICE = setting.getDouble("max_profit_run_price");
        MAX_PROFIT_RUN_PERCENT = setting.getDouble("max_profit_run_percent");
    }
    private double level;
    private double buyPrice;
    private int buyNum;
    private double buyPriceSum;
    private double sellPrice;
    private int sellNum;
    private double sellPriceSum;
    private double profit;
    private double profitPercentage;
    private int leftNum;
    private double leftProfitSellPrice;



    public double getLevel() {
        return level;
    }

    public void setLevel(double level) {
        this.level = level;
    }

    public double getBuyPrice() {
        return buyPrice;
    }

    public void setBuyPrice(double buyPrice) {
        this.buyPrice = buyPrice;
    }

    public int getBuyNum() {
        return buyNum;
    }

    public void setBuyNum(int buyNum) {
        this.buyNum = buyNum;
    }

    public double getBuyPriceSum() {
        return buyPriceSum;
    }

    public void setBuyPriceSum(double buyPriceSum) {
        this.buyPriceSum = buyPriceSum;
    }

    public double getSellPrice() {
        return sellPrice;
    }

    public void setSellPrice(double sellPrice) {
        this.sellPrice = sellPrice;
    }

    public int getSellNum() {
        return sellNum;
    }

    public void setSellNum(int sellNum) {
        this.sellNum = sellNum;
    }

    public double getSellPriceSum() {
        return sellPriceSum;
    }

    public void setSellPriceSum(double sellPriceSum) {
        this.sellPriceSum = sellPriceSum;
    }

    public double getProfit() {
        return profit;
    }

    public void setProfit(double profit) {
        this.profit = profit;
    }

    public double getProfitPercentage() {
        return profitPercentage;
    }

    public void setProfitPercentage(double profitPercentage) {
        this.profitPercentage = profitPercentage;
    }

    public int getLeftNum() {
        return leftNum;
    }

    public void setLeftNum(int leftNum) {
        this.leftNum = leftNum;
    }

    public double getLeftProfitSellPrice() {
        return leftProfitSellPrice;
    }

    public void setLeftProfitSellPrice(double leftProfitSellPrice) {
        this.leftProfitSellPrice = leftProfitSellPrice;
    }

    public static GridModel createOneGrid(double buyPrice, double sellPrice, double buyLevel) {
        GridModel gridModel = new GridModel();
        gridModel.setLevel(buyLevel);
        gridModel.setBuyPrice(buyPrice);
        gridModel.setBuyNum(BUY_NUM);
        gridModel.setBuyPriceSum(buyPrice * BUY_NUM);
        gridModel.setSellPrice(sellPrice);
        int leftNum = calLeftProfitNum(buyPrice, sellPrice);
        gridModel.setLeftNum(leftNum);
        gridModel.setSellNum(BUY_NUM - leftNum);
        gridModel.setSellPriceSum(sellPrice * gridModel.getSellNum());
        gridModel.setLeftProfitSellPrice(calLeftProfitSellPrice(sellPrice));
        double finalProfit = leftNum * gridModel.getLeftProfitSellPrice() + sellPrice *
                gridModel.getSellNum() - buyPrice * BUY_NUM;
        gridModel.setProfit(finalProfit);

        gridModel.setProfitPercentage(gridModel.getProfit() / gridModel.getBuyPriceSum() * 100);
        return gridModel;
    }

    /**
     * 留利润数量
     * @param buyPrice
     * @param sellPrice
     * @return
     */
    private static int calLeftProfitNum(double buyPrice, double sellPrice) {
        double spread = sellPrice - buyPrice;
        double profit = spread * BUY_NUM;
        return (int) (profit / sellPrice);
    }

    /**
     * 获取保留利润的出售价格
     */
    private static double calLeftProfitSellPrice(double sellPrice) {
        double leftSellPrice = sellPrice * (100 + MAX_PROFIT_RUN_PERCENT) / 100;
        return Math.min(leftSellPrice, MAX_PROFIT_RUN_PRICE);
    }

}
