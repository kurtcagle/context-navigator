import { inject } from 'aurelia-framework';

@inject(Element)
export class ModalCustomElement {
  
  // refs
  el;

  // view model properties
  visible = false; // This variable will track the visibility state of the modal.

  constructor(el) {
    this.el = el;
  }
  
  // Whenever a view is loaded with a modal in it, I want to make sure that the
  // modal's visiblility is set back to hidden.
  attached() {
    this.visible = false;
  }
  
  // I create an open() function. By using view-model.ref in my view model, I will 
  // be able to call this function to open the modal.
  open() {
    this.visible = true;
    console.log("Modal opened");
  }
  
  // I also create a close() function. This can be called externally, just like
  // open, but is also called internally by the default "Close" button in the
  // footer.
  close() {
    
    // The close function will hide the modal...
    this.visible = false;

    // ...and dispatch an event on the modal that the view model can listen for.
    this.el.dispatchEvent(
      new CustomEvent('closed', { bubbles: true })
    );
  }
  cancel() {
    
    // The close function will hide the modal...
    this.visible = false;

    // ...but doesn't dispatch the processing event.
/*    this.el.dispatchEvent(
      new CustomEvent('closed', { bubbles: true })
    );*/
  }
}
