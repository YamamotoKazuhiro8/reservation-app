// utils.js

// エラー作成
export function err(status, message){
    const err = new Error(message);
    err.status = status;
    return err;
}