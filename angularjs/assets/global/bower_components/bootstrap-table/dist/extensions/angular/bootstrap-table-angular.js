// JavaScript source code
(function() {
    if (typeof angular === 'undefined') {
        return;
    }
    angular.module('bsTable', [])
    .directive('bsTableControl', [function() {
        var CONTAINER_SELECTOR = '.bootstrap-table';
        var SCROLLABLE_SELECTOR = '.fixed-table-body';
        var SEARCH_SELECTOR = '.search input';
        var test = '#ceshi';
        var bsTables = {};

        function getBsTable(el) {
            var result;
            $.each(bsTables, function(id, bsTable) {
                if (!bsTable.$el.closest(CONTAINER_SELECTOR).has(el).length) return;
                result = bsTable;
                return true;
            });
            return result;
        }

        $(window).resize(function() {
            $.each(bsTables, function(id, bsTable) {
                bsTable.$el.bootstrapTable('resetView');
            });
        });

        function onScroll() {
            var bsTable = this;
            var state = bsTable.$s.bsTableControl.state;
            bsTable.$s.$applyAsync(function() {
                state.scroll = bsTable.$el.bootstrapTable('getScrollPosition');
            });
        }
        $(document)
            .on('post-header.bs.table', CONTAINER_SELECTOR + ' table', function(evt) { // bootstrap-table calls .off('scroll') in initHeader so reattach here
                var bsTable = getBsTable(evt.target);
                if (!bsTable) return;
                bsTable.$el
                    .closest(CONTAINER_SELECTOR)
                    .find(SCROLLABLE_SELECTOR)
                    .on('scroll', onScroll.bind(bsTable));
            })
            .on('sort.bs.table', CONTAINER_SELECTOR + ' table', function(evt, sortName, sortOrder) {
                var bsTable = getBsTable(evt.target);
                if (!bsTable) return;
                var state = bsTable.$s.bsTableControl.state;
                bsTable.$s.$applyAsync(function() {
                    state.sortName = sortName;
                    state.sortOrder = sortOrder;
                });
            })
            .on('page-change.bs.table', CONTAINER_SELECTOR + ' table', function(evt, pageNumber, pageSize) {
                var bsTable = getBsTable(evt.target);
                if (!bsTable) return;
                var state = bsTable.$s.bsTableControl.state;

                bsTable.$s.$applyAsync(function() {
                    state.pageNumber = pageNumber;
                    state.pageSize = pageSize;
                    bsTable.$s.bsTableParams.search.params.pageIndex = pageNumber;
                    bsTable.$s.bsTableParams.search.params.pageSize = pageSize;
                    bsTable.$s.bsTableParams.search.callback(bsTable.$s.bsTableParams, null);
                });
            })
            .on('search.bs.table', CONTAINER_SELECTOR + ' table', function(evt, searchText) {
                var bsTable = getBsTable(evt.target);
                if (!bsTable) return;
                var state = bsTable.$s.bsTableControl.state;
                bsTable.$s.$applyAsync(function() {
                    state.searchText = searchText;
                });
            })
            .on('focus blur', CONTAINER_SELECTOR + ' ' + SEARCH_SELECTOR, function(evt) {
                var bsTable = getBsTable(evt.target);
                if (!bsTable) return;
                var state = bsTable.$s.bsTableControl.state;
                bsTable.$s.$applyAsync(function() {
                    state.searchHasFocus = $(evt.target).is(':focus');
                });
            })
            .on('click', '.aa', function(event) {
                event.preventDefault();
                alert(3333)
            })
            .on('click', CONTAINER_SELECTOR + ' .glyphicon-pencil', function(evt) {
                var This = this;
                var bsTable = getBsTable(evt.target);
                if (!bsTable) return;
                var selectRow = bsTable.$el.bootstrapTable('getRowByUniqueId', $(This).attr('data-rowid'));
                bsTable.$s.bsTableParams.edit.callback(bsTable.$s.bsTableParams, selectRow);
            })
            .on('click', CONTAINER_SELECTOR + ' .glyphicon-trash', function(evt) {
                var This = this;
                var bsTable = getBsTable(evt.target);
                if (!bsTable) return;
                var selectRow = bsTable.$el.bootstrapTable('getRowByUniqueId', $(This).attr('data-rowid'));
                bsTable.$s.bsTableParams.del.callback(bsTable.$s.bsTableParams, selectRow);
            })
            .on('click', CONTAINER_SELECTOR + ' .fa-lock', function(evt) {
                var This = this;
                var bsTable = getBsTable(evt.target);
                if (!bsTable) return;
                var selectRow = bsTable.$el.bootstrapTable('getRowByUniqueId', $(This).attr('data-rowid'));
                bsTable.$s.bsTableParams.lock.callback(bsTable.$s.bsTableParams, selectRow);
            })
             .on('click', CONTAINER_SELECTOR + ' .fa-unlock', function(evt) {
                var This = this;
                var bsTable = getBsTable(evt.target);
                if (!bsTable) return;
                var selectRow = bsTable.$el.bootstrapTable('getRowByUniqueId', $(This).attr('data-rowid'));
                bsTable.$s.bsTableParams.unlock.callback(bsTable.$s.bsTableParams, selectRow);
            })
            .on('click', CONTAINER_SELECTOR + ' .fa-copy', function(evt) {
                var This = this;
                var bsTable = getBsTable(evt.target);
                if (!bsTable) return;
                var selectRow = bsTable.$el.bootstrapTable('getRowByUniqueId', $(This).attr('data-rowid'));
                bsTable.$s.bsTableParams.copy.callback(bsTable.$s.bsTableParams, selectRow);
            })
            .on('click', CONTAINER_SELECTOR + ' .fa-reply', function(evt) {
                var This = this;
                var bsTable = getBsTable(evt.target);
                if (!bsTable) return;
                var selectRow = bsTable.$el.bootstrapTable('getRowByUniqueId', $(This).attr('data-rowid'));
                bsTable.$s.bsTableParams.revert.callback(bsTable.$s.bsTableParams, selectRow);
            })
            .on('click', CONTAINER_SELECTOR + ' .glyphicon-eye-open', function(evt) {
                var This = this;
                var bsTable = getBsTable(evt.target);
                if (!bsTable) return;
                var selectRow = bsTable.$el.bootstrapTable('getRowByUniqueId', $(This).attr('data-rowid'));
                bsTable.$s.bsTableParams.see.callback(bsTable.$s.bsTableParams, selectRow);
            })
            .on('click', CONTAINER_SELECTOR + ' .fa-picture-o', function(evt) {
                var This = this;
                var bsTable = getBsTable(evt.target);
                if (!bsTable) return;
                var selectRow = bsTable.$el.bootstrapTable('getRowByUniqueId', $(This).attr('data-rowid'));
                bsTable.$s.bsTableParams.picture.callback(bsTable.$s.bsTableParams, selectRow);
            })
            .on('click', CONTAINER_SELECTOR + ' .glyphicon-edit', function(evt) {
                var This = this;
                var bsTable = getBsTable(evt.target);
                if (!bsTable) return;
                var selectRow = bsTable.$el.bootstrapTable('getRowByUniqueId', $(This).attr('data-rowid'));
                bsTable.$s.bsTableParams.fileE.callback(bsTable.$s.bsTableParams, selectRow);
            })
            .on('click', CONTAINER_SELECTOR + ' .mdi-action-open-in-browser', function(evt) {
                var This = this;
                var bsTable = getBsTable(evt.target);
                if (!bsTable) return;
                var selectRow = bsTable.$el.bootstrapTable('getRowByUniqueId', $(This).attr('data-rowid'));
                bsTable.$s.bsTableParams.update.callback(bsTable.$s.bsTableParams, selectRow);
            })
            .on('click', CONTAINER_SELECTOR + ' .icon-accountType', function(evt) {
                var This = this;
                var bsTable = getBsTable(evt.target);
                if (!bsTable) return;
                var selectRow = bsTable.$el.bootstrapTable('getRowByUniqueId', $(This).attr('data-rowid'));
                bsTable.$s.bsTableParams.Payment.callback(bsTable.$s.bsTableParams, selectRow);
            })
            .on('click', CONTAINER_SELECTOR + ' .glyphicon-color', function(evt) {
                var This = this;
                var bsTable = getBsTable(evt.target);
                if (!bsTable) return;
                var selectRow = bsTable.$el.bootstrapTable('getRowByUniqueId', $(This).attr('data-rowid'));
                bsTable.$s.bsTableParams.color.callback(bsTable.$s.bsTableParams, selectRow);
            })
            .on('click', CONTAINER_SELECTOR + ' .glyphicon-stats', function(evt) {
                var This = this;
                var bsTable = getBsTable(evt.target);
                if (!bsTable) return;
                var selectRow = bsTable.$el.bootstrapTable('getRowByUniqueId', $(This).attr('data-rowid'));
                bsTable.$s.bsTableParams.result.callback(bsTable.$s.bsTableParams, selectRow);
            })
            .on('click', CONTAINER_SELECTOR + ' .mark-remove', function(evt) {
                var This = this;
                var bsTable = getBsTable(evt.target);
                if (!bsTable) return;
                var selectRow = bsTable.$el.bootstrapTable('getRowByUniqueId', $(This).attr('data-rowid'));
                bsTable.$s.bsTableParams.markRemove.callback(bsTable.$s.bsTableParams, selectRow, $(This).attr('data-index'));
            })
            .on('click', CONTAINER_SELECTOR + ' .glyphicon-time', function(evt) {
                var This = this;
                var bsTable = getBsTable(evt.target);
                if (!bsTable) return;
                var selectRow = bsTable.$el.bootstrapTable('getRowByUniqueId', $(This).attr('data-rowid'));
                bsTable.$s.bsTableParams.time.callback(bsTable.$s.bsTableParams, selectRow);
            })
            .on('click', CONTAINER_SELECTOR + ' .glyphicon-reportnum', function(evt) {
                var This = this;
                var bsTable = getBsTable(evt.target);
                if (!bsTable) return;
                var selectRow = bsTable.$el.bootstrapTable('getRowByUniqueId', $(This).attr('data-rowid'));
                bsTable.$s.bsTableParams.number.callback(bsTable.$s.bsTableParams, selectRow);
            });

            // .on('click', '.bsTableReload', function(event) {
            //     event.preventDefault();
            //     bsTable.$s.bsTableParams.search.callback(bsTable.$s.bsTableParams, null);
            // })
            // .on('click', '.bsTableReset', function(event) {
            //     event.preventDefault();
            //     var state = bsTable.$s.bsTableControl.state;
            //     bsTable.$s.$applyAsync(function() {
            //         state.pageNumber = 1;
            //         state.pageSize = 10;
            //         bsTable.$s.bsTableParams.search.params.pageIndex = 1;
            //         bsTable.$s.bsTableParams.search.params.pageSize = 10;
            //         bsTable.$s.bsTableParams.search.callback(bsTable.$s.bsTableParams, null);
            //     });
            // });

        return {
            restrict: 'EA',
            scope: {
                bsTableControl: '=',
                bsTableParams: '='
            },
            link: function($s, $el, attr) {
                var bsTable = bsTables[$s.$id] = {
                    $s: $s,
                    $el: $el,
                    attr: attr
                };
                
                $s.bsTableParams.bsTableId = $s.$id;
                $s.bsTableParams.search.callback($s.bsTableParams, null);
                $s.instantiated = false;
                $s.$watch('bsTableControl.options', function(options) {
                    
                    if (!options) options = $s.bsTableControl.options = {};
                    var state = $s.bsTableControl.state || {};
                    if ($s.instantiated) $el.bootstrapTable('destroy');
                    $el.bootstrapTable(angular.extend(angular.copy(options), state));
                    $el.bootstrapTable('load', $s.bsTableControl.options.data);
                    $s.instantiated = true;

                    // Update the UI for state that isn't settable via options
                    if ('scroll' in state) $el.bootstrapTable('scrollTo', state.scroll);
                    if ('searchHasFocus' in state) $el.closest(CONTAINER_SELECTOR).find(SEARCH_SELECTOR).focus(); // $el gets detached so have to recompute whole chain
                }, true);
                $s.$watch('bsTableControl.state', function(state) {

                    if (!state) state = $s.bsTableControl.state = {};
                    $el.trigger('directive-updated.bs.table', [state]);
                }, true);
                $s.$on('$destroy', function() {
                    delete bsTables[$s.$id];
                });
            }
        };
    }])
    
})();
