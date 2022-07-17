// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const testTag = new vscode.TestTag("TestTag");
const myWeakMap = new WeakMap<vscode.TestItem, string>();

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "test-extension" is now active!');

    const testController = vscode.tests.createTestController("xyz", "xyz");
    const testItem = testController.createTestItem("Item1", "My Item");
    testItem.tags = [testTag];
    testController.items.add(testItem);

	testController.createRunProfile("Run", vscode.TestRunProfileKind.Run, async (request, token) => {

		for (const test of request.include!) {
            test.busy = true;

            await new Promise((resolve) => {
                setTimeout(resolve, 5000);
            });

            test.busy = false;

            // Add to weakmap
            console.log(`Adding ${test.label} to weakmap`);
            myWeakMap.set(test, test.label);
		}

	});

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('test-extension.helloWorld', async (test: vscode.TestItem) => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from test-extension!');


        test.busy = true;

        await new Promise((resolve) => {
            setTimeout(resolve, 5000);
        });

        test.busy = false;

        console.log(`Trying to get ${test.label} from weakmap`);
        const label = myWeakMap.get(test);
        console.log(`Got ${label} from weakmap`);
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
