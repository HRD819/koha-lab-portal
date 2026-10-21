# 輔大圖資地下系圖書館入口

GitHub Pages：https://hrd819.github.io/koha-lab-portal/

分類編目為主要入口，OPAC 為讀者視角預覽；另提供學習流程及修改密碼指引。此儲存庫只有靜態入口網站，不存放 Koha、帳密、讀者資料或憑證私鑰。

## 自動選擇入口（2026-10-21）

`assets/config.js` 列出研究室的兩個核准候選 IP。`assets/connectivity.js` 使用正常 HTTPS 驗證，並檢查館員端與 OPAC 的健康回應；成功後 `assets/main.js` 同步分類編目、OPAC 與改密碼連結。不傳送登入 Cookie，不接受轉址、未知服務、錯誤 IP 或過期健康狀態。

頁面開啟、回到頁面及可見期間會重新檢查。沒有可用來源時顯示網路提示與重新偵測按鈕。Koha 來源限制仍由主機端執行；GitHub 頁面公開不等於可從校外登入。校外須先使用符合路由與權限條件的學校 VPN。

主機端另負責同步目前可達的 IP、正式憑證及 Koha 內部連結，約每兩分鐘檢查。兩個候選位址不代表必然同時可達。IP 改變後，既有登入工作階段可能需重新登入。

## 驗證與維護

執行 `node --test tests/connectivity.test.cjs` 驗證雙向候選切換、健康資料驗證、OPAC 失效及逾時行為。公開頁面已實測自動選到 `.61`，並成功開啟分類編目登入頁。

修改 JavaScript 後同步更新 `index.html` 的資源版本參數，發布後驗證 GitHub Pages 建置與實際瀏覽器行為。候選來源須先完成主機端路由及正式 HTTPS 憑證設定，不可只添加 IP 或略過憑證錯誤。
