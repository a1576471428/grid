package org.xiaochao.model;

/**
 * @Author jiang_ruixin
 * @Date 2019/6/25 20:35
 **/
public class GridModel {
    private double level;
    private double buyPrice;
    private int buyNum;
    private double buyPriceSum;
    private double sellPrice;
    private int sellNum;
    private double sellPriceSum;
    private double profit;
    private double profitPercentage;


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
}
