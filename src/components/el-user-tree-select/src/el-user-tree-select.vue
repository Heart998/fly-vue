<template>
    <div>
        <el-tree-table
            ref="treeTable"
            :style="domStyle"
            :multiple="multiple"
            v-model="myValue"
            :placeholder="placeholder"
            :tree-data="deptList"
            :table-data="userList"
            :columns="columns"
            :value-id="valueId"
            :label-id="labelId"
            @input-focus="initData"
            @tree-select="handleTreeNodeSelect"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            @change="handleValueChange">
            <template v-slot:search>
                <el-row>
                    <el-col :span="12">
                        <div style="display: inline-flex; margin-bottom: 10px;">
                            <el-input v-model="dataForm.realName" size="mini" placeholder="用户名/姓名" clearable></el-input>
                            <el-button @click="getDataList()" size="mini" style="margin-left:10px;">查询</el-button>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div style="float:right;">
                            {{selectedDept.name}}
                        </div>
                    </el-col>
                </el-row>
            </template>
        </el-tree-table>
    </div>
    
</template>
<script>
import ElTreeTable from '@/components/el-tree-table'
export default {
    name: 'el-user-tree-select',
    components: {
      ElTreeTable
    },
    props: {
        multiple: {
            type: Boolean
        },
        treeData: {
            type: Array
        },
        placeholder: {
            type: String,
            default: '员工姓名'
        },
        selected: {
            type: [String, Number, Object, Array]
        },
        domStyle: {
            type: [String],
            default: 'width: 400px;'
        }
    },
    model: {
        prop: 'selected',
        event: 'change'
    },
    computed: {
        
    },
    watch: {
        selected(newValue) {
            if (newValue) {
                if (Object.prototype.toString.call(newValue) === '[object String]' || Object.prototype.toString.call(newValue) === '[object Number]') {
                    this.getUserInfo(newValue)
                }
                else if (Object.prototype.toString.call(newValue) === '[object Object]') {
                    this.myValue = [newValue]
                }
                else if (Object.prototype.toString.call(newValue) === '[object Array]') {
                    this.myValue = newValue
                }
            }
        }
    },

    data() {
        return {
            valueId: 'userId',
            labelId: 'realName',
            myValue: this.selected,
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            dataForm: {
                userName: '',
                realName: ''
            },
            deptList: [],
            selectedDept: '',
            userList: [],
            columns: [
                {
                    label: '用户名',
                    prop: 'username'
                },
                {
                    label: '姓名',
                    prop: 'realName'
                },
                {
                    label: '手机号',
                    prop: 'mobile'
                }
            ]
        }
    },
    methods: {
        // 初始化数据
        initData() {
            this.getDeptList()
            this.getDataList()
        },
        // 获取部门列表
        getDeptList () {
            return this.$http({
            url: this.$http.adornUrl("/sys/dept/list"),
            method: "get",
            params: this.$http.adornParams()
            }).then(({ data: res }) => {
                if (res.code !== 0) {
                    return this.$message.error(res.msg)
                }
                this.deptList = res.data
            }).catch(() => {})
        },
        handleSizeChange(val) {
            this.pageSize = val.pageSize
            this.pageIndex = val.pageIndex
            this.getDataList()
        },
        handleCurrentChange(val) {
            this.pageSize = val.pageSize
            this.pageIndex = val.pageIndex
            this.getDataList()
        },
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true;
            let _self = this
            this.$http({
                url: _self.$http.adornUrl("/sys/user/list"),
                method: "get",
                params: this.$http.adornParams({
                    page: this.pageIndex,
                    limit: this.pageSize,
                    username: this.dataForm.realName
                })
            }).then(({ data }) => {
                if (data && data.code === 0) {
                    this.userList = data.page.list;
                    this.totalPage = data.page.totalCount;
                } else {
                    this.userList = [];
                    this.totalPage = 0;
                }
                this.dataListLoading = false;
                
                this._fixRowSelection()
            });
        },
        getUserInfo(userId) {
            this.$http({
                url: this.$http.adornUrl(`/sys/user/info/${userId}`),
                method: 'get',
                params: this.$http.adornParams()
            }).then(({data}) => {
                if (data && data.code === 0) {
                    this.myValue = data.user
                }
            })
        },
        // 获取数据列表
        handleTreeNodeSelect (val) {
            if (val) {
                this.selectedDept = val
            }
            this.$http({
                url: this.$http.adornUrl('/sys/user/list?deptId=' + val.id),
                method: 'get',
                params: this.$http.adornParams({
                    'page': this.pageIndex,
                    'limit': this.pageSize,
                    'realName': this.dataForm.realName
                })
                }).then(({data}) => {
                if (data && data.code === 0) {
                    this.userList = data.page.list
                    this.totalPage = data.page.totalCount
                } else {
                    this.userList = []
                    this.totalPage = 0
                }
                this._fixRowSelection()
            })
        },
        _fixRowSelection() {
            let _self = this
            _self.$nextTick(() => {
                if (_self.selected) {
                    if (typeof _self.selected === 'object' && _self.selected.length > 0) {
                        _self.$refs.treeTable.$refs.multipleTable.clearSelection()
                        _self.selected.forEach(row => {
                            let user = _self.userList.find(item => item[_self.valueId] === row[_self.valueId]) 
                            if (user) {
                                _self.$refs.treeTable.$refs.multipleTable.toggleRowSelection(user, true)
                            }
                        })
                    }
                    else if (typeof _self.selected === 'string' || typeof _self.selected === 'number') {
                        _self.$refs.treeTable.$refs.multipleTable.clearSelection()
                        _self.getUserInfo(_self.selected)
                    }
                }
            })
        },
        handleValueChange(val) {
            this.myValue = val
            this.$emit('change', this.myValue)
        }
    },
}
</script>