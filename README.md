# 輔大圖資地下系圖書館入口

GitHub Pages 靜態網站。主要入口為分類編目，OPAC供讀者視角預覽。目前提供郵件驗證保護的小規模遠端試用；網址為臨時Quick Tunnel，服務重啟後須更新連結。尚未驗證70人併發，並非正式長期課程入口。

## 部署

GitHub Pages從main分支根目錄發布，無建置依賴。網站僅包含公開文案與靜態資產，不包含Koha程式、資料庫、學生名單、帳號或密碼。

## 正式連線啟用

修改`assets/config.js`的staff、opac、password為獲核准的HTTPS網址；staff應指向館員端`/cgi-bin/koha/cataloguing/addbooks.pl`，password應指向OPAC的`/cgi-bin/koha/opac-passwd.pl`。空白欄位保持準備中提示。連線與權限驗證完成後再設定，並依實際狀態調整網站文案。前端設定不是存取控制，安全措施應在Koha服務入口實施。

未設定自訂網域；取得授權前不新增CNAME或修改DNS。搬遷主機後更新連結即可。

## 本機預覽

`python3 -m http.server 8765 --bind 127.0.0.1`

2026-10-19：使用者完成郵件驗證後，Koha登入出現plain Unauthorized；試用未通過驗收，公開入口已暫停，兩個URL設定已清空。本機服務正常。

## 2026-10-19 校內來源入口

正式 HTTPS 入口已設定於 assets/config.js；主要按鈕直達分類編目，OPAC 為讀者視角預覽。應用服務僅接受輔大校內來源，校外需使用能將目的流量送入校網的學校 VPN。GitHub Pages 本身公開，並不授予 Koha 權限。VPN 各類帳號與路由仍需以實際裝置驗收。
