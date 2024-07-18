# Node.js Simple Package Manager

This project implements a basic version of a Node.js package manager in JavaScript. The package manager supports two main commands: `add` and `install`.

## Commands Implemented

### `add <package_name>`

The `add` command adds a specified package to the `dependencies` object in `package.json`.

- If a version is provided (e.g., `is-thirteen@2.0.0`), it adds the package with that specific version.
- If no version is provided, it defaults to the latest version available (`latest`).
- With the `add` command, it also circumvents the issue of using `npm init` to add the `package.json` file by automatically creating one if it doesn't exist.

### `install <package_name>`

The  `install` command installs the specified package and its dependencies to the `node_modules` directory. It uses the `dependencies` object in `package.json` to determine which versions to install.

- It installs the package with the version specified in `package.json` and its dependencies without need for redundant arguments - it uses the  `package.json` file to determine which versions to install

#### Features

- **File System Operations**: Uses Node.js fs module for reading and writing package.json and package-lock.json.

- **External Commands Execution**: Executes shell commands (npm view and npm install) using execSync from child_process.

- **Error Handling**: Provides error animations and logs specific error messages when package installation fails or package validation is unsuccessful.

- **Visual Feedback**: Includes success animations for successful operations, providing clear visual feedback to the user.

#### Notes
- This project is a basic implementation and does not handle advanced features like caching, circular dependencies, or conflict resolution.

#### Contributors
Jason Vu [jvu@scu.edu]

#### License
This project is licensed under the MIT License.