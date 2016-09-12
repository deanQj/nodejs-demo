$(function() {

	// 错误信息的js渲染
	$('#errorMessage').alert();

	/**
	 * jquery form 序列号对象
	 * @returns {*}
	 */
	if (!$.prototype.serializeObject) {
	    $.prototype.serializeObject = function () {
	        var hasOwnProperty = Object.prototype.hasOwnProperty;
	        return this.serializeArray().reduce(function (data, pair) {
	            if (!hasOwnProperty.call(data, pair.name)) {
	                data[pair.name] = pair.value;
	            }
	            return data;
	        }, {});
	    };
	}

	/**
	 * jquery 扩展
	 */
	$.extend({
		bootstrapTable : function(config) {

	        var TableObj = {
	            deffConfig : {
	                tableId: '#bs-table',
	                operateSelId : '#bs-operate-sel',
	                operateBtnId : '#bs-operate-btn',
	                operateModalId : '#bsTableOperateModal',
	                formId : '#bs-form',
	                toolbar: '#bs-toolbar',
	                delField: '_id',
	                search : false, // 显示搜索框
	                searchOnEnterKey : true, // 搜索框回车后才执行查询
	                searchAlign : 'left', // 搜索框位置
	                showRefresh : true, // 显示刷新按钮
	                showColumns : true, // 显示列下拉列表
	                pagination : true, // 显示在表格底部的分页工具栏
	                pageSize : 15,
	                pageList : [15, 30, 50, 100],
	                paginationLoop : false,
	                sidePagination : 'server', // 设置分页数据源是"client"或"server"
	                dataField : 'rows', //关键在传入的JSON数据表包含的行。 默认"rows"
	                method : 'POST',
	                contentType: 'application/x-www-form-urlencoded',
	                queryParams : function (params) {
	                    params.page = (params.offset/params.limit)+1;
	                    return params;
	                },
	                responseHandler : function (res) {
	                    return res;
	                }
	            },
	            init : function () {
	                var self = this;
	                this.initConfig();
	                //console.log(this.mergeConfig)
	                this.$table = $(this.mergeConfig.tableId);
	                this.$operateBtn = $(this.mergeConfig.operateBtnId);
	                this.$operateSel = $(this.mergeConfig.operateSelId);
	                this.$operateModalId = $(this.mergeConfig.operateModalId);
	                this.$form = $(this.mergeConfig.formId);
	                this.selections = [];

	                setTimeout(function () {
	                    self.$table.bootstrapTable(self.mergeConfig);
	                    //$table.bootstrapTable('resetView');
	                }, 200);

	                this.bindEvent();
	            },
	            // 绑定事件
	            bindEvent : function () {
	                var self = this;

	                // checkbox选择事件
	                self.$table.on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', function () {
	                    self.$operateBtn.prop('disabled', (!self.$table.bootstrapTable('getSelections').length || self.$operateSel.val()=='') );
	                });

	                // 批量操作 - 选择操作类型
	                self.$operateSel.on('change', function () {
	                    self.$operateBtn.prop('disabled', (!self.$table.bootstrapTable('getSelections').length || self.$operateSel.val()=='') );
	                });

	                // 批量操作 - 打开弹出层
	                self.$operateBtn.on('click', function () {
	                    self.$operateModalId.modal('toggle');
	                });

	                // 批量操作 - 确认执行
	                self.$operateModalId.find('.sure').on('click', function () {
	                    var type = self.$operateSel.val(),
	                        url = self.$operateBtn.attr('url'),
	                        ids = self.getIdSelections();

	                    $.post(url,{
	                        type : type,
	                        ids : JSON.stringify(ids)
	                    }, function (data) {
	                        self.$table.bootstrapTable('remove', {
	                            field: self.mergeConfig.delField,
	                            values: ids
	                        });
	                        self.$operateBtn.prop('disabled', true);
	                        self.$operateModalId.modal('hide');
	                        self.$table.bootstrapTable('refresh');
	                    });
	                });

	                // table随窗口变化大小
	                $(window).resize(function () {
	                    self.$table.bootstrapTable('resetView', {
	                        height: self.getTableHeight()
	                    });
	                });

	                // form 搜索
	                self.$form.find('[type="submit"]').on('click', function (e) {
	                    self.formSearch();
	                    return false;
	                });

	            },
	            // config 初始化
	            initConfig : function () {
	                var self = this;
	                this.deffConfig.height = this.getTableHeight();
	                this.deffConfig.queryParams = function (params) {
	                    params.page = (params.offset/params.limit)+1;
	                    return $.extend(params,self.getFormData());
	                };
	                this.mergeConfig = $.extend(this.deffConfig, config);
	            },
	            // 获取table高度
	            getTableHeight : function () {
	                return $(window).height() - $('nav.navbar').outerHeight(true) - 20;
	            },
	            // 获取选中行的 用于删除记录的ID集合
	            getIdSelections : function () {
	                var self = this;
	                return $.map(self.$table.bootstrapTable('getSelections'), function (row) {
	                    return row[self.mergeConfig.delField]
	                });
	            },
	            // 表单查询
	            formSearch : function () {
	                var self = this;
	                self.$table.bootstrapTable('refresh', { query : self.getFormData() });
	            },
	            // 获取表单序列号数据
	            getFormData : function () {
	                var self = this;
	                return { querys : JSON.stringify(self.$form.serializeObject()) };
	            }
	        }

	        TableObj.init();

	        return TableObj;
	    }
	});

});