

export function createBezierCurve(position, velocity, target, alpha = 0.25){
    const c1 = position + velocity * alpha; // 制御点1
    const c2 = target; // 制御点2は終点に等しい（速度0）

    return {
        p:function(t){
            const t_1 = 1 - t;
            return t_1 ** 3 * position
                + 3 * t_1 ** 2 * t * c1
                + 3 * t_1 * t ** 2 * c2
                + t ** 3 * target;
        },
        v: function(t) {
            const t_1 = 1 - t;
            return 3 * t_1 ** 2 * (c1 - position)
                 + 6 * t_1 * t * (c2 - c1)
                 + 3 * t ** 2 * (target - c2);
        }
    }
}

// エラー作成
export function err(status, message){
    const err = new Error(message);
    err.status = status;
    return err;
}