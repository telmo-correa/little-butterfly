const GameDataLib = artifacts.require("GameDataLibMock");

contract('GameDataLib test claim', async (accounts) => {

    const TEST_TIMEZONE = 0;
    const TEST_TIMESTAMP = 500;

    before(async () => {
        const instance = await GameDataLib.deployed();

        await instance.claim(accounts[0], TEST_TIMEZONE, TEST_TIMESTAMP);
    });

    it('test first butterfly properties', async () => {
        const instance = await GameDataLib.deployed();

        const butterflyId = (await instance.getLastId()).toNumber();
        assert.equal(butterflyId, 0, 'first butterfly ID is incorrect');

        const butterflyInfo = (await instance.getButterflyInfo(butterflyId));

        assert(butterflyInfo.gene !== 0, 'butterfly gene not initialized');
        assert.equal(TEST_TIMESTAMP, butterflyInfo.createdTimestamp.toNumber(), 'unexpected created timestamp');
        assert.equal(TEST_TIMESTAMP, butterflyInfo.lastTimestamp.toNumber(), 'unexpected last timestamp');
        assert.equal(1, butterflyInfo.numOwners.toNumber(), 'unexpected number of owners');

        const lastOwner = (await instance.getButterflyOwnerByIndex(butterflyId, 0));
        assert.equal(accounts[0], lastOwner, 'unexpected owner');
    });

    it('test flower properties', async () => {
        const instance = await GameDataLib.deployed();

        const flowerInfo = (await instance.getFlowerInfo(accounts[0]));

        assert(flowerInfo.isClaimed, 'flower should have been claimed');
        assert(flowerInfo.gene !== 0, 'flower gene not initialized');

        const flowerInfoNotClaimed = (await instance.getFlowerInfo(accounts[1]));

        assert(!flowerInfoNotClaimed.isClaimed, 'flower should have been claimed');
        assert.equal(0, flowerInfoNotClaimed.gene, 'flower gene not initialized');
    });

    it('test flower accessors', async () => {
       const instance = await GameDataLib.deployed();

       const totalFlowers = (await instance.totalFlowers()).toNumber();
       const flowerAddress = (await instance.getFlowerByIndex(0));

       assert.equal(1, totalFlowers, 'unexpected number of flowers');
       assert.equal(accounts[0], flowerAddress, 'unexpected owner');
    });

});

contract('GameDataLib test receive', async (accounts) => {

    const TEST_TIMEZONE = 0;
    const TEST_TIMESTAMP = 500;
    const LATE_TIMESTAMP = TEST_TIMESTAMP + 86401;
    const butterflyIds = [];

    before(async () => {
        const instance = await GameDataLib.deployed();

        await instance.claim(accounts[0], TEST_TIMEZONE, TEST_TIMESTAMP);
        butterflyIds.push((await instance.getLastId()).toNumber());

        await instance.claim(accounts[1], TEST_TIMEZONE, TEST_TIMESTAMP);
        butterflyIds.push((await instance.getLastId()).toNumber());
    });

    it('test can receive butterfly', async () => {
        const instance = await GameDataLib.deployed();

        assert(!(await instance.canReceiveButterfly(butterflyIds[0], accounts[0], TEST_TIMESTAMP)),
            'cannot receive own butterfly');
        assert(!(await instance.canReceiveButterfly(butterflyIds[1], accounts[1], TEST_TIMESTAMP)),
            'cannot receive own butterfly');

        assert((await instance.canReceiveButterfly(butterflyIds[0], accounts[1], TEST_TIMESTAMP)),
            'can receive new butterfly');
        assert((await instance.canReceiveButterfly(butterflyIds[1], accounts[0], TEST_TIMESTAMP)),
            'can receive new butterfly');

        assert(!(await instance.canReceiveButterfly(butterflyIds[0], accounts[1], LATE_TIMESTAMP)),
            'cannot receive late butterfly');
        assert(!(await instance.canReceiveButterfly(butterflyIds[1], accounts[0], LATE_TIMESTAMP)),
            'cannot receive late butterfly');
    });

});

contract('GameDataLib test transfer', async (accounts) => {

    const TEST_TIMEZONE = 0;
    const TEST_TIMESTAMP = 500;
    const TRANSFER_TIMESTAMP = 1000;
    const butterflyIds = [];
    const heartIds = [];

    before(async () => {
        const instance = await GameDataLib.deployed();

        await instance.claim(accounts[0], TEST_TIMEZONE, TEST_TIMESTAMP);
        butterflyIds.push((await instance.getLastId()).toNumber());

        await instance.claim(accounts[1], TEST_TIMEZONE, TEST_TIMESTAMP);
        butterflyIds.push((await instance.getLastId()).toNumber());

        // do transfer
        await instance.transferButterfly(butterflyIds[0], accounts[0], accounts[1], TRANSFER_TIMESTAMP);
        heartIds.push((await instance.getLastId()).toNumber());
    });

    it('test butterfly after transfer', async () => {
        const instance = await GameDataLib.deployed();

        const butterflyId = butterflyIds[0];
        assert.equal(butterflyId, 0, 'first butterfly ID is incorrect');

        const butterflyInfo = (await instance.getButterflyInfo(butterflyId));

        assert(butterflyInfo.gene !== 0, 'butterfly gene not initialized');
        assert.equal(TEST_TIMESTAMP, butterflyInfo.createdTimestamp.toNumber(), 'unexpected created timestamp');
        assert.equal(TRANSFER_TIMESTAMP, butterflyInfo.lastTimestamp.toNumber(), 'unexpected last timestamp');
        assert.equal(2, butterflyInfo.numOwners.toNumber(), 'unexpected number of owners');

        const firstOwner = (await instance.getButterflyOwnerByIndex(butterflyId, 0));
        const secondOwner = (await instance.getButterflyOwnerByIndex(butterflyId, 1));

        assert.equal(accounts[0], firstOwner, 'unexpected first owner');
        assert.equal(accounts[1], secondOwner, 'unexpected second owner');
    });

    it('test heart info', async () => {
        const instance = await GameDataLib.deployed();

        const heartId = heartIds[0];
        const heartInfo = (await instance.getHeartInfo(heartId));
        const butterflyInfo = (await instance.getButterflyInfo(butterflyIds[0]));

        assert.equal(butterflyIds[0], heartInfo.butterflyId, 'unexpected butterfly ID');
        assert.equal(butterflyInfo.gene.toString(), heartInfo.gene.toString(), 'unexpected heart gene');
        assert.equal(TRANSFER_TIMESTAMP, heartInfo.snapshotTimestamp, 'unexpected heart timestamp');
        assert.equal(2, heartInfo.numOwners.toNumber(), 'unexpected number of owners');

        const firstOwner = (await instance.getHeartOwnerByIndex(heartId, 0));
        const secondOwner = (await instance.getHeartOwnerByIndex(heartId, 1));

        assert.equal(accounts[0], firstOwner, 'unexpected first owner');
        assert.equal(accounts[1], secondOwner, 'unexpected second owner');
    });

});



