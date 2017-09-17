class Util {
  makeError(nameText, msgText, data) {
    const error = new Error();
    error.name = nameText;
    error.message = msgText;

    if (data) error.data = data;

    return error;
  }

  setConfigMap(argMap) {
    const inputMap = argMap.inputMap,
          settableMap = argMap.settableMap,
          configMap = argMap.configMap;

    for (let keyName in inputMap) {
      if (inputMap.hasOwnProperty(keyName)) {
        if (settableMap.hasOwnProperty(keyName)) {
          configMap[keyName] = inputMap[keyName];
        }
        else {
          const error = this.makeError('Bad Input', `Setting config |${keyName}| is not supported`);
          throw error;
        }
      }
    }
  }
}