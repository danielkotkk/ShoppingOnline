import swal from 'sweetalert2';
import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {

  constructor() { }
  public fullName: string;
  public email: string;
  public message: string;
  public reasonForContacting: string;
  public sendMessage() {
    // Validates that there are no empty inputs, not sending data to anywhere, just a form.
    if (this.fullName && this.fullName.trim() !== "" && this.email && this.email.trim() !== "" && this.message && this.message.trim() !== "" && this.reasonForContacting && this.reasonForContacting !== "") {
      swal.fire({
        icon: 'success',
        title: 'Thanks for contacting us!',
        text: 'We will review your message and contact you!',
        width: "26em"
      })
    }
    else {
      swal.fire({
        icon: 'error',
        title: 'Something went wrong',
        text: 'Must fill all the fields',
        width: "26em"
      })
    }
  }

}
