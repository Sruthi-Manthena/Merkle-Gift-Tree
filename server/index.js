const express = require('express');
const verifyProof = require('../utils/verifyProof');
const MerkleTree = require('../utils/MerkleTree');
const niceList = require("../utils/niceList.json");

const port = 1225;

const app = express();
app.use(express.json());

// TODO: hardcode a merkle root here representing the whole nice list
// paste the hex string in here, without the 0x prefix
const merkleTree = new MerkleTree(niceList);
const MERKLE_ROOT = merkleTree.getRoot();

app.post('/gift', (req, res) => {
    // grab the parameters from the front-end here
    const body = req.body;

    // TODO: prove that a name is in the list 
    const index = niceList.findIndex(n => n === body.name);
    const Proof = merkleTree.getProof(index);

    const verify = verifyProof(Proof, body.name, MERKLE_ROOT);
    let isInTheList = false;
    if (verify) {
        isInTheList = true;
    }
    if (isInTheList) {
        res.send("You got a toy robot!");
    }
    else {
        res.send("You are not on the list :(");
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});
