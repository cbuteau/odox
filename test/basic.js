
import { Odox } from "../index.js";


class Basic extends Odox {
  constructor() {
    super();
  }

  _echo() {
    console.info('yo');
  }

  spit(info) {
    console.info(info);
  }
}


describe('Tests on a basic class', function() {

  it ('Test obj', function(done) {
    var obj = new Basic();
    setTimeout(() => {
      obj.doc();
      done();
    }, 500);
  });

});
