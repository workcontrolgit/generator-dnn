'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const uuid = require('uuid-v4');
const pascalCase = require('pascal-case');
const sln = require('dotnet-solution');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    // This method adds support for a `--test` flag
    this.option('noinstall');
  }

  prompting() {
    const prompts = [
      {
        when: !this.options.company,
        type: 'input',
        name: 'company',
        message: 'Namespace for your module (Usually a company name)?',
        store: true,
        validate: str => {
          return str.length > 0;
        }
      },
      {
        when: !this.options.name,
        type: 'input',
        name: 'name',
        message: 'What is the name of your MVC Module?',
        default: this.appname,
        validate: str => {
          return str.length > 0;
        }
      },
      {
        when: !this.options.description,
        type: 'input',
        name: 'description',
        message: 'Describe your module:',
        validate: str => {
          return str.length > 0;
        }
      },
      {
        when: !this.options.companyUrl,
        type: 'input',
        name: 'companyUrl',
        message: 'Company Website:',
        store: true,
        validate: str => {
          return str.length > 0;
        }
      },
      {
        when: !this.options.emailAddy,
        type: 'input',
        name: 'emailAddy',
        message: 'Your e-mail address:',
        store: true,
        validate: str => {
          return str.length > 0;
        }
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      props.currentDate = new Date();
      props.projectGuid = uuid();
      props.solutionGuid = uuid();
      props.namespace = pascalCase(props.company);
      props.moduleName = pascalCase(props.name);

      this.props = props;
    });
  }

  writing() {
    this.log(chalk.white('Creating MVC Module.'));

    let namespace = this.props.namespace;
    let moduleName = this.props.moduleName;

    this.fs.copy(
      this.templatePath('App_LocalResources/**'),
      this.destinationPath(moduleName + '/App_LocalResources/')
    );
    this.fs.copy(
      this.templatePath('_BuildScripts/**'),
      this.destinationPath(moduleName + '/_BuildScripts/')
    );
    this.fs.copy(
      this.templatePath('Components/**'),
      this.destinationPath(moduleName + '/Components/')
    );
    this.fs.copy(
      this.templatePath('Controllers/**'),
      this.destinationPath(moduleName + '/Controllers/')
    );
    this.fs.copy(
      this.templatePath('Models/**'),
      this.destinationPath(moduleName + '/Models/')
    );
    this.fs.copy(
      this.templatePath('Providers/**'),
      this.destinationPath(moduleName + '/Providers/')
    );
    this.fs.copy(
      this.templatePath('Resources/**'),
      this.destinationPath(moduleName + '/Resources/')
    );
    this.fs.copy(
      this.templatePath('Views/**'),
      this.destinationPath(moduleName + '/Views/')
    );
    this.fs.copy(
      this.templatePath('Properties/**'),
      this.destinationPath(moduleName + '/Properties/')
    );

    this.fs.copyTpl(
      this.templatePath('../../gulp/*.js'),
      this.destinationPath(moduleName + '/_BuildScripts/gulp/'),
      {
        namespace: namespace,
        moduleName: moduleName
      }
    );

    this.fs.copyTpl(
      this.templatePath('Components/FeatureController.cs'),
      this.destinationPath(moduleName + '/Components/FeatureController.cs'),
      {
        namespace: namespace,
        moduleName: moduleName
      }
    );

    this.fs.copyTpl(
      this.templatePath('Controllers/SettingsController.cs'),
      this.destinationPath(moduleName + '/Controllers/SettingsController.cs'),
      {
        namespace: namespace,
        moduleName: moduleName
      }
    );

    this.fs.copyTpl(
      this.templatePath('Controllers/HomeController.cs'),
      this.destinationPath(moduleName + '/Controllers/HomeController.cs'),
      {
        namespace: namespace,
        moduleName: moduleName
      }
    );

    this.fs.copyTpl(
      this.templatePath('Models/Settings.cs'),
      this.destinationPath(moduleName + '/Models/Settings.cs'),
      {
        namespace: namespace,
        moduleName: moduleName
      }
    );

    this.fs.copyTpl(
      this.templatePath('Views/_ViewStart.cshtml'),
      this.destinationPath(moduleName + '/Views/_ViewStart.cshtml'),
      {
        namespace: namespace,
        moduleName: moduleName
      }
    );

    this.fs.copyTpl(
      this.templatePath('Views/Settings/Settings.cshtml'),
      this.destinationPath(moduleName + '/Views/Settings/Settings.cshtml'),
      {
        namespace: namespace,
        moduleName: moduleName
      }
    );

    this.fs.copyTpl(
      this.templatePath('Views/Home/Edit.cshtml'),
      this.destinationPath(moduleName + '/Views/Home/Edit.cshtml'),
      {
        namespace: namespace,
        moduleName: moduleName
      }
    );

    this.fs.copyTpl(
      this.templatePath('Views/Home/Index.cshtml'),
      this.destinationPath(moduleName + '/Views/Home/Index.cshtml'),
      {
        namespace: namespace,
        moduleName: moduleName
      }
    );

    this.fs.copyTpl(
      this.templatePath('RouteConfig.cs'),
      this.destinationPath(moduleName + '/RouteConfig.cs'),
      {
        namespace: namespace,
        moduleName: moduleName
      }
    );

    this.fs.copyTpl(
      this.templatePath('manifest.dnn'),
      this.destinationPath(moduleName + '/' + moduleName + '.dnn'),
      {
        namespace: namespace,
        moduleName: moduleName,
        moduleFriendlyName: this.props.name,
        description: this.props.description,
        companyUrl: this.props.companyUrl,
        emailAddy: this.props.emailAddy
      }
    );

    this.fs.copyTpl(
      this.templatePath('Properties/AssemblyInfo.cs'),
      this.destinationPath(moduleName + '/Properties/AssemblyInfo.cs'),
      {
        namespace: namespace,
        moduleName: moduleName,
        currentYear: this.props.currentDate.getFullYear()
      }
    );

    this.fs.copyTpl(
      this.templatePath('_Project.csproj'),
      this.destinationPath(moduleName + '/' + moduleName + '.csproj'),
      {
        namespace: namespace,
        moduleName: moduleName,
        projectGuid: this.props.projectGuid
      }
    );

    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath(moduleName + '/package.json'),
      {
        namespace: namespace,
        moduleName: moduleName,
        description: this.props.description,
        companyUrl: this.props.companyUrl,
        emailAddy: this.props.emailAddy
      }
    );

    this.fs.copyTpl(
      this.templatePath('gulpfile.js'),
      this.destinationPath(moduleName + '/gulpfile.js'),
      {
        namespace: namespace,
        moduleName: moduleName
      }
    );

    this.fs.copy(
      this.templatePath('packages.config'),
      this.destinationPath(moduleName + '/packages.config')
    );

    this.fs.copy(
      this.templatePath('License.md'),
      this.destinationPath(moduleName + '/License.md')
    );

    this.fs.copy(
      this.templatePath('ReleaseNotes.md'),
      this.destinationPath(moduleName + '/ReleaseNotes.md')
    );

    this.fs.copy(
      this.templatePath('web.config'),
      this.destinationPath(moduleName + '/web.config')
    );

    this.fs.copy(
      this.templatePath('web.Debug.config'),
      this.destinationPath(moduleName + '/web.Debug.config')
    );

    this.fs.copy(
      this.templatePath('web.Release.config'),
      this.destinationPath(moduleName + '/web.Release.config')
    );

    this._writeSolution();
  }

  _createSolutionFromTemplate() {
    this.log(chalk.white('Creating sln from template.'));
    let namespace = this.props.company;
    let moduleName = this.props.moduleName;
    let projectGuid = this.props.projectGuid;
    let solutionGuid = this.props.solutionGuid;

    this.fs.copyTpl(
      this.templatePath('_Template.sln'),
      this.destinationPath(namespace + '.sln'),
      {
        moduleName: moduleName,
        projectGuid: projectGuid,
        solutionGuid: solutionGuid
      }
    );
  }

  _addProjectToSolution() {
    this.log(chalk.white('Adding project to existing sln.'));
    let namespace = this.props.company;
    let moduleName = this.props.moduleName;
    let projectGuid = this.props.projectGuid;
    let slnFileName = this.destinationPath(namespace + '.sln');

    // Create a reader, and build a solution from the lines
    const reader = new sln.SolutionReader();
    const sourceLines = this.fs
      .read(slnFileName)
      .toString()
      .split(/\r?\n/);
    const solution = reader.fromLines(sourceLines);

    solution.addProject({
      id: projectGuid, // This is the same id as in the csproj
      name: moduleName,
      path: moduleName + '\\' + moduleName + '.csproj', // Relative to the solution location
      parent: moduleName // The name or id of a folder to parent it to
    });

    // Create a writer and write back to the same file
    const writer = new sln.SolutionWriter();
    const lines = writer.write(solution);
    this.fs.write(slnFileName, lines.join('\r\n'));
  }

  _writeSolution() {
    let namespace = this.props.company;
    let slnFileName = this.destinationPath(namespace + '.sln');
    this.log(
      chalk.white(
        'Looking for sln [' + slnFileName + ']. Result: ' + this.fs.exists(slnFileName)
      )
    );
    if (this.fs.exists(slnFileName)) {
      this.log(chalk.white('Existing sln file found.'));
      this._addProjectToSolution();
    } else {
      // File does not exist
      this.log(chalk.white('No sln file found.'));
      this._createSolutionFromTemplate();
    }
  }

  install() {
    if (!this.options.noinstall) {
      process.chdir(this.props.moduleName);
      this.installDependencies({ npm: true, bower: false, yarn: false });
    }
  }

  end() {
    this.log(chalk.white('Installed MVC Module npm Dependencies.'));
    this.log(chalk.white('Running NuGet.'));
    this.spawnCommand('gulp', ['nuget']);
    process.chdir('../');
    this.log(chalk.white('All Ready!'));
  }
};
