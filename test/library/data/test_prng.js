const PRNG = artifacts.require("PRNGMock");

contract('PRNG test', async (accounts) => {

    it('should generate elements', async () => {
        const instance = await PRNG.deployed();

        for (let i = 0; i < 20; i++) {
            const j = (await instance.get());
            //console.log(j);
            await instance.next();
        }
    });

});
