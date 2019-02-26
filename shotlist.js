const fs = require("fs");

fs.readdir("./shots", (err, files) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const locales = files.filter(file => file.endsWith(".png"));
  const output = locales.map(file => {
    const [, locale] = file.match(/^testpilot-(.*?)\.png$/);
    return `
      ## ${locale}
      ![](${file})
    `.replace(/^\s+/gm, "");
  }).join("\n");

  console.log(output);

  // fs.writeFileSync("./shots/README.md", output.toString());
});
