'use strict';

angular.module('newApp').service('dataService', ['$rootScope', '$http', function($rootScope, $http) {
        var service = {
            searchData: '',
            editData: '',
            search: function(params, callback) {
                $http({
                    method: params.search.method,
                    url: params.search.url,
                    params: params.search.params,
                    data: JSON.stringify(params.search.data),
                    headers: { 'Content-Type': 'application/json' }
                }).success(function(response) {
                    if (response.status == "timeout") {
                        login();
                        return;
                    }
                    if (!response.data) {
                        response.data = {
                            "pageIndex": 1,
                            "pageSize": 50,
                            "total": 0,
                            "rows": []
                        };
                    }
                    $("#shopDataTable").attr("pageIndex", response.data.pageIndex);
                    service.searchData = response.data;
                    $rootScope.$broadcast('dataService.search');
                });
            },
            edit: function(params, callback) {

            }
        }
        return service;
    }])
    .controller('dataCtrl', ['$scope', '$http', '$timeout', 'Configuration', 'dataService', function($scope, $http, $timeout, Configuration, dataService) {
        if (JSON.parse($.cookie('user_data')) != {}) {
            $scope.shopId = JSON.parse($.cookie('user_data')).shopId;
            $scope.shopName = JSON.parse($.cookie('user_data')).shopName;
            $scope.userName = JSON.parse($.cookie('user_data')).userName;
        } else {
            $scope.shopId = '';
            $scope.shopName = '';
            $scope.userName = '';
        }

        $scope.shopDataConfig = {
            bsTableId: '',
            add: '',
            del: null,
            edit: null,
            search: {
                url: Configuration.API + '/pc_report/getClaimData.do',
                callback: dataService.search,
                method: 'post',
                params: {
                    sso_token: Configuration.token,
                    pageIndex: 1,
                    pageSize: 50,
                },
                data: {
                    "shopId": $scope.shopId,
                    "fromDay": formatDate(new Date() - 86400000, 'yyyy-MM-dd'),
                    "toDay": formatDate(new Date() - 86400000, 'yyyy-MM-dd'),
                    "shopEntityId": "",
                    "entityName": "",
                    "contractNo": "",
                    "rateDescrip": "",
                    "collectRate": "",
                    "hasPic": -1,
                    "reviewStatus": -1,
                    "terminalStatus": -1,
                    "sortBy": "collectRate",
                    "reverse": "1",
                    "shopName": $scope.shopName,
                    "tagIds": [],
                    "querySource": 0
                }
            },
            inmport: '',
            reset: ''
        };

        var shops = {};

        $scope.$on('dataService.search', function(event) {
            $scope.shopDataControl.options.data = dataService.searchData;
            $scope.searchS = false;
            $scope.resetS = false;
            $scope.$applyAsync(function() {
                var shopEntityIds = [];
                $.each(shops, function(name, value) {
                    shopEntityIds.push(name);
                });
                $("#pushCommandTable").bootstrapTable("checkBy", { field: "shopEntityId", values: shopEntityIds });
                $scope.columnsChanged();
            });
        });

        $("#shopDataSearch").on("click", $(".recommendAmount"), function(event) {
            if ((event.target.parentNode.tagName.toLowerCase() == "th" && event.target.parentNode.classList.contains("recommendAmount")) || event.target.classList.contains("recommendAmount-arrow")) {
                if ($scope.shopDataSearch.sortBy == "recommendAmount") {
                    if ($scope.shopDataSearch.reverse == "1") {
                        $scope.shopDataSearch.reverse = "0";
                    } else {
                        $scope.shopDataSearch.reverse = "1";
                    }
                } else {
                    $scope.shopDataSearch.sortBy = "recommendAmount";
                    $scope.shopDataSearch.reverse = "1";
                }
                $scope.search();
            }
        });

        $("#shopDataSearch").on("click", $(".claimMoneyTotal"), function(event) {
            if ((event.target.parentNode.tagName.toLowerCase() == "th" && event.target.parentNode.classList.contains("claimMoneyTotal")) || event.target.classList.contains("claimMoneyTotal-arrow")) {
                if ($scope.shopDataSearch.sortBy == "claimMoneyTotal") {
                    if ($scope.shopDataSearch.reverse == "1") {
                        $scope.shopDataSearch.reverse = "0";
                    } else {
                        $scope.shopDataSearch.reverse = "1";
                    }
                } else {
                    $scope.shopDataSearch.sortBy = "claimMoneyTotal";
                    $scope.shopDataSearch.reverse = "1";
                }
                $scope.search();
            }
        });

        $("#shopDataSearch").on("click", $(".collectRate"), function(event) {
            if ((event.target.parentNode.tagName.toLowerCase() == "th" && event.target.parentNode.classList.contains("collectRate")) || event.target.classList.contains("collectRate-arrow")) {
                if ($scope.shopDataSearch.sortBy == "collectRate") {
                    if ($scope.shopDataSearch.reverse == "1") {
                        $scope.shopDataSearch.reverse = "0";
                    } else {
                        $scope.shopDataSearch.reverse = "1";
                    }
                } else {
                    $scope.shopDataSearch.sortBy = "collectRate";
                    $scope.shopDataSearch.reverse = "1";
                }
                $scope.search();
            }
        });

        $("#shopDataSearch").on("mouseover", $(".collectRate"), function(event) {
            if (event.target.parentNode.tagName.toLowerCase() == "th" && event.target.parentNode.classList.contains("collectRate")) {
                $(".data-tip").css({ "visibility": "visible" });
            }
        }).on("mouseout", $(".collectRate"), function(event) {
            if (event.target.parentNode.tagName.toLowerCase() == "th" && event.target.parentNode.classList.contains("collectRate")) {
                $(".data-tip").css({ "visibility": "hidden" });
            }
        });

        $("#shopDataSearch").on("click", $(".claimNum"), function(event) {
            if ((event.target.parentNode.tagName.toLowerCase() == "th" && event.target.parentNode.classList.contains("claimNum")) || event.target.classList.contains("claimNum-arrow")) {
                if ($scope.shopDataSearch.sortBy == "claimNum") {
                    if ($scope.shopDataSearch.reverse == "1") {
                        $scope.shopDataSearch.reverse = "0";
                    } else {
                        $scope.shopDataSearch.reverse = "1";
                    }
                } else {
                    $scope.shopDataSearch.sortBy = "claimNum";
                    $scope.shopDataSearch.reverse = "1";
                }
                $scope.search();
            }
        });

        $scope.$on('$viewContentLoaded', function() {

            $scope.rateDescripsSearch = [{
                "text": "大于等于",
                "code": ">="
            }, {
                "text": "小于",
                "code": "<"
            }];

            $scope.hasPicsSearch = [{
                "text": "请选择",
                "code": -1
            }, {
                "text": "未上传图片",
                "code": 0
            }, {
                "text": "已上传图片",
                "code": 1
            }];

            $scope.reviewStatussSearch = [{
                "text": "请选择",
                "code": -1
            }, {
                "text": "未上报",
                "code": 0
            }, {
                "text": "已上报",
                "code": 1
            }, {
                "text": "已审核",
                "code": 2
            }, {
                "text": "退回",
                "code": 3
            }];

            $scope.terminalStatussSearch = [{
                "text": "请选择",
                "code": -1
            }, {
                "text": "否",
                "code": 0
            }, {
                "text": "是",
                "code": 1
            }];

            $scope.tagIdsSearch = [];

            $http.get(Configuration.API + '/pc_report/getTags.do?shopId=' + $scope.shopId + '&sso_token=' + Configuration.token).
            success(function(data, status) {
                if (data.status == "timeout") {
                    login();
                    return;
                }
                $scope.tagIdsSearch = data.data;
                return;
            }).
            error(function(data, status) {
                return;
            });

            $scope.$$postDigestQueue.push(function() {
                $("input[name='tagIds']").click(function() {
                    var count = 0;
                    $("input[name='tagIds']").each(function() {
                        if (this.checked) {
                            count++;
                        }
                    });
                    if (count < 2) {
                        $("input[name='tagIds']").each(function() {
                            if (this.checked) {
                                this.disabled = true;
                            } else {
                                this.disabled = false;
                            }
                        });
                    } else {
                        $("input[name='tagIds']").each(function() {
                            this.disabled = false;
                        });
                    }
                });
            });

            $scope.shopDataSearch = {
                "shopId": $scope.shopId,
                "fromDay": formatDate(new Date() - 86400000, 'yyyy-MM-dd'),
                "toDay": formatDate(new Date() - 86400000, 'yyyy-MM-dd'),
                "shopEntityId": "",
                "entityName": "",
                "contractNo": "",
                "rateDescrip": "",
                "collectRate": "",
                "hasPic": -1,
                "reviewStatus": -1,
                "terminalStatus": -1,
                "sortBy": "collectRate",
                "reverse": "1",
                "shopName": $scope.shopName,
                "tagIds": [],
                "querySource": 0
            };

            $("#saleTime").val(formatDate(new Date() - 86400000, 'yyyy-MM-dd'));

            $scope.shopDataSearch.fromDay = $("#saleTime").val();

            $scope.shopDataSearch.toDay = $("#saleTime").val();

            $scope.searchS = false;

            $scope.resetS = false;

            $scope.shopDataConfig.search.data = $scope.shopDataSearch;

            $scope.pageNumber = 0;

            $scope.search = function() {
                $scope.shopDataSearch.fromDay = $("#saleTime").val();
                $scope.shopDataSearch.toDay = $("#saleTime").val();
                $scope.searchS = true;
                $scope.pageNumber = $("#shopDataTable").bootstrapTable('getData').length;
                $scope.shopDataSearch.tagIds = [];
                $("input[name='tagIds']:checked").each(function() {
                    $scope.shopDataSearch.tagIds.push(this.value);
                });
                if ($scope.pageNumber > 0) {
                    $("#shopDataTable").bootstrapTable('selectPage', 1);
                } else {
                    dataService.search({
                        search: {
                            callback: dataService.search,
                            url: Configuration.API + '/pc_report/getClaimData.do',
                            method: 'post',
                            params: {
                                sso_token: Configuration.token,
                                pageIndex: 1,
                                pageSize: 50
                            },
                            data: $scope.shopDataSearch
                        }
                    });
                }
            };

            $scope.reset = function() {
                $scope.resetS = true;
                $scope.shopDataSearch.fromDay = formatDate(new Date() - 86400000, 'yyyy-MM-dd');
                $scope.shopDataSearch.toDay = formatDate(new Date() - 86400000, 'yyyy-MM-dd');
                $scope.shopDataSearch.shopEntityId = "";
                $scope.shopDataSearch.entityName = "";
                $scope.shopDataSearch.contractNo = "";
                $scope.shopDataSearch.rateDescrip = "";
                $scope.shopDataSearch.collectRate = "";
                $scope.shopDataSearch.hasPic = -1;
                $scope.shopDataSearch.reviewStatus = -1;
                $scope.shopDataSearch.terminalStatus = -1;
                $scope.shopDataSearch.sortBy = "collectRate";
                $scope.shopDataSearch.reverse = "1";
                $scope.shopDataSearch.tagIds = [];
                $scope.shopDataSearch.querySource = 0;
                $("#saleTime").val(formatDate(new Date() - 86400000, 'yyyy-MM-dd'));
                $("input[name='tagIds']").each(function() {
                    this.checked = false;
                });
                $scope.search();

            }

            $scope.passAll = function() {
                var data = [];
                $.each(shops, function(name, value) {
                    data.push({
                        "shopEntityId": shops[name].shopEntityId,
                        "confirmMoney": shops[name].confirmMoney,
                        "claimMoneyTotal": shops[name].claimMoneyTotal,
                        "claimBillTotal": shops[name].claimBillTotal
                    });
                })
                if (data.length > 0) {
                    $http({
                        method: 'post',
                        url: Configuration.API + '/pc_report/review.do?sso_token=' + Configuration.token,
                        data: JSON.stringify({
                            "userName": $scope.userName,
                            "shopId": $scope.shopDataSearch.shopId,
                            "reviewStatus": 2,
                            "saleTime": $scope.shopDataSearch.fromDay,
                            "data": data
                        }),
                        headers: { 'Content-Type': 'application/json' }
                    }).success(function(response) {
                        if (response.status == "timeout") {
                            login();
                            return;
                        }
                        if (response.status == "S") {
                            shops = {};
                            $scope.search();
                        }
                        shadowShowText("提示", response.msg);
                    });
                }
            }

            $scope.export = function($event) {
                $event.stopPropagation();
                var formExport = $('<form></form>');
                formExport.attr("target", "");
                formExport.attr("method", "post");
                formExport.attr("action", Configuration.API + '/pc_report/download/claimData.do?sso_token=' + Configuration.token);
                formExport.attr("style", "display:none");
                var shopIdInput = $('<input name="shopId"/>');
                shopIdInput.attr("value", $scope.shopDataSearch.shopId);
                var fromDayInput = $('<input name="fromDay"/>');
                fromDayInput.attr("value", $scope.shopDataSearch.fromDay);
                var toDayInput = $('<input name="toDay"/>');
                toDayInput.attr("value", $scope.shopDataSearch.toDay);
                var shopEntityIdInput = $('<input name="shopEntityId"/>');
                shopEntityIdInput.attr("value", $scope.shopDataSearch.shopEntityId);
                var entityNameInput = $('<input name="entityName"/>');
                entityNameInput.attr("value", $scope.shopDataSearch.entityName);
                var contractNoInput = $('<input name="contractNo"/>');
                contractNoInput.attr("value", $scope.shopDataSearch.contractNo);
                var rateDescripInput = $('<input name="rateDescrip"/>');
                rateDescripInput.attr("value", $scope.shopDataSearch.rateDescrip);
                var collectRateInput = $('<input name="collectRate"/>');
                collectRateInput.attr("value", $scope.shopDataSearch.collectRate);
                var hasPicInput = $('<input name="hasPic"/>');
                hasPicInput.attr("value", $scope.shopDataSearch.hasPic);
                var reviewStatusInput = $('<input name="reviewStatus"/>');
                reviewStatusInput.attr("value", $scope.shopDataSearch.reviewStatus);
                var terminalStatusInput = $('<input name="terminalStatus"/>');
                terminalStatusInput.attr("value", $scope.shopDataSearch.terminalStatus);
                var sortByInput = $('<input name="sortBy"/>');
                sortByInput.attr("value", $scope.shopDataSearch.sortBy);
                var reverseInput = $('<input name="reverse"/>');
                reverseInput.attr("value", $scope.shopDataSearch.reverse);
                var shopNameInput = $('<input name="shopName"/>');
                shopNameInput.attr("value", $scope.shopDataSearch.shopName);
                var tagIds = "";
                $.each($scope.shopDataSearch.tagIds, function(i, value) {
                    tagIds = $('<input name="tagIds"/>');
                    tagIds.attr("value", $scope.shopDataSearch.tagIds[i]);
                    formExport.append(tagIds);
                });
                var querySourceInput = $('<input name="querySource"/>');
                querySourceInput.attr("value", $scope.shopDataSearch.querySource);
                formExport.append(shopIdInput);
                formExport.append(fromDayInput);
                formExport.append(toDayInput);
                formExport.append(shopEntityIdInput);
                formExport.append(entityNameInput);
                formExport.append(contractNoInput);
                formExport.append(rateDescripInput);
                formExport.append(collectRateInput);
                formExport.append(hasPicInput);
                formExport.append(reviewStatusInput);
                formExport.append(terminalStatusInput);
                formExport.append(sortByInput);
                formExport.append(reverseInput);
                formExport.append(shopNameInput);
                formExport.append(querySourceInput);
                $("body").append(formExport);
                formExport.submit();
                formExport.remove();
            }

            $scope.columnsChanged = function() {
                var bhtml = "";
                if ($(".recommendAmount:eq(0) div:eq(0)").html().indexOf('<') > 0) {
                    bhtml = $(".recommendAmount:eq(0) div:eq(0)").html().substring(0, $(".recommendAmount:eq(0) div:eq(0)").html().indexOf('<'));
                } else {
                    bhtml = $(".recommendAmount:eq(0) div:eq(0)").html();
                }
                var phtml = "";
                if ($(".claimMoneyTotal:eq(0) div:eq(0)").html().indexOf('<') > 0) {
                    phtml = $(".claimMoneyTotal:eq(0) div:eq(0)").html().substring(0, $(".claimMoneyTotal:eq(0) div:eq(0)").html().indexOf('<'));
                } else {
                    phtml = $(".claimMoneyTotal:eq(0) div:eq(0)").html();
                }
                var ahtml = "";
                if ($(".collectRate:eq(0) div:eq(0)").html().indexOf('<') > 0) {
                    ahtml = $(".collectRate:eq(0) div:eq(0)").html().substring(0, $(".collectRate:eq(0) div:eq(0)").html().indexOf('<'));
                } else {
                    ahtml = $(".collectRate:eq(0) div:eq(0)").html();
                }
                var lhtml = "";
                if ($(".claimNum:eq(0) div:eq(0)").html().indexOf('<') > 0) {
                    lhtml = $(".claimNum:eq(0) div:eq(0)").html().substring(0, $(".claimNum:eq(0) div:eq(0)").html().indexOf('<'));
                } else {
                    lhtml = $(".claimNum:eq(0) div:eq(0)").html();
                }

                if ($scope.shopDataSearch.sortBy == "recommendAmount") {
                    if ($scope.shopDataSearch.reverse == "1") {
                        bhtml += "<i class='glyphicon glyphicon-arrow-down recommendAmount-arrow'></i>";
                    } else {
                        bhtml += "<i class='glyphicon glyphicon-arrow-up recommendAmount-arrow'></i>";
                    }
                    $(".recommendAmount:eq(0) div:eq(0)").html(bhtml);
                    $(".claimMoneyTotal:eq(0) div:eq(0)").html(phtml + "<i class='glyphicon glyphicon-arrow-down claimMoneyTotal-arrow' style='color:#dddddd' ></i>");
                    $(".collectRate:eq(0) div:eq(0)").html(ahtml + "<i class='glyphicon glyphicon-arrow-down collectRate-arrow' style='color:#dddddd' ></i>");
                    $(".claimNum:eq(0) div:eq(0)").html(lhtml + "<i class='glyphicon glyphicon-arrow-down claimNum-arrow' style='color:#dddddd' ></i>");
                } else if ($scope.shopDataSearch.sortBy == "claimMoneyTotal") {
                    if ($scope.shopDataSearch.reverse == "1") {
                        phtml += "<i class='glyphicon glyphicon-arrow-down claimMoneyTotal-arrow'></i>";
                    } else {
                        phtml += "<i class='glyphicon glyphicon-arrow-up claimMoneyTotal-arrow'></i>";
                    }
                    $(".recommendAmount:eq(0) div:eq(0)").html(bhtml + "<i class='glyphicon glyphicon-arrow-down recommendAmount-arrow' style='color:#dddddd' ></i>");
                    $(".claimMoneyTotal:eq(0) div:eq(0)").html(phtml);
                    $(".collectRate:eq(0) div:eq(0)").html(ahtml + "<i class='glyphicon glyphicon-arrow-down collectRate-arrow' style='color:#dddddd' ></i>");
                    $(".claimNum:eq(0) div:eq(0)").html(lhtml + "<i class='glyphicon glyphicon-arrow-down claimNum-arrow' style='color:#dddddd' ></i>");
                } else if ($scope.shopDataSearch.sortBy == "collectRate") {
                    if ($scope.shopDataSearch.reverse == "1") {
                        ahtml += "<i class='glyphicon glyphicon-arrow-down collectRate-arrow'></i>";
                    } else {
                        ahtml += "<i class='glyphicon glyphicon-arrow-up collectRate-arrow'></i>";
                    }
                    $(".recommendAmount:eq(0) div:eq(0)").html(bhtml + "<i class='glyphicon glyphicon-arrow-down recommendAmount-arrow' style='color:#dddddd' ></i>");
                    $(".claimMoneyTotal:eq(0) div:eq(0)").html(phtml + "<i class='glyphicon glyphicon-arrow-down claimMoneyTotal-arrow' style='color:#dddddd' ></i>");
                    $(".collectRate:eq(0) div:eq(0)").html(ahtml);
                    $(".claimNum:eq(0) div:eq(0)").html(lhtml + "<i class='glyphicon glyphicon-arrow-down claimNum-arrow' style='color:#dddddd' ></i>");
                } else {
                    if ($scope.shopDataSearch.reverse == "1") {
                        lhtml += "<i class='glyphicon glyphicon-arrow-down claimNum-arrow'></i>";
                    } else {
                        lhtml += "<i class='glyphicon glyphicon-arrow-up claimNum-arrow'></i>";
                    }
                    $(".recommendAmount:eq(0) div:eq(0)").html(bhtml + "<i class='glyphicon glyphicon-arrow-down recommendAmount-arrow' style='color:#dddddd' ></i>");
                    $(".claimMoneyTotal:eq(0) div:eq(0)").html(phtml + "<i class='glyphicon glyphicon-arrow-down claimMoneyTotal-arrow' style='color:#dddddd' ></i>");
                    $(".collectRate:eq(0) div:eq(0)").html(ahtml + "<i class='glyphicon glyphicon-arrow-down collectRate-arrow' style='color:#dddddd' ></i>");
                    $(".claimNum:eq(0) div:eq(0)").html(lhtml);
                }

                if ($(".data-tip").length == 0) {
                    $(".collectRate:eq(0)").append("<div class='data-tip' >采集率=上报金额/采集金额*100%</div>");
                }
            };

            $scope.shopDataControl = {
                options: {
                    method: 'get',
                    data: '',
                    cache: false,
                    height: 'auto',
                    striped: true,
                    uniqueId: 'shopEntityId',
                    pagination: true,
                    sidePagination: "server",
                    pageSize: 50,
                    // pageList: [10, 25, 50, 100, 200],
                    search: false,
                    showColumns: false,
                    showRefresh: false,
                    searchAlign: 'left',
                    buttonsAlign: 'left',
                    showExport: true,
                    minimumCountColumns: 2,
                    clickToSelect: false,
                    undefinedText: '',
                    //queryParamsType: false,
                    showPaginationSwitch: false,
                    // showToggle: true,
                    //smartDisplay: true,
                    toolbar: '#search_button',
                    toolbarAlign: 'right',
                    classes: 'table table-no-bordered table-condensed table-beark',
                    clickToSelect: true,
                    singleSelect: false,
                    columns: [{
                        field: '',
                        title: '#',
                        align: 'center',
                        checkbox: true,
                        width: '2%'
                    }, {
                        field: 'saleTime',
                        title: '销售日期',
                        align: 'left',
                        valign: 'middle',
                        width: '9%',
                        sortable: false
                    }, {
                        field: 'contractNo',
                        title: '合同号',
                        align: 'left',
                        valign: 'middle',
                        width: '7%',
                        sortable: false
                    }, {
                        field: 'entityName',
                        title: '店铺名称',
                        align: 'left',
                        valign: 'middle',
                        width: '7%',
                        sortable: false
                    }, {
                        field: 'terminalStatus',
                        title: '安装状态',
                        align: 'left',
                        valign: 'middle',
                        formatter: terminalFormatter,
                        width: '7%',
                        sortable: false
                    }, {
                        field: 'recommendAmount',
                        title: '推荐金额',
                        align: 'left',
                        valign: 'middle',
                        class: 'recommendAmount',
                        formatter: recommendFormatter,
                        width: '9%',
                        sortable: false
                    }, {
                        field: 'claimMoneyTotal',
                        title: '上报金额',
                        align: 'left',
                        valign: 'middle',
                        class: 'claimMoneyTotal',
                        formatter: claimFormatter,
                        width: '9%',
                        sortable: false
                    }, {
                        field: 'collectRate',
                        title: '采集率',
                        align: 'left',
                        valign: 'middle',
                        class: 'collectRate',
                        formatter: percentFormatter,
                        width: '8%',
                        sortable: false
                    }, {
                        field: 'review',
                        title: '审核状态',
                        align: 'left',
                        valign: 'middle',
                        formatter: reviewFormatter,
                        width: '7%',
                        sortable: false
                    }, {
                        field: 'confirmMoney',
                        title: '确认金额',
                        align: 'left',
                        valign: 'middle',
                        formatter: valueFormatter,
                        width: '9%',
                        sortable: false
                    }, {
                        field: 'flag',
                        title: '操作',
                        align: 'left',
                        valign: 'middle',
                        clickToSelect: false,
                        formatter: flagFormatter,
                        width: '8%',
                        events: flagEvents
                    }, {
                        field: 'claimNum',
                        title: '操作次数',
                        align: 'left',
                        valign: 'middle',
                        class: 'claimNum',
                        clickToSelect: false,
                        formatter: numberFormatter,
                        width: '9%',
                        sortable: false
                    }, {
                        field: 'tagSign',
                        title: '属性标签',
                        align: 'left',
                        valign: 'middle',
                        formatter: tagSignFormatter,
                        width: '9%',
                        sortable: false
                    }],
                    onCheck: function(row) {
                        shops[row['shopEntityId']] = {
                            "shopEntityId": row.shopEntityId,
                            "confirmMoney": row.confirmMoney,
                            "claimMoneyTotal": row.claimMoneyTotal,
                            "claimBillTotal": row.claimBillTotal
                        }; // 没有选上的才加入shops;
                    },
                    onUncheck: function(row) {
                        delete(shops[row['shopEntityId']]);
                    },
                    onCheckAll: function(rows) {
                        $.each(rows, function(i, row) {
                            shops[row['shopEntityId']] = {
                                "shopEntityId": row.shopEntityId,
                                "confirmMoney": row.confirmMoney,
                                "claimMoneyTotal": row.claimMoneyTotal,
                                "claimBillTotal": row.claimBillTotal
                            }; // 没有选上的才加入shops;
                        });
                    },
                    onUncheckAll: function(rows) {
                        $.each(rows, function(i, row) {
                            delete(shops[row['shopEntityId']]);
                        });
                    }

                }
            };

            function terminalFormatter(value, row, index) {
                var terminalStatus = "否";
                if (row.terminalNum) {
                    terminalStatus = "是";
                }
                return terminalStatus;
            }

            function recommendFormatter(value, row, index) {
                var recommendAmount = formatCurrency(value);
                if (!row.terminalNum && !value) {
                    recommendAmount = "-";
                }
                return recommendAmount;
            }

            function claimFormatter(value, row, index) {
                var claimMoneyTotal = formatCurrency(value);
                if (!row.isClaimed && !value) {
                    claimMoneyTotal = "-";
                }
                return claimMoneyTotal;
            }

            function valueFormatter(value, row, index) {
                return formatCurrency(value);
            }

            function percentFormatter(value, row, index) {
                value = value ? value : 0;
                return formatCurrency(value * 100) + "%";
            }

            function infomationFormatter(value, row, index) {
                var info = "";
                if (typeof value == "string") {
                    info = (value.length > 13) ? value.substring(0, 13) + "..." : value;
                }
                return info;
            }

            function reviewFormatter(value, row, index) {
                var convert = {
                    "0": function() {
                        return "未上报";
                    },
                    "1": function() {
                        return "已上报";
                    },
                    "2": function() {
                        return "已审核";
                    },
                    "3": function() {
                        return "退回";
                    }
                }
                if (typeof convert[row.reviewStatus] !== 'function') {
                    return "";
                }
                return convert[row.reviewStatus]();
            }

            function numberFormatter(value, row, index) {
                return '<i class="glyphicon-reportnum pointer " data-toggle="modal" data-target="#ohistoryModal" data-rowid="' + row.shopEntityId + '" >' + value + '</i>';
            }

            function tagSignFormatter(value, row, index) {
                var tagName = "";
                if (Object.prototype.toString.call(row.tags) == '[object Array]') {
                    $.each(row.tags, function(i, value) {
                        tagName += row.tags[i].tag + " ";
                    });
                }
                tagName = tagName.length > 0 ? tagName.substring(0, tagName.length - 1) : tagName;
                return tagName;
            }

            function flagFormatter(value, row, index) {
                var buttons = "";
                if (row.shopEntityId) {
                    buttons = buttons + '<i class="glyphicon glyphicon-time pointer " data-toggle="modal" data-target="#rhistoryModal" data-rowid="' + row.shopEntityId + '" ></i>';
                    buttons = buttons + '<i class="glyphicon glyphicon-eye-open pointer " data-toggle="modal" data-target="#detailModal" data-rowid="' + row.shopEntityId + '" ></i>';
                    if (Object.prototype.toString.call(row.pic) == '[object Array]' && row.pic.length > 0) {
                        buttons = buttons + '<i class="fa fa-picture-o pointer " data-rowid="' + row.shopEntityId + '" ></i>';
                    }
                }
                return buttons;
            }
            var flagEvents = {
                event: 'click',
                value: function(argument) {

                }
            } 

            $scope.shopData = {
                "saleTime": "", //销售日期
                "contractNo": "", //合同号
                "shopEntityId": "", //店铺编号
                "shopEntityName": "", //店铺名称
                "recommendAmount": "", //采集金额
                "claimMoneyTotal": "", //上报金额
                "confirmMoney": "",
                "collectRate": "", //采集率
                "noteInformation": "", //备注信息
                "claimBillTotal": "",
                "pic": [] //图片数组
            };

            $scope.claimMoneyTotal = "";

            $scope.rhistorys = [];

            $scope.ohistorys = [];

            $scope.recommendFormat = function(value, terminalNum) {
                var recommendAmount = formatCurrency(value);
                if (!terminalNum && !value) {
                    recommendAmount = "-";
                }
                return recommendAmount;
            }

            $scope.claimFormat = function(value, isClaimed) {
                var claimMoneyTotal = formatCurrency(value);
                if (!isClaimed && !value) {
                    claimMoneyTotal = "-";
                }
                return claimMoneyTotal;
            }

            $scope.percentFormat = function(value) {
                value = value ? value : 0;
                return formatCurrency(value * 100) + "%";
            }

            $scope.shopDataConfig.time = {
                callback: function(params, row) {
                    var height = parseInt(window.windowHeight);
                    $('.data-block').css({ 'max-height': height * 0.8 - 200 + 'px' });
                    $http({
                        method: 'post',
                        url: Configuration.API + '/pc_report/getClaimData.do',
                        params: {
                            sso_token: Configuration.token,
                            pageIndex: 1,
                            pageSize: 1000,
                        },
                        data: JSON.stringify({
                            "shopId": $scope.shopId,
                            "fromDay": formatDate(new Date() - 86400000 * 60, 'yyyy-MM-dd'),
                            "toDay": formatDate(new Date() - 86400000, 'yyyy-MM-dd'),
                            "shopEntityId": row.shopEntityId,
                            "entityName": "",
                            "contractNo": "",
                            "rateDescrip": "",
                            "collectRate": "",
                            "hasPic": -1,
                            "reviewStatus": -1,
                            "terminalStatus": -1,
                            "sortBy": "saleTime",
                            "reverse": "1",
                            "shopName": $scope.shopName,
                            "tagIds": [],
                            "querySource": 1
                        }),
                        headers: { 'Content-Type': 'application/json' }
                    }).success(function(response) {
                        if (response.status == "timeout") {
                            login();
                            return;
                        }
                        $scope.rhistorys = [];
                        if (response.data && response.data.rows && Object.prototype.toString.call(response.data.rows) == '[object Array]') {
                            $scope.rhistorys = response.data.rows;
                        }
                        $.each($scope.rhistorys, function(i, value) {
                            $scope.rhistorys[i].recommendAmount = $scope.recommendFormat($scope.rhistorys[i].recommendAmount, $scope.rhistorys[i].terminalNum);
                            $scope.rhistorys[i].claimMoneyTotal = $scope.claimFormat($scope.rhistorys[i].claimMoneyTotal, $scope.rhistorys[i].isClaimed);
                            $scope.rhistorys[i].collectRate = $scope.percentFormat($scope.rhistorys[i].collectRate);
                            $scope.rhistorys[i].confirmMoney = formatCurrency($scope.rhistorys[i].confirmMoney);
                        });
                        return;
                    });
                }
            };

            $scope.shopDataConfig.see = {
                callback: function(params, row) {
                    var height = parseInt(window.windowHeight);
                    $('.data-block').css({ 'max-height': height * 0.8 - 200 + 'px' });
                    $scope.$apply(function() {
                        $scope.shopData = Object.assign({}, row);
                        $scope.shopData.recommendAmount = $scope.recommendFormat($scope.shopData.recommendAmount, $scope.shopData.terminalNum);
                        $scope.claimMoneyTotal = $scope.claimFormat($scope.shopData.claimMoneyTotal, $scope.shopData.isClaimed);
                        $scope.shopData.collectRate = $scope.percentFormat($scope.shopData.collectRate);
                        if (formatDate(new Date() - 86400000, 'yyyy-MM-dd') == $scope.shopData.saleTime) {
                            $scope.shopData.saleTime = "昨天" + $scope.shopData.saleTime;
                        }
                        $scope.shopData.confirmMoney = formatCurrency($scope.shopData.confirmMoney);
                    });
                }
            };

            $scope.shopDataConfig.picture = {
                callback: function(params, row) {}
            };

            $scope.shopDataConfig.number = {
                callback: function(params, row) {
                    var height = parseInt(window.windowHeight);
                    $('.data-block').css({ 'max-height': height * 0.8 - 200 + 'px' });
                    $http({
                        method: 'post',
                        url: Configuration.API + '/pc_report/claimOpHistory.do',
                        params: {
                            sso_token: Configuration.token,
                            pageIndex: 1,
                            pageSize: 1000,
                        },
                        data: {
                            "shopId": $scope.shopId,
                            "fromDay": $scope.shopDataSearch.fromDay,
                            "toDay": $scope.shopDataSearch.toDay,
                            "shopEntityId": row.shopEntityId,
                        }
                    }).success(function(response) {
                        if (response.status == "timeout") {
                            login();
                            return;
                        }
                        $scope.ohistorys = [];
                        if (response.data && response.data.history && Object.prototype.toString.call(response.data.history) == '[object Array]') {
                            $scope.ohistorys = response.data.history;
                        }
                        $.each($scope.ohistorys, function(i, value) {
                            $scope.ohistorys[i].claimMoneyTotal = formatCurrency($scope.ohistorys[i].claimMoneyTotal);
                        });
                        return;
                    });
                }
            };

            $scope.seeBigPhoto = function(image) {
                $("#seephoto").modal("show");
                $("#contentbody").html("<img src=" + image + "></img>");
            };

            $scope.back = function() {
                $http({
                    method: 'post',
                    url: Configuration.API + '/pc_report/review.do?sso_token=' + Configuration.token,
                    data: JSON.stringify({
                        "userName": $scope.userName,
                        "shopId": $scope.shopDataSearch.shopId,
                        "reviewStatus": 3,
                        "saleTime": $scope.shopDataSearch.fromDay,
                        "data": [{
                            "shopEntityId": $scope.shopData.shopEntityId,
                            "confirmMoney": $scope.shopData.confirmMoney,
                            "claimMoneyTotal": $scope.shopData.claimMoneyTotal,
                            "claimBillTotal": $scope.shopData.claimBillTotal
                        }]
                    }),
                    headers: { 'Content-Type': 'application/json' }
                }).success(function(response) {
                    if (response.status == "timeout") {
                        login();
                        return;
                    }
                    if (response.status == "S") {
                        $("#detailModal").modal('hide');
                        $scope.search();
                    }
                    shadowShowText("提示", response.msg);
                });
            }

            $scope.pass = function() {
                $http({
                    method: 'post',
                    url: Configuration.API + '/pc_report/review.do?sso_token=' + Configuration.token,
                    data: JSON.stringify({
                        "userName": $scope.userName,
                        "shopId": $scope.shopDataSearch.shopId,
                        "reviewStatus": 2,
                        "saleTime": $scope.shopDataSearch.fromDay,
                        "data": [{
                            "shopEntityId": $scope.shopData.shopEntityId,
                            "confirmMoney": $scope.shopData.confirmMoney,
                            "claimMoneyTotal": $scope.shopData.claimMoneyTotal,
                            "claimBillTotal": $scope.shopData.claimBillTotal
                        }]
                    }),
                    headers: { 'Content-Type': 'application/json' }
                }).success(function(response) {
                    if (response.status == "timeout") {
                        login();
                        return;
                    }
                    if (response.status == "S") {
                        $("#detailModal").modal('hide');
                        $scope.search();
                    }
                    shadowShowText("提示", response.msg);
                });
            }
        });
    }]);
