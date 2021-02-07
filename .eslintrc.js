const { strictEslint } = require('@umijs/fabric');

module.exports = {
    ...strictEslint,
    rules: {
        'max-len': 0,
        ...strictEslint.rules,
        // 扩展eslint
        // 禁用 debugger
        'no-debugger': 2,
        // 禁止在嵌套的块中出现 function 或 var 声明
        'no-inner-declarations': [2, 'functions'],
        // 强制所有控制语句使用一致的括号风格
        curly: [2, 'all'],
        // switch 语句强制 default 分支，也可添加 // no default 注释取消此次警告
        'default-case': 2,
        // 强制object.key 中 . 的位置，参数:
        'dot-location': [2, 'property'],
        // 使用 === 替代 == allow-null允许null和undefined==
        eqeqeq: [2, 'allow-null'],
        // 禁止 case 语句落空
        'no-fallthrough': 2,
        // 禁止在循环中出现 function 声明和表达式
        'no-loop-func': 1,
        // 禁止使用多个空格
        'no-multi-spaces': 2,
        // 禁用指定的通过 require 加载的模块
        'no-return-assign': 2,
        // 强制在parseInt()使用基数参数
        radix: 0,
        // 禁止将变量初始化为 undefined
        'no-undef-init': 2,
        //强制使用一致的缩进 第二个参数为 "tab" 时，会使用tab，
        'brace-style': [2, '1tbs', { allowSingleLine: true }],
        // 不允许空格和 tab 混合缩进
        'no-mixed-spaces-and-tabs': 0,
        // 禁用行尾空格
        'no-trailing-spaces': 2,
        // 强制使用一致的反勾号、双引号或单引号
        quotes: [2, 'single', 'avoid-escape'],
        // 要求箭头函数体使用大括号
        'arrow-body-style': ['error', 'always'],
        // 禁止在构造函数中，在调用 super() 之前使用 this 或 super
        'no-this-before-super': 2,
        // 强制模块内的 import 排序
        'sort-imports': 0,
        // 文件末尾强制换行
        'eol-last': 0,
        // 要求或禁止使用分号而不是 ASI（这个才是控制行尾部分号的，）
        // 强制在花括号中使用一致的空格
        'object-curly-spacing': 2,
        // 强制将对象的属性放在不同的行上
        'object-property-newline': 'error',
        // 强制函数中的变量要么一起声明要么分开声明
        'one-var': [2, { initialized: 'never' }],
        semi: [2, 'always'],
        indent: ['error', 4, { SwitchCase: 1 }],
        'linebreak-style': ['error', 'unix'],
        'no-extra-semi': ['error'],
        'keyword-spacing': 'error',
        'no-spaced-func': 'error',
        'block-spacing': ['error', 'always'],
        'comma-spacing': 2,
        'arrow-spacing': 2,
        'arrow-parens': 0,
        'array-callback-return': 0,
        'consistent-return': 0,
        'no-extra-parens': 'error',
        'no-tabs': 0,
        'jsx-a11y/label-has-associated-control': 'off',
        'jsx-a11y/label-has-for': 'off',
        'spaced-comment': 'off',
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
        'no-multiple-empty-lines': ["error", { "max": 1}],
    },
    globals: {
        page: true,
    },
};
