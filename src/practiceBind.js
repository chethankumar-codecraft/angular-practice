function printName() {
  console.log('HEllo world0', this.name);
}

const someObj1 = {
  name: 'angular',
};

printName.apply(someObj1); //invoke yourself, and bind you this to someObj
//print -> Hello world angular
console.log();
class UIButton {
  callback = null;
  addEventListener(callback) {
    this.callback = callback;
  }
  click() {
    if (this.callback) {
      this.callback('Clicked', 'Button');
    }
  }
}

class SomeClass {
  name = 'angular';

  constructor(aButton) {
    this.aButton = aButton;
    this.aButton.addEventListener(this.printName.bind(this)); //bind is needed for functions created using function keyword, not for arrow functions.
  }

  printName(prefix, suffix) {
    console.log('Hello World', prefix, ':', this.name, ':', suffix);
  }
}

const student = {
  name: 'Chethan',
  dob: '1994-11-19',
};

const aButton = new UIButton();
const someObj = new SomeClass(aButton);

aButton.click();
aButton.click();

// const printFc = someObj.printName;

// someObj.printName(); //succeeded
// //printFc(); failed

// printFc.apply(someObj, ['Second']);
// printFc.apply(student, ['Third']);
// printFc.call(someObj, 'Second', 'Suffix');
