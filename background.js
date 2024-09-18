/**
 * 24-09-18
 * 处理目标信息
 */

var js = [];
var search_data = {};

// 静态资源
var static_file = ['.jpg','.png','.gif','.css','.svg','.ico','.js'];
// 单独列出来一个 .jsp
var non_static_file = ['.jsp']
// 预计提取并展示的信息
var key = ["ip","ip_port","domain","path","incomplete_path","url","sfz","mobile","mail","jwt","algorithm","secret"];
var not_sub_key = ["secret"];
var nuclei_regex = [
    /["']?zopim[_-]?account[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?zhuliang[_-]?gh[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?zensonatypepassword["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?zendesk[_-]?travis[_-]?github["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?yt[_-]?server[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?yt[_-]?partner[_-]?refresh[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?yt[_-]?partner[_-]?client[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?yt[_-]?client[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?yt[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?yt[_-]?account[_-]?refresh[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?yt[_-]?account[_-]?client[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?yangshun[_-]?gh[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?yangshun[_-]?gh[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?www[_-]?googleapis[_-]?com["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?wpt[_-]?ssh[_-]?private[_-]?key[_-]?base64["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?wpt[_-]?ssh[_-]?connect["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?wpt[_-]?report[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?wpt[_-]?prepare[_-]?dir["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?wpt[_-]?db[_-]?user["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?wpt[_-]?db[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?wporg[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?wpjm[_-]?phpunit[_-]?google[_-]?geocode[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?wordpress[_-]?db[_-]?user["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?wordpress[_-]?db[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?wincert[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?widget[_-]?test[_-]?server["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?widget[_-]?fb[_-]?password[_-]?3["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?widget[_-]?fb[_-]?password[_-]?2["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?widget[_-]?fb[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?widget[_-]?basic[_-]?password[_-]?5["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?widget[_-]?basic[_-]?password[_-]?4["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?widget[_-]?basic[_-]?password[_-]?3["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?widget[_-]?basic[_-]?password[_-]?2["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?widget[_-]?basic[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?watson[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?watson[_-]?device[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?watson[_-]?conversation[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?wakatime[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?vscetoken["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?visual[_-]?recognition[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?virustotal[_-]?apikey["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?vip[_-]?github[_-]?deploy[_-]?key[_-]?pass["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?vip[_-]?github[_-]?deploy[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?vip[_-]?github[_-]?build[_-]?repo[_-]?deploy[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?v[_-]?sfdc[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?v[_-]?sfdc[_-]?client[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?usertravis["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?user[_-]?assets[_-]?secret[_-]?access[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?user[_-]?assets[_-]?access[_-]?key[_-]?id["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?use[_-]?ssh["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?us[_-]?east[_-]?1[_-]?elb[_-]?amazonaws[_-]?com["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?urban[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?urban[_-]?master[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?urban[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?unity[_-]?serial["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?unity[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?twitteroauthaccesstoken["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?twitteroauthaccesssecret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?twitter[_-]?consumer[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?twitter[_-]?consumer[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?twine[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?twilio[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?twilio[_-]?sid["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?twilio[_-]?configuration[_-]?sid["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?twilio[_-]?chat[_-]?account[_-]?api[_-]?service["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?twilio[_-]?api[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?twilio[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?trex[_-]?okta[_-]?client[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?trex[_-]?client[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?travis[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?travis[_-]?secure[_-]?env[_-]?vars["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?travis[_-]?pull[_-]?request["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?travis[_-]?gh[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?travis[_-]?e2e[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?travis[_-]?com[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?travis[_-]?branch["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?travis[_-]?api[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?travis[_-]?access[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?token[_-]?core[_-]?java["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?thera[_-]?oss[_-]?access[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?tester[_-]?keys[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?test[_-]?test["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?test[_-]?github[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?tesco[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?svn[_-]?pass["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?surge[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?surge[_-]?login["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?stripe[_-]?public["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?stripe[_-]?private["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?strip[_-]?secret[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?strip[_-]?publishable[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?stormpath[_-]?api[_-]?key[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?stormpath[_-]?api[_-]?key[_-]?id["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?starship[_-]?auth[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?starship[_-]?account[_-]?sid["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?star[_-]?test[_-]?secret[_-]?access[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?star[_-]?test[_-]?location["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?star[_-]?test[_-]?bucket["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?star[_-]?test[_-]?aws[_-]?access[_-]?key[_-]?id["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?staging[_-]?base[_-]?url[_-]?runscope["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ssmtp[_-]?config["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?sshpass["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?srcclr[_-]?api[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?square[_-]?reader[_-]?sdk[_-]?repository[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?sqssecretkey["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?sqsaccesskey["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?spring[_-]?mail[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?spotify[_-]?api[_-]?client[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?spotify[_-]?api[_-]?access[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?spaces[_-]?secret[_-]?access[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?spaces[_-]?access[_-]?key[_-]?id["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?soundcloud[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?soundcloud[_-]?client[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?sonatypepassword["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?sonatype[_-]?token[_-]?user["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?sonatype[_-]?token[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?sonatype[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?sonatype[_-]?pass["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?sonatype[_-]?nexus[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?sonatype[_-]?gpg[_-]?passphrase["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?sonatype[_-]?gpg[_-]?key[_-]?name["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?sonar[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?sonar[_-]?project[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?sonar[_-]?organization[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?socrata[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?socrata[_-]?app[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?snyk[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?snyk[_-]?api[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?snoowrap[_-]?refresh[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?snoowrap[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?snoowrap[_-]?client[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?slate[_-]?user[_-]?email["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?slash[_-]?developer[_-]?space[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?slash[_-]?developer[_-]?space["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?signing[_-]?key[_-]?sid["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?signing[_-]?key[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?signing[_-]?key[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?signing[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?setsecretkey["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?setdstsecretkey["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?setdstaccesskey["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ses[_-]?secret[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ses[_-]?access[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?service[_-]?account[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?sentry[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?sentry[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?sentry[_-]?endpoint["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?sentry[_-]?default[_-]?org["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?sentry[_-]?auth[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?sendwithus[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?sendgrid[_-]?username["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?sendgrid[_-]?user["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?sendgrid[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?sendgrid[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?sendgrid[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?sendgrid["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?selion[_-]?selenium[_-]?host["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?selion[_-]?log[_-]?level[_-]?dev["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?segment[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?secretid["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?secretkey["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?secretaccesskey["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?secret[_-]?key[_-]?base["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?secret[_-]?9["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?secret[_-]?8["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?secret[_-]?7["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?secret[_-]?6["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?secret[_-]?5["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?secret[_-]?4["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?secret[_-]?3["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?secret[_-]?2["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?secret[_-]?11["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?secret[_-]?10["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?secret[_-]?1["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?secret[_-]?0["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?sdr[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?scrutinizer[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?sauce[_-]?access[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?sandbox[_-]?aws[_-]?secret[_-]?access[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?sandbox[_-]?aws[_-]?access[_-]?key[_-]?id["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?sandbox[_-]?access[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?salesforce[_-]?bulk[_-]?test[_-]?security[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?salesforce[_-]?bulk[_-]?test[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?sacloud[_-]?api["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?sacloud[_-]?access[_-]?token[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?sacloud[_-]?access[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?s3[_-]?user[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?s3[_-]?secret[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?s3[_-]?secret[_-]?assets["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?s3[_-]?secret[_-]?app[_-]?logs["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?s3[_-]?key[_-]?assets["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?s3[_-]?key[_-]?app[_-]?logs["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?s3[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?s3[_-]?external[_-]?3[_-]?amazonaws[_-]?com["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?s3[_-]?bucket[_-]?name[_-]?assets["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?s3[_-]?bucket[_-]?name[_-]?app[_-]?logs["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?s3[_-]?access[_-]?key[_-]?id["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?s3[_-]?access[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?rubygems[_-]?auth[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?rtd[_-]?store[_-]?pass["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?rtd[_-]?key[_-]?pass["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?route53[_-]?access[_-]?key[_-]?id["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ropsten[_-]?private[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?rinkeby[_-]?private[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?rest[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?repotoken["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?reporting[_-]?webdav[_-]?url["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?reporting[_-]?webdav[_-]?pwd["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?release[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?release[_-]?gh[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?registry[_-]?secure["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?registry[_-]?pass["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?refresh[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?rediscloud[_-]?url["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?redis[_-]?stunnel[_-]?urls["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?randrmusicapiaccesstoken["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?rabbitmq[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?quip[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?qiita[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?pypi[_-]?passowrd["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?pushover[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?publish[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?publish[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?publish[_-]?access["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?project[_-]?config["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?prod[_-]?secret[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?prod[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?prod[_-]?access[_-]?key[_-]?id["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?private[_-]?signing[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?pring[_-]?mail[_-]?username["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?preferred[_-]?username["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?prebuild[_-]?auth["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?postgresql[_-]?pass["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?postgresql[_-]?db["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?postgres[_-]?env[_-]?postgres[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?postgres[_-]?env[_-]?postgres[_-]?db["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?plugin[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?plotly[_-]?apikey["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?places[_-]?apikey["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?places[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?pg[_-]?host["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?pg[_-]?database["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?personal[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?personal[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?percy[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?percy[_-]?project["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?paypal[_-]?client[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?passwordtravis["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?parse[_-]?js[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?pagerduty[_-]?apikey["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?packagecloud[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ossrh[_-]?username["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ossrh[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ossrh[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ossrh[_-]?pass["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ossrh[_-]?jira[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?os[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?os[_-]?auth[_-]?url["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?org[_-]?project[_-]?gradle[_-]?sonatype[_-]?nexus[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?org[_-]?gradle[_-]?project[_-]?sonatype[_-]?nexus[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?openwhisk[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?open[_-]?whisk[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?onesignal[_-]?user[_-]?auth[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?onesignal[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?omise[_-]?skey["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?omise[_-]?pubkey["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?omise[_-]?pkey["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?omise[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?okta[_-]?oauth2[_-]?clientsecret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?okta[_-]?oauth2[_-]?client[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?okta[_-]?client[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ofta[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ofta[_-]?region["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ofta[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?octest[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?octest[_-]?app[_-]?username["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?octest[_-]?app[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?oc[_-]?pass["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?object[_-]?store[_-]?creds["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?object[_-]?store[_-]?bucket["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?object[_-]?storage[_-]?region[_-]?name["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?object[_-]?storage[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?oauth[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?numbers[_-]?service[_-]?pass["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?nuget[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?nuget[_-]?apikey["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?nuget[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?npm[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?npm[_-]?secret[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?npm[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?npm[_-]?email["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?npm[_-]?auth[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?npm[_-]?api[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?npm[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?now[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?non[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?node[_-]?pre[_-]?gyp[_-]?secretaccesskey["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?node[_-]?pre[_-]?gyp[_-]?github[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?node[_-]?pre[_-]?gyp[_-]?accesskeyid["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?node[_-]?env["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ngrok[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ngrok[_-]?auth[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?nexuspassword["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?nexus[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?new[_-]?relic[_-]?beta[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?netlify[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?nativeevents["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?mysqlsecret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?mysqlmasteruser["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?mysql[_-]?username["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?mysql[_-]?user["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?mysql[_-]?root[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?mysql[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?mysql[_-]?hostname["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?mysql[_-]?database["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?my[_-]?secret[_-]?env["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?multi[_-]?workspace[_-]?sid["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?multi[_-]?workflow[_-]?sid["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?multi[_-]?disconnect[_-]?sid["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?multi[_-]?connect[_-]?sid["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?multi[_-]?bob[_-]?sid["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?minio[_-]?secret[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?minio[_-]?access[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?mile[_-]?zero[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?mh[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?mh[_-]?apikey["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?mg[_-]?public[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?mg[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?mapboxaccesstoken["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?mapbox[_-]?aws[_-]?secret[_-]?access[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?mapbox[_-]?aws[_-]?access[_-]?key[_-]?id["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?mapbox[_-]?api[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?mapbox[_-]?access[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?manifest[_-]?app[_-]?url["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?manifest[_-]?app[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?mandrill[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?managementapiaccesstoken["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?management[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?manage[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?manage[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?mailgun[_-]?secret[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?mailgun[_-]?pub[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?mailgun[_-]?pub[_-]?apikey["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?mailgun[_-]?priv[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?mailgun[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?mailgun[_-]?apikey["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?mailgun[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?mailer[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?mailchimp[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?mailchimp[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?mail[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?magento[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?magento[_-]?auth[_-]?username ["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?magento[_-]?auth[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?lottie[_-]?upload[_-]?cert[_-]?key[_-]?store[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?lottie[_-]?upload[_-]?cert[_-]?key[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?lottie[_-]?s3[_-]?secret[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?lottie[_-]?happo[_-]?secret[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?lottie[_-]?happo[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?looker[_-]?test[_-]?runner[_-]?client[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ll[_-]?shared[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ll[_-]?publish[_-]?url["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?linux[_-]?signing[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?linkedin[_-]?client[_-]?secretor lottie[_-]?s3[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?lighthouse[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?lektor[_-]?deploy[_-]?username["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?lektor[_-]?deploy[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?leanplum[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?kxoltsn3vogdop92m["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?kubeconfig["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?kubecfg[_-]?s3[_-]?path["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?kovan[_-]?private[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?keystore[_-]?pass["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?kafka[_-]?rest[_-]?url["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?kafka[_-]?instance[_-]?name["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?kafka[_-]?admin[_-]?url["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?jwt[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?jdbc:mysql["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?jdbc[_-]?host["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?jdbc[_-]?databaseurl["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?itest[_-]?gh[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ios[_-]?docs[_-]?deploy[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?internal[_-]?secrets["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?integration[_-]?test[_-]?appid["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?integration[_-]?test[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?index[_-]?name["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ij[_-]?repo[_-]?username["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ij[_-]?repo[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?hub[_-]?dxia2[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?homebrew[_-]?github[_-]?api[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?hockeyapp[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?heroku[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?heroku[_-]?email["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?heroku[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?hb[_-]?codesign[_-]?key[_-]?pass["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?hb[_-]?codesign[_-]?gpg[_-]?pass["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?hab[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?hab[_-]?auth[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?grgit[_-]?user["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?gren[_-]?github[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?gradle[_-]?signing[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?gradle[_-]?signing[_-]?key[_-]?id["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?gradle[_-]?publish[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?gradle[_-]?publish[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?gpg[_-]?secret[_-]?keys["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?gpg[_-]?private[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?gpg[_-]?passphrase["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?gpg[_-]?ownertrust["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?gpg[_-]?keyname["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?gpg[_-]?key[_-]?name["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?google[_-]?private[_-]?key[_-]?(id)?["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?google[_-]?maps[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?google[_-]?client[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?google[_-]?client[_-]?id["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?google[_-]?client[_-]?email["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?google[_-]?account[_-]?type["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?gogs[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?gitlab[_-]?user[_-]?email["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?github[_-]?tokens["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?github[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?github[_-]?repo["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?github[_-]?release[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?github[_-]?pwd["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?github[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?github[_-]?oauth[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?github[_-]?oauth["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?github[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?github[_-]?hunter[_-]?username["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?github[_-]?hunter[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?github[_-]?deployment[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?github[_-]?deploy[_-]?hb[_-]?doc[_-]?pass["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?github[_-]?client[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?github[_-]?auth[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?github[_-]?auth["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?github[_-]?api[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?github[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?github[_-]?access[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?git[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?git[_-]?name["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?git[_-]?email["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?git[_-]?committer[_-]?name["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?git[_-]?committer[_-]?email["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?git[_-]?author[_-]?name["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?git[_-]?author[_-]?email["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ghost[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ghb[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?gh[_-]?unstable[_-]?oauth[_-]?client[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?gh[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?gh[_-]?repo[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?gh[_-]?oauth[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?gh[_-]?oauth[_-]?client[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?gh[_-]?next[_-]?unstable[_-]?oauth[_-]?client[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?gh[_-]?next[_-]?unstable[_-]?oauth[_-]?client[_-]?id["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?gh[_-]?next[_-]?oauth[_-]?client[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?gh[_-]?email["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?gh[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?gcs[_-]?bucket["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?gcr[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?gcloud[_-]?service[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?gcloud[_-]?project["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?gcloud[_-]?bucket["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ftp[_-]?username["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ftp[_-]?user["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ftp[_-]?pw["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ftp[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ftp[_-]?login["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ftp[_-]?host["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?fossa[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?flickr[_-]?api[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?flickr[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?flask[_-]?secret[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?firefox[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?firebase[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?firebase[_-]?project[_-]?develop["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?firebase[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?firebase[_-]?api[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?firebase[_-]?api[_-]?json["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?file[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?exp[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?eureka[_-]?awssecretkey["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?env[_-]?sonatype[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?env[_-]?secret[_-]?access[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?env[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?env[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?env[_-]?heroku[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?env[_-]?github[_-]?oauth[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?end[_-]?user[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?encryption[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?elasticsearch[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?elastic[_-]?cloud[_-]?auth["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?dsonar[_-]?projectkey["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?dsonar[_-]?login["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?droplet[_-]?travis[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?dropbox[_-]?oauth[_-]?bearer["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?doordash[_-]?auth[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?dockerhubpassword["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?dockerhub[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?docker[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?docker[_-]?postgres[_-]?url["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?docker[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?docker[_-]?passwd["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?docker[_-]?pass["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?docker[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?docker[_-]?hub[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?digitalocean[_-]?ssh[_-]?key[_-]?ids["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?digitalocean[_-]?ssh[_-]?key[_-]?body["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?digitalocean[_-]?access[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?dgpg[_-]?passphrase["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?deploy[_-]?user["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?deploy[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?deploy[_-]?secure["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?deploy[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ddgc[_-]?github[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ddg[_-]?test[_-]?email[_-]?pw["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ddg[_-]?test[_-]?email["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?db[_-]?username["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?db[_-]?user["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?db[_-]?pw["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?db[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?db[_-]?host["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?db[_-]?database["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?db[_-]?connection["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?datadog[_-]?app[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?datadog[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?database[_-]?username["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?database[_-]?user["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?database[_-]?port["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?database[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?database[_-]?name["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?database[_-]?host["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?danger[_-]?github[_-]?api[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?cypress[_-]?record[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?coverity[_-]?scan[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?coveralls[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?coveralls[_-]?repo[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?coveralls[_-]?api[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?cos[_-]?secrets["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?conversation[_-]?username["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?conversation[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?contentful[_-]?v2[_-]?access[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?contentful[_-]?test[_-]?org[_-]?cma[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?contentful[_-]?php[_-]?management[_-]?test[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?contentful[_-]?management[_-]?api[_-]?access[_-]?token[_-]?new["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?contentful[_-]?management[_-]?api[_-]?access[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?contentful[_-]?integration[_-]?management[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?contentful[_-]?cma[_-]?test[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?contentful[_-]?access[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?consumerkey["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?consumer[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?conekta[_-]?apikey["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?coding[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?codecov[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?codeclimate[_-]?repo[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?codacy[_-]?project[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?cocoapods[_-]?trunk[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?cocoapods[_-]?trunk[_-]?email["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?cn[_-]?secret[_-]?access[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?cn[_-]?access[_-]?key[_-]?id["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?clu[_-]?ssh[_-]?private[_-]?key[_-]?base64["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?clu[_-]?repo[_-]?url["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?cloudinary[_-]?url[_-]?staging["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?cloudinary[_-]?url["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?cloudflare[_-]?email["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?cloudflare[_-]?auth[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?cloudflare[_-]?auth[_-]?email["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?cloudflare[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?cloudant[_-]?service[_-]?database["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?cloudant[_-]?processed[_-]?database["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?cloudant[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?cloudant[_-]?parsed[_-]?database["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?cloudant[_-]?order[_-]?database["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?cloudant[_-]?instance["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?cloudant[_-]?database["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?cloudant[_-]?audited[_-]?database["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?cloudant[_-]?archived[_-]?database["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?cloud[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?clojars[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?client[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?cli[_-]?e2e[_-]?cma[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?claimr[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?claimr[_-]?superuser["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?claimr[_-]?db["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?claimr[_-]?database["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ci[_-]?user[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ci[_-]?server[_-]?name["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ci[_-]?registry[_-]?user["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ci[_-]?project[_-]?url["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ci[_-]?deploy[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?chrome[_-]?refresh[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?chrome[_-]?client[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?cheverny[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?cf[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?certificate[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?censys[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?cattle[_-]?secret[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?cattle[_-]?agent[_-]?instance[_-]?auth["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?cattle[_-]?access[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?cargo[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?cache[_-]?s3[_-]?secret[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?bx[_-]?username["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?bx[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?bundlesize[_-]?github[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?built[_-]?branch[_-]?deploy[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?bucketeer[_-]?aws[_-]?secret[_-]?access[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?bucketeer[_-]?aws[_-]?access[_-]?key[_-]?id["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?browserstack[_-]?access[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?browser[_-]?stack[_-]?access[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?brackets[_-]?repo[_-]?oauth[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?bluemix[_-]?username["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?bluemix[_-]?pwd["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?bluemix[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?bluemix[_-]?pass[_-]?prod["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?bluemix[_-]?pass["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?bluemix[_-]?auth["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?bluemix[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?bintraykey["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?bintray[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?bintray[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?bintray[_-]?gpg[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?bintray[_-]?apikey["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?bintray[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?b2[_-]?bucket["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?b2[_-]?app[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?awssecretkey["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?awscn[_-]?secret[_-]?access[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?awscn[_-]?access[_-]?key[_-]?id["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?awsaccesskeyid["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?aws[_-]?ses[_-]?secret[_-]?access[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?aws[_-]?ses[_-]?access[_-]?key[_-]?id["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?aws[_-]?secrets["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?aws[_-]?secret[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?aws[_-]?secret[_-]?access[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?aws[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?aws[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?aws[_-]?config[_-]?secretaccesskey["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?aws[_-]?config[_-]?accesskeyid["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?aws[_-]?access[_-]?key[_-]?id["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?aws[_-]?access[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?aws[_-]?access["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?author[_-]?npm[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?author[_-]?email[_-]?addr["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?auth0[_-]?client[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?auth0[_-]?api[_-]?clientsecret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?auth[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?assistant[_-]?iam[_-]?apikey["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?artifacts[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?artifacts[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?artifacts[_-]?bucket["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?artifacts[_-]?aws[_-]?secret[_-]?access[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?artifacts[_-]?aws[_-]?access[_-]?key[_-]?id["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?artifactory[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?argos[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?apple[_-]?id[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?appclientsecret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?app[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?app[_-]?secrete["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?app[_-]?report[_-]?token[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?app[_-]?bucket[_-]?perm["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?apigw[_-]?access[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?apiary[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?api[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?api[_-]?key[_-]?sid["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?api[_-]?key[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?aos[_-]?sec["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?aos[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?ansible[_-]?vault[_-]?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?android[_-]?docs[_-]?deploy[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?anaconda[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?amazon[_-]?secret[_-]?access[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?amazon[_-]?bucket[_-]?name["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?alicloud[_-]?secret[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?alicloud[_-]?access[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?alias[_-]?pass["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?algolia[_-]?search[_-]?key[_-]?1["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?algolia[_-]?search[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?algolia[_-]?search[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?algolia[_-]?api[_-]?key[_-]?search["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?algolia[_-]?api[_-]?key[_-]?mcm["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?algolia[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?algolia[_-]?admin[_-]?key[_-]?mcm["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?algolia[_-]?admin[_-]?key[_-]?2["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?algolia[_-]?admin[_-]?key[_-]?1["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?air[-_]?table[-_]?api[-_]?key["']?[=:]["']?.+["']/gi,
    /["']?adzerk[_-]?api[_-]?key["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?admin[_-]?email["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?account[_-]?sid["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?access[_-]?token["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?access[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?access[_-]?key[_-]?secret["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?account["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?password["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?username["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?[\w_-]*?password[\w_-]*?["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?[\w_-]*?username[\w_-]*?["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?[\w_-]*?accesskey[\w_-]*?["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?[\w_-]*?secret[\w_-]*?["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?[\w_-]*?bucket[\w_-]*?["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?[\w_-]*?token[\w_-]*?["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?[-]+BEGIN \w+ PRIVATE KEY[-]+/gi,
    /["']?huawei\.oss\.(ak|sk|bucket\.name|endpoint|local\.path)["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?private[_-]?key[_-]?(id)?["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /["']?account[_-]?(name|key)?["']?[^\S\r\n]*[=:][^\S\r\n]*["']?[\w-]+["']?/gi,
    /LTAI[A-Za-z\d]{12,30}/g,
    /AKID[A-Za-z\d]{13,40}/g,
    /JDC_[0-9A-Z]{25,40}/g,
    /["']?(?:A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}["']?/g,
    /(?:AKLT|AKTP)[a-zA-Z0-9]{35,50}/g,
    /AKLT[a-zA-Z0-9-_]{16,28}/g,
    /AIza[0-9A-Za-z_\-]{35}/g,
    /[Bb]earer\s+[a-zA-Z0-9\-=._+/\\]{20,500}/g,
    /[Bb]asic\s+[A-Za-z0-9+/]{18,}={0,2}/g,
    /["''\[]*[Aa]uthorization["''\]]*\s*[:=]\s*[''"]?\b(?:[Tt]oken\s+)?[a-zA-Z0-9\-_+/]{20,500}[''"]?/g,
    /(glpat-[a-zA-Z0-9\-=_]{20,22})/g,
    /((?:ghp|gho|ghu|ghs|ghr|github_pat)_[a-zA-Z0-9_]{36,255})/g,
    /APID[a-zA-Z0-9]{32,42}/g,
    /["'](wx[a-z0-9]{15,18})["']/g,
    /["'](ww[a-z0-9]{15,18})["']/g,
    /["'](gh_[a-z0-9]{11,13})["']/g,
    /(?:admin_?pass|password|[a-z]{3,15}_?password|user_?pass|user_?pwd|admin_?pwd)\\?['"]*\s*[:=]\s*\\?['"][a-z0-9!@#$%&*]{5,20}\\?['"]/gi,
    /https:\/\/qyapi\.weixin\.qq\.com\/cgi\-bin\/webhook\/send\?key=[a-zA-Z0-9\-]{25,50}/gi,
    /https:\/\/oapi\.dingtalk\.com\/robot\/send\?access_token=[a-z0-9]{50,80}/gi,
    /https:\/\/open\.feishu\.cn\/open\-apis\/bot\/v2\/hook\/[a-z0-9\-]{25,50}/gi,
    /https:\/\/hooks\.slack\.com\/services\/[a-zA-Z0-9\-_]{6,12}\/[a-zA-Z0-9\-_]{6,12}\/[a-zA-Z0-9\-_]{15,24}/gi,
    /eyJrIjoi[a-zA-Z0-9\-_+/]{50,100}={0,2}/g,
    /glc_[A-Za-z0-9\-_+/]{32,200}={0,2}/g,
    /glsa_[A-Za-z0-9]{32}_[A-Fa-f0-9]{8}/g,
]
var tab_url = {};
var selected_id = -1;

// 
function get_js(){
	return js;
}

// 
function add_js(js_name) {
	js.push(js_name);
}

// 
function unique(arr1){
  if(arr1 == 'null'){
    return null;
  }
  let arr2=[];
  arr1.forEach(function (item,index,array) {
    // console.log(item, arr2.indexOf(item), arr2)
    if(arr2.indexOf(item)==-1){
      arr2.push(item)
    }
  })
  // for (var i = 0;i<arr.length;i++){
  //   if (array.indexOf(arr[i])===-1){
  //     array.push(arr[i])
  //   }
  // }
  return arr2
}

// 查找 search_data中 是否已经存在了，如果已存在则不返回
function find(arr1,arr2) {
  var arr3 = []
  arr1.forEach(function (item,index,array) {
    if(arr2.indexOf(item)==-1){
      arr3.push(item)
    }
  })
  return arr3
}

// 去重合并两个数组 并集
function add(arr1,arr2) {
  if(!arr1){
    return arr2
  }
  if(!arr2){
    return arr1
  }
  arr1.forEach(function (item,index,array) {
    if(arr2.indexOf(item)==-1){
      arr2.push(item)
    }
  })
  return arr2
}

// 交集
function jiaoji(arr1,arr2) {
  var arr3 = [];
  arr1.forEach(function (item,index,array) {
    if(arr2.indexOf(item)>-1){
      arr3.push(item)
    }
  })
  return arr3
}

// 从 arr1 中收集静态文件并添加到 arr2
function collect_static(arr1,arr2) {
  var arr3 = arr1.slice(0,arr1.length);
  arr1.forEach(function (item,index,array) {
    for (var i = 0; i < static_file.length; i++) {
      if(item.indexOf(static_file[i])!=-1){
        if(static_file[i]=='.js' && item.indexOf('.jsp')!=-1){
           continue
        }
        arr3.splice(arr3.indexOf(item),1)
        if(arr2.indexOf(item)==-1){
            arr2.push(item)
        }
      }
    }
  })
  return {'arr1':arr3,'static':arr2}
}

// 处理一个字符串数组 arr1，去掉每个字符串开头和结尾的引号（单引号或双引号），并返回一个新的数组 arr3
function sub_1(arr1) {
  var arr3 = []
  arr1.forEach(function (item,index,array) {
    let start = 0
    let end = 0
    if(item.startsWith("'") || item.startsWith('"')){
        start = 1
    }
    if(item.endsWith("'") || item.endsWith('"')){
        end = 1
    }
    arr3.push(item.substring(start,item.length-end))
  })
  return arr3
}

// 提取 js 中的敏感信息，使用 nuclei 的正则
// https://github.com/projectdiscovery/nuclei
function get_secret(data) {
    // console.log("get_secret");
    // console.time();
    var result = [];
    for (var i = nuclei_regex.length - 1; i >= 0; i--) {
        var tmp_result = data.match(nuclei_regex[i]);
        if (tmp_result != null){
            for(var j in tmp_result){
                result.push(tmp_result[j]);
            }
        }

    }
    // console.log(data);
    // console.log(result);
    // console.timeEnd();
    return result;
}

// 输入的字符串 data 中提取各种信息，包括身份证号、手机号码、邮箱、IP 地址、域名、路径、URL、JWT 和加密算法
// 数据提取放到background里，避免前端加载时阻塞
function extract_info(data) {
  // console.log('extraInfo');
  var extract_data = {}
  // 大量的正则匹配信息
  extract_data['sfz'] = data.match(/['"]((\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(\d{6}(18|19|20)\d{2}(0[1-9]|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)))['"]/g);
  extract_data['mobile'] = data.match(/['"](1(3([0-35-9]\d|4[1-8])|4[14-9]\d|5([\d]\d|7[1-79])|66\d|7[2-35-8]\d|8\d{2}|9[89]\d)\d{7})['"]/g);
  extract_data['mail'] = data.match(/['"][a-zA-Z0-9\._\-]*@[a-zA-Z0-9\._\-]{1,63}\.((?!js|css|jpg|jpeg|png|ico)[a-zA-Z]{2,})['"]/g);
  extract_data['ip'] = data.match(/['"](([a-zA-Z0-9]+:)?\/\/)?\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(\/.*?)?['"]/g);
  extract_data['ip_port'] = data.match(/['"](([a-zA-Z0-9]+:)?\/\/)?\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\:\d{1,5}(\/.*?)?['"]/g);
  extract_data['domain'] = data.match(/['"](([a-zA-Z0-9]+:)?\/\/)?[a-zA-Z0-9\-\.]*?\.(xin|com|cn|net|com.cn|vip|top|cc|shop|club|wang|xyz|luxe|site|news|pub|fun|online|win|red|loan|ren|mom|net.cn|org|link|biz|bid|help|tech|date|mobi|so|me|tv|co|vc|pw|video|party|pics|website|store|ltd|ink|trade|live|wiki|space|gift|lol|work|band|info|click|photo|market|tel|social|press|game|kim|org.cn|games|pro|men|love|studio|rocks|asia|group|science|design|software|engineer|lawyer|fit|beer|tw|我爱你|中国|公司|网络|在线|网址|网店|集团|中文网)(\:\d{1,5})?(\/)?['"]/g);
  extract_data['path'] = data.match(/['"](?:\/|\.\.\/|\.\/)[^\/\>\< \)\(\{\}\,\'\"\\]([^\>\< \)\(\{\}\,\'\"\\])*?['"]/g);
  extract_data['incomplete_path'] = data.match(/['"][^\/\>\< \)\(\{\}\,\'\"\\][\w\/]*?\/[\w\/]*?['"]/g);
  extract_data['url'] = data.match(/['"](([a-zA-Z0-9]+:)?\/\/)?[a-zA-Z0-9\-\.]*?\.(xin|com|cn|net|com.cn|vip|top|cc|shop|club|wang|xyz|luxe|site|news|pub|fun|online|win|red|loan|ren|mom|net.cn|org|link|biz|bid|help|tech|date|mobi|so|me|tv|co|vc|pw|video|party|pics|website|store|ltd|ink|trade|live|wiki|space|gift|lol|work|band|info|click|photo|market|tel|social|press|game|kim|org.cn|games|pro|men|love|studio|rocks|asia|group|science|design|software|engineer|lawyer|fit|beer|tw|我爱你|中国|公司|网络|在线|网址|网店|集团|中文网)(\:\d{1,5})?(\/.*?)?['"]/g);
  extract_data['jwt'] = data.match(/['"](ey[A-Za-z0-9_-]{10,}\.[A-Za-z0-9._-]{10,}|ey[A-Za-z0-9_\/+-]{10,}\.[A-Za-z0-9._\/+-]{10,})['"]/g);
  // search_data['algorithm'] = data.match(/\WBase64\.encode\(|\WBase64\.decode\(|\Wbtoa\(|\Watob\(|\WCryptoJS\.AES\.|\WCryptoJS\.DES\.|\WJSEncrypt\(|\Wrsa\.|\WKJUR\.|\W$\.md5\(|\Wmd5\(|\Wsha1\(|\Wsha256\(|\Wsha512\(/gi);
  extract_data['algorithm'] = data.match(/\W(Base64\.encode|Base64\.decode|btoa|atob|CryptoJS\.AES|CryptoJS\.DES|JSEncrypt|rsa|KJUR|$\.md5|md5|sha1|sha256|sha512)[\(\.]/gi);
  extract_data['secret'] = get_secret(data);
  if (extract_data['url']){
        extract_data['url'].map((url)=>{
        extract_data['ip'] = add(extract_data['ip'], url.match(/['"](([a-zA-Z0-9]+:)?\/\/)?\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g))
        extract_data['ip_port'] = add(extract_data['ip_port'], url.match(/['"](([a-zA-Z0-9]+:)?\/\/)?\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\:\d{1,5}(\/.*?)?['"]/g))
        extract_data['domain'] = add(extract_data['domain'], url.match(/['"](([a-zA-Z0-9]+:)?\/\/)?[a-zA-Z0-9\-\.]*?\.(xin|com|cn|net|com.cn|vip|top|cc|shop|club|wang|xyz|luxe|site|news|pub|fun|online|win|red|loan|ren|mom|net.cn|org|link|biz|bid|help|tech|date|mobi|so|me|tv|co|vc|pw|video|party|pics|website|store|ltd|ink|trade|live|wiki|space|gift|lol|work|band|info|click|photo|market|tel|social|press|game|kim|org.cn|games|pro|men|love|studio|rocks|asia|group|science|design|software|engineer|lawyer|fit|beer|tw|我爱你|中国|公司|网络|在线|网址|网店|集团|中文网)(\:\d{1,5})?/g))
      })
  }
  return extract_data;
}

// 设置点基本信息，webhook() 中使用
var myHeaders = new Headers();
myHeaders.append('accept', '*/*');

// 将提取到的数据通过 webhook 发送到指定的 URL
function webhook(data) {
  // 将 search_data 中对应 data 的内容转换为 JSON 字符串
  data = JSON.stringify(search_data[data]);

  // 从 local storage 中提取 webhook 设置
  chrome.storage.local.get(["webhook_setting"], function(settings){
      // 检查设置是否存在或有效
      if(!settings || !settings["webhook_setting"] || settings["webhook_setting"] == {} || settings["webhook_setting"] == undefined){
          // 如果获取 webhook 设置失败，则返回
          return;
      }
      
      // 初始化 webhook 请求的配置
      let webhookInit = {
          method: 'GET', // 默认请求方法为 GET
          headers: myHeaders, // 使用预定义的请求头
          mode: 'cors', // 设置跨域请求模式
          cache: 'default', // 默认缓存策略
          credentials: 'include' // 包含凭据
      };
      
      // 创建一个新的 Headers 对象用于存储自定义请求头
      let webhookHeaders = new Headers();
      
      // 检查 webhook 设置中的 URL 是否不为空
      if (settings["webhook_setting"]['url'] != "") {
          var url = settings["webhook_setting"]['url']; // 获取 webhook URL
          
          // 根据设置的请求方法进行处理
          if (settings["webhook_setting"]['method'] == "GET") {
              // 如果是 GET 方法，将数据作为查询参数附加到 URL
              url = url + "?" + settings["webhook_setting"]['arg'] + "=" + data;
          } else if (settings["webhook_setting"]['method'] == "POST") {
              // 如果是 POST 方法，设置请求头的内容类型
              webhookHeaders.append("Content-Type", "application/json");
              webhookInit['method'] = "POST"; // 更新请求方法为 POST
              
              // 根据设置的参数构建请求体
              if (settings["webhook_setting"]['arg'] != "") {
                  webhookInit['body'] = settings["webhook_setting"]['arg'] + "=" + data;
              } else {
                  webhookInit['body'] = data; // 直接使用数据作为请求体
              }
          } else {
              // 如果请求方法不在预期范围内，输出错误信息
              console.log("webhook method error:" + settings["webhook_setting"]['method']);
          }
          
          // 检查是否有自定义请求头
          if (settings["webhook_setting"]['headers'] != {}) {
              // 遍历自定义请求头并添加到 Headers 对象中
              for (let i in settings["webhook_setting"]['headers']) {
                  webhookHeaders.append(i, settings["webhook_setting"]['headers'][i]);
              }
          }
          
          // 将自定义请求头添加到请求配置中
          webhookInit["headers"] = webhookHeaders;
          // 创建一个新的请求对象
          let webhookRequest = new Request(url, webhookInit);
          
          // 发送 fetch 请求
          fetch(webhookRequest, webhookInit).then(function(response) {
              // 处理响应（此处可以添加响应处理逻辑）
          }).catch(err => {
              // 捕获并输出请求错误
              console.log("webhook fetch error", err);
          });
      }
  });
}

// 更新当前任务的计数，并在任务完成时触发 webhook
function refresh_count() {
  const cur = tab_url[selected_id];
  let cnt = 0;
  for (const k in search_data[cur]) {
    if (k == "done" || k == "tasklist" || k == "donetasklist" || k == "current" || k == "pretasknum")
      continue;
    const v = search_data[cur][k];
    if (v == "🈚️" || v == "") continue;
    cnt++;
  }
  chrome.action.setBadgeText({ text: "" + cnt });
  if(search_data[cur] && search_data[cur]['donetasklist'] && search_data[cur]['pretasknum'] && search_data[cur]['donetasklist'].length==search_data[cur]['pretasknum']){
    console.log(search_data[cur]['pretasknum'],search_data[cur]['donetasklist'].length,search_data[cur]['tasklist'].length)
    search_data[cur]['done'] = 'done'
    chrome.storage.local.set({["findsomething_result_"+cur]: search_data[cur]}, function(){});
    refresh_storage_expire_index(cur)
    webhook(cur);
  }
}
function refresh_storage_expire_index(cur) {
  console.log("refresh_storage_expire_index:"+cur)
  chrome.storage.local.get(["expire_index"], function(expire_index){
    expire_index = expire_index["expire_index"]
    if(!expire_index){
      expire_index = {}
    }
    const today = new Date();
    const todaystr = today.toLocaleDateString('cn', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '');
    expire_index[cur]=todaystr;
    chrome.storage.local.set({["expire_index"]: expire_index}, function(){} )
  })
}


// 持久化临时数据到 search_data 中
function persist_tmp_data(tmp_data, req_url, current) {
  // 遍历所有数据类型
  for (var i = 0; i < key.length; i++) {
      // 如果传入的数据没有这个类型，就跳过
      if (tmp_data[key[i]] == null) {
          continue; // 继续下一个循环
      }
      
      // 如果当前数据类型不在不处理的子键列表中，则进行处理
      if (not_sub_key.indexOf(key[i]) < 0) {
          // 调用 sub_1 函数处理数据，去掉开头和结尾的引号
          tmp_data[key[i]] = sub_1(tmp_data[key[i]]);
      }
      
      // 将处理后的数据项映射到 search_data 的 source 中
      tmp_data[key[i]].map((item) => {
          search_data[tmp_data['current']]['source'][item] = req_url; // 记录数据来源
      });

      // 检查 search_data 中是否已有历史数据
      if (tmp_data['current'] in search_data && search_data[tmp_data['current']][key[i]] != null) {
          // 合并当前数据和历史数据，并去重
          var search_data_value = unique(add(search_data[tmp_data['current']][key[i]], tmp_data[key[i]])).sort();
          
          // 检查是否存在静态文件数据
          if ('static' in search_data[tmp_data['current']]) {
              // 调用 collect_static 函数处理静态文件
              var res = collect_static(search_data_value, search_data[tmp_data['current']]['static']);
          } else {
              // 如果没有静态文件数据，则直接处理
              var res = collect_static(search_data_value, []);
          }
          
          // 更新 search_data 中的当前数据和静态文件
          search_data[tmp_data['current']][key[i]] = res['arr1']; // 更新当前数据
          search_data[tmp_data['current']]['static'] = res['static']; // 更新静态文件
      } else {
          // 如果没有历史数据，则直接处理当前数据
          var search_data_value = unique(tmp_data[key[i]]).sort();
          
          // 检查是否存在静态文件数据
          if ('static' in search_data[tmp_data['current']]) {
              // 调用 collect_static 函数处理静态文件
              var res = collect_static(search_data_value, search_data[tmp_data['current']]['static']);
          } else {
              // 如果没有静态文件数据，则直接处理
              var res = collect_static(search_data_value, []);
          }
          
          // 更新 search_data 中的静态文件和当前数据
          search_data[tmp_data['current']]['static'] = unique(res['static']); // 更新静态文件
          search_data[tmp_data['current']][key[i]] = unique(res['arr1']); // 更新当前数据
      }
  }
}



// 监听来自其他部分的消息
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // 创建一个 AbortController 实例，用于控制 fetch 请求的取消
    var abort_controller = new AbortController();
    // 创建一个新的 Headers 对象
    var myHeaders = new Headers();
    myHeaders.append('accept', '*/*'); // 设置请求头，接受所有类型的响应
    // 初始化 fetch 请求的配置
    var myInit = { 
      method: 'GET', // 默认请求方法为 GET
      headers: myHeaders, // 使用自定义请求头
      mode: 'cors', // 设置跨域请求模式
      cache: 'default', // 默认缓存策略
      credentials: 'include', // 包含凭据
      signal: abort_controller.signal // 关联 AbortController 的信号
    };

    // 检查请求的类型
    if (request.greeting == "find") {
        // 如果当前请求的 current 在 search_data 中
        if (request.current in search_data) {
            // 重置当前任务的状态
            search_data[request.current]['done'] = '';
            search_data[request.current]['tasklist'] = [];
            search_data[request.current]['donetasklist'] = [];
        } else {
            // 如果没有历史数据，初始化当前任务的数据结构
            search_data[request.current] = {
                'current': request.current, 
                'tasklist': [], 
                'donetasklist': [], 
                'source': {}
            };
        }

        // 提取信息并存储到 tmp_data 中
        let tmp_data = extract_info(request.source);
        tmp_data['current'] = request.current; // 设置当前任务
        tmp_data['static'] = null; // 初始化静态数据
        console.log(tmp_data); // 输出临时数据

        // 持久化临时数据
        persist_tmp_data(tmp_data, request.current, request.current);
        // 将结果存储到 Chrome 的本地存储中
        chrome.storage.local.set({["findsomething_result_" + request.current]: search_data[request.current]}, function(){});
        // 更新当前标签页的 URL
        tab_url[sender.tab.id] = request.current;
        // 刷新任务计数
        refresh_count();

        // 初始化一个 Promise 数组，用于存储所有的 fetch 请求
        let promiseTask = [];
        search_data[request.current]['pretasknum'] = request.data.length; // 记录预期任务数量

        // 遍历请求的 URL 列表
        request.data.map((req_url) => {
            try {
                // 将任务添加到任务列表中
                search_data[request.current]['tasklist'].push(0);
                // 如果请求的 URL 与当前任务相同，跳过处理
                if (req_url == request.current) {
                    search_data[request.current]['donetasklist'].push(0);
                    return;
                }
                // 创建一个新的请求对象
                var myRequest = new Request(req_url, myInit);
                // 发送 fetch 请求
                let p = fetch(myRequest, myInit).then(function(response) {
                    // 处理响应
                    response.text().then(function(text) {
                        let tmp_data = text; // 获取响应文本
                        tmp_data = extract_info(tmp_data); // 提取信息
                        tmp_data['current'] = request.current; // 设置当前任务
                        // 持久化提取到的数据
                        persist_tmp_data(tmp_data, req_url, request.current);
                        search_data[request.current]['donetasklist'].push(0); // 更新已完成任务列表
                        // 更新本地存储
                        chrome.storage.local.set({["findsomething_result_" + request.current]: search_data[request.current]}, function(){});
                        tab_url[sender.tab.id] = request.current; // 更新当前标签页的 URL
                        refresh_count(); // 刷新任务计数
                    });
                }).catch(err => {
                    // 捕获并处理错误
                    console.log("fetch error", err);
                    search_data[request.current]['donetasklist'].push(0); // 更新已完成任务列表
                    refresh_count(); // 刷新任务计数
                    chrome.storage.local.set({["findsomething_result_" + request.current]: search_data[request.current]}, function(){});
                });
                promiseTask.push(p); // 将 Promise 添加到数组中
            } catch (e) {
                // 捕获异常
                console.log(e);
                search_data[request.current]['donetasklist'].push(0); // 更新已完成任务列表
            }
        });

        // 获取 fetch 超时设置
        chrome.storage.local.get(["fetch_timeout"], function(settings) {
            if (settings["fetch_timeout"] == true) {
                // 如果启用了超时设置
                let abort_promise = new Promise(function(resolve, reject) {
                    setTimeout(function() {
                        resolve(new Response("findsomething fetch timeout", {status: 504, statusText: "timeout"}));
                        abort_controller.abort(); // 取消请求
                    }, 2000); // 设置超时时间为 2000 毫秒
                });
                promiseTask.push(abort_promise); // 将超时 Promise 添加到数组中

                // 使用 Promise.race 来处理请求和超时
                Promise.race(promiseTask).then(function() {
                    refresh_count(); // 刷新任务计数
                    chrome.storage.local.set({["findsomething_result_" + request.current]: search_data[request.current]}, function(){});
                }).catch(function(err) {
                    console.log(err);
                    abort_controller = null; // 清空 AbortController
                });
            } else {
                // 如果没有启用超时设置，等待所有请求完成
                Promise.all(promiseTask).then(function() {
                    refresh_count(); // 刷新任务计数
                    chrome.storage.local.set({["findsomething_result_" + request.current]: search_data[request.current]}, function(){});
                });
            }
        });
        return true; // 表示异步响应
    } else if (request.greeting == "get") {
        // 如果请求类型为 "get"，返回当前任务的数据
        sendResponse(search_data[request.current]);
        return true; // 表示异步响应
    }
});

// 监听标签页更新事件
chrome.tabs.onUpdated.addListener(function(tabId, props) {
    // 如果标签页加载完成且是当前选中的标签页
    if (props.status == "complete" && tabId == selected_id)
        refresh_count(); // 刷新任务计数
});

// 监听标签页激活事件
chrome.tabs.onActivated.addListener(function(activeInfo) {
    selected_id = activeInfo.tabId; // 更新当前选中的标签页 ID
    refresh_count(); // 刷新任务计数
});

// 查询当前窗口中激活的标签页
chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs && tabs[0]) {
        selected_id = tabs[0].id; // 更新当前选中的标签页 ID
        refresh_count(); // 刷新任务计数
    }
});