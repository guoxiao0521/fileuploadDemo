export function getFakerData() {
    let faker = require("faker");
    return {
        UUID: faker.random.uuid(),
        datePath: getDatePath()
    };
}

/* 根据当前时间戳生成“/YYYY/MM/DD”路径名 */
function getDatePath() {
    let date = new Date();
    let y = zeroBu(date.getFullYear());//年
    let m = zeroBu(date.getMonth() + 1);//月
    let d = zeroBu(date.getDate());//日
    return "/" + y + "/" + m + "/" + d;
}

/* 补零函数 */
function zeroBu(n) {
    if (n < 10) {
        return '0' + n;
    } else {
        return n
    }
}


