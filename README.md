# 网格交易画表工具
## 这个只是e大网格交易的1.0版本，交易使用类型，详细操作等可以在长赢指数投资公众号的历史文章里面找到
## 2020-07-01 更新为网格2.1 新增留利润
* 配置文件给出的是华宝油气（162411），今日价格0.456（2019-06-25），网格范围0.600-0.270 ，0.600是心理最高网格位置，0.27是40%跌幅以后的价格
* 利润从最大为40%，封顶0.700 然后会卖出。

## 框架信息：
### 前端为angular，使用的 NG-ZORRO 组件库。
由于内容过少，去掉了前后端交互。直接在前端实现了全部逻辑。<br>
使用时启动springboot的App，输入地址localhost:9000<br>
或者进入src/angular/grid目录，启动 ng serve<br>
或者访问：http://hard-cent.surge.sh/index.html (访问比较慢，请保持耐心)<br> 
发布使用的是surge 官网 http://surge.sh <br>
使用参考： https://cloud.tencent.com/developer/article/1481311
