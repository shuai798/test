export default {
    //common
    loginTitle: '用户登录',
    productTitle: '智慧云厦',
    introTitle: '使用说明',

    //校验message
    requriedMessage: '该项不能为空',

    //table实例
    tableName: '姓名',
    tableAge: '年龄',
    tableAddr: '住址',

    approvalResultPass: '通过',
    approvalResultRefuse: '拒绝',

    industryType: [
        {
            code: '1',
            name: '计算机',
        },
        {
            code: '2',
            name: '银行',
        },
        {
            code: '3',
            name: '采矿',
        },
    ],

    staffSizeType: [
        {
            code: 'ONE',
            name: '1-20人',
        },
        {
            code: 'TWO',
            name: '20-99人',
        },
        {
            code: 'THREE',
            name: '100-499人',
        },
        {
            code: 'FOUR',
            name: '500-999人',
        },
        {
            code: 'FIVE',
            name: '1000-9999人',
        },
        {
            code: 'SIX',
            name: '10000人以上',
        },
    ],

    // 设备管理状态
    managementStatus: [
        {
            code: 'ENABLE',
            name: '启用',
        },
        {
            code: 'DISABLE',
            name: '禁用',
        },
    ],
    // 设备运行监测状态
    runningStatus: [
        {
            code: 'NORMAL',
            name: '正常',
        },
        {
            code: 'BREAKDOWN',
            name: '故障',
        },
        {
            code: 'OFFLINE',
            name: '离线',
        },
        {
            code: 'ALARM',
            name: '报警',
        },
    ],
    // 设备状态
    deviceStatus: [
        {
            code: 'INITIALIZE',
            name: '未绑定',
        },
        {
            code: 'NOT_ACTIVE',
            name: '未激活',
        },
        {
            code: 'RUNNING',
            name: '运行中',
        },
        {
            code: 'TO_BE_MAINTAINED',
            name: '待维保',
        },
        {
            code: 'TO_BE_SCRAPPED',
            name: '待报废',
        },
        {
            code: 'UNBOUND',
            name: '已解绑',
        },
    ],
    // 设备参数设置-通行规则
    customerRule: [
        {
            code: 'WEEK',
            name: '周内周末',
        },
        {
            code: 'CUSTOMIZE',
            name: '自定义',
        },
    ],
    // 设备参数设置-验证方式
    verify: [
        {
            code: 'AUTO_RECOGNITION',
            name: '自动识别',
        },
        {
            code: 'FINGER',
            name: '仅指纹',
        },
        {
            code: 'NO',
            name: '仅工号',
        },
        {
            code: 'PASSWORD',
            name: '仅密码',
        },
        {
            code: 'CARD',
            name: '仅卡',
        },
        {
            code: 'FINGER_OR_PASSWORD',
            name: '指纹或密码',
        },
        {
            code: 'CARD_OR_FINGER',
            name: '卡或指纹',
        },
        {
            code: 'CARD_OR_PASSWORD',
            name: '卡或密码',
        },
        {
            code: 'NO_AND_PASSWORD',
            name: '工号加指纹',
        },
        {
            code: 'FINGER_AND_PASSWORD',
            name: '指纹加密码',
        },
        {
            code: 'CARD_AND_FINGER',
            name: '卡加指纹',
        },
        {
            code: 'CARD_AND_PASSWORD',
            name: '卡加密码',
        },
        {
            code: 'CARD_AND_PASSWORD_AND_FINGER',
            name: '卡加密码加指纹',
        },
        {
            code: 'NO_AND_PASSWORD_AND_FINGER',
            name: '工号加密码加指纹',
        },
        {
            code: 'NO_AND_FINGER_OR_CARD_AND_FINGER',
            name: '工号加指纹或卡加指纹',
        },
    ],
    // 设备参数设置-离合报警设置
    clutchAlarmSetting: [
        {
            code: 'AUTO_UNLOCK',
            name: '自动解锁',
        },
        {
            code: 'CARD_UNLOCK',
            name: '刷卡解锁',
        },
    ],
    // 设备参数设置-开关闸设置
    gateSetting: [
        {
            code: 'CLOSE_GATE',
            name: '关闸',
        },
        {
            code: 'OPEN_GATE',
            name: '不关闸',
        },
        {
            code: 'CLOSE_FUNCTION',
            name: '关闭功能',
        },
    ],
    // 设备参数设置-红外防夹区域
    infraredRegion: [
        {
            code: 'ALL_AVOID',
            name: '全部防夹',
        },
        {
            code: 'HEAD_TAIL_NOT',
            name: '首尾不防夹',
        },
    ],
    // 设备参数设置-防夹设置
    avoidPinchedSetting: [
        {
            code: 'STOP',
            name: '防夹停止',
        },
        {
            code: 'OPEN_GATE',
            name: '防夹开闸',
        },
        {
            code: 'CLOSE_FUNCTION',
            name: '关闭功能',
        },
    ],
    // 设备参数设置-复位计数器
    resetCounter: [
        {
            code: 'OUT',
            name: '出计数器',
        },
        {
            code: 'IN',
            name: '入计数器',
        },
        {
            code: 'ALARM',
            name: '报警计数器',
        },
    ],
    // 设备参数设置-消防模式
    fireProtectionMode: [
        {
            code: 'RIGHT_OPEN',
            name: '右开闸',
        },
        {
            code: 'LEFT_OPEN',
            name: '左开闸',
        },
        {
            code: 'CLOSE_FUNCTION',
            name: '关闭功能',
        },
    ],
    // 设备参数设置-语音切换
    voiceSwitch: [
        {
            code: 'VOICEBROADCAST',
            name: '语音报播',
        },
        {
            code: 'PROMPT_TONE',
            name: '提示音',
        },
    ],
    // 设备异常类型
    deviceExceptionType: [
        {
            code: 'ILLEGAL_TIME',
            name: '非法时间段',
        },
        {
            code: 'ILLEGAL_ACCESS',
            name: '非法访问',
        },
        {
            code: 'ANTISUBMARINE',
            name: '反潜',
        },
        {
            code: 'UNREGISTERED',
            name: '人未登记',
        },
    ],
    // 设备故障记录
    deviceBrokenType: [
        {
            code: 'NO_CONNECTION',
            name: '闸机未连接',
        },
        {
            code: 'DISCONNECT',
            name: '连接断开',
        },
        {
            code: 'ELECTROMAGNETIC_CLUTCH_ERROR',
            name: '电磁离合器异常',
        },
        {
            code: 'ELECTRIC_MACHINERY_ERROR',
            name: '电机异常',
        },
    ],
    // 设备相关-发布结果
    publishResult: [
        {
            code: 'PROCESSING',
            name: '执行中',
        },
        {
            code: 'SUCCESS',
            name: '成功',
        },
        {
            code: 'FAILURE',
            name: '失败',
        },
    ],
    // 设备语音播报场景
    voicebroadcastScene: [
        {
            code: 'NORMAL_VERIFY_OPEN',
            name: '正常验证开闸',
        },
        {
            code: 'NORMALLY_VERIFY',
            name: '常开时间段内验证',
        },
        {
            code: 'EMERGENCY_PASSWORD_OPEN',
            name: '紧急状态密码开闸',
        },
        {
            code: 'NORMALLY_OPEN',
            name: '常开时间段开闸',
        },
        {
            code: 'REMOTE_OPEN',
            name: '远程开闸',
        },
        {
            code: 'REMOTE_CLOSE',
            name: '远程关闸',
        },
    ],
    // 设备语音播报文字
    voicebroadcastCharacters: [
        {
            code: 'NOT_BROADCAST',
            name: '不播报',
        },
        {
            code: 'WELCOME',
            name: '欢迎光临',
        },
        {
            code: 'THANKS_FOR_COMING',
            name: '谢谢光临',
        },
        {
            code: 'WELCOME_TO_VISIT',
            name: '欢迎来访',
        },
    ],
    // 设备部件类型
    deviceUnitType: [
        {
            code: 'ELECTRIC_MACHINERY',
            name: '电机',
            type: 'motor',
            icon: 'icon-electrical-machinery',
        },
        {
            code: 'ENCODER',
            name: '编码器',
            type: 'encoder',
            icon: 'icon-encoder',
        },
        {
            code: 'ELECTROMAGNETIC_CLUTCH',
            name: '电磁离合器',
        },
        {
            code: 'INFRARED_SENSOR',
            name: '红外感应器',
            type: 'infrared',
            icon: 'icon-infrared-sensor',
        },
        {
            code: 'PROXIMITY_SWITCH',
            name: '接近开关',
        },
        {
            code: 'READING_HEAD',
            name: '读头',
        },
        {
            code: 'FACE_RECOGNITION_MACHINE',
            name: '人脸识别一体机',
        },
        {
            code: 'SWITCH_BUTTON',
            name: '开关按钮',
        },
    ],
    // 组织类型展示
    organizationType: [
        {
            code: 'HEAD_OFFICE',
            name: '总公司',
        },
        {
            code: 'BRANCH_OFFICE',
            name: '分公司',
        },
        {
            code: 'AGENT',
            name: '经销商',
        },
    ],
    // 设备故障类型
    deviceTroubleType: [
        {
            code: 'NO_CONNECTION',
            name: '闸机未连接',
        },
        {
            code: 'DISCONNECT',
            name: '连接断开',
        },
        {
            code: 'ELECTROMAGNETIC_CLUTCH_ERROR',
            name: '电磁离合器异常',
        },
        {
            code: 'ELECTRIC_MACHINERY_ERROR',
            name: '电机异常',
        },
    ],
    // 设备远程操作类型
    deviceControlType: [
        {
            code: 'REBOOT',
            name: '远程重启',
        },
        {
            code: 'OPEN',
            name: '远程开闸',
        },
        {
            code: 'CLOSE',
            name: '远程关闸',
        },
        {
            code: 'RESET_COUNTER',
            name: '复位计数器',
        },
    ],

    // 设备状态
    batchStatus: [
        {
            code: 'RUNNING',
            name: '运行中',
        },
        {
            code: 'TO_BE_MAINTAINED',
            name: '待维保',
        },
        {
            code: 'TO_BE_SCRAPPED',
            name: '待报废',
        },
        {
            code: 'UNBOUND',
            name: '已解绑',
        },
    ],

    // 运行监测
    operationMonitor: [
        {
            code: 'NORMAL',
            name: '正常',
        },
        {
            code: 'BREAKDOWN',
            name: '故障',
        },
        {
            code: 'OFFLINE',
            name: '离线',
        },
    ],

    // 管理状态
    manageStatus: [
        {
            code: 'ENABLE',
            name: '启用',
        },
        {
            code: 'DISABLE',
            name: '禁用',
        },
    ],

    // 事件类型
    eventType: [
        {
            code: 'BREAKDOWN',
            name: '故障',
        },
        {
            code: 'REPAIR',
            name: '报修',
        },
        {
            code: 'TO_BE_MAINTAINED',
            name: '待维保',
        },
        {
            code: 'TO_BE_SCRAPPED',
            name: '待报废',
        },
        {
            code: 'EXPIRED',
            name: '已过期',
        },
    ],

    // 事件类型
    results: [
        {
            code: 'MANUAL_HANDLE',
            name: '人工现场处理',
        },
        {
            code: 'RETURNED_TO_NORMAL',
            name: '系统已恢复正常',
        },
        {
            code: 'NO_HANDLE',
            name: '暂不处理',
        },
    ],

    // 事件类型
    customerScale: [
        {
            code: 'ONE',
            name: '1-20人',
        },
        {
            code: 'TWO',
            name: '20-99人',
        },
        {
            code: 'THREE',
            name: '100-499人',
        },
        {
            code: 'FOUR',
            name: '500-999人',
        },
        {
            code: 'FIVE',
            name: '1000-9999人',
        },
        {
            code: 'SIX',
            name: '10000人以上',
        },
    ],

    // 操作类型
    operationType: [
        {
            code: 'UPGRADE',
            name: '远程升级',
        },
        {
            code: 'INFORMATION_PUBLISH',
            name: '信息发布',
        },
        {
            code: 'VOICE_BROADCAST',
            name: '语音播报',
        },
        {
            code: 'REBOOT',
            name: '远程重启',
        },
        {
            code: 'OPEN',
            name: '远程开闸',
        },
        {
            code: 'CLOSE',
            name: '远程关闸',
        },
        {
            code: 'STATUS_SET',
            name: '状态设置',
        },
    ],

    // 通道类型
    pathTypeList: [
        {
            code: 'IN',
            name: 'in通道',
        },
        {
            code: 'OUT',
            name: 'out通道',
        },
    ],

    // 显示位置
    deviceInformationLocation: [
        {
            code: 'VIDEO',
            name: '视频区',
        },
        {
            code: 'BACKGROUND',
            name: '状态背景',
        },
        {
            code: 'IMAGE',
            name: '图片区',
        },
    ],

    // 信息发布操作类型
    operationTypeList: [
        {
            code: 'CREATE',
            name: '新增',
        },
        {
            code: 'CLEAR',
            name: '清除',
        },
    ],

    // 播报场景
    broadcastScenario: [
        {
            code: 'NORMAL_VERIFY_OPEN',
            name: '正常验证开闸',
        },
        {
            code: 'NORMALLY_VERIFY',
            name: '常开时间段内验证',
        },
        {
            code: 'EMERGENCY_PASSWORD_OPEN',
            name: '紧急状态密码开闸',
        },
        {
            code: 'NORMALLY_OPEN',
            name: '常开时间段开闸',
        },
        {
            code: 'REMOTE_OPEN',
            name: '远程开闸',
        },
        {
            code: 'REMOTE_CLOSE',
            name: '远程关闸',
        },
    ],

    // 播报内容
    broadcastContent: [
        {
            code: 'NOT_BROADCAST',
            name: '不播报',
        },
        {
            code: 'WELCOME',
            name: '欢迎光临',
        },
        {
            code: 'THANKS_FOR_COMING',
            name: '谢谢光临',
        },
        {
            code: 'WELCOME_TO_VISIT',
            name: '欢迎来访',
        },
    ],

    // 操作结果
    operationResult: [
        {
            code: 'PROCESSING',
            name: '执行中',
        },
        {
            code: 'SUCCESS',
            name: '成功',
        },
        {
            code: 'FAILURE',
            name: '失败',
        },
    ],

    // 系统日志执行结果
    systemLogResult: [
        {
            code: 'SUCCESS',
            name: '成功',
        },
        {
            code: 'FAILURE',
            name: '失败',
        },
    ],

    // 操作日志操作类型
    operationLog: [
        {
            code: 'SUCCESS',
            name: '登录',
        },
        {
            code: 'FAILURE',
            name: '新增',
        },
        {
            code: 'FAILURE1',
            name: '编辑',
        },
        {
            code: 'FAILURE2',
            name: '删除',
        },
    ],

    // 语音播报模式
    voiceBroadcastMode: [
        {
            code: 'INTERNAL',
            name: '内置语音',
        },
        {
            code: 'CUSTOMIZE',
            name: '自定义',
        },
    ],
};
