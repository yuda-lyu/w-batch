# 規則帳本

本檔為套件設計與開發階段之規則帳本(藍圖),為要求程式碼須長成什麼樣,或由規格產出之測試(項目/說明/流程)有哪些,包含軸、單一擁有者、已知限制、破壞性變更紀錄,以及對應是哪些測試檔案或指令等,由agent自行編列、擴充與維護.當前已做到哪些記於`sgud/state/state.md`.

- 盤點指令一律用 `git grep`;站點狀態:**已套 / 未套 / 刻意不套**(附理由).
- 建立:2026-11-26(wsemi 1.9.80 列舉函數遷移輪,原無 `sgud/`).

## R1 以 wsemi 列舉 log 資料夾時須明示層數(wsemi 1.9.80 起)

- 規格來源:wsemi 破壞性變更第 83 項(1.9.80):`fsTreeFolder` 等列舉函數之第 2 參數由 `levelLimit`(舊預設 1 層)改為 opt 物件,`opt.levelLimit` 為有效正整數才限層,**未給即窮舉全部層級**;給數字拋 `invalid opt: must be an object`.
- 規則:本套件之 log 檔由 `logMsg` 以 `${type}-${now2strp()}.log` 直接置於 `logFd` 下(`src/WBatch.mjs:177-178`),無子資料夾;範例與測試取 log 檔(取列舉結果之最後一項)時一律寫 `{ levelLimit: 1 }`(保持只列第 1 層之語意),不省略第 2 參數、不給數字.
- 本庫 `src/` 之執行碼不呼叫 wsemi 之列舉函數(0 處),只有根目錄範例與測試.
- 盤點:`git grep -nE "\b(fsTreeFolder|fsTreeFolderWithHash|fsGetFilesInFolder|fsGetFilesWithHashInFolder|fsGetFoldersInFolder)(Core)?\s*\(" -- . ':!dist' ':!docs'`(判準:每處第 2 參數皆為 `{ levelLimit: 1 }`).
- 站點全集(2026-11-26):

  | 站點 | 傳值 | 判準 |
  |---|---|---|
  | `g.mjs:9` | `{ levelLimit: 1 }` | 已套 |
  | `test/WBatch.test.mjs:26` | `{ levelLimit: 1 }` | 已套 |
  | `src/`、README、JSDoc | — | 0 站點 |

- 測試:`test/WBatch.test.mjs`(僅 Windows;執行 `bin/wbat.exe` 並以 `bin/setting.json` 之 `logFd` 讀回 log 檔,斷言內容之項數).
