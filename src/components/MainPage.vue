<template>
    <div id="app">
        <el-container>
            <el-header>
                <h2>茅台酒区块链溯源系统</h2>
            </el-header>
            <el-main>
                <el-row>
                    <el-col :span="18">
                        <h4>查询茅台酒信息</h4>
                        <el-col :span="8">
                            <el-select v-model="searchType" placeholder="选择搜索类型">
                                <el-option label="茅台酒批次号" value="batchNo"></el-option>
                                <el-option label="茅台酒ID" value="id"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="12">
                        <el-input v-model="searchInput" placeholder="请输入搜索内容" prefix-icon="el-icon-search"
                                @keyup.enter.native="searchBlock"></el-input>
                        </el-col>
                        <el-col :span="4">
                            <el-button type="primary" @click="searchBlock">查询</el-button>
                        </el-col>
                        <el-dialog title="查询结果" :visible.sync="searchResultsDialogVisible" width="80%" @close="resetSearch">
                            <el-table :data="searchResults" stripe border v-if="searchResults.length > 0">
                                <el-table-column prop="index" label="索引" width="50"></el-table-column>
                                <el-table-column prop="timestamp" label="时间戳" width="125"></el-table-column>
                                <el-table-column prop="data.id" label="茅台酒ID" width="90"></el-table-column>
                                <el-table-column prop="data.batchNo" label="批次号" width="64"></el-table-column>
                                <el-table-column prop="data.productionDate" label="生产日期" width="95"></el-table-column>
                                <el-table-column prop="data.factory" label="生产工厂"  width="115"></el-table-column>
                                <el-table-column prop="data.location" label="生产地点" width="100"></el-table-column>
                                <el-table-column prop="data.producer" label="生产者" width="80"></el-table-column>
                                <el-table-column prop="hash" label="哈希"></el-table-column>
                            </el-table>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="searchResultsDialogVisible = false">关闭</el-button>
                            </span>
                        </el-dialog>
                    </el-col>
                    <el-col :span="1">
                    </el-col>
                    <el-col :span="5">
                        <h4>添加区块</h4>
                        <el-button type="primary" @click="openAddBlockDialog">
                            添加新区块
                        </el-button>
                        <el-dialog title="添加新区块" :visible.sync="addBlockDialogVisible" width="50%" @close="resetForm">
                            <el-form ref="addBlockForm" :model="newBlockData" label-width="120px">
                                <el-form-item label="批次号">
                                    <el-input v-model="newBlockData.batchNo"></el-input>
                                </el-form-item>
                                <el-form-item label="生产日期">
                                    <el-date-picker v-model="newBlockData.productionDate" type="date" placeholder="选择日期"
                                        format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"></el-date-picker>
                                </el-form-item>
                                <el-form-item label="茅台酒ID">
                                    <el-input v-model="newBlockData.id"></el-input>
                                </el-form-item>
                                <el-form-item label="生产工厂">
                                    <el-input v-model="newBlockData.factory"></el-input>
                                </el-form-item>
                                <el-form-item label="生产地点">
                                    <el-input v-model="newBlockData.location"></el-input>
                                </el-form-item>
                                <el-form-item label="生产者">
                                    <el-input v-model="newBlockData.producer"></el-input>
                                </el-form-item>
                            </el-form>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="addBlockDialogVisible = false">取消</el-button>
                                <el-button type="primary" @click="addNewBlock">确定</el-button>
                            </span>
                        </el-dialog>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <h3>区块链信息</h3>
                        <el-table :data="blockchain.chain" stripe border>
                            <el-table-column prop="index" label="索引" width="100"></el-table-column>
                            <el-table-column prop="timestamp" label="时间戳"></el-table-column>
                            <el-table-column prop="previousHash" label="前一个区块哈希"></el-table-column>
                            <el-table-column prop="hash" label="当前区块哈希值"></el-table-column>
                            <el-table-column prop="nonce" label="随机数" width="200"></el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>

<script type="text/javascript">
/* eslint-disable */

import { Block } from '../blockchain/block.js'
import { Blockchain } from '../blockchain/block.js'

export default {
    name: "App",
    data() {
        return {
            blockchain: new Blockchain(),
            addBlockDialogVisible: false,
            newBlockData: {
                id: "",
                batchNo: "",
                productionDate: "",
                factory: "Maotai Distillery Co., Ltd.",
                location: "Renhuai, Guizhou, China",
                producer: "Maotai Co., Ltd",
            },

            searchBatchNo: "",
            searchResults: [],
            searchResultsDialogVisible: false,
            searchType: "",
            searchInput: "",
        };
    },
    created() {
        this.blockchain.addBlock(new Block(
            Date.now(),
            {
                id: "12345678",
                batchNo: "1",
                productionDate: "2020-01-01",
                factory: "Maotai Distillery Co., Ltd.",
                location: "Renhuai, Guizhou, China",
                producer: "Maotai Co., Ltd",
            }
        ));
        console.log(JSON.stringify(this.blockchain, null, 4));
    },
    methods: {
        openAddBlockDialog() {
            this.addBlockDialogVisible = true;
        },
        resetForm() {
            this.newBlockData.id = "";
            this.newBlockData.batchNo = "";
            this.newBlockData.productionDate = "";
            this.newBlockData.factory = "Maotai Distillery Co., Ltd.";
            this.newBlockData.location = "Renhuai, Guizhou, China";
            this.newBlockData.producer = "Maotai Co., Ltd";
            this.$refs.addBlockForm.resetFields();
        },
        addNewBlock() {
            const newBlock = new Block(Date.now(), {
                id: this.newBlockData.id,
                batchNo: this.newBlockData.batchNo,
                productionDate: this.newBlockData.productionDate,
                factory: this.newBlockData.factory,
                location: this.newBlockData.location,
                producer: this.newBlockData.producer,
            });
            this.blockchain.addBlock(newBlock);
            this.addBlockDialogVisible = false;
            this.resetForm();
        },
        searchBlock() {
            if (!this.searchType || !this.searchInput) {
                return;
            }
            this.searchResults = this.blockchain.chain.filter((block) => {
                return block.data[this.searchType] === this.searchInput;
            });
            this.searchResultsDialogVisible = true;
        },
        resetSearch() {
            this.searchBatchNo = "";
            this.searchResults = [];
        },
    },
};
</script>

<style>
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}

.el-header {
    background-color: #b3c0d1;
    line-height: 20px;
    padding-left: 20px;
    padding-bottom: 10px;
}

h1 {
    font-weight: bold;
}

h2 {
    font-weight: normal;
}

.el-row {
    margin-bottom: 10px;
}

.el-table {
    width: 100%;
}
</style>
