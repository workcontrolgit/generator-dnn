'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
    prompting() {
        const prompts = [{
            when: !this.options.namespace,
            type: 'input',
            name: 'namespace',
            message: 'Namespace for your module (Usually a company name)?',
            validate: str => {
              return str.length > 0;
            }
          },
          {
          when: !this.options.name,
          type: 'input',
          name: 'name',
          message: 'What is the name of your MVC Module?',
          validate: str => {
            return str.length > 0;
          }
        }];
    
        return this.prompt(prompts).then(props => {
          // To access props later use this.props.someAnswer;
          this.props = props;
        });
      }

    writing() {
        this.log(
            chalk.white('Creating MVC Module.')
        );
                // TODO: Need to remove spaces and pascal case namespace and module name

        this.fs.copyTpl(
            this.templatePath('/Controllers/SettingsController.cs'),
            this.destinationPath('/Controllers/SettingsController.cs'),
            { 
                title: this.props.namespace,
                moduleName: this.props.name
            }
        );

        this.fs.copyTpl(
            this.templatePath('/Models/Settings.cs'),
            this.destinationPath('/Models/Settings.cs'),
            { 
                title: this.props.namespace,
                moduleName: this.props.name
            }
        );

        this.fs.copyTpl(
            this.templatePath('/Views/_ViewStart.cshtml'),
            this.destinationPath('/Views/_ViewStart.cshtml'),
            { 
                title: this.props.namespace,
                moduleName: this.props.name
            }
        );

        this.fs.copyTpl(
            this.templatePath('/Views/Settings/Settings.cshtml'),
            this.destinationPath('/Views/Settings/Settings.cshtml'),
            { 
                title: this.props.namespace,
                moduleName: this.props.name
            }
        );

        this.fs.copy(this.templatePath('License.lic'), this.destinationPath('License.lic'));
        this.fs.copy(this.templatePath('manifest.dnn'), this.destinationPath(this.props.name + '.dnn'));
        this.fs.copy(this.templatePath('ReleaseNotes.txt'), this.destinationPath('ReleaseNotes.txt'));
    }

  install() {
    //this.installDependencies({ npm: true, bower: false, yarn: false });
  }
};
