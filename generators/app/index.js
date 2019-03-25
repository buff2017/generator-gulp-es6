// 创建 yeoman generator 的核心功能模块.
const Generator = require('yeoman-generator')

// 文件读写模块.
const fs = require('fs')
// 路径模块
const path = require('path')

// PS: fs 和 path 是 NodeJS 的核心模块，无需安装.

/**
 * Base generator.
 */
module.exports = class extends Generator {
  
  /** 构造函数 */
  constructor (args, opts) {
    // 继承必须.
    super(args, opts)
    
    // 获取 AppName，使用路径尾.
    this.appName = path.basename(process.cwd())
    // 设置 Author.
    this.appAuthor = "buff2017"
  }
  
  /**
   * 初始化方法.
   */
  initializing () {
    this.log("building...")
  }
  
  /**
   * 用户交互组件
   */
  prompting () {
    return this.prompt([{
      type: 'input',
      name: 'projectName',
      message: 'Tell me u project name',
      default: this.appname // Default to current folder name
    }]).then((answers) => {
      fs.mkdirSync('app')
      
      let projectName = answers.projectName ? answers.projectName : this.appname
      projectName = projectName.trim().replace(' ', '-')
      projectName = projectName.replace(/^-/, '')
      
      this.fs.copyTpl(
        this.templatePath('package_tmpl'),
        this.destinationPath('package.json'),
        {projectName: projectName}
      )
    })
    
  }
  
  /**
   * 写入配置
   */
  configuring () {
    
    // 获取 package 配置模板.
    let defaultSettings = this.fs.readJSON(this.templatePath('package.json'))
    // 做新 package 配置文件.
    let packageSettings = {
      name: this.appName,
      version: '1.0.0',
      description: `${this.appName} - Generated by generator-gulp-es6`,
      main: 'index.js',
      scripts: defaultSettings.scripts,
      author: this.appAuthor,
      devDependencies: defaultSettings.devDependencies
    }
    
    // 写入 package.json.
    this.fs.writeJSON(this.destinationPath('package.json'), packageSettings)
  }
  
  /**
   * 写入文件
   */
  writing () {
    fs.mkdirSync('app/database')
    fs.mkdirSync('app/js')
    fs.mkdirSync('app/scss')
    fs.mkdirSync('app/sources')
    fs.mkdirSync('app/templates')
    
    //  放置app目录
    this.fs.copy(
      this.templatePath("app"),
      this.destinationPath("app")
    )
    
    // 拷贝入口页.
    /* 拷贝所需的文件. */
    this.fs.copy(
      this.templatePath("babelrc_tmpl"),
      this.destinationPath(".babelrc")
    )
  
    this.fs.copy(
      this.templatePath("gulpfile_tmpl"),
      this.destinationPath("gulpfile.babel.js")
    )
  }
  
  /**
   * 安装方法
   */
  install () {
    // 安装 package 安装.
    this.installDependencies({
      npm: true,
      bower: false,
      yarn: false
    }).then(() => {
      this.spawnCommand('npm', ['start'])
    })
  }
}
