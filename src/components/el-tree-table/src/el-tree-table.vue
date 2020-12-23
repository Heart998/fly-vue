<template>
    <div>
        <el-row>
          <el-col :span="24">
              <div class="tagSelect" @click="inputFocus">
                    <input v-if="!mySelected || mySelected.length == 0" type="text" readonly="readonly" autocomplete="off" :placeholder="placeholder" style="border: 0px;" class="el-input__inner">
                    <div v-else-if="mySelected" class="tagWrap">
                        <el-tag
                            v-for="item in mySelected"
                            :key="'val_' + item[valueId]"
                            closable
                            :disable-transitions="false"
                            @close="handleClearValue(item)">
                            {{item[labelId]}}
                        </el-tag>
                    </div>
              </div>
          </el-col>
        </el-row>
        <el-dialog
            :visible.sync="visibleTreeTable"
            :modal="false"
            width="80%"
            height="500px"
            :title="placeholder"
            :close-on-click-modal="false"
            :close-on-press-escape="false">
            <el-row :gutter="10">
                <el-col :span="6">
                    <el-card shadow="never" body-style="height:520px;">
                        <el-tree
                            style="height:440px;overflow:auto;"
                            :data="treeData"
                            :props="defaultProps"
                            :expand-on-click-node="false"
                            :filter-node-method="filterNode"
                            ref="tree"
                            default-expand-all
                            @node-click="handleSelect"
                        />
                    </el-card>
                </el-col>
                <el-col :span="14">
                    <el-card shadow="never" body-style="height:520px;">
                        <el-row>
                            <el-col :span="24">
                                <slot name="search"></slot>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-table
                                    ref="multipleTable"
                                    v-loading="dataListLoading"
                                    :data="tableData"
                                    height="400"
                                    border
                                    @current-change="handleCurrentChange"
                                    @selection-change="handleSelectionChange"
                                    @row-click="handleRowClick"
                                    style="width: 100%;" size="mini">
                                    <el-table-column
                                        v-if="multiple"
                                        type="selection"
                                        width="55">
                                    </el-table-column>
                                    <el-table-column :label="col.label" :prop="col.prop" :key="col.label" v-for="col in columns">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row[col.prop] }}</span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <el-pagination
                                    @size-change="sizeChangeHandle"
                                    @current-change="currentChangeHandle"
                                    :current-page="pageIndex"
                                    :page-sizes="[5, 10, 20]"
                                    :page-size="pageSize"
                                    :total="totalPage"
                                    layout="total, sizes, prev, pager, next, jumper">
                                </el-pagination>
                            </el-col>
                        </el-row>
                    </el-card>
                </el-col>
                <el-col :span="4">
                    <el-card shadow="never" body-style="height:520px;">
                    <el-row>
                      <el-col :span="24">
                          当前已选
                          
                          <template v-if="innerDynamicTags && innerDynamicTags.length > 0">
                              {{innerDynamicTags.length}}
                          </template>
                          <template v-else>
                              0
                          </template>
                          项：

                      </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <template >
                                <el-tag
                                    class="selected-tag"
                                    :key="'tag_' + tag[valueId]"
                                    v-for="tag in innerDynamicTags"
                                    closable
                                    :disable-transitions="false"
                                    @close="handleClose(tag)">
                                    {{tag[labelId]}}
                                </el-tag>
                            </template>
                        </el-col>
                    </el-row>
                    </el-card>
                </el-col>
            </el-row>
            <template slot="footer">
                <el-button type="default" @click="handleCancel()" size="mini">取消</el-button>
                <el-button type="primary" @click="handleCommit()" size="mini">确定</el-button>
            </template>
        </el-dialog>  
    </div>
</template>
<script>
export default {
    name: "el-tree-table",
    props: {
        selected: {
            type: [String, Number, Object, Array]
        },
        treeData: {
            type: Array
        },
        tableData: {
            type: Array
        },
        multiple: {
            type: Boolean,
            default: false
        },
        columns: {
            type: Array
        },
        valueId: {
            type: String,
            default: 'id'
        },
        labelId: {
            type: String,
            default: 'name'
        },
        placeholder: {
            type: String
        }
    },
    model: {
        prop: 'selected',
        event: 'change'
    },
    computed: {
        innerDynamicTags() {
            return this.mySelected
        }
    },
    watch: {
        selected(newValue) {
            if (newValue) {
                if (Object.prototype.toString.call(newValue) === '[object Object]') {
                    this.mySelected = [newValue]
                }
                else if (Object.prototype.toString.call(newValue) === '[object Array]') {
                    this.mySelected = newValue
                }
            }
        }
    },
    data() {
        return {
            mySelected: this.selected,
            defaultProps: {
                children: "children",
                label: "name"
            },
            label: '',
            visibleTreeTable: false,
            treeValue: null,
            normalizer(node) {
                if (node.children && node.children.length > 0) {
                    return {
                    id: node.id,
                    label: node.name,
                    children: node.children
                    }
                }
                else {
                    return {
                    id: node.id,
                    label: node.name,
                    children: undefined,
                    }
                }
            },
            pageIndex: 1,
            pageSize: 5,
            totalPage: 0,
            dataListLoading: false
        }
    },
    methods: {
        // 筛选节点
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        inputFocus() {
            this.visibleTreeTable = true
            this.$emit('input-focus')
        },
        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val;
            this.pageIndex = 1;
            this.$emit('size-change', {
                pageSize: this.pageSize,
                pageIndex: this.pageIndex
            })
        },
        // 当前页
        currentChangeHandle(val) {
            this.pageIndex = val;
            this.$emit('current-change', {
                pageSize: this.pageSize,
                pageIndex: this.pageIndex
            })
        },
        handleRowClick(val) {
            this.$emit('row-click', val)
        },
        handleCurrentChange(val) {
            if (this.multiple || !val) {
                return
            }
     
            this.$emit('table-current-change', [val])
            if (val) {
                this.mySelected = []
                this.mySelected.push(val);
            }
        },
        handleSelectionChange(val) {
            let _self = this
            _self.$emit('table-selection-change', val)
            
            val.forEach(element => {
                let ele = _self.mySelected.find(item => item.userId === element.userId)
                if (!ele) {
                    _self.mySelected.push(element)
                }
            });
        },
        handleSelect(val) {
            this.treeValue = val.id
            this.$emit('tree-select', val)
        },
        handleDeselect(val) {
            this.$emit('tree-deselect', val) 
        },
        handleClearValue(item) {
            this.mySelected.splice(this.mySelected.indexOf(item), 1)
        },
        handleClose(tag) {
            if (this.tableData.indexOf(tag) >= 0) {
                this.$refs.multipleTable.toggleRowSelection(tag, false)
            }
            this.mySelected.splice(this.mySelected.indexOf(tag), 1);
        },
        handleCancel() {
            this.visibleTreeTable = false
        },
        handleCommit() {
            this.$emit('change', this.mySelected)
            this.visibleTreeTable = false
        }
    }
}
</script>
<style scoped>
.tagSelect {
    width: 100%;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -ms-flex-align: start;
    align-items: start;
    min-height: 32px;
    border: 1px solid #dee0e3;
    border-radius: 4px;
    font-size: 14px;
    line-height: 20px;
    color: #1f2329;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.tagWrap {
    padding-top: 4px;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-positive: 1;
    flex-grow: 1;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
}
.selected-tag {
    margin-left: 5px;
    margin-bottom: 5px;
}
</style>
