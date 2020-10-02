/*=================================
#微信公众号iosrule
#by红鲤鱼绿鲤鱼与驴 2020.9.25
#https://github.com/wangdelu2020
#查询联通流量话费，提醒流量和话费的使用情况。
#教程:微信搜索🔎iosrule,关注公众号，翻看历史教程文章。

#本脚本远程库订阅
https://raw.githubusercontent.com/wangdelu2020/hongliyu/master/liantongnotice.js

#QX 联通流量话费提醒
https:\/\/m.client\.10010\.com\/mobileService\/home\/queryUserInfoSeven\.htm? url script-request-header liantongnotice.js

#定时(远程订阅)6点到24点 30分提醒一次
0 30 6-23 * * ? liantongnotice.js, tag=联通流量话费提醒, enabled=true

mit=m.client.10010.com

//====================================

#loon联通流量话费提醒

http-request https:\/\/m.client\.10010\.com\/mobileService\/home\/queryUserInfoSeven\.htm? script-path=liantongnotice.js, requires-header=true, timeout=30, tag=联通流量话费提醒

mit=m.client.10010.com


#使用方法🔍打开手机联通app客户端获取cookies.

*/

const $iosrule = iosrule();
const log=1;//设置0关闭日志,1开启日志
const getck=1;//设置0关闭获取ck,1开启获取ck








//以下部分不要改动

var all="";
var tt=`联通App话费流量 `;
var LianTongck="";var LianTongckst="LianTongckst";
var queryUserInfoSeven="";var LianTongurlst="liantongurlst";

//++++++++++++++++++++++++++++++++




 async function LianTongApp_begin()
 {
await LianTongApp_data();
let lt1=await LianTongApp_queryUserInfoSeven();
let lt2=await LianTongApp_daySign();
papa(tt,"",lt1+lt2);
   
}




function LianTongApp_data(){
  return  new Promise((resolve, reject) => {LianTongck=$iosrule.read(LianTongckst);
  queryUserInfoSeven=$iosrule.read(LianTongurlst);
  if(LianTongck==undefined&&queryUserInfoSeven==undefined)
  {
    
let st1="读取签到Cookies数据错误❎";
let st2=`打开手机联通app客户端获取cookies.😌`;
    console.log(st1+"\n"+st2);
    papa(tt,st1,st2)}
  else {LianTongck=JSON.parse(LianTongck);
    console.log("*********🔔"+tt+"+*********")}
  resolve();})}

function LianTongApp_queryUserInfoSeven(){
return  new Promise((resolve, reject) => {
    
var result1=tt;var result2="";
const user_url={
      url:queryUserInfoSeven,
       headers:{Cookie:LianTongck.Cookie},
       timeout:600
               };
      $iosrule.get(user_url,function(error, response, data) {
try{
var obj=JSON.parse(data);

result2=obj.flush_date_time+"\n";
for(let i=0;i<obj.data.dataList.length;i++){
  
 let list=obj.data.dataList[i];
  result2+=`【${list.remainTitle}】${list.number}${list.unit}  ${list.usedTitle}\n`;
  
}

}catch(err){
  result2=null;
  console.log(err);
} finally{
  console.log(result2);
resolve(result2);
}
})
})}



function LianTongApp_daySign(){
return  new Promise((resolve, reject) => {
    
var result1="【每日签到】";var result2="";
const user_url1={
      url:"https://act.10010.com/SigninApp/signin/daySign",
       headers:{Cookie:LianTongck.Cookie},
       timeout:600};
       const user_url2={
      url:"https://act.10010.com/SigninApp/signin/getGoldTotal",
   headers:{Cookie:LianTongck.Cookie},
          timeout:600};
      const user_url3={
         url:"https://act.10010.com/SigninApp/signin/getIntegral",
   headers:{Cookie:LianTongck.Cookie},
          timeout:600};
      $iosrule.post(user_url1,function(error, response, data) {
try{
var obj=JSON.parse(data);
if(obj.status=="0000")
result2="【7天连续签到】"+obj.data.days7+"天";
}catch(err){
  result2=null;
  console.log(err);
} finally{
$iosrule.post(user_url2,function(error, response, data) {
try{
var obj=JSON.parse(data);
if(obj.status=="0000")
result2+="【金币】"+obj.data.goldTotal;
}catch(err){
  result2=null;
  console.log(err);
} finally{
$iosrule.post(user_url3,function(error, response, data) {
try{
var obj=JSON.parse(data);
if(obj.status=="0000")
result2+="【积分】"+obj.data.integralTotal+"✅";
}catch(err){
  result2=null;
  console.log(err);
} finally{
console.log(result2+"\n");
resolve("\n"+result2+"\n");
}
})}
})}
})
})

}
  





  

























function LianTongApp_getck() {

  if ($request.headers) {

 var urlval = $request.url;

var md_hd=$request.headers;
if(urlval.indexOf("mobileService/home/queryUserInfoSeven.htm?")!=-1&&urlval.indexOf("showType=3")!=-1)
{
console.log("发现"+tt+"cookies数据");
 var sk= $iosrule.write(urlval,LianTongurlst);

var sm= $iosrule.write(JSON.stringify(md_hd),LianTongckst);

if (sk==true&&sm==true) 
 papa(tt,"[获取Cookies数据]","✌🏻成功");}



  
}}





function main()
{LianTongApp_begin();}



function papa(x,y,z){$iosrule.notify(x,y,z);}


if ($iosrule.isRequest) {
  if(getck==1)LianTongApp_getck()
  $iosrule.end()
} else {
  main();
  $iosrule.end()
 }



function iosrule() {
    const isRequest = typeof $request != "undefined"
    const isSurge = typeof $httpClient != "undefined"
    const isQuanX = typeof $task != "undefined"
    const notify = (title, subtitle, message) => {
        if (isQuanX) $notify(title, subtitle, message)
        if (isSurge) $notification.post(title, subtitle, message)
    }
    const write = (value, key) => {
        if (isQuanX) return $prefs.setValueForKey(value, key)
        if (isSurge) return $persistentStore.write(value, key)
    }
    const read = (key) => {
        if (isQuanX) return $prefs.valueForKey(key)
        if (isSurge) return $persistentStore.read(key)
    }
    const get = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "GET"
            $task.fetch(options).then(response => {
                response["status"] = response.statusCode
                callback(null, response, response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.get(options, callback)
    }
    const post = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "POST"
            $task.fetch(options).then(response => {
                response["status"] = response.statusCode
                callback(null, response, response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.post(options, callback)
    }
    const end = () => {
        if (isQuanX) isRequest ? $done({}) : ""
        if (isSurge) isRequest ? $done({}) : $done()
    }
    return { isRequest, isQuanX, isSurge, notify, write, read, get, post, end }
};




