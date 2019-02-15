const Main = artifacts.require("Main");

contract('Main test', async (accounts) => {

    before(async () => {
        const instance = await Main.deployed();

        await instance.claim(0);
    });

    it('test first butterfly properties', async () => {
        const instance = await Main.deployed();

        const butterflyId = (await instance.tokenByIndex(0)).toNumber();
        assert.equal(butterflyId, 0, 'first butterfly ID is incorrect');

        const butterflyInfo = (await instance.getButterflyInfo(butterflyId));

        assert(butterflyInfo.gene !== 0, 'butterfly gene not initialized');
        assert.equal(butterflyInfo.createdTimestamp.toNumber(), butterflyInfo.lastTimestamp.toNumber(),
            'unexpected last timestamp');
        assert.equal(1, butterflyInfo.numOwners.toNumber(), 'unexpected number of owners');

        const lastOwner = (await instance.getButterflyOwnerByIndex(butterflyId, 0));
        assert.equal(accounts[0], lastOwner, 'unexpected owner');

        const butterflyURI = (await instance.tokenURI(butterflyId));
        // console.log(butterflyURI);
    });

    it ('test flower 0 URI', async () => {
        const instance = await Main.deployed();

        await instance.accountZeroURI();
    });

    it('test flower properties', async () => {
        const instance = await Main.deployed();

        const flowerInfo = (await instance.getFlowerInfo(accounts[0]));

        assert(flowerInfo.isClaimed, 'flower should have been claimed');
        assert(flowerInfo.gene !== 0, 'flower gene not initialized');

        const flowerInfoNotClaimed = (await instance.getFlowerInfo(accounts[1]));

        assert(!flowerInfoNotClaimed.isClaimed, 'flower should have been claimed');
        assert.equal(0, flowerInfoNotClaimed.gene, 'flower gene not initialized');

        const flowerURI = (await instance.accountURI(accounts[0]));
        // console.log(flowerURI);
    });

});

contract('Main test burn', async (accounts) => {

    before(async () => {
        const instance = await Main.deployed();

        await instance.claim(0);
    });

    it('test burn', async () => {
        const instance = await Main.deployed();

        const butterflyId = (await instance.tokenByIndex(0)).toNumber();
        const butterflyInfo = (await instance.getButterflyInfo(butterflyId));

        // burn the token, leaving behind a heart
        await instance.burn(butterflyId);

        const heartId = (await instance.tokenOfOwnerByIndex(accounts[0], 0)).toNumber();
        const heartInfo = (await instance.getHeartInfo(heartId));

        const heartURI = (await instance.tokenURI(heartId));
        // console.log(heartURI);

        assert.equal(butterflyId, heartInfo.butterflyId, 'unexpected butterfly ID');
        assert.equal(butterflyInfo.gene.toString(), heartInfo.gene.toString(), 'unexpected heart gene');
        assert.equal(2, heartInfo.numOwners.toNumber(), 'unexpected number of owners');

        const firstOwner = (await instance.getHeartOwnerByIndex(heartId, 0));
        const secondOwner = (await instance.getHeartOwnerByIndex(heartId, 1));

        assert.equal(accounts[0], firstOwner, 'unexpected first owner');
        assert.equal(0, secondOwner, 'unexpected second owner');
    });

});
