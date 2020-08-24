
function detectIsFunction(value) {
  if (value.apply && value.call && value.bind) {
      return true;
  } else {
    return false;
  }
}

function getAllProps(object) {
  var obj = object;
  var props = [];
  do {
      props = props.concat(Object.getOwnPropertyNames(obj));
  } while (obj = Object.getPrototypeOf(obj));

  var objProps = Object.getOwnPropertyNames(Object.getPrototypeOf({}));

  var finalProps = props.filter((p) => { return objProps.indexOf(p) === -1; });

  return finalProps;
}

function extractPropsAndFuncs(objPtr, keys) {
  var result = {
    props: [],
    funcs: []
  }
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var thing = objPtr[key];
    if (detectIsFunction(thing)) {
      result.funcs.push(key);
    } else {
      result.props.push(key);
    }
  }

  return result;
}

export class Odox {
  constructor() {
    this.typeName = this.constructor.name;
    var keys = getAllProps(this);
    //var keys = Object.keys(this);
    var privates = keys.filter((k) => { return k.startsWith('_'); });
    var publics = keys.filter((k) => { return !k.startsWith('_'); });

    this.privates = extractPropsAndFuncs(this, privates);
    this.publics = extractPropsAndFuncs(this, publics);
  }

  doc() {
    console.groupCollapsed(' object ' + this.typeName);
    console.groupCollapsed('privates');
    for (var i = 0; i < this.privates.funcs.length; i++) {
      console.log(this.privates.funcs[i]);
    }
    console.groupEnd();
    console.groupCollapsed('publics');
    for (var i = 0; i < this.publics.funcs.length; i++) {
      console.log(this.publics.funcs[i]);
    }
    console.groupEnd();
    console.groupEnd();
  }
}
