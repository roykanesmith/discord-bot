import { assert } from 'chai';
import { argsToString, parseMessage } from '../util/parsing';

describe('parsing', () => {

    describe('#parseMessage()', () => {
        it('Should return correct command and args given odd spacing', async () => {
            const message = '! 1 2';
            const parsedMessage = parseMessage(message, '!');
            const [cmd, args] = [parsedMessage.cmd, parsedMessage.args];
            assert.strictEqual(cmd, '');
            assert.deepEqual(args, ['1', '2']);
        });

        it('Should return correct command and args given no arguments', async () => {
            const message = '!test';
            const parsedMessage = parseMessage(message, '!');
            const [cmd, args] = [parsedMessage.cmd, parsedMessage.args];
            assert.strictEqual(cmd, 'test');
            assert.deepEqual(args, []);
        });

        it('Should return correct command and args given no command or arguments', async () => {
            const message = '!   ';
            const parsedMessage = parseMessage(message, '!');
            const [cmd, args] = [parsedMessage.cmd, parsedMessage.args];
            assert.strictEqual(cmd, '');
            assert.deepEqual(args, []);
        });

        it('Should return correct command and args given normal message', async () => {
            const message = '!add 1 2';
            const parsedMessage = parseMessage(message, '!');
            const [cmd, args] = [parsedMessage.cmd, parsedMessage.args];
            assert.strictEqual(cmd, 'add');
            assert.deepEqual(args, ['1', '2']);
        });

        it('Should return correct command and args given oddly formatted message', async () => {
            const message = '!TESTWord 1    2 4Aa';
            const parsedMessage = parseMessage(message, '!');
            const [cmd, args] = [parsedMessage.cmd, parsedMessage.args];
            assert.strictEqual(cmd, 'testword');
            assert.deepEqual(args, ['1', '2', '4Aa']);
        });
    });

    describe('#argsToString()', () => {
        it('Should return correct string from list of string args', async () => {
            const args = ['command', '1', '2Aa'];
            assert.strictEqual(argsToString(args), '1 2Aa');
        });

        it('Should return empty string from list of single arg (command)', async () => {
            const args = ['command'];
            assert.strictEqual(argsToString(args), '');
        });

        it('Should return empty string from empty list of args', async () => {
            const args: string[] = [];
            assert.strictEqual(argsToString(args), '');
        });
    });

});