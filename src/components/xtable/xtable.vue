<template>
  <div class="container is-vertical xtable">
    <!-- 表格标题 -->
    <template v-if="title.show">
      <div class="table-header">
        <h4 class="table-title" :class="[title.align ? 'is-' + title.align : null]">{{title.label}}</h4>
        <template v-if="title.list && title.list.length">
          <div class="table-title-slot">
            <template v-for="(item, t) in title.list">
              <template v-if="item.render">
                <titleDom :render="item.render" :method="item.method" :key="t"></titleDom>
              </template>
              <template v-else>
                <template v-if="!item.show">

                </template>
                <template v-else>
                  <template v-if="item.type">

                    <template v-if="!item.disabled">
                      <el-button :type="item.type" :size="item.size || 'medium'" :icon="item.icon" :key="t" @click.native.prevent="item.method">
                        <template v-if="item.svg">
                          <svg-icon :icon-class="item.svg"></svg-icon>
                        </template>
                        {{item.label}}
                      </el-button>
                    </template>
                    <template v-else>
                      <el-button :type="item.type" :size="item.size || 'medium'" :icon="item.icon" :key="t" disabled>
                        <template v-if="item.svg">
                          <svg-icon :icon-class="item.svg"></svg-icon>
                        </template>
                        {{item.label}}
                      </el-button>
                    </template>

                  </template>
                  <template v-else>
                    <template v-if="!item.disabled">
                      <el-button :size="item.size || 'medium'" :icon="item.icon" :key="t" @click.native.prevent="item.method">
                        <template v-if="item.svg">
                          <svg-icon :icon-class="item.svg"></svg-icon>
                        </template>
                        {{item.label}}
                      </el-button>
                    </template>
                    <template v-else>
                      <el-button :size="item.size || 'medium'" :icon="item.icon" :key="t" disabled>
                        <template v-if="item.svg">
                          <svg-icon :icon-class="item.svg"></svg-icon>
                        </template>
                        {{item.label}}
                      </el-button>
                    </template>
                  </template>
                </template>

              </template>
            </template>
          </div>
        </template>
      </div>
    </template>
    <!-- 表格标题 end -->
    <!-- 表格数据 -->
    <template v-if="show">
      <div class="flex-scroll flex-column">
        <el-table :data="list" :show-overflow-tooltip="overflowTool" ref="dataTable" style="width: 100%" highlight-current-row border header-cell-class-name="default-bg"
          @selection-change="handleSelectionChange" @cell-click="handleCellClick" @row-click="handleRowClick">
          <!-- :height="height" -->
          <template v-if="isMultiple">
            <el-table-column v-if="isMultiple" :resizable="false" type="selection" width="45" align="center"></el-table-column>
          </template>
          <template v-else-if="radio">
            <el-table-column label="" width="45" align="center" :resizable="false">
              <template v-slot="scope">
                <el-radio v-model="radioVal" style="color:#fff!important" :label="scope.row[radio]" @change.native="radioCurrentChange($event,scope.row)">
                </el-radio>
              </template>
            </el-table-column>
          </template>
          <el-table-column v-if="typeIndex" type="index" width="45" align="center" :resizable="false"></el-table-column>
          <el-table-column :resizable="false" v-for="(col, c) in tableHeader" :prop="col.slot? null : col.name || col.label" :key="c" :label="col.label" :min-width="col.width"
            :align="col.align || align" :type="col.type" :sortable="col.sortable">
            <template v-if="col.children">
              <el-table-column v-for="(ch,o) in col.children" :key="o" :label="ch.label" :prop="ch.name || ch.label" :min-width="col.width" align="center"></el-table-column>
            </template>
            <template v-slot="scope">
              <template v-if="col.render">
                <expand-dom :column="col" :row="scope.row" :render="col.render"></expand-dom>
              </template>
              <template v-else-if="col.formatter && col.method">
                <el-button :type="col.type || 'text'" :size="col.size || 'medium'" @click.native.prevent="col.method(scope.row)" v-html="col.formatter(scope.row, col)"></el-button>
              </template>
              <template v-else>
                <template v-if="col.formatter">
                  <span v-html="col.formatter(scope.row, col)"></span>
                </template>
                <template v-else-if="col.method">
                  <el-button :type="col.type || 'text'" :size="col.size || 'medium'" @click.native.prevent="col.method(scope.row)">{{scope.row[col.name]}}</el-button>
                </template>
                <template v-else>
                  <span>{{scope.row[col.name]}}</span>
                </template>
              </template>

            </template>
          </el-table-column>
          <!-- 按钮操作组 -->
          <el-table-column :resizable="false" v-if="operates.show && operates.list.length" label="操作" align="center" :fixed="operates.fixed" :width="operates.width">
            <template v-slot="scope">
              <div>
                <template v-for="(btn, key) in operates.list">
                  <template v-if="btn.filter">
                    <el-button :type="btn.type" :class="btn.class" :size="btn.type || 'medium'" :icon="btn.icon" :disabled="btn.disabled" :plain="btn.plain"
                      @click.native.prevent="btn.method(key, scope.row)" :key="key" v-if="btn.filter(scope.row)">
                      <template v-if="btn.svg">
                        <svg-icon :icon-class="btn.svg"></svg-icon>
                      </template>
                      {{ btn.label }}
                    </el-button>
                  </template>
                  <template v-else>
                    <el-button :type="btn.type" :class="btn.class" :size="btn.type || 'medium'" :icon="btn.icon" :disabled="btn.disabled" :plain="btn.plain"
                      @click.native.prevent="btn.method(key, scope.row)" :key="key">
                      <template v-if="btn.svg">
                        <svg-icon :icon-class="btn.svg"></svg-icon>
                      </template>
                      {{ btn.label }}
                    </el-button>
                  </template>
                </template>
                <template v-if="isDropDown.show && isDropDown.list.length > 0 && isDropDown.filter(scope.row)">
                  <el-dropdown>
                    <span class="el-dropdown-link">
                      更多<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <template v-for="(btn, key) in isDropDown.list">
                        <template v-if="btn.filter">
                          <el-dropdown-item v-if="btn.filter(scope.row)" :disabled="btn.disabled" :key="key" :class="btn.class" @click.native.prevent="btn.method(key, scope.row)">{{ btn.label }}
                          </el-dropdown-item>
                        </template>
                        <template v-else>
                          <el-dropdown-item :disabled="btn.disabled" :key="key" :class="btn.class" @click.native.prevent="btn.method(key, scope.row)">{{ btn.label }}</el-dropdown-item>
                        </template>
                      </template>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>

              </div>

            </template>

          </el-table-column>
          <!-- 按钮操作组 end-->
        </el-table>
      </div>
    </template>
    <!-- 表格数据 end-->
    <!-- 分页 -->
    <template v-if="total">
      <el-pagination @size-change="handleSizeChange" :total="total" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 40]" :page-size="listQuery.pageSize"
        layout="sizes, prev, pager, next, ->, jumper, slot, total" @current-change="handleCurrentChange" class="pagination">
        <slot>
          <span class="pagination__count">{{pageCount}}</span>
        </slot>
      </el-pagination>
    </template>
    <!-- 分页 end -->
  </div>
