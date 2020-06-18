import sketch from "sketch";
// documentation: https://developer.sketchapp.com/reference/api/
let fileData = "Symbol name;Library Name;Number of instances\n";
let documentName = "library-inventory";

export default function () {
  let document = sketch.getSelectedDocument();

  let path = document.path.split("/");
  documentName = path[path.length - 1].replace(".sketch", "");
  documentName = documentName.replace(/\s/g, "-");
  documentName = documentName.replace(/%20/g, "-");
  documentName = documentName.replace(/--/g, "-");
  documentName = documentName.replace(/--/g,"-");
  let symbols = document.getSymbols();

  symbols.forEach((symbolMaster) => {
    let originLibrary = symbolMaster.getLibrary();
    if (originLibrary) {
      var instances = symbolMaster.getAllInstances();
      fileData += `${symbolMaster.name};${originLibrary.name};${instances.length}\n`;
    }
  });
  showSavePanel();
}

const showSavePanel = () => {
  const savePanel = NSSavePanel.savePanel();
  savePanel.setNameFieldStringValue(`${documentName}.csv`);
  savePanel.setAllowsOtherFileTypes(false);
  savePanel.setExtensionHidden(false);

  if (savePanel.runModal()) {
    const filePath = savePanel.URL().path();
    const file = NSString.stringWithString(fileData);
    file.writeToFile_atomically_encoding_error(
      filePath,
      true,
      NSUTF8StringEncoding,
      null
    );
    UI.message("📓 Export of " + filePath + " complete!");
  }
};
