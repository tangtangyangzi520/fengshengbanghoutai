<template>
    <div style="padding-left: 15px;border-top: 1px solid #e7ecf1;">
        <div class="select-page">
            每页
            <select class="form-control" v-model="pageSize">
                <option value="10">10</option>
                <option value="30">30</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>条，共 {{totalSize}} 条数据，共 {{totalPageNum}} 页　　跳转
            <input class="form-control" style="width:50px;" placeholder="" v-model="pageNum" />
            <button class="btn green-meadow" type="button" @click="goPage">GO</button>
        </div>
        <ul class="pagination" style="margin-top:10px;" v-show="totalSize>0">
            <li :class="{disabled:currentPage==1}">
                <a @click="selectPreviousPage()">上一页</a>
            </li>
            <template v-if="totalPageNum<=maxPage">
                <li v-for="item in totalPageNum" :class="{active:item+1==currentPage}">
                    <a @click="selectPage(item+1)">{{item+1}}</a>
                </li>
            </template>
            <template v-else>
                <template v-if="currentPage>3&&currentPage<totalPageNum-1">
                    <li v-for="item in maxPage" :class="{active:item+(currentPage-3)+1==currentPage}">
                        <a @click="selectPage(item+(currentPage-3)+1)">{{item+(currentPage-3)+1}}</a>
                    </li>
                </template>
                <template v-else>
                    <template v-if="currentPage<4">
                        <li v-for="item in maxPage" :class="{active:item+1==currentPage}">
                            <a @click="selectPage(item+1)">{{item+1}}</a>
                        </li>
                    </template>
                    <template v-if="currentPage>totalPageNum-3">
                        <li v-for="item in maxPage" :class="{active:item+(totalPageNum-5)+1==currentPage}">
                            <a @click="selectPage(item+(totalPageNum-5)+1)">{{item+(totalPageNum-5)+1}}</a>
                        </li>
                    </template>
                </template>
            </template>
            <li :class="{disabled:currentPage==totalPageNum}">
                <a @click="selectNextPage()">下一页</a>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props: {
        currentPage: {
            type: Number,
            value: 1
        },
        pageSize: {
            type: Number,
            value: 10
        },
        startIndex: {
            type: Number,
            value: 0
        },
        totalPage: {
            type: Number,
            value: 0
        },
        totalSize: {
            type: Number,
            value: 0
        },
        change: {
            type: Function,
            default: () => { }
        }
    },
    data() {
        return {
            maxPage: 5,
            curPage: 1,
            pageSizeNum: 10,
            pageNum: 1,
            totalPageNum: 1
        }
    },
    methods: {
        selectPreviousPage() {
            if (this.currentPage == 1) {
                return;
            }
            let options = {
                currentPage: this.currentPage - 1,
                pageSize: this.pageSize
            }
            this.change(options);
        },
        selectNextPage() {
            if (this.currentPage >= this.totalPage) {
                return;
            }
            let options = {
                currentPage: this.currentPage + 1,
                pageSize: this.pageSize
            }
            this.pageNum = this.currentPage+1;
            this.change(options);
        },
        // 点击页数跳转
        selectPage(page) {
            let options = {
                currentPage: page,
                pageSize: this.pageSize
            }
            this.change(options);
        },
        // 输入页数跳转
        goPage() {
            if( parseInt(this.pageNum) < 1 ){
                this.pageNum = 1
            }
            let options = {
                currentPage: parseInt(this.pageNum),
                pageSize: this.pageSize
            }
            this.change(options);
        }
    },
    watch: {
        totalPage() {
            this.totalPageNum = this.totalPage;
        },
        pageNum() {
            if (!/^[0-9]*$/g.test(this.pageNum)) {
                this.pageNum = 1;
            }
            if (this.pageNum > this.totalPage) {
                this.pageNum = this.totalPage;
            }
        },
        pageSize(val) {
            let options = {
                currentPage: 1,
                pageSize: this.pageSize
            }
            this.change(options);
        }
    }
};
</script>
<style lang="less" scope>
.pagination {
    margin: 0;
}

.select-page {
    float: left;
    margin-right: 25px;
    margin-top: 10px;
    select.form-control,
    input.form-control {
        width: 54px;
        padding-left: 0;
        padding-right: 0;
        display: inline-block;
        margin: 0 5px;
        text-align: center;
    }
    button.btn {
        margin-top: -3px;
    }
}
</style>