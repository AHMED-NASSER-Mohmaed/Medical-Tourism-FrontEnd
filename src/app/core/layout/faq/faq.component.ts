import { Component } from '@angular/core';

@Component({
  selector: 'app-faq', // Or whatever your component's selector is
  standalone:false,
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent {

  // Variable to track the currently open accordion item.
  // We'll set it to 1 initially so the first item is open by default.
  activeAccordionIndex: number | null = 0;

  // Your FAQ data as an array of objects
  faqs = [
    {
      question: 'How do I choose the right hospital for my treatment?',
      answer: `
        <p>Our medical advisors evaluate your specific needs and match you with the most appropriate facilities based on:</p>
        <ul>
          <li>Specialty expertise and success rates for your procedure</li>
          <li>Hospital accreditation and international certifications</li>
          <li>Patient reviews and outcomes data</li>
          <li>Language support and international patient services</li>
        </ul>
        <p>We provide detailed profiles of each option to help you make an informed decision.</p>
      `
    },
    {
      question: 'What is included in your medical tourism packages?',
      answer: `
        <p>Our comprehensive packages typically include:</p>
        <ul>
          <li>Medical procedure costs (surgeon fees, facility charges, implants if applicable)</li>
          <li>Pre-treatment consultations and diagnostic tests</li>
          <li>Accommodation (hotel or recovery center)</li>
          <li>Airport transfers and local transportation</li>
          <li>24/7 patient support and concierge services</li>
        </ul>
      `
    },
    {
      question: 'How much can I save with medical tourism?',
      answer: `
        <p>Savings vary by procedure and country of origin, but typical savings range from 60-80% for many treatments. Even after including travel expenses, patients typically save thousands of dollars.</p>
      `
    }
    // Add more FAQ items here
  ];

  constructor() { }

  // Function to toggle the accordion
  toggleAccordion(index: number): void {
    if (this.activeAccordionIndex === index) {
      // If the clicked item is already open, close it
      this.activeAccordionIndex = null;
    } else {
      // Otherwise, open the clicked item
      this.activeAccordionIndex = index;
    }
  }
}
