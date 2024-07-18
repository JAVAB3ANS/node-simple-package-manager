const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const packageJsonPath = path.resolve(__dirname, 'package.json');
const lockFilePath = path.resolve(__dirname, 'package-lock.json');

const errorAnimation = `
==================================
⚠️  Error! Something went wrong.
==================================
`;

const successAnimation = `
=================================================
✅  Success! Operation completed successfully.
=================================================
`;

function add(packageName) {
  const [name, version] = packageName.split('@');
  
  if (!isValidPackage(packageName)) {
    console.log(errorAnimation);
    return; // Stop execution if package is not valid
  }

  ensurePackageJson(); // Ensure package.json exists before adding dependencies

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  if (!packageJson.dependencies) {
    packageJson.dependencies = {};
  }

  // If no version is provided, default to 'latest'
  packageJson.dependencies[name] = version || 'latest';

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf-8');
  console.log(successAnimation);
  console.log(`Added ${name}@${version || 'latest'} to dependencies.`);
}

async function installDependencies() {
  ensurePackageJson(); // Ensure package.json exists before installing dependencies

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const lockFile = fs.existsSync(lockFilePath) ? JSON.parse(fs.readFileSync(lockFilePath, 'utf-8')) : {};

  const dependencies = lockFile.dependencies || packageJson.dependencies || {};
  
  for (const [name, version] of Object.entries(dependencies)) {
    const installCommand = `npm install ${name}@${version}`;
    try {
      execSync(installCommand, { stdio: 'inherit' });
      console.log(successAnimation);
      console.log(`Successfully installed ${name}@${version}.`);
      
      // Update lock file with exact version installed
      lockFile.dependencies = lockFile.dependencies || {};
      lockFile.dependencies[name] = version;

      fs.writeFileSync(lockFilePath, JSON.stringify(lockFile, null, 2), 'utf-8');
    } catch (error) {
        console.error(errorAnimation);
        console.error(`Failed to install ${name}@${version}. Error: ${error.message}`);
    }
  }

  console.log(successAnimation);
  console.log('Dependencies installed.');
}

function isValidPackage(packageName) {
  const [name, version] = packageName.split('@');
  const viewCommand = `npm view ${name}@${version || 'latest'}`; // Ensure to use 'latest' if no version provided
  
  try {
    execSync(viewCommand);
    console.log(successAnimation);
    console.log(`${name}@${version || 'latest'} is a valid package.`);
    return true;
  } catch (error) {
    console.error(errorAnimation);
    console.error(`${name}@${version || 'latest'} is not found in the npm registry.`);
    return false;
  }
}

function ensurePackageJson() {
  if (!fs.existsSync(packageJsonPath)) {
    console.log('Initializing new package.json...');
    try {
      execSync('npm init -y', { stdio: 'inherit' });
      console.log('Initialized package.json successfully.');
    } catch (error) {
      console.error(errorAnimation);
      console.error('Failed to initialize package.json.');
    }
  }
}

async function runCommand(command, packageName) {
  if (command === 'add') {
    add(packageName);
  } else if (command === 'install') {
    await installDependencies();
  } else {
    console.error(errorAnimation);
    console.error(`Unsupported command: ${command}`);
  }
}

const command = process.argv[2];
const packageName = process.argv[3];

runCommand(command, packageName);