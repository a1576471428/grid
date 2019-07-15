package org.xiaochao.tool;

import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

/**
 * 大盘预测器
 * 灰常准！成功率咋也有百分之五十！
 * @Author jiang_ruixin
 * @Date 2019/7/15 22:48
 **/
public class BigCapForecast {
    private static final int UP = 1;
    private static final int DOWN = 0;

    public static void main(String[] args) {
        Random forecastMachine = ThreadLocalRandom.current();
        int forecast = forecastMachine.nextInt(2);
        if (forecast == UP){
            System.out.println("涨！");
        }
        if (forecast == DOWN){
            System.out.println("跌！");
        }
    }
}
