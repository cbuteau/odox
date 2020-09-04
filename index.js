
function detectIsFunction(value) {
  if (value.apply && value.call && value.bind) {
      return true;
  } else {
    return false;
  }
}

function getAllProps(object) {
  var results = [];
  var obj = object;
  var props = [];
  var objProps = Object.getOwnPropertyNames(Object.getPrototypeOf({}));
  do {
    var currType = obj.constructor.name;
    var newprops = Object.getOwnPropertyNames(obj);
    var finalProps = newprops.filter((p) => { return objProps.indexOf(p) === -1; });
    var propsboth = finalProps.map((p) => {
      return {
        prop: p,
        display: currType + '.' + p
      };
    });
    results = results.concat(propsboth);
  } while (obj = Object.getPrototypeOf(obj));

  return results;
}

function extractPropsAndFuncs(objPtr, keys) {
  var result = {
    props: [],
    funcs: []
  };
  for (var i = 0; i < keys.length; i++) {
    var propInfo = keys[i];
    var thing = objPtr[propInfo.prop];
    if (detectIsFunction(thing)) {
      result.funcs.push(propInfo);
    } else {
      result.props.push(propInfo);
    }
  }

  return result;
}

function dumpGroup(groupHeader, array) {
  var len = array.length;
  if (len) {
    console.groupCollapsed(groupHeader);
    for (var i = 0; i < len; i++) {
      var cur = array[i];
      console.log(cur.display);
    }
    console.groupEnd();
  }
}

export class Odox {
  constructor() {
    this.typeName = this.constructor.name;
    var props = getAllProps(this);

    var privates = props.filter((p) => {
      return p.prop.startsWith('_');
    });

    var publics = props.filter((p) => {
      return !p.prop.startsWith('_');
    });

    //var privates = keys.filter((k) => { return k.startsWith('_'); });
    //var publics = keys.filter((k) => { return !k.startsWith('_'); });

    this.privates = extractPropsAndFuncs(this, privates);
    this.publics = extractPropsAndFuncs(this, publics);
  }

  doc() {
    console.groupCollapsed(' object ' + this.typeName);
    console.groupCollapsed('privates');
    dumpGroup('functions', this.privates.funcs);
    dumpGroup('properties', this.privates.props);
    console.groupEnd();
    console.groupCollapsed('publics');
    dumpGroup('functions', this.publics.funcs);
    dumpGroup('properties', this.publics.props);
    console.groupEnd();
    console.groupEnd();
  }
}
