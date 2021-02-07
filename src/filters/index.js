import i18n from '../i18n/zh-CN/zhCN.js';

export default {
    // 行业类型
    industryTypeFilter(val) {
        if (val) {
            return i18n.industryType.find((item) => {
                return item.code === val;
            }).name;
        }
    },
    // 人员规模
    staffSizeTypeFilter(val) {
        if (val) {
            return i18n.staffSizeType.find((item) => {
                return item.code === val;
            }).name;
        }
    },
    check(item, type) {
        const result = i18n[type].find((e) => {
            return item === e.code;
        });
        return result;
    },
    genderSingleFilter(val) {
        return i18n.gender.find((item) => {
            return item.code === val;
        }).name;
    },
    genderMultFilter(arr) {
        const list = [];
        if (arr instanceof Array) {
            arr.forEach((item) => {
                const itemResult = this.check(item, 'gender');
                if (itemResult) {
                    list.push(itemResult.name);
                }
            });
        }
        return list;
    },
    approvalStatusSingleFilter(val) {
        return i18n.approvalStatus.find((item) => {
            return item.code === val;
        }).name;
    },
    approvalStatusMultFilter(arr) {
        const list = [];
        if (arr instanceof Array) {
            arr.forEach((item) => {
                const itemResult = this.check(item, 'approvalStatus');
                if (itemResult) {
                    list.push(itemResult.name);
                }
            });
        }
        return list;
    },
    cardStatusSingleFilter(val) {
        return i18n.cardStatus.find((item) => {
            return item.code === val;
        }).name;
    },
    cardStatusMultFilter(arr) {
        const list = [];
        if (arr instanceof Array) {
            arr.forEach((item) => {
                const itemResult = this.check(item, 'cardStatus');
                if (itemResult) {
                    list.push(itemResult.name);
                }
            });
        }
        return list;
    },
    voucherStatusSingleFilter(val) {
        return i18n.voucherStatus.find((item) => {
            return item.code === val;
        }).name;
    },
    voucherStatusMultFilter(arr) {
        const list = [];
        if (arr instanceof Array) {
            arr.forEach((item) => {
                const itemResult = this.check(item, 'voucherStatus');
                if (itemResult) {
                    list.push(itemResult.name);
                }
            });
        }
        return list;
    },
    employeeTypeSingleFilter(val) {
        return i18n.employeeType.find((item) => {
            return item.code === val;
        }).name;
    },
    employeeTypeMultFilter(arr) {
        const list = [];
        if (arr instanceof Array) {
            arr.forEach((item) => {
                const itemResult = this.check(item, 'employeeType');
                if (itemResult) {
                    list.push(itemResult.name);
                }
            });
        }
        return list;
    },
    cardTypeSingleFilter(val) {
        return i18n.cardType.find((item) => {
            return item.code === val;
        }).name;
    },
    cardTypeMultFilter(arr) {
        const list = [];
        if (arr instanceof Array) {
            arr.forEach((item) => {
                const itemResult = this.check(item, 'cardType');
                if (itemResult) {
                    list.push(itemResult.name);
                }
            });
        }
        return list;
    },
    applyTypeSingleFilter(val) {
        return i18n.applyType.find((item) => {
            return item.code === val;
        }).name;
    },
    applyTypeMultFilter(arr) {
        const list = [];
        if (arr instanceof Array) {
            arr.forEach((item) => {
                const itemResult = this.check(item, 'applyType');
                if (itemResult) {
                    list.push(itemResult.name);
                }
            });
        }
        return list;
    },
    deviceTypeSingleFilter(val) {
        return i18n.deviceType.find((item) => {
            return item.code === val;
        }).name;
    },
    deviceTypeMultFilter(arr) {
        const list = [];
        if (arr instanceof Array) {
            arr.forEach((item) => {
                const itemResult = this.check(item, 'deviceType');
                if (itemResult) {
                    list.push(itemResult.name);
                }
            });
        }
        return list;
    },
    verifyType1SingleFilter(val) {
        return i18n.verifyType1.find((item) => {
            return item.code === val;
        }).name;
    },
    verifyType1MultFilter(arr) {
        const list = [];
        if (arr instanceof Array) {
            arr.forEach((item) => {
                const itemResult = this.check(item, 'verifyType1');
                if (itemResult) {
                    list.push(itemResult.name);
                }
            });
        }
        return list;
    },
    approvalResultSingleFilter(val) {
        return i18n.approvalResult.find((item) => {
            return item.code === val;
        }).name;
    },
    approvalResultMultFilter(arr) {
        const list = [];
        if (arr instanceof Array) {
            arr.forEach((item) => {
                const itemResult = this.check(item, 'approvalResult');
                if (itemResult) {
                    list.push(itemResult.name);
                }
            });
        }
        return list;
    },
    eventTypeSingleFilter(val) {
        if (val) {
            return i18n.eventType.find((item) => {
                return item.code === val;
            }).name;
        }
    },
    eventTypeMultFilter(arr) {
        const list = [];
        if (arr instanceof Array) {
            arr.forEach((item) => {
                const itemResult = this.check(item, 'eventType');
                if (itemResult) {
                    list.push(itemResult.name);
                }
            });
        }
        return list;
    },
    verifyType2SingleFilter(val) {
        return i18n.verifyType2.find((item) => {
            return item.code === val;
        }).name;
    },
    verifyType2MultFilter(arr) {
        const list = [];
        if (arr instanceof Array) {
            arr.forEach((item) => {
                const itemResult = this.check(item, 'verifyType2');
                if (itemResult) {
                    list.push(itemResult.name);
                }
            });
        }
        return list;
    },
    visitorLevelSingleFilter(val) {
        return i18n.visitorLevel.find((item) => {
            return item.code === val;
        }).name;
    },
    visitorLevelMultFilter(arr) {
        const list = [];
        if (arr instanceof Array) {
            arr.forEach((item) => {
                const itemResult = this.check(item, 'visitorLevel');
                if (itemResult) {
                    list.push(itemResult.name);
                }
            });
        }
        return list;
    },
    visitingFormSingleFilter(val) {
        return i18n.visitingForm.find((item) => {
            return item.code === val;
        }).name;
    },
    visitingFormMultFilter(arr) {
        const list = [];
        if (arr instanceof Array) {
            arr.forEach((item) => {
                const itemResult = this.check(item, 'visitingForm');
                if (itemResult) {
                    list.push(itemResult.name);
                }
            });
        }
        return list;
    },
    verifyType3SingleFilter(val) {
        return i18n.verifyType3.find((item) => {
            return item.code === val;
        }).name;
    },
    verifyType3MultFilter(arr) {
        const list = [];
        if (arr instanceof Array) {
            arr.forEach((item) => {
                const itemResult = this.check(item, 'verifyType3');
                if (itemResult) {
                    list.push(itemResult.name);
                }
            });
        }
        return list;
    },
    visitingVisitorStatusSingleFilter(val) {
        return i18n.visitingVisitorStatus.find((item) => {
            return item.code === val;
        }).name;
    },
    visitingVisitorStatusMultFilter(arr) {
        const list = [];
        if (arr instanceof Array) {
            arr.forEach((item) => {
                const itemResult = this.check(item, 'visitingVisitorStatus');
                if (itemResult) {
                    list.push(itemResult.name);
                }
            });
        }
        return list;
    },
    identityTypeSingleFilter(val) {
        return i18n.identityType.find((item) => {
            return item.code === val;
        }).name;
    },
    identityTypeMultFilter(arr) {
        const list = [];
        if (arr instanceof Array) {
            arr.forEach((item) => {
                const itemResult = this.check(item, 'identityType');
                if (itemResult) {
                    list.push(itemResult.name);
                }
            });
        }
        return list;
    },
    inoutStatusSingleFilter(val) {
        return i18n.inoutStatus.find((item) => {
            return item.code === val;
        }).name;
    },
    inoutStatusMultFilter(arr) {
        const list = [];
        if (arr instanceof Array) {
            arr.forEach((item) => {
                const itemResult = this.check(item, 'inoutStatus');
                if (itemResult) {
                    list.push(itemResult.name);
                }
            });
        }
        return list;
    },
    cardAuthRecordStatusSingleFilter(val) {
        return i18n.cardAuthRecordStatus.find((item) => {
            return item.code === val;
        }).name;
    },
    cardAuthRecordStatusMultFilter(arr) {
        const list = [];
        if (arr instanceof Array) {
            arr.forEach((item) => {
                const itemResult = this.check(item, 'cardAuthRecordStatus');
                if (itemResult) {
                    list.push(itemResult.name);
                }
            });
        }
        return list;
    },
    cardSendStatusSingleFilter(val) {
        return i18n.cardSendStatus.find((item) => {
            return item.code === val;
        }).name;
    },
    cardSendStatusMultFilter(arr) {
        const list = [];
        if (arr instanceof Array) {
            arr.forEach((item) => {
                const itemResult = this.check(item, 'cardSendStatus');
                if (itemResult) {
                    list.push(itemResult.name);
                }
            });
        }
        return list;
    },
    applyLevelSingleFilter(val) {
        return i18n.applyLevel.find((item) => {
            return item.code === val;
        }).name;
    },
    applyLevelMultFilter(arr) {
        const list = [];
        if (arr instanceof Array) {
            arr.forEach((item) => {
                const itemResult = this.check(item, 'applyLevel');
                if (itemResult) {
                    list.push(itemResult.name);
                }
            });
        }
        return list;
    },
    authOperationSingleFilter(val) {
        return i18n.authOperation.find((item) => {
            return item.code === val;
        }).name;
    },
    authOperationMultFilter(arr) {
        const list = [];
        if (arr instanceof Array) {
            arr.forEach((item) => {
                const itemResult = this.check(item, 'authOperation');
                if (itemResult) {
                    list.push(itemResult.name);
                }
            });
        }
        return list;
    },
    managementStatusFilter(val) {
        return i18n.managementStatus.find((item) => {
            return item.code === val;
        })?.name;
    },
    runningStatusFilter(val) {
        return i18n.runningStatus.find((item) => {
            return item.code === val;
        })?.name;
    },
    deviceStatusFilter(val) {
        return i18n.deviceStatus.find((item) => {
            return item.code === val;
        })?.name;
    },
    customerRuleFilter(val) {
        return i18n.customerRule.find((item) => {
            return item.code === val;
        })?.name;
    },
    verifyFilter(val) {
        return i18n.verify.find((item) => {
            return item.code === val;
        })?.name;
    },
    clutchAlarmSettingFilter(val) {
        return i18n.clutchAlarmSetting.find((item) => {
            return item.code === val;
        })?.name;
    },
    gateSettingFilter(val) {
        return i18n.gateSetting.find((item) => {
            return item.code === val;
        })?.name;
    },
    infraredRegionFilter(val) {
        return i18n.infraredRegion.find((item) => {
            return item.code === val;
        })?.name;
    },
    avoidPinchedSettingFilter(val) {
        return i18n.avoidPinchedSetting.find((item) => {
            return item.code === val;
        })?.name;
    },
    resetCounterFilter(val) {
        return i18n.resetCounter.find((item) => {
            return item.code === val;
        })?.name;
    },
    fireProtectionModeFilter(val) {
        return i18n.fireProtectionMode.find((item) => {
            return item.code === val;
        })?.name;
    },
    voiceSwitchFilter(val) {
        return i18n.voiceSwitch.find((item) => {
            return item.code === val;
        })?.name;
    },
    deviceExceptionTypeFilter(val) {
        return i18n.deviceExceptionType.find((item) => {
            return item.code === val;
        })?.name;
    },
    deviceBrokenTypeFilter(val) {
        return i18n.deviceBrokenType.find((item) => {
            return item.code === val;
        })?.name;
    },
    publishResultFilter(val) {
        return i18n.publishResult.find((item) => {
            return item.code === val;
        })?.name;
    },
    voicebroadcastSceneFilter(val) {
        return i18n.voicebroadcastScene.find((item) => {
            return item.code === val;
        })?.name;
    },
    voicebroadcastCharactersFilter(val) {
        return i18n.voicebroadcastCharacters.find((item) => {
            return item.code === val;
        })?.name;
    },
    deviceUnitTypeFilter(val) {
        return i18n.deviceUnitType.find((item) => {
            return item.code === val;
        })?.name;
    },
    organizationTypeFilter(val) {
        return i18n.organizationType.find((item) => {
            return item.code === val;
        })?.name;
    },
    deviceTroubleTypeFilter(val) {
        return i18n.deviceTroubleType.find((item) => {
            return item.code === val;
        })?.name;
    },
    deviceControlTypeFilter(val) {
        return i18n.deviceControlType.find((item) => {
            return item.code === val;
        })?.name;
    },
    batchStatusFilter(val) {
        return i18n.batchStatus.find((item) => {
            return item.code === val;
        })?.name;
    },
    operationMonitorFilter(val) {
        return i18n.operationMonitor.find((item) => {
            return item.code === val;
        })?.name;
    },
    manageStatusFilter(val) {
        return i18n.manageStatus.find((item) => {
            return item.code === val;
        })?.name;
    },
    // 事件类型
    deviceFilter(val) {
        return i18n.eventType.find((item) => {
            return item.code === val;
        })?.name;
    },
    // 处理结果
    resultFilter(val) {
        return i18n.results.find((item) => {
            return item.code === val;
        })?.name;
    },
    // 客户规模
    getCustomerScale(val) {
        return i18n.customerScale.find((item) => {
            return item.code === val;
        })?.name;
    },
    // 设备状态
    getDeviceStatusData(val) {
        return i18n.batchStatus.find((item) => {
            return item.code === val;
        })?.name;
    },
    // 操作结果
    getOperationType(val) {
        return i18n.operationType.find((item) => {
            return item.code === val;
        })?.name;
    },
    // 通道类型
    pathTypeListFilter(val) {
        return i18n.pathTypeList.find((item) => {
            return item.code === val;
        })?.name;
    },
    // 显示位置
    deviceInformationLocationFilter(val) {
        return i18n.deviceInformationLocation.find((item) => {
            return item.code === val;
        })?.name;
    },
    // 信息发布操作类型
    operationTypeListFilter(val) {
        return i18n.operationTypeList.find((item) => {
            return item.code === val;
        })?.name;
    },
    // 操作结果
    operationResultFilter(val) {
        return i18n.operationResult.find((item) => {
            return item.code === val;
        })?.name;
    },
    // 操作结果
    getBroadcastScenario(val) {
        return i18n.broadcastScenario.find((item) => {
            return item.code === val;
        })?.name;
    },
    // 操作结果
    getBroadcastContent(val) {
        return i18n.broadcastContent.find((item) => {
            return item.code === val;
        })?.name;
    },
    // 语音播报模式
    voiceBroadcastModeFilter(val) {
        return i18n.voiceBroadcastMode.find((item) => {
            return item.code === val;
        })?.name;
    },
};
