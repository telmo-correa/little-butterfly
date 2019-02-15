const EnumerableSet256 = artifacts.require("EnumerableSet256Mock");

contract('EnumerableSet256 test', async (accounts) => {

    it('should add elements', async () => {
        const instance = await EnumerableSet256.deployed();

        const initialSize = (await instance.size()).toNumber();
        assert.equal(initialSize, 0, 'initial size incorrect');

        await instance.add(0);
        await instance.add(1);
        await instance.add(2);

        const finalSize = (await instance.size()).toNumber();
        assert.equal(finalSize, 3, 'final size incorrect');

        assert(await instance.contains(0), 'instance should contain 0');
        assert(await instance.contains(1), 'instance should contain 1');
        assert(await instance.contains(2), 'instance should contain 2');

        const elementA = (await instance.get(0)).toNumber();
        const elementB = (await instance.get(1)).toNumber();
        const elementC = (await instance.get(2)).toNumber();

        const setAfter = new Set([elementA, elementB, elementC]);
        assert(setAfter.has(0), 'enumeration should include 0');
        assert(setAfter.has(1), 'enumeration should include 1');
        assert(setAfter.has(2), 'enumeration should include 2');

        assert(!(await instance.contains(3)), 'instance should not contain 3');

        // should not be able to add existing element
        let hasError = false;
        try {
            await instance.add(1);
        } catch (e) {
            hasError = true;
        }

        assert(hasError, 'should not be able to add again existing element');
    });

    it('should remove elements', async () => {
        const instance = await EnumerableSet256.deployed();

        const initialSize = (await instance.size()).toNumber();
        assert.equal(initialSize, 3, 'initial size incorrect');

        await instance.remove(0);
        await instance.remove(1);
        await instance.remove(2);

        const finalSize = (await instance.size()).toNumber();
        assert.equal(finalSize, 0, 'final size incorrect');

        assert(!(await instance.contains(0)), 'instance should not contain 0');
        assert(!(await instance.contains(1)), 'instance should not contain 1');
        assert(!(await instance.contains(2)), 'instance should not contain 2');

        assert(!(await instance.contains(3)), 'instance should not contain 3');

        // should not be able to remove missing element
        let hasError = false;
        try {
            await instance.remove(1);
        } catch (e) {
            hasError = true;
        }

        assert(hasError, 'should not be able to remove missing element');
    });

    it('should behave as empty after clear', async () => {
        const instance = await EnumerableSet256.deployed();

        const initialSize = (await instance.size()).toNumber();
        assert.equal(initialSize, 0, 'initial size incorrect');

        await instance.add(0);
        await instance.add(1);
        await instance.add(2);

        await instance.clear();

        const clearSize = (await instance.size()).toNumber();
        assert.equal(clearSize, 0, 'clear size incorrect');

        assert(!(await instance.contains(0)), 'instance should not contain 0');
        assert(!(await instance.contains(1)), 'instance should not contain 1');
        assert(!(await instance.contains(2)), 'instance should not contain 2');

        // should not be able to remove missing element
        let hasError = false;
        try {
            await instance.remove(1);
        } catch (e) {
            hasError = true;
        }

        assert(hasError, 'should not be able to remove missing element');

        // should be able to add back element
        await instance.add(2);
        assert(!(await instance.contains(0)), 'instance should not contain 0');
        assert(!(await instance.contains(1)), 'instance should not contain 1');
        assert(await instance.contains(2), 'instance should contain 2');
    });

});
