const EnumerableSetAddress = artifacts.require("EnumerableSetAddressMock");

contract('EnumerableSetAddress test', async (accounts) => {

    it('should add elements', async () => {
        const instance = await EnumerableSetAddress.deployed();

        const initialSize = (await instance.size()).toNumber();
        assert.equal(initialSize, 0, 'initial size incorrect');

        await instance.add(accounts[0]);
        await instance.add(accounts[1]);
        await instance.add(accounts[2]);

        const finalSize = (await instance.size()).toNumber();
        assert.equal(finalSize, 3, 'final size incorrect');

        assert(await instance.contains(accounts[0]), 'instance should contain 0');
        assert(await instance.contains(accounts[1]), 'instance should contain 1');
        assert(await instance.contains(accounts[2]), 'instance should contain 2');

        const elementA = (await instance.get(0));
        const elementB = (await instance.get(1));
        const elementC = (await instance.get(2));

        const setAfter = new Set([elementA, elementB, elementC]);
        assert(setAfter.has(accounts[0]), 'enumeration should include 0');
        assert(setAfter.has(accounts[1]), 'enumeration should include 1');
        assert(setAfter.has(accounts[2]), 'enumeration should include 2');

        assert(!(await instance.contains(accounts[3])), 'instance should not contain 3');

        // should not be able to add existing element
        let hasError = false;
        try {
            await instance.add(accounts[1]);
        } catch (e) {
            hasError = true;
        }

        assert(hasError, 'should not be able to add again existing element');
    });

    it('should remove elements', async () => {
        const instance = await EnumerableSetAddress.deployed();

        const initialSize = (await instance.size()).toNumber();
        assert.equal(initialSize, 3, 'initial size incorrect');

        await instance.remove(accounts[0]);
        await instance.remove(accounts[1]);
        await instance.remove(accounts[2]);

        const finalSize = (await instance.size()).toNumber();
        assert.equal(finalSize, 0, 'final size incorrect');

        assert(!(await instance.contains(accounts[0])), 'instance should not contain 0');
        assert(!(await instance.contains(accounts[1])), 'instance should not contain 1');
        assert(!(await instance.contains(accounts[2])), 'instance should not contain 2');

        assert(!(await instance.contains(accounts[3])), 'instance should not contain 3');

        // should not be able to remove missing element
        let hasError = false;
        try {
            await instance.remove(accounts[1]);
        } catch (e) {
            hasError = true;
        }

        assert(hasError, 'should not be able to remove missing element');
    });

    it('should behave as empty after clear', async () => {
        const instance = await EnumerableSetAddress.deployed();

        const initialSize = (await instance.size()).toNumber();
        assert.equal(initialSize, 0, 'initial size incorrect');

        await instance.add(accounts[0]);
        await instance.add(accounts[1]);
        await instance.add(accounts[2]);

        await instance.clear();

        const clearSize = (await instance.size()).toNumber();
        assert.equal(clearSize, 0, 'clear size incorrect');

        assert(!(await instance.contains(accounts[0])), 'instance should not contain 0');
        assert(!(await instance.contains(accounts[1])), 'instance should not contain 1');
        assert(!(await instance.contains(accounts[2])), 'instance should not contain 2');

        // should not be able to remove missing element
        let hasError = false;
        try {
            await instance.remove(accounts[1]);
        } catch (e) {
            hasError = true;
        }

        assert(hasError, 'should not be able to remove missing element');

        // should be able to add back element
        await instance.add(accounts[2]);
        assert(!(await instance.contains(accounts[0])), 'instance should not contain 0');
        assert(!(await instance.contains(accounts[1])), 'instance should not contain 1');
        assert(await instance.contains(accounts[2]), 'instance should contain 2');
    });

});