</template>

<script>
export default {
  props: {
    height: {
      type: String,
      default: '100%'
    },
    row: {},
    // 默认开启文字溢出隐藏显示tooltip
    overflowTool: {
      type: Boolean,
      default: true
    },
    show: {
      type: Boolean,
      default: true
    },
    list: {
      type: Array,
      default () {
        return []
      }
    }, // 表格数据
    align: {
      type: String,
      default: 'center'
    }, // 对齐方式
    isMultiple: {
      type: Boolean,
      default: false
    }, // 是否多选
    typeIndex: {},
    radio: {}, // 单选唯一标示符
    tableHeader: {
      type: Array,
      default () {
        return []
      }
    }, // 表头
    listQuery: {
      type: Object,
      default () {
        return {
          page: 1,
          pageSize: 10
        }
      }
    }, // 分页参数
    total: {
      type: Number
    }, // 总数
    operates: {
      type: Object,
      default () {
        return {
          show: false,
          width: 150,
          fixed: false,
          list: []
        }
      }
    },
    // 是否开启更多
    isDropDown: {
      type: Object,
      default () {
        return {
          show: false,
          filter: function () {},
          list: []
        }
      }
    },
    // 列操作按钮
    title: {
      type: Object,
      default () {
        return {
          show: true,
          align: 'left',
          label: '',
          list: []
        }
      }
    } // 表格标题
  },
  data () {
    return {
      radioVal: null
    }
  },
  created () {},
  components: {
    expandDom: {
      functional: true,
      props: {
        row: Object,
        render: Function,
        index: Number,
        column: {
          type: Object,
          default: null
        }
      },
      render: (h, ctx) => {
        const params = {
          row: ctx.props.row,
          index: ctx.props.index
        }
        if (ctx.props.column) params.column = ctx.props.column
        return ctx.props.render(h, params)
      }
    },
    titleDom: {
      functional: true,
      props: {
        render: Function,
        method: Function
      },
      render: (h, ctx) => {
        return ctx.props.render(h, ctx.props)
      }
    }
  },
  computed: {
    pageCount () {
      let count = Math.ceil(this.total / this.listQuery.pageSize)
      return `共${count}页、`
    }
  },
  methods: {
    toggleSelection (rows) {
      rows.forEach((row) => {
        setTimeout(() => {
          this.$refs.dataTable.toggleRowSelection(row)
        }, 1000)
      })
    },
    // 单行选中
    radioCurrentChange (e, val) {
      if (val) {
        this.radioVal = val[this.radio]
      } else {
        this.radioVal = null
      }
      this.$emit('radioCurrentChange', val)
    },
    // 切换页码
    handleCurrentChange (index) {
      this.listQuery.page = index
      this.$emit('handleCurrentChange', index)
    },
    handleSizeChange (size) {
      this.listQuery.pageSize = size
      this.$emit('handleSizeChange', size)
    },
    // 多行选中
    handleSelectionChange (val) {
      this.$emit('handleSelectionChange', val)
    },
    // 点击选择某个单元格
    handleCellClick (row, column, cell, event) {
      // console.log(row, column, cell, event)
      this.$emit('handlecellClick', row, column)
    },
    // 点击选择某行
    handleRowClick (row, column, cell, event) {
      this.$emit('handleRowClick', row, column)
    }
  }
}
</script>

<style>
.table-title {
  color: #363636;
  font-weight: normal !important;
}
.xtable .el-dropdown {
  cursor: pointer;
}
body .el-table th.gutter {
  display: table-cell !important;
}
.table-header {
  margin: 0 0 10px;
}
</style>