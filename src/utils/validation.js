// 验证
export default {
    // 必填项
    //采用i8n
    Rule_require: {
        required: true,
        message: '该项不能为空',
    },
    // 名称
    Rule_name: (rule, value, callback) => {
        const reg = new RegExp(/^(?!_)[a-zA-Z0-9_\u4e00-\u9fa5]+$/);
        if (value && !reg.test(value)) {
            callback('请输入中文、字母、数字、下划线，不能以下划线开头');
        }
        callback();
    },
    // 中英文姓名
    Rule_pName: (rule, value, callback) => {
        const reg = new RegExp(/^([\u4e00-\u9fa5]{2,20}|[a-zA-Z.·\s]{2,32})$/);
        if (value && !reg.test(value)) {
            callback('请输入正确名称');
        }
        callback();
    },
    // 统一社会信用代码
    Rule_pon: (rule, value, callback) => {
        const reg = new RegExp(/^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g);
        if (value && !reg.test(value)) {
            callback('请输入正确格式');
        }
        callback();
    },
    // 身份证号效验
    Rule_IdCode: (rule, value, callback) => {
        const reg = new RegExp(/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/);
        if (value && !reg.test(value)) {
            callback('请输入正确的身份证号');
        }
        callback();
    },
    // 编号
    Rule_code: (rule, value, callback) => {
        const reg = new RegExp(/^(?!_)[a-zA-Z0-9_]+$/);
        if (value && !reg.test(value)) {
            callback('请输入字母、数字、下划线，不能以下划线开头');
        }
        callback();
    },
    // ip
    Rule_ip: (rule, value, callback) => {
        const reg = new RegExp(/^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/);
        if (value && !reg.test(value)) {
            callback('请输入正确的IP地址');
        }
        callback();
    },
    // 编号,镜像名
    Rule_projectCode: (rule, value, callback) => {
        const reg = new RegExp(/^[0-9a-z][0-9a-z\-_.]*$/);
        if (value && !reg.test(value)) {
            callback('请输入小写字母、数字、下划线，点，-，以字母或者数字开头');
        }
        callback();
    },
    // groupId
    Rule_groupId: (rule, value, callback) => {
        const reg = new RegExp(/^[0-9a-zA-Z][0-9a-zA-Z\\_.]*$/);
        if (value && !reg.test(value)) {
            callback('请输入字母、数字、下划线、点，以字母或者数字开头');
        }
        callback();
    },
    // artifactId
    Rule_artifactId: (rule, value, callback) => {
        const reg = new RegExp(/^[0-9a-zA-Z][0-9a-zA-Z\\-]*$/);
        if (value && !reg.test(value)) {
            callback('请输入字母、数字、-，以字母或者数字开头');
        }
        callback();
    },
    // nodeName
    Rule_nodeName: (rule, value, callback) => {
        const reg = new RegExp(/^[a-zA-Z][0-9a-zA-Z\\-]*$/);
        if (value && !reg.test(value)) {
            callback('请输入字母、数字、-，以字母开头');
        }
        callback();
    },
    // nameSpace
    Rule_nameSpace: (rule, value, callback) => {
        const reg = new RegExp(/^[a-z][0-9a-z\\-]*$/);
        if (value && !reg.test(value)) {
            callback('请输入小写字母、数字、-，以小写字母开头');
        }
        callback();
    },
    // numLetter
    Rule_NumLetter: (rule, value, callback) => {
        const reg = new RegExp(/^[0-9a-zA-Z]*$/);
        if (value && !reg.test(value)) {
            callback('请输入字母、数字');
        }
        callback();
    },
    // version&classifier&版本
    Rule_params: (rule, value, callback) => {
        const reg = new RegExp(/^[0-9a-zA-Z][0-9a-zA-Z\-._]*$/);
        if (value && !reg.test(value)) {
            callback('请输入字母、数字、点、下划线、-，以字母或者数字开头');
        }
        callback();
    },

    // branch
    Rule_branch: (rule, value, callback) => {
        const reg = new RegExp(/^[0-9a-zA-Z$][0-9a-zA-Z\\${}_]*$/);
        if (value && !reg.test(value)) {
            callback('请输入字母、数字、下划线、$、{}，以字母、数字或$开头');
        }
        callback();
    },
    // Maven参数
    Rule_Maven: (rule, value, callback) => {
        const reg = new RegExp(/^[a-zA-Z$][a-zA-Z\\$ -{}]*$/);
        if (value && !reg.test(value)) {
            callback('请输入字母、空格、$、{}，-，以字母或$开头');
        }
        callback();
    },
    // 数字
    Rule_number: (rule, value, callback) => {
        const reg = new RegExp(/^[0-9]+$/);
        if (value && !reg.test(value)) {
            callback('请输入正整数');
        }
        callback();
    },
    // 英文
    Rule_English: (rule, value, callback) => {
        const reg = new RegExp(/^[a-zA-Z]+$/);
        if (value && !reg.test(value)) {
            callback('请输入英文字母');
        }
        callback();
    },
    // 中文
    Rule_truenochinese: (rule, value, callback) => {
        const reg = new RegExp(/^[\u4e00-\u9fa5]+$/);
        if (value && !reg.test(value)) {
            callback('请输入中文');
        }
        callback();
    },

    // 非中文
    Rule_nochinese: (rule, value, callback) => {
        const reg = new RegExp(/^[^\u4e00-\u9fa5]+$/);
        if (value && !reg.test(value)) {
            callback('请输入非中文字符');
        }
        callback();
    },
    // url/http
    Rule_url: (rule, value, callback) => {
        const reg = new RegExp(/^(http|ftp|https):\/\/?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\\+#]*[\w\-\\@?^=%&amp;/~\\+#])?/);
        if (value && !reg.test(value)) {
            callback('请输入正确url地址');
        }
        callback();
    },
    // 手机号码
    Rule_tel: (rule, value, callback) => {
        const reg = new RegExp(/^1[3|4|5|6|7|8|9]\d{9}$/);
        if (value && !reg.test(value)) {
            callback('请输入正确的手机号码');
        }
        callback();
    },
    //    同时校验手机号码座机号码
    Rule_tell: (rule, value, callback) => {
        const reg = new RegExp(/^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/);
        if (value && !reg.test(value)) {
            callback('请输入正确的手机/座机号码');
        }
        callback();
    },
    //    邮箱
    Rule_mail: (rule, value, callback) => {
        const reg = new RegExp(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/);
        if (value && !reg.test(value)) {
            callback('请输入正确的邮箱地址');
        }
        callback();
    },
    // 传真
    Rule_fax: (rule, value, callback) => {
        const reg = new RegExp(/^(\d{3,4}-)?\d{7,8}$/);
        if (value && !reg.test(value)) {
            callback('请输入正确的传真地址');
        }
        callback();
    },
    // password
    Rule_password: (rule, value, callback) => {
        const reg = new RegExp(/^[^\u4e00-\u9fa5]{6,20}$/gm);
        if (value && !reg.test(value)) {
            callback('密码应为6到20位字母、数字');
        }
        callback();
    },

    // 小数点两位
    Rule_NumberPoint: (rule, value, callback) => {
        const reg = new RegExp(/^\d+(\.\d{1,2})?$/);
        if (value && !reg.test(value)) {
            callback('请输入数字，可保留两位小数');
        }
        callback();
    },
    // 小数 不限制位数
    Rule_NumberPointNot: (rule, value, callback) => {
        const reg = new RegExp(/^\d+(\.\d+)?$/);
        if (value && !reg.test(value)) {
            callback('请输入整数或小数');
        }
        callback();
    },
    // command
    Rule_command: (rule, value, callback) => {
        const reg = new RegExp(/^[a-zA-Z0-9_ ]+$/);
        if (value && !reg.test(value)) {
            callback('请输入字母，数字，下划线');
        }
        callback();
    },
    // 端口
    Rule_port: (rule, value, callback) => {
        const reg = new RegExp(/^[1-9]$|(^[1-9][0-9]$)|(^[1-9][0-9][0-9]$)|(^[1-9][0-9][0-9][0-9]$)|(^[1-6][0-5][0-5][0-3][0-5]$)/);
        if (value && !reg.test(value)) {
            callback('请输入正确的端口号');
        }
        callback();
    },
    Rule_hour: (rule, value, callback) => {
        if (value > 24) {
            callback('请输入正确的小时数');
        }
        callback();
    },
    Rule_minute: (rule, value, callback) => {
        if (value >= 60) {
            callback('请输入正确的分钟数');
        }
        callback();
    },
    Rule_second: (rule, value, callback) => {
        if (value >= 60) {
            callback('请输入正确的秒数');
        }
        callback();
    },
    Rule_max16_length: {
        max: 16,
        message: '长度不超过16位',
    },
    Rule_max20_length: {
        max: 20,
        message: '长度不超过20位',
    },
    Rule_max32_length: {
        max: 32,
        message: '长度不超过32位',
    },
    Rule_max50_length: {
        max: 50,
        message: '长度不超过50位',
    },
    Rule_max64_length: {
        max: 64,
        message: '长度不超过64位',
    },
    Rule_max100_length: {
        max: 100,
        message: '长度不超过100位',
    },
    Rule_max128_length: {
        max: 128,
        message: '长度不超过128位',
    },
    Rule_max256_length: {
        max: 256,
        message: '长度不超过256位',
    },
    Rule_max512_length: {
        max: 512,
        message: '长度不超过512位',
    },
    Rule_input_length: {
        max: 50,
        message: '长度不超过50位',
    },
    Rule_textarea_length: {
        max: 200,
        message: '长度不超过200位',
    },
    Rule_email_length: {
        max: 25,
        message: '长度不超过25位',
    },
    Rule_phone_length: {
        max: 11,
        message: '长度不超过11位',
    },
    Rule_tel_length: {
        max: 15,
        message: '长度不超过15位',
    },
};
