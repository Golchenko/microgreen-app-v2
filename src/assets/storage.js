import { makeAutoObservable, toJS } from "mobx";

class Storage {
  productTags = "";
  messageLimit = 300;
  customStyles = "";
  loading = false;
  isInstalled = false;

  setProductTags = (value) => {
    this.productTags = value;
    console.log(this.productTags);
  };

  setMessageLimit = (value) => {
    this.messageLimit = value;
    console.log(this.messageLimit);
  };

  setCustomStyles = (value) => {
    this.customStyles = value;
    console.log(this.customStyles);
  };

  setisInstalled = (value) => {
    this.customStyles = value;
    console.log(this.isInstalled);
  };

  constructor() {
    makeAutoObservable(this);
  }
}

export default new Storage();
