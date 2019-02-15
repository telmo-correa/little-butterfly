const URIDistribution = artifacts.require("URIDistributionMock");

contract('URIDistribution test distribution 1', async (accounts) => {

    before(async () => {
        const instance = await URIDistribution.deployed();

        for (let i = 0; i < 7; i++) {
            await instance.addURI(2, i.toString());
        }
    });

    it('should draw from distribution elements', async () => {
        const instance = await URIDistribution.deployed();

        for (let j = 0; j < 14; j++) {
            const v = (await instance.getURI(j));
            assert.equal(v, Math.floor(j / 2).toString(), "unexpected value drawn for " + j);
        }
    });

});

contract('URIDistribution test distribution 2', async (accounts) => {

    before(async () => {
        const instance = await URIDistribution.deployed();

        await instance.addURI(8, "common");
        await instance.addURI(4, "uncommon");
        await instance.addURI(2, "rare");
        await instance.addURI(1, "epic");
    });

    it('should draw from distribution elements', async () => {
        const instance = await URIDistribution.deployed();

        for (let j = 0; j < 30; j++) {
            const value = (await instance.getURI(j));

            const modSeed = (j % 15);
            if (modSeed < 8) assert.equal(value, "common", "unexpected value drawn for " + j);
            else if (modSeed < 12) assert.equal(value, "uncommon", "unexpected value drawn for " + j);
            else if (modSeed < 14) assert.equal(value, "rare", "unexpected value drawn for "+ j);
            else assert.equal(value, "epic", "unexpected value drawn for " + j);
        }
    });

});
