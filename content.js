/**
 * 24-09-18
 * 自动插入当前浏览器正在浏览的网页，可以使用该模块篡改页面内容，控制页面的 DOM 结构，调用相关 API 或者与插件的其他模块通信
 *  */ 

// 匿名函数，在页面加载时自动执行搜集信息 hrer/src/script src，简单处理后发送到 background.js
(function(){
    // 获取当前页面 URL 的基本信息
    var protocol = window.location.protocol;
    var host = window.location.host;
    var domain_host = host.split(':')[0];
    var href = window.location.href;
    
    // 获取 HTML 文档源代码，后者更稳定全面，可防止遗漏信息
    // var source = document.getElementsByTagName('html')[0].innerHTML;
    var source = document.documentElement.outerHTML;
    
    // 
    init_source(source);

    // 获取页面中所有的 iframe 元素，执行同样的逻辑
    // 尽可能的搜集全信息
    var iframes = document.querySelectorAll('iframe');
    iframes.forEach(function(iframe) {
        iframe.addEventListener('load', function() {
            var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            source = iframeDocument.documentElement.outerHTML
            // console.log(iframeDocument.documentElement.outerHTML);
            init_source(source);
        });
    });

    // 处理当前页面的 HTML 文档，获取目标信息并做简单处理
    function init_source(source) {
        var hostPath;
        var urlPath;
        // 白名单，后面开发时要求可以实现自定义
        var urlWhiteList = ['.google.com','.amazon.com','portswigger.net'];
        var target_list = [];
        
        // 提取信息，HTML 文档中 href 属性列表，src 属性列表，外联 js 列表
        var source_href = source.match(/href=['"].*?['"]/g);
        var source_src = source.match(/src=['"].*?['"]/g);
        var script_src = source.match(/<script [^><]*?src=['"].*?['"]/g);

        //从 local storage 中查询是都有白名单，有的话就扔出提示
        chrome.storage.local.get(["allowlist"], function(settings){
            // console.log(settings , settings['allowlist'])
            if(settings && settings['allowlist']){
                urlWhiteList = settings['allowlist'];
            }
            
            // 根据白名单检查已有的 href 和 src 列表，剔除白名单中的元素
            for(var i = 0;i < urlWhiteList.length;i++){
                if(host.endsWith(urlWhiteList[i]) || domain_host.endsWith(urlWhiteList[i])){
                    console.log('域名在白名单中，跳过当前页')
                    return ;
                }
            }
            // target_list.push(window.location.href);
            
            // 初步处理之前的列表
            /**
             * 处理效果大致如下
                var source_href = [
                    'href="https://example.com/page"',
                    'href="javascript:void(0)"', // 无效链接
                    'href="#"', // 无效链接
                    'href="https://example.com/page4?query=1"'
                ];
             * 
             */
            // console.log(source_href,source_src,script_src)
            if(source_href){
                for(var i=0;i<source_href.length;i++){
                    var u = deal_url(source_href[i].substring(6,source_href[i].length-1));
                    if(u){
                        target_list.push(u);
                    }
                }
            }
            if(source_src){
                for(var i=0;i<source_src.length;i++){
                    var u = deal_url(source_src[i].substring(5,source_src[i].length-1));
                    if(u){
                        target_list.push(u);
                    }
                }
            }
            
            // 去重
            const tmp_target_list=[];
            for (var i = 0;i<target_list.length;i++){
                if (tmp_target_list.indexOf(target_list[i])===-1){
                  tmp_target_list.push(target_list[i])
                }
            }
            tmp_target_list.pop(href)
            
            // 将经过处理的目标元素列表传达给 background.js
            chrome.runtime.sendMessage({greeting: "find",data: target_list, current: href, source: source});
        });
    
        //
        function is_script(u){
            if(script_src){
                for(var i=0;i<script_src.length;i++){
                    if (script_src[i].indexOf(u)>0){
                        return true
                    }
                }
            }
            return false
        }

        /**
         * 处理和规范化 URL 的函数
         * 
         * @param {string} u - 需要处理的 URL
         * @returns {string|undefined} - 规范化后的 URL 或 undefined（如果无效）
         */
        function deal_url(u) {
            // 1. 检查是否为有效的脚本 URL
            // 如果 URL 不包含 ".js" 并且不是脚本类型，则返回 undefined。
            // 这是为了确保只处理有效的脚本链接，避免无效链接。
            if (u.indexOf(".js") == -1 && !is_script(u)) {
                return; // 返回 undefined
            }

            // 2. 处理绝对 URL
            // 如果 URL 以 "http" 或 "https" 开头，直接返回该 URL。
            // 这是因为绝对 URL 已经是完整的，不需要进一步处理。
            else if (u.substring(0, 4) == "http") {
                return u; // 返回绝对 URL
            }

            // 3. 处理协议相对 URL
            // 如果 URL 以 "//" 开头，表示协议相对 URL，返回当前页面的协议加上该 URL。
            // 这样可以确保 URL 在当前协议下有效。
            else if (u.substring(0, 2) == "//") {
                return protocol + u; // 返回协议相对 URL
            }

            // 4. 处理根相对 URL
            // 如果 URL 以 "/" 开头，表示根相对 URL，返回当前页面的协议和主机名加上该 URL。
            // 这样可以构建出完整的绝对 URL。
            else if (u.substring(0, 1) == '/') {
                return protocol + '//' + host + u; // 返回根相对 URL
            }

            // 5. 处理当前目录相对 URL
            // 如果 URL 以 "./" 开头，表示当前目录相对 URL。
            // 需要获取当前页面的 URL，去掉锚点部分（如果有），
            // 然后返回当前 URL 的目录部分加上该 URL。
            else if (u.substring(0, 2) == './') {
                if (href.indexOf('#') > 0) {
                    tmp_href = href.substring(0, href.indexOf('#'));
                } else {
                    tmp_href = href;
                }
                return tmp_href.substring(0, tmp_href.lastIndexOf('/') + 1) + u; // 返回当前目录相对 URL
            }

            // 6. 处理其他相对 URL
            // 如果 URL 既不是绝对 URL 也不是以 "//"、"/" 或 "./" 开头，
            // 则表示它是一个相对 URL。处理方式与当前目录相对 URL 类似，
            // 返回当前 URL 的目录部分加上该 URL。
            else {
                if (href.indexOf('#') > 0) {
                    tmp_href = href.substring(0, href.indexOf('#'));
                } else {
                    tmp_href = href;
                }
                return tmp_href.substring(0, tmp_href.lastIndexOf('/') + 1) + u; // 返回其他相对 URL
            }
        }
    }
})()


/**
 * 设置了一个全局悬浮窗，这段就是纯前端活，skip
 */
chrome.storage.local.get(["global_float"], function(settings){
    // console.log(settings);
    if (settings["global_float"]!=true){
        return
    }
    // console.log(settings["global_float"]);
    // console.log("findsomething-divglobal_float");
    // 使用自定义标签
    const body = document.getElementsByTagName('html')[0];
    const div = document.createElement('div');
    div.setAttribute("id","findsomething-float-div");
    div.innerHTML = `
    <findsomething-div id="findsomething_neko" style="width:410px;max-height:500px;font-size:14px;color:#000000;box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1) ;background-color: #fff;border-radius: 5px;border: 1px solid #ebebeb;left:20px;top:20px;position: fixed;z-index: 1000000;overflow:scroll;">
          <findsomething-div id="findsomething_neko-title" style="display: flex;justify-content: space-between;">
            <findsomething-div id="findsomething_taskstatus" style="height: 34px; line-height: 34px; margin-left: 10px;"></findsomething-div>
            <findsomething-div style="cursor: pointer;margin-top: 2px;margin-right: 10px;" onclick='(function(){document.getElementById("findsomething-float-div").removeChild(document.getElementById("neko"));})()'>隐藏</findsomething-div>
          </findsomething-div>
            <findsomething-div style="width: 300px; margin-top: 10px;">
                <findsomething-div class="findsomething-title">IP<button type="button" class="finsomething_copy" name="ip">复制</button></findsomething-div>
                <findsomething-p id="findsomething_ip" style="word-break:break-word;margin-left:10px;">🈚️</findsomething-p>
                <findsomething-div class="findsomething-title">IP_PORT<button class="findsomething_copy" name="ip_port">复制</button></findsomething-div>
                <findsomething-p id="findsomething_ip_port" style="word-break:break-word;margin-left:10px;">🈚️</findsomething-p>
                <findsomething-div class="findsomething-title">域名<button class="findsomething_copy" name="domain">复制</button></findsomething-div>
                <findsomething-p id="findsomething_domain" style="word-break:break-word;margin-left:10px;">🈚️</findsomething-p>
                <findsomething-div class="findsomething-title">身份证<button class="findsomething_copy" name="sfz">复制</button></findsomething-div>
                <findsomething-p id="findsomething_sfz" style="word-break:break-word;margin-left:10px;">🈚️</findsomething-p>
                <findsomething-div class="findsomething-title">手机号<button class="findsomething_copy" name="mobile">复制</button></findsomething-div>
                <findsomething-p id="findsomething_mobile" style="word-break:break-word;margin-left:10px;">🈚️</findsomething-p>
                <findsomething-div class="findsomething-title">邮箱<button class="findsomething_copy" name="mail">复制</button></findsomething-div>
                <findsomething-p id="findsomething_mail" style="word-break:break-word;margin-left:10px;">🈚️</findsomething-p>
                <findsomething-div class="findsomething-title">JWT<button class="findsomething_copy" name="jwt">复制</button></findsomething-div>
                <findsomething-p id="findsomething_jwt" style="word-break:break-word;margin-left:10px;">🈚️</findsomething-p>
                <findsomething-div class="findsomething-title">算法<button class="findsomething_copy" name="algorithm">复制</button></findsomething-div>
                <findsomething-p id="findsomething_algorithm" style="word-break:break-word;margin-left:10px;">🈚️</findsomething-p>
                <findsomething-div class="findsomething-title">Secret<button class="findsomething_copy" name="secret">复制</button></findsomething-div>
                <findsomething-p id="findsomething_secret" style="word-break:break-word;margin-left:10px;">🈚️</findsomething-p>
                <findsomething-div class="findsomething-title">Path<button class="findsomething_copy" name="path">复制</button></findsomething-div>
                <findsomething-p id="findsomething_path" style="word-break:break-word;margin-left:10px;">🈚️</findsomething-p>
                <findsomething-div class="findsomething-title">IncompletePath<button class="findsomething_copy" name="incomplete_path">复制</button></findsomething-div>
                <findsomething-p id="findsomething_incomplete_path" style="word-break:break-word;margin-left:10px;">🈚️</findsomething-p>
                <findsomething-div class="findsomething-title">Url<button class="findsomething_copy" name="url">复制</button></findsomething-div>
                <findsomething-p id="findsomething_url" style="word-break:break-word;margin-left:10px;">🈚️</findsomething-p>
                <findsomething-div class="findsomething-title">StaticUrl<button class="findsomething_copy" name="static">复制</button></findsomething-div>
                <findsomething-p id="findsomething_static" style="word-break:break-word;margin-left:10px;">🈚️</findsomething-p>
            </findsomething-div>
    </findsomething-div>
        <style type="text/css">
        .findsomething_copy {
            border-style: none;
            background-color: #ffffff;
            float: right;
            margin-right: 0px;
            font-size: 14px;
        }
        findsomething-div{
            display: block;
        }
        findsomething-p {
            display: block;
            margin-top: 14px;
            margin-bottom: 14px;
            line-height: 14px;
        }

        .findsomething-title {
            font-size: 16px;
            font-weight: bold;
            border-left: 4px solid black;
            text-indent: 4px;
            height: 16px;
            line-height: 16px;
            width: 100%;
            margin-left: 10px;
        }

        button{
            cursor: pointer
        }
        </style>
        `
    body.appendChild(div)
    var neko = document.querySelector('#findsomething_neko');
    var nekoW = neko.offsetWidth;
    var nekoH = neko.offsetHeight;
    var cuntW = 0;
    var cuntH = 0;
    neko.style.left = parseInt(document.body.offsetWidth - nekoW)+1 + 'px';
    neko.style.top = '50px';
    move(neko, 0, 0);
    function move(obj, w, h) {
        if (obj.direction === 'left') {
            obj.style.left = 0 - w + 'px';
        } else if (obj.direction === 'right') {

            obj.style.left = document.body.offsetWidth - nekoW + w + 'px';
        }
        if (obj.direction === 'top') {
            obj.style.top = 0 - h + 'px';
        } else if (obj.direction === 'bottom') {
            obj.style.top = document.body.offsetHeight - nekoH + h + 'px';
        }
    }

    function rate(obj, a) {
        //  console.log(a);
        obj.style.transform = ' rotate(' + a + ')'
    }

    var nekotitle = document.querySelector('#findsomething_neko-title');
    nekotitle.onmousedown = function (e) {
        var nekoL = e.clientX - neko.offsetLeft;
        var nekoT = e.clientY - neko.offsetTop;
        document.onmousemove = function (e) {
            cuntW = 0;
            cuntH = 0;
            neko.direction = '';
            neko.style.transition = '';
            neko.style.left = (e.clientX - nekoL) + 'px';
            neko.style.top = (e.clientY - nekoT) + 'px';
            if (e.clientX - nekoL < 5) {
                neko.direction = 'left';
            }
            if (e.clientY - nekoT < 5) {
                neko.direction = 'top';
            }
            if (e.clientX - nekoL > document.body.offsetWidth - nekoW - 5) {
                neko.direction = 'right';
            }
            if (e.clientY - nekoT > document.body.offsetHeight - nekoH - 5) {
                neko.direction = 'bottom';
            }

            move(neko, 0, 0);


        }
    }
    neko.onmouseover = function () {
        move(this, 0, 0);
        rate(this, 0)
    }

    neko.onmouseout = function () {
        // move(this, nekoW / 2, nekoH / 2);
        move(this, nekoW / 2, 0);
        // move(this, 0, 0);
    }

    neko.onmouseup = function () {
        document.onmousemove = null;
        this.style.transition = '.5s';
        // move(this, nekoW / 2, nekoH / 2);
        move(this, nekoW / 2, 0);
    }

    window.onresize = function () {
        var bodyH = document.body.offsetHeight;
        var nekoT = neko.offsetTop;
        var bodyW = document.body.offsetWidth;
        var nekoL = neko.offsetLeft;

        if (nekoT + nekoH > bodyH) {
            neko.style.top = bodyH - nekoH + 'px';
            cuntH++;
        }
        if (bodyH > nekoT && cuntH > 0) {
            neko.style.top = bodyH - nekoH + 'px';
        }
        if (nekoL + nekoW > bodyW) {
            neko.style.left = bodyW - nekoW + 'px';
            cuntW++;
        }
        if (bodyW > nekoL && cuntW > 0) {
            neko.style.left = bodyW - nekoW + 'px';
        }

        // move(neko, nekoW / 2, nekoH / 2);
        move(this, nekoW / 2, 0);
        // move(this, 0, 0);
    }
});

/**
 * 实现窗口的复制功能，前端活，skip 
 */
function init_copy() {
    var elements = document.getElementsByClassName("findsomething_copy");
    if (elements) {
        for (var i=0, len=elements.length|0; i<len; i=i+1|0) {
            let ele_name = elements[i].name;
            elements[i].onclick=function () {
                // console.log('copy begin');
                var inp =document.createElement('textarea');
                document.body.appendChild(inp)
                inp.value =document.getElementById(ele_name).textContent;
                inp.select();
                document.execCommand('copy',false);
                inp.remove();
                // console.log('copy end');
            }
        }
    }
};
setTimeout(()=>{
    init_copy();
}, 500);

/**
 * 设置延后时间
 */
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * 展示信息，skip
 */
var key = ["ip","ip_port","domain","path","incomplete_path","url","static","sfz","mobile","mail","jwt","algorithm","secret"]
function show_info(result_data) {
    if(result_data){
        for (var k in key){
            if (result_data[key[k]]){
                // console.log(result_data[key[k]])
                let p="";
                for(var i in result_data[key[k]]){
                    p = p + result_data[key[k]][i] +'\n'
                }
                document.getElementById("findsomething_"+key[k]).style.whiteSpace="pre";
                document.getElementById("findsomething_"+key[k]).textContent=p;
            }
        }
    }
}

/**
 * 向 background.js 发送信息获取处理后的信息
 */
function get_info() {
    chrome.runtime.sendMessage({greeting: "get", current: window.location.href}, function(result_data) {
        let taskstatus = document.getElementById('findsomething_taskstatus');
        if(!taskstatus){
            return;
        }
        if(!result_data|| result_data['done']!='done'){
            // console.log('还未提取完成');
            if(result_data){
                show_info(result_data);

                taskstatus.textContent = "处理中.."+result_data['donetasklist'].length+"/"+result_data['tasklist'].length;
            }else{
                taskstatus.textContent = "处理中..";
            }
            sleep(100);
            get_info();
            return;
        }
        taskstatus.textContent = "处理完成："+result_data['donetasklist'].length+"/"+result_data['tasklist'].length;
        show_info(result_data);
        // 结果不一致继续刷新
        if(result_data['donetasklist'].length!=result_data['tasklist'].length){
            get_info();
        }
        return;
    });
}
get_info();