const inquirer = require("inquirer");

(async () => {
  const list = await inquirer.prompt([
    {
      type: "list",
      name: "select",
      message: "Select what you want to do",
      choices: ["Create Project"],
    },
  ]);

  const selected = list.select;

  if (selected == "Create Project") {
    const installer = require("../utils/install");
    installer();
  }
})();
