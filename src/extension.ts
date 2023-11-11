// // The module 'vscode' contains the VS Code extensibility API
// // Import the module and reference it with the alias vscode in your code below
// import * as vscode from 'vscode';

// // This method is called when your extension is activated
// // Your extension is activated the very first time the command is executed
// export function activate(context: vscode.ExtensionContext) {

// 	// Use the console to output diagnostic information (console.log) and errors (console.error)
// 	// This line of code will only be executed once when your extension is activated
// 	console.log('Congratulations, your extension "nuwave-odoo" is now active!');

// 	// The command has been defined in the package.json file
// 	// Now provide the implementation of the command with registerCommand
// 	// The commandId parameter must match the command field in package.json
// 	let disposable = vscode.commands.registerCommand('nuwave-odoo.helloWorld', () => {
// 		// The code you place here will be executed every time your command is executed
// 		// Display a message box to the user
// 		vscode.window.showInformationMessage('Hello World from nuwave_odoo!');
// 	});

// 	context.subscriptions.push(disposable);
// }

// // This method is called when your extension is deactivated
// export function deactivate() {}

import * as vscode from "vscode";

import * as fs from "fs";
import * as path from "path";

//cc
//

// import {
//   mainTemplate,
//   storybookTemplate,
//   styleTemplate,
// } from "./templates/index";

//https://velog.io/@93minki/VSCode-Extension-만들기

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "createComponent",
    async (uri) => {
      try {
        const fp = uri.fsPath;
        const componentName = await vscode.window.showInputBox({
          placeHolder: "Enter Component Name",
          validateInput: (value: string) => {
            if (!value) {
              return "Component Name Can't be Empty!";
            }
            return undefined;
          },
        });

        if (componentName) {
          const folderPath =
            vscode.workspace.workspaceFolders?.[0].uri.fsPath || "";
          const componentPath = path.join(fp, componentName);

          console.log(folderPath);
          console.log(componentPath);

          //if (!fs.existsSync(componentPath)) {
          if (1 === 1) {
            //fs.mkdirSync(componentPath);

            const indexFilePath = path.join(
              componentPath,
              `${componentName}.tsx`
            );
            const storybookPath = path.join(
              componentPath,
              `${componentName}.stories.tsx`
            );
            const styledPath = path.join(componentPath, `style.ts`);
            const modelPath = path.join(folderPath, `data/model.json`);
            console.log(modelPath);

            const loadedConfig = fs.readFileSync(modelPath, "utf-8");
            const configs = JSON.parse(loadedConfig);
            console.log(configs.length);
            configs.forEach(function (config: any) {
              console.log(config.name);
            });

            //vscode.window.showInformationMessage(config);

            //fs.writeFileSync(indexFilePath, "mainTemplate(componentName)");
            //fs.writeFileSync(storybookPath, "storybookTemplate(componentName)");
            //fs.writeFileSync(styledPath, "styleTemplate(componentName)");

            vscode.window.showInformationMessage(`Component Created!`);
          } else {
            vscode.window.showInformationMessage(`Component already Exist`);
          }
        }
        //vscode.window.showInformationMessage("Hello VsCode Extension!");
      } catch (error) {
        console.log(error);
      }
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
