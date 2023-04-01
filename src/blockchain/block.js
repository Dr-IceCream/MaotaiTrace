/* eslint-disable */
const SHA256 = require('crypto-js/sha256');

export class Block {
    constructor(timestamp, data, previousHash = '') {
        this.index = 0;
        this.timestamp = timestamp;
        this.data = data;      // 新添加的茅台酒信息
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(
            this.index +
            this.previousHash +
            this.timestamp +
            JSON.stringify(this.data) +
            this.nonce
        ).toString();
    }

    mineBlock(difficulty) {
        while (
            this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
        ) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log('Block mined: ' + this.hash);
    }
}

export class Blockchain {
    constructor() {
        this.index = 1; // 初始索引值为1，因为第一个块是创世块
        this.difficulty = 4; // 设置区块链难度为4
        this.chain = [this.createGenesisBlock()];
        this.chain[0].mineBlock(this.difficulty);
    }

    createGenesisBlock() {
        return new Block(Date.now(), 'Genesis Block', '0');
    }

    validateBatch(data) {
        // 验证批次号是否符合规范
        // if (data.id.length !== 8 || !/^\d+$/.test(data.id)) {
        //     console.log('Invalid id!');
        //     return false;
        // }
        if (data.id.length !== 8) {
            console.log('Invalid id!');
            console.log('id:'+ data.id);
            return false;
        }
        // 验证生产日期是否符合规范
        if (!/^\d{4}-\d{2}-\d{2}$/.test(data.productionDate)) {
            console.log('Invalid productionDate!');
            console.log('productionDate:'+ data.productionDate);
            return false;
        }
        // 如果以上验证都通过，则返回true
        return true;
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        const isValid = this.validateBatch(newBlock.data);
        if (!isValid) {
            return;
        }

        newBlock.index = this.index; // 为新块分配索引值
        this.index++; // 自增索引值，以便为下一个块分配适当的索引值
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isBlockValid(newBlock, previousBlock) {
        if (previousBlock.index + 1 !== newBlock.index) {
            return false;
        }
        if (previousBlock.hash !== newBlock.previousHash) {
            return false;
        }
        if (newBlock.calculateHash() !== newBlock.hash) {
            return false;
        }
        // 验证批次茅台酒的信息是否有效
        const isValid = this.validateBatch(newBlock.data);
        if (!isValid) {
            console.log('Invalid batch data!');
            return false;
        }
        return true;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            if (!this.isBlockValid(currentBlock, previousBlock)) {
                return false;
            }
        }
        return true;
    }
}

// let ins = new Blockchain();
// console.log(JSON.stringify(ins,null,4));

/* eslint-enable */
