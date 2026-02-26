import { Injectable } from '@angular/core';
import { TemplateCategory } from '../models/template.model';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  #categories: TemplateCategory[] = [
    {
      id: 'user-account',
      name: 'User Account',
      icon: 'folder',
      templates: [
        {
          id: 'update-profile',
          name: 'Update Profile',
          description: 'Keep your profile information up to date.',
          categoryId: 'user-account',
          fields: [
            {
              key: 'firstName',
              type: 'input',
              props: {
                label: 'First Name',
                placeholder: 'John',
                required: true,
              },
            },
            {
              key: 'lastName',
              type: 'input',
              props: {
                label: 'Last Name',
                placeholder: 'Doe',
                required: true,
              },
            },
            {
              key: 'email',
              type: 'input',
              props: {
                label: 'Email',
                type: 'email',
                placeholder: 'john@example.com',
                required: true,
              },
            },
            {
              key: 'phoneNumber',
              type: 'input',
              props: {
                label: 'Phone Number',
                placeholder: '+1 (555) 000-0000',
              },
            },
            {
              key: 'bio',
              type: 'textarea',
              props: {
                label: 'Bio',
                placeholder: 'Tell us about yourself...',
                rows: 4,
              },
            },
          ],
        },
        {
          id: 'change-password',
          name: 'Change Password',
          description: 'Update your account password.',
          categoryId: 'user-account',
          fields: [
            {
              key: 'currentPassword',
              type: 'input',
              props: {
                label: 'Current Password',
                type: 'password',
                required: true,
              },
            },
            {
              key: 'newPassword',
              type: 'input',
              props: {
                label: 'New Password',
                type: 'password',
                required: true,
              },
            },
            {
              key: 'confirmPassword',
              type: 'input',
              props: {
                label: 'Confirm Password',
                type: 'password',
                required: true,
              },
            },
          ],
        },
        {
          id: 'account-settings',
          name: 'Account Settings',
          description: 'Manage your account preferences.',
          categoryId: 'user-account',
          fields: [
            {
              key: 'notifications',
              type: 'checkbox',
              props: {
                label: 'Email Notifications',
              },
            },
            {
              key: 'newsletter',
              type: 'checkbox',
              props: {
                label: 'Subscribe to Newsletter',
              },
            },
            {
              key: 'privacy',
              type: 'select',
              props: {
                label: 'Profile Visibility',
                options: [
                  { label: 'Public', value: 'public' },
                  { label: 'Private', value: 'private' },
                  { label: 'Friends Only', value: 'friends' },
                ],
              },
            },
          ],
        },
        {
          id: 'user-preferences',
          name: 'User Preferences',
          description: 'Customize your experience.',
          categoryId: 'user-account',
          fields: [
            {
              key: 'language',
              type: 'select',
              props: {
                label: 'Language',
                options: [
                  { label: 'English', value: 'en' },
                  { label: 'Spanish', value: 'es' },
                  { label: 'French', value: 'fr' },
                ],
              },
            },
            {
              key: 'timezone',
              type: 'select',
              props: {
                label: 'Timezone',
                options: [
                  { label: 'UTC-8 (PST)', value: 'pst' },
                  { label: 'UTC-5 (EST)', value: 'est' },
                  { label: 'UTC+0 (GMT)', value: 'gmt' },
                ],
              },
            },
          ],
        },
        {
          id: 'account-deletion',
          name: 'Account Deletion Request',
          description: 'Request permanent deletion of your account.',
          categoryId: 'user-account',
          fields: [
            {
              key: 'reason',
              type: 'textarea',
              props: {
                label: 'Reason for Deletion',
                placeholder: 'Please tell us why you want to delete your account',
                required: true,
              },
            },
            {
              key: 'confirmation',
              type: 'checkbox',
              props: {
                label: 'I understand this action is permanent',
                required: true,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'service',
      name: 'Service',
      icon: 'folder',
      templates: [
        {
          id: 'service-request',
          name: 'Service Request',
          description: 'Submit a new service request.',
          categoryId: 'service',
          fields: [
            {
              key: 'serviceType',
              type: 'select',
              props: {
                label: 'Service Type',
                options: [
                  { label: 'Maintenance', value: 'maintenance' },
                  { label: 'Repair', value: 'repair' },
                  { label: 'Installation', value: 'installation' },
                ],
                required: true,
              },
            },
            {
              key: 'description',
              type: 'textarea',
              props: {
                label: 'Description',
                placeholder: 'Describe the service you need',
                required: true,
              },
            },
          ],
        },
        {
          id: 'feedback-form',
          name: 'Feedback Form',
          description: 'Share your feedback with us.',
          categoryId: 'service',
          fields: [
            {
              key: 'rating',
              type: 'select',
              props: {
                label: 'Rating',
                options: [
                  { label: '5 - Excellent', value: '5' },
                  { label: '4 - Good', value: '4' },
                  { label: '3 - Average', value: '3' },
                  { label: '2 - Poor', value: '2' },
                  { label: '1 - Very Poor', value: '1' },
                ],
                required: true,
              },
            },
            {
              key: 'comments',
              type: 'textarea',
              props: {
                label: 'Comments',
                placeholder: 'Share your thoughts',
              },
            },
          ],
        },
        {
          id: 'support-ticket',
          name: 'Support Ticket',
          description: 'Create a support ticket.',
          categoryId: 'service',
          fields: [
            {
              key: 'subject',
              type: 'input',
              props: {
                label: 'Subject',
                required: true,
              },
            },
            {
              key: 'priority',
              type: 'select',
              props: {
                label: 'Priority',
                options: [
                  { label: 'Low', value: 'low' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'High', value: 'high' },
                  { label: 'Critical', value: 'critical' },
                ],
                required: true,
              },
            },
            {
              key: 'description',
              type: 'textarea',
              props: {
                label: 'Description',
                placeholder: 'Describe your issue',
                required: true,
              },
            },
          ],
        },
        {
          id: 'appointment-booking',
          name: 'Appointment Booking',
          description: 'Book a service appointment.',
          categoryId: 'service',
          fields: [
            {
              key: 'date',
              type: 'input',
              props: {
                label: 'Preferred Date',
                type: 'date',
                required: true,
              },
            },
            {
              key: 'time',
              type: 'input',
              props: {
                label: 'Preferred Time',
                type: 'time',
                required: true,
              },
            },
          ],
        },
        {
          id: 'contact-us',
          name: 'Contact Us',
          description: 'Get in touch with our team.',
          categoryId: 'service',
          fields: [
            {
              key: 'name',
              type: 'input',
              props: {
                label: 'Name',
                required: true,
              },
            },
            {
              key: 'email',
              type: 'input',
              props: {
                label: 'Email',
                type: 'email',
                required: true,
              },
            },
            {
              key: 'message',
              type: 'textarea',
              props: {
                label: 'Message',
                required: true,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'event',
      name: 'Event',
      icon: 'folder',
      templates: [
        {
          id: 'event-registration',
          name: 'Event Registration',
          description: 'Register for an upcoming event.',
          categoryId: 'event',
          fields: [
            {
              key: 'fullName',
              type: 'input',
              props: {
                label: 'Full Name',
                required: true,
              },
            },
            {
              key: 'email',
              type: 'input',
              props: {
                label: 'Email',
                type: 'email',
                required: true,
              },
            },
            {
              key: 'ticketType',
              type: 'select',
              props: {
                label: 'Ticket Type',
                options: [
                  { label: 'General Admission', value: 'general' },
                  { label: 'VIP', value: 'vip' },
                  { label: 'Student', value: 'student' },
                ],
                required: true,
              },
            },
          ],
        },
        {
          id: 'rsvp',
          name: 'RSVP',
          description: 'Respond to an event invitation.',
          categoryId: 'event',
          fields: [
            {
              key: 'attending',
              type: 'radio',
              props: {
                label: 'Will you attend?',
                options: [
                  { label: 'Yes', value: 'yes' },
                  { label: 'No', value: 'no' },
                  { label: 'Maybe', value: 'maybe' },
                ],
                required: true,
              },
            },
            {
              key: 'guestCount',
              type: 'input',
              props: {
                label: 'Number of Guests',
                type: 'number',
              },
            },
          ],
        },
        {
          id: 'venue-booking',
          name: 'Venue Booking',
          description: 'Book a venue for your event.',
          categoryId: 'event',
          fields: [
            {
              key: 'eventName',
              type: 'input',
              props: {
                label: 'Event Name',
                required: true,
              },
            },
            {
              key: 'eventDate',
              type: 'input',
              props: {
                label: 'Event Date',
                type: 'date',
                required: true,
              },
            },
            {
              key: 'attendees',
              type: 'input',
              props: {
                label: 'Expected Attendees',
                type: 'number',
                required: true,
              },
            },
          ],
        },
        {
          id: 'speaker-proposal',
          name: 'Speaker Proposal',
          description: 'Submit a proposal to speak at an event.',
          categoryId: 'event',
          fields: [
            {
              key: 'speakerName',
              type: 'input',
              props: {
                label: 'Speaker Name',
                required: true,
              },
            },
            {
              key: 'topic',
              type: 'input',
              props: {
                label: 'Presentation Topic',
                required: true,
              },
            },
            {
              key: 'abstract',
              type: 'textarea',
              props: {
                label: 'Abstract',
                placeholder: 'Brief description of your presentation',
                required: true,
              },
            },
          ],
        },
        {
          id: 'volunteer-signup',
          name: 'Volunteer Signup',
          description: 'Sign up to volunteer at an event.',
          categoryId: 'event',
          fields: [
            {
              key: 'name',
              type: 'input',
              props: {
                label: 'Name',
                required: true,
              },
            },
            {
              key: 'availability',
              type: 'textarea',
              props: {
                label: 'Availability',
                placeholder: 'When are you available?',
                required: true,
              },
            },
          ],
        },
        {
          id: 'event-feedback',
          name: 'Event Feedback',
          description: 'Provide feedback about an event.',
          categoryId: 'event',
          fields: [
            {
              key: 'overallRating',
              type: 'select',
              props: {
                label: 'Overall Rating',
                options: [
                  { label: '5 - Excellent', value: '5' },
                  { label: '4 - Good', value: '4' },
                  { label: '3 - Average', value: '3' },
                  { label: '2 - Poor', value: '2' },
                  { label: '1 - Very Poor', value: '1' },
                ],
              },
            },
            {
              key: 'comments',
              type: 'textarea',
              props: {
                label: 'Comments',
              },
            },
          ],
        },
        {
          id: 'exhibition-booth',
          name: 'Exhibition Booth',
          description: 'Request an exhibition booth.',
          categoryId: 'event',
          fields: [
            {
              key: 'companyName',
              type: 'input',
              props: {
                label: 'Company Name',
                required: true,
              },
            },
            {
              key: 'boothSize',
              type: 'select',
              props: {
                label: 'Booth Size',
                options: [
                  { label: 'Small (3x3)', value: 'small' },
                  { label: 'Medium (6x6)', value: 'medium' },
                  { label: 'Large (9x9)', value: 'large' },
                ],
                required: true,
              },
            },
          ],
        },
        {
          id: 'workshop-registration',
          name: 'Workshop Registration',
          description: 'Register for a workshop session.',
          categoryId: 'event',
          fields: [
            {
              key: 'workshopName',
              type: 'input',
              props: {
                label: 'Workshop Name',
                required: true,
              },
            },
            {
              key: 'participantName',
              type: 'input',
              props: {
                label: 'Participant Name',
                required: true,
              },
            },
            {
              key: 'experienceLevel',
              type: 'select',
              props: {
                label: 'Experience Level',
                options: [
                  { label: 'Beginner', value: 'beginner' },
                  { label: 'Intermediate', value: 'intermediate' },
                  { label: 'Advanced', value: 'advanced' },
                ],
              },
            },
          ],
        },
        {
          id: 'catering-request',
          name: 'Catering Request',
          description: 'Request catering for an event.',
          categoryId: 'event',
          fields: [
            {
              key: 'guestCount',
              type: 'input',
              props: {
                label: 'Number of Guests',
                type: 'number',
                required: true,
              },
            },
            {
              key: 'mealType',
              type: 'select',
              props: {
                label: 'Meal Type',
                options: [
                  { label: 'Breakfast', value: 'breakfast' },
                  { label: 'Lunch', value: 'lunch' },
                  { label: 'Dinner', value: 'dinner' },
                ],
                required: true,
              },
            },
            {
              key: 'dietaryRestrictions',
              type: 'textarea',
              props: {
                label: 'Dietary Restrictions',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'business',
      name: 'Business',
      icon: 'folder',
      templates: [
        {
          id: 'business-inquiry',
          name: 'Business Inquiry',
          description: 'Submit a business inquiry.',
          categoryId: 'business',
          fields: [
            {
              key: 'companyName',
              type: 'input',
              props: {
                label: 'Company Name',
                required: true,
              },
            },
            {
              key: 'industry',
              type: 'input',
              props: {
                label: 'Industry',
              },
            },
            {
              key: 'inquiry',
              type: 'textarea',
              props: {
                label: 'Inquiry',
                required: true,
              },
            },
          ],
        },
        {
          id: 'partnership-proposal',
          name: 'Partnership Proposal',
          description: 'Propose a business partnership.',
          categoryId: 'business',
          fields: [
            {
              key: 'organizationName',
              type: 'input',
              props: {
                label: 'Organization Name',
                required: true,
              },
            },
            {
              key: 'proposalDetails',
              type: 'textarea',
              props: {
                label: 'Proposal Details',
                required: true,
              },
            },
          ],
        },
        {
          id: 'vendor-application',
          name: 'Vendor Application',
          description: 'Apply to become a vendor.',
          categoryId: 'business',
          fields: [
            {
              key: 'businessName',
              type: 'input',
              props: {
                label: 'Business Name',
                required: true,
              },
            },
            {
              key: 'productsServices',
              type: 'textarea',
              props: {
                label: 'Products/Services',
                required: true,
              },
            },
          ],
        },
        {
          id: 'quote-request',
          name: 'Quote Request',
          description: 'Request a price quote.',
          categoryId: 'business',
          fields: [
            {
              key: 'projectDescription',
              type: 'textarea',
              props: {
                label: 'Project Description',
                required: true,
              },
            },
            {
              key: 'budget',
              type: 'input',
              props: {
                label: 'Budget Range',
              },
            },
          ],
        },
        {
          id: 'invoice-submission',
          name: 'Invoice Submission',
          description: 'Submit an invoice.',
          categoryId: 'business',
          fields: [
            {
              key: 'invoiceNumber',
              type: 'input',
              props: {
                label: 'Invoice Number',
                required: true,
              },
            },
            {
              key: 'amount',
              type: 'input',
              props: {
                label: 'Amount',
                type: 'number',
                required: true,
              },
            },
          ],
        },
        {
          id: 'contract-request',
          name: 'Contract Request',
          description: 'Request a business contract.',
          categoryId: 'business',
          fields: [
            {
              key: 'contractType',
              type: 'select',
              props: {
                label: 'Contract Type',
                options: [
                  { label: 'Service Agreement', value: 'service' },
                  { label: 'NDA', value: 'nda' },
                  { label: 'Partnership', value: 'partnership' },
                ],
                required: true,
              },
            },
          ],
        },
        {
          id: 'supplier-registration',
          name: 'Supplier Registration',
          description: 'Register as a supplier.',
          categoryId: 'business',
          fields: [
            {
              key: 'supplierName',
              type: 'input',
              props: {
                label: 'Supplier Name',
                required: true,
              },
            },
            {
              key: 'products',
              type: 'textarea',
              props: {
                label: 'Products Offered',
                required: true,
              },
            },
          ],
        },
        {
          id: 'procurement-request',
          name: 'Procurement Request',
          description: 'Submit a procurement request.',
          categoryId: 'business',
          fields: [
            {
              key: 'itemDescription',
              type: 'textarea',
              props: {
                label: 'Item Description',
                required: true,
              },
            },
            {
              key: 'quantity',
              type: 'input',
              props: {
                label: 'Quantity',
                type: 'number',
                required: true,
              },
            },
          ],
        },
        {
          id: 'business-license',
          name: 'Business License Application',
          description: 'Apply for a business license.',
          categoryId: 'business',
          fields: [
            {
              key: 'businessName',
              type: 'input',
              props: {
                label: 'Business Name',
                required: true,
              },
            },
            {
              key: 'businessType',
              type: 'select',
              props: {
                label: 'Business Type',
                options: [
                  { label: 'Sole Proprietorship', value: 'sole' },
                  { label: 'Partnership', value: 'partnership' },
                  { label: 'Corporation', value: 'corporation' },
                ],
                required: true,
              },
            },
          ],
        },
        {
          id: 'employment-verification',
          name: 'Employment Verification',
          description: 'Request employment verification.',
          categoryId: 'business',
          fields: [
            {
              key: 'employeeName',
              type: 'input',
              props: {
                label: 'Employee Name',
                required: true,
              },
            },
            {
              key: 'employmentDates',
              type: 'input',
              props: {
                label: 'Employment Dates',
                required: true,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'education',
      name: 'Education',
      icon: 'folder',
      templates: [
        {
          id: 'course-enrollment',
          name: 'Course Enrollment',
          description: 'Enroll in a course.',
          categoryId: 'education',
          fields: [
            {
              key: 'studentName',
              type: 'input',
              props: {
                label: 'Student Name',
                required: true,
              },
            },
            {
              key: 'courseCode',
              type: 'input',
              props: {
                label: 'Course Code',
                required: true,
              },
            },
          ],
        },
        {
          id: 'scholarship-application',
          name: 'Scholarship Application',
          description: 'Apply for a scholarship.',
          categoryId: 'education',
          fields: [
            {
              key: 'applicantName',
              type: 'input',
              props: {
                label: 'Applicant Name',
                required: true,
              },
            },
            {
              key: 'gpa',
              type: 'input',
              props: {
                label: 'GPA',
                type: 'number',
                required: true,
              },
            },
            {
              key: 'essay',
              type: 'textarea',
              props: {
                label: 'Personal Statement',
                required: true,
              },
            },
          ],
        },
        {
          id: 'transcript-request',
          name: 'Transcript Request',
          description: 'Request academic transcripts.',
          categoryId: 'education',
          fields: [
            {
              key: 'studentID',
              type: 'input',
              props: {
                label: 'Student ID',
                required: true,
              },
            },
            {
              key: 'deliveryMethod',
              type: 'select',
              props: {
                label: 'Delivery Method',
                options: [
                  { label: 'Email', value: 'email' },
                  { label: 'Mail', value: 'mail' },
                  { label: 'Pickup', value: 'pickup' },
                ],
                required: true,
              },
            },
          ],
        },
        {
          id: 'library-card',
          name: 'Library Card Application',
          description: 'Apply for a library card.',
          categoryId: 'education',
          fields: [
            {
              key: 'fullName',
              type: 'input',
              props: {
                label: 'Full Name',
                required: true,
              },
            },
            {
              key: 'address',
              type: 'textarea',
              props: {
                label: 'Address',
                required: true,
              },
            },
          ],
        },
        {
          id: 'exam-registration',
          name: 'Exam Registration',
          description: 'Register for an exam.',
          categoryId: 'education',
          fields: [
            {
              key: 'examName',
              type: 'input',
              props: {
                label: 'Exam Name',
                required: true,
              },
            },
            {
              key: 'preferredDate',
              type: 'input',
              props: {
                label: 'Preferred Date',
                type: 'date',
                required: true,
              },
            },
          ],
        },
        {
          id: 'tutoring-request',
          name: 'Tutoring Request',
          description: 'Request tutoring services.',
          categoryId: 'education',
          fields: [
            {
              key: 'subject',
              type: 'input',
              props: {
                label: 'Subject',
                required: true,
              },
            },
            {
              key: 'availability',
              type: 'textarea',
              props: {
                label: 'Availability',
                required: true,
              },
            },
          ],
        },
        {
          id: 'financial-aid',
          name: 'Financial Aid Application',
          description: 'Apply for financial aid.',
          categoryId: 'education',
          fields: [
            {
              key: 'studentName',
              type: 'input',
              props: {
                label: 'Student Name',
                required: true,
              },
            },
            {
              key: 'householdIncome',
              type: 'input',
              props: {
                label: 'Household Income',
                type: 'number',
                required: true,
              },
            },
          ],
        },
        {
          id: 'internship-application',
          name: 'Internship Application',
          description: 'Apply for an internship.',
          categoryId: 'education',
          fields: [
            {
              key: 'applicantName',
              type: 'input',
              props: {
                label: 'Applicant Name',
                required: true,
              },
            },
            {
              key: 'major',
              type: 'input',
              props: {
                label: 'Major',
                required: true,
              },
            },
            {
              key: 'coverLetter',
              type: 'textarea',
              props: {
                label: 'Cover Letter',
                required: true,
              },
            },
          ],
        },
        {
          id: 'class-schedule',
          name: 'Class Schedule Request',
          description: 'Request your class schedule.',
          categoryId: 'education',
          fields: [
            {
              key: 'semester',
              type: 'select',
              props: {
                label: 'Semester',
                options: [
                  { label: 'Fall', value: 'fall' },
                  { label: 'Spring', value: 'spring' },
                  { label: 'Summer', value: 'summer' },
                ],
                required: true,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      icon: 'folder',
      templates: [
        {
          id: 'patient-registration',
          name: 'Patient Registration',
          description: 'Register as a new patient.',
          categoryId: 'healthcare',
          fields: [
            {
              key: 'patientName',
              type: 'input',
              props: {
                label: 'Patient Name',
                required: true,
              },
            },
            {
              key: 'dateOfBirth',
              type: 'input',
              props: {
                label: 'Date of Birth',
                type: 'date',
                required: true,
              },
            },
            {
              key: 'insuranceProvider',
              type: 'input',
              props: {
                label: 'Insurance Provider',
              },
            },
          ],
        },
        {
          id: 'appointment-request',
          name: 'Appointment Request',
          description: 'Request a medical appointment.',
          categoryId: 'healthcare',
          fields: [
            {
              key: 'preferredDate',
              type: 'input',
              props: {
                label: 'Preferred Date',
                type: 'date',
                required: true,
              },
            },
            {
              key: 'reasonForVisit',
              type: 'textarea',
              props: {
                label: 'Reason for Visit',
                required: true,
              },
            },
          ],
        },
        {
          id: 'prescription-refill',
          name: 'Prescription Refill',
          description: 'Request a prescription refill.',
          categoryId: 'healthcare',
          fields: [
            {
              key: 'medicationName',
              type: 'input',
              props: {
                label: 'Medication Name',
                required: true,
              },
            },
            {
              key: 'pharmacyName',
              type: 'input',
              props: {
                label: 'Pharmacy Name',
                required: true,
              },
            },
          ],
        },
        {
          id: 'medical-records',
          name: 'Medical Records Request',
          description: 'Request copies of medical records.',
          categoryId: 'healthcare',
          fields: [
            {
              key: 'patientName',
              type: 'input',
              props: {
                label: 'Patient Name',
                required: true,
              },
            },
            {
              key: 'recordType',
              type: 'select',
              props: {
                label: 'Record Type',
                options: [
                  { label: 'Complete Records', value: 'complete' },
                  { label: 'Lab Results', value: 'lab' },
                  { label: 'Imaging', value: 'imaging' },
                ],
                required: true,
              },
            },
          ],
        },
        {
          id: 'insurance-claim',
          name: 'Insurance Claim',
          description: 'Submit an insurance claim.',
          categoryId: 'healthcare',
          fields: [
            {
              key: 'claimNumber',
              type: 'input',
              props: {
                label: 'Claim Number',
                required: true,
              },
            },
            {
              key: 'serviceDate',
              type: 'input',
              props: {
                label: 'Service Date',
                type: 'date',
                required: true,
              },
            },
          ],
        },
        {
          id: 'vaccination-record',
          name: 'Vaccination Record',
          description: 'Request vaccination records.',
          categoryId: 'healthcare',
          fields: [
            {
              key: 'patientName',
              type: 'input',
              props: {
                label: 'Patient Name',
                required: true,
              },
            },
            {
              key: 'vaccinationType',
              type: 'input',
              props: {
                label: 'Vaccination Type',
              },
            },
          ],
        },
        {
          id: 'lab-test-request',
          name: 'Lab Test Request',
          description: 'Request laboratory tests.',
          categoryId: 'healthcare',
          fields: [
            {
              key: 'testType',
              type: 'input',
              props: {
                label: 'Test Type',
                required: true,
              },
            },
            {
              key: 'urgency',
              type: 'select',
              props: {
                label: 'Urgency',
                options: [
                  { label: 'Routine', value: 'routine' },
                  { label: 'Urgent', value: 'urgent' },
                  { label: 'Stat', value: 'stat' },
                ],
              },
            },
          ],
        },
        {
          id: 'referral-request',
          name: 'Referral Request',
          description: 'Request a specialist referral.',
          categoryId: 'healthcare',
          fields: [
            {
              key: 'specialtyNeeded',
              type: 'input',
              props: {
                label: 'Specialty Needed',
                required: true,
              },
            },
            {
              key: 'reason',
              type: 'textarea',
              props: {
                label: 'Reason',
                required: true,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'real-estate',
      name: 'Real Estate',
      icon: 'folder',
      templates: [
        {
          id: 'property-inquiry',
          name: 'Property Inquiry',
          description: 'Inquire about a property.',
          categoryId: 'real-estate',
          fields: [
            {
              key: 'propertyAddress',
              type: 'input',
              props: {
                label: 'Property Address',
                required: true,
              },
            },
            {
              key: 'inquiryDetails',
              type: 'textarea',
              props: {
                label: 'Inquiry Details',
              },
            },
          ],
        },
        {
          id: 'viewing-request',
          name: 'Viewing Request',
          description: 'Request a property viewing.',
          categoryId: 'real-estate',
          fields: [
            {
              key: 'preferredDate',
              type: 'input',
              props: {
                label: 'Preferred Date',
                type: 'date',
                required: true,
              },
            },
            {
              key: 'preferredTime',
              type: 'input',
              props: {
                label: 'Preferred Time',
                type: 'time',
                required: true,
              },
            },
          ],
        },
        {
          id: 'rental-application',
          name: 'Rental Application',
          description: 'Apply to rent a property.',
          categoryId: 'real-estate',
          fields: [
            {
              key: 'applicantName',
              type: 'input',
              props: {
                label: 'Applicant Name',
                required: true,
              },
            },
            {
              key: 'currentAddress',
              type: 'textarea',
              props: {
                label: 'Current Address',
                required: true,
              },
            },
            {
              key: 'monthlyIncome',
              type: 'input',
              props: {
                label: 'Monthly Income',
                type: 'number',
                required: true,
              },
            },
          ],
        },
        {
          id: 'maintenance-request',
          name: 'Maintenance Request',
          description: 'Request property maintenance.',
          categoryId: 'real-estate',
          fields: [
            {
              key: 'issueDescription',
              type: 'textarea',
              props: {
                label: 'Issue Description',
                required: true,
              },
            },
            {
              key: 'urgency',
              type: 'select',
              props: {
                label: 'Urgency',
                options: [
                  { label: 'Low', value: 'low' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'High', value: 'high' },
                ],
              },
            },
          ],
        },
        {
          id: 'lease-renewal',
          name: 'Lease Renewal',
          description: 'Renew your lease agreement.',
          categoryId: 'real-estate',
          fields: [
            {
              key: 'currentLeaseEnd',
              type: 'input',
              props: {
                label: 'Current Lease End Date',
                type: 'date',
                required: true,
              },
            },
            {
              key: 'renewalTerms',
              type: 'textarea',
              props: {
                label: 'Renewal Terms',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'travel',
      name: 'Travel',
      icon: 'folder',
      templates: [
        {
          id: 'booking-request',
          name: 'Booking Request',
          description: 'Request a travel booking.',
          categoryId: 'travel',
          fields: [
            {
              key: 'destination',
              type: 'input',
              props: {
                label: 'Destination',
                required: true,
              },
            },
            {
              key: 'travelDates',
              type: 'input',
              props: {
                label: 'Travel Dates',
                required: true,
              },
            },
            {
              key: 'numberOfTravelers',
              type: 'input',
              props: {
                label: 'Number of Travelers',
                type: 'number',
                required: true,
              },
            },
          ],
        },
        {
          id: 'visa-application',
          name: 'Visa Application',
          description: 'Apply for a travel visa.',
          categoryId: 'travel',
          fields: [
            {
              key: 'destinationCountry',
              type: 'input',
              props: {
                label: 'Destination Country',
                required: true,
              },
            },
            {
              key: 'purposeOfTravel',
              type: 'select',
              props: {
                label: 'Purpose of Travel',
                options: [
                  { label: 'Tourism', value: 'tourism' },
                  { label: 'Business', value: 'business' },
                  { label: 'Education', value: 'education' },
                ],
                required: true,
              },
            },
          ],
        },
        {
          id: 'itinerary-request',
          name: 'Itinerary Request',
          description: 'Request a custom itinerary.',
          categoryId: 'travel',
          fields: [
            {
              key: 'tripDuration',
              type: 'input',
              props: {
                label: 'Trip Duration (days)',
                type: 'number',
                required: true,
              },
            },
            {
              key: 'interests',
              type: 'textarea',
              props: {
                label: 'Interests',
                placeholder: 'What would you like to do?',
              },
            },
          ],
        },
        {
          id: 'travel-insurance',
          name: 'Travel Insurance',
          description: 'Purchase travel insurance.',
          categoryId: 'travel',
          fields: [
            {
              key: 'coverage',
              type: 'select',
              props: {
                label: 'Coverage Type',
                options: [
                  { label: 'Basic', value: 'basic' },
                  { label: 'Comprehensive', value: 'comprehensive' },
                  { label: 'Premium', value: 'premium' },
                ],
                required: true,
              },
            },
          ],
        },
        {
          id: 'group-booking',
          name: 'Group Booking',
          description: 'Book travel for a group.',
          categoryId: 'travel',
          fields: [
            {
              key: 'groupSize',
              type: 'input',
              props: {
                label: 'Group Size',
                type: 'number',
                required: true,
              },
            },
            {
              key: 'groupName',
              type: 'input',
              props: {
                label: 'Group Name',
                required: true,
              },
            },
          ],
        },
        {
          id: 'baggage-claim',
          name: 'Baggage Claim',
          description: 'Report lost or damaged baggage.',
          categoryId: 'travel',
          fields: [
            {
              key: 'flightNumber',
              type: 'input',
              props: {
                label: 'Flight Number',
                required: true,
              },
            },
            {
              key: 'baggageDescription',
              type: 'textarea',
              props: {
                label: 'Baggage Description',
                required: true,
              },
            },
          ],
        },
        {
          id: 'travel-cancellation',
          name: 'Travel Cancellation',
          description: 'Cancel a travel booking.',
          categoryId: 'travel',
          fields: [
            {
              key: 'bookingReference',
              type: 'input',
              props: {
                label: 'Booking Reference',
                required: true,
              },
            },
            {
              key: 'cancellationReason',
              type: 'textarea',
              props: {
                label: 'Reason for Cancellation',
              },
            },
          ],
        },
        {
          id: 'special-assistance',
          name: 'Special Assistance Request',
          description: 'Request special assistance during travel.',
          categoryId: 'travel',
          fields: [
            {
              key: 'assistanceType',
              type: 'select',
              props: {
                label: 'Assistance Type',
                options: [
                  { label: 'Wheelchair', value: 'wheelchair' },
                  { label: 'Dietary', value: 'dietary' },
                  { label: 'Medical', value: 'medical' },
                ],
                required: true,
              },
            },
            {
              key: 'additionalDetails',
              type: 'textarea',
              props: {
                label: 'Additional Details',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'membership',
      name: 'Membership',
      icon: 'folder',
      templates: [
        {
          id: 'new-membership',
          name: 'New Membership',
          description: 'Apply for a new membership.',
          categoryId: 'membership',
          fields: [
            {
              key: 'fullName',
              type: 'input',
              props: {
                label: 'Full Name',
                required: true,
              },
            },
            {
              key: 'membershipType',
              type: 'select',
              props: {
                label: 'Membership Type',
                options: [
                  { label: 'Basic', value: 'basic' },
                  { label: 'Premium', value: 'premium' },
                  { label: 'VIP', value: 'vip' },
                ],
                required: true,
              },
            },
          ],
        },
        {
          id: 'membership-renewal',
          name: 'Membership Renewal',
          description: 'Renew your membership.',
          categoryId: 'membership',
          fields: [
            {
              key: 'memberID',
              type: 'input',
              props: {
                label: 'Member ID',
                required: true,
              },
            },
            {
              key: 'renewalPeriod',
              type: 'select',
              props: {
                label: 'Renewal Period',
                options: [
                  { label: '1 Year', value: '1year' },
                  { label: '2 Years', value: '2years' },
                  { label: '3 Years', value: '3years' },
                ],
                required: true,
              },
            },
          ],
        },
        {
          id: 'membership-upgrade',
          name: 'Membership Upgrade',
          description: 'Upgrade your membership level.',
          categoryId: 'membership',
          fields: [
            {
              key: 'currentLevel',
              type: 'input',
              props: {
                label: 'Current Level',
                required: true,
              },
            },
            {
              key: 'desiredLevel',
              type: 'select',
              props: {
                label: 'Desired Level',
                options: [
                  { label: 'Premium', value: 'premium' },
                  { label: 'VIP', value: 'vip' },
                ],
                required: true,
              },
            },
          ],
        },
        {
          id: 'membership-cancellation',
          name: 'Membership Cancellation',
          description: 'Cancel your membership.',
          categoryId: 'membership',
          fields: [
            {
              key: 'memberID',
              type: 'input',
              props: {
                label: 'Member ID',
                required: true,
              },
            },
            {
              key: 'cancellationReason',
              type: 'textarea',
              props: {
                label: 'Reason for Cancellation',
              },
            },
          ],
        },
        {
          id: 'family-membership',
          name: 'Family Membership',
          description: 'Apply for a family membership.',
          categoryId: 'membership',
          fields: [
            {
              key: 'primaryMemberName',
              type: 'input',
              props: {
                label: 'Primary Member Name',
                required: true,
              },
            },
            {
              key: 'numberOfFamilyMembers',
              type: 'input',
              props: {
                label: 'Number of Family Members',
                type: 'number',
                required: true,
              },
            },
          ],
        },
        {
          id: 'guest-pass',
          name: 'Guest Pass Request',
          description: 'Request a guest pass.',
          categoryId: 'membership',
          fields: [
            {
              key: 'guestName',
              type: 'input',
              props: {
                label: 'Guest Name',
                required: true,
              },
            },
            {
              key: 'visitDate',
              type: 'input',
              props: {
                label: 'Visit Date',
                type: 'date',
                required: true,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'technical',
      name: 'Technical',
      icon: 'folder',
      templates: [
        {
          id: 'bug-report',
          name: 'Bug Report',
          description: 'Report a technical bug.',
          categoryId: 'technical',
          fields: [
            {
              key: 'bugTitle',
              type: 'input',
              props: {
                label: 'Bug Title',
                required: true,
              },
            },
            {
              key: 'stepsToReproduce',
              type: 'textarea',
              props: {
                label: 'Steps to Reproduce',
                required: true,
              },
            },
            {
              key: 'severity',
              type: 'select',
              props: {
                label: 'Severity',
                options: [
                  { label: 'Low', value: 'low' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'High', value: 'high' },
                  { label: 'Critical', value: 'critical' },
                ],
                required: true,
              },
            },
          ],
        },
        {
          id: 'feature-request',
          name: 'Feature Request',
          description: 'Request a new feature.',
          categoryId: 'technical',
          fields: [
            {
              key: 'featureTitle',
              type: 'input',
              props: {
                label: 'Feature Title',
                required: true,
              },
            },
            {
              key: 'description',
              type: 'textarea',
              props: {
                label: 'Description',
                required: true,
              },
            },
            {
              key: 'useCases',
              type: 'textarea',
              props: {
                label: 'Use Cases',
              },
            },
          ],
        },
        {
          id: 'api-access',
          name: 'API Access Request',
          description: 'Request API access.',
          categoryId: 'technical',
          fields: [
            {
              key: 'applicationName',
              type: 'input',
              props: {
                label: 'Application Name',
                required: true,
              },
            },
            {
              key: 'apiPurpose',
              type: 'textarea',
              props: {
                label: 'Purpose of API Access',
                required: true,
              },
            },
          ],
        },
        {
          id: 'system-access',
          name: 'System Access Request',
          description: 'Request system access.',
          categoryId: 'technical',
          fields: [
            {
              key: 'systemName',
              type: 'input',
              props: {
                label: 'System Name',
                required: true,
              },
            },
            {
              key: 'accessLevel',
              type: 'select',
              props: {
                label: 'Access Level',
                options: [
                  { label: 'Read Only', value: 'read' },
                  { label: 'Read/Write', value: 'write' },
                  { label: 'Admin', value: 'admin' },
                ],
                required: true,
              },
            },
          ],
        },
        {
          id: 'database-query',
          name: 'Database Query Request',
          description: 'Request a database query.',
          categoryId: 'technical',
          fields: [
            {
              key: 'queryPurpose',
              type: 'textarea',
              props: {
                label: 'Query Purpose',
                required: true,
              },
            },
            {
              key: 'urgency',
              type: 'select',
              props: {
                label: 'Urgency',
                options: [
                  { label: 'Low', value: 'low' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'High', value: 'high' },
                ],
              },
            },
          ],
        },
        {
          id: 'server-maintenance',
          name: 'Server Maintenance Request',
          description: 'Request server maintenance.',
          categoryId: 'technical',
          fields: [
            {
              key: 'serverName',
              type: 'input',
              props: {
                label: 'Server Name',
                required: true,
              },
            },
            {
              key: 'maintenanceType',
              type: 'select',
              props: {
                label: 'Maintenance Type',
                options: [
                  { label: 'Update', value: 'update' },
                  { label: 'Repair', value: 'repair' },
                  { label: 'Configuration', value: 'configuration' },
                ],
                required: true,
              },
            },
          ],
        },
        {
          id: 'security-incident',
          name: 'Security Incident Report',
          description: 'Report a security incident.',
          categoryId: 'technical',
          fields: [
            {
              key: 'incidentType',
              type: 'select',
              props: {
                label: 'Incident Type',
                options: [
                  { label: 'Unauthorized Access', value: 'access' },
                  { label: 'Data Breach', value: 'breach' },
                  { label: 'Malware', value: 'malware' },
                ],
                required: true,
              },
            },
            {
              key: 'incidentDetails',
              type: 'textarea',
              props: {
                label: 'Incident Details',
                required: true,
              },
            },
          ],
        },
        {
          id: 'password-reset',
          name: 'Password Reset',
          description: 'Request a password reset.',
          categoryId: 'technical',
          fields: [
            {
              key: 'username',
              type: 'input',
              props: {
                label: 'Username',
                required: true,
              },
            },
            {
              key: 'email',
              type: 'input',
              props: {
                label: 'Email',
                type: 'email',
                required: true,
              },
            },
          ],
        },
        {
          id: 'backup-restore',
          name: 'Backup Restore Request',
          description: 'Request a data backup restore.',
          categoryId: 'technical',
          fields: [
            {
              key: 'backupDate',
              type: 'input',
              props: {
                label: 'Backup Date',
                type: 'date',
                required: true,
              },
            },
            {
              key: 'dataToRestore',
              type: 'textarea',
              props: {
                label: 'Data to Restore',
                required: true,
              },
            },
          ],
        },
      ],
    },
    {
      id: 'feedback',
      name: 'Feedback',
      icon: 'folder',
      templates: [
        {
          id: 'product-feedback',
          name: 'Product Feedback',
          description: 'Provide feedback on a product.',
          categoryId: 'feedback',
          fields: [
            {
              key: 'productName',
              type: 'input',
              props: {
                label: 'Product Name',
                required: true,
              },
            },
            {
              key: 'rating',
              type: 'select',
              props: {
                label: 'Rating',
                options: [
                  { label: '5 - Excellent', value: '5' },
                  { label: '4 - Good', value: '4' },
                  { label: '3 - Average', value: '3' },
                  { label: '2 - Poor', value: '2' },
                  { label: '1 - Very Poor', value: '1' },
                ],
                required: true,
              },
            },
            {
              key: 'comments',
              type: 'textarea',
              props: {
                label: 'Comments',
                required: true,
              },
            },
          ],
        },
        {
          id: 'service-feedback',
          name: 'Service Feedback',
          description: 'Provide feedback on a service.',
          categoryId: 'feedback',
          fields: [
            {
              key: 'serviceName',
              type: 'input',
              props: {
                label: 'Service Name',
                required: true,
              },
            },
            {
              key: 'satisfaction',
              type: 'select',
              props: {
                label: 'Satisfaction Level',
                options: [
                  { label: 'Very Satisfied', value: 'very_satisfied' },
                  { label: 'Satisfied', value: 'satisfied' },
                  { label: 'Neutral', value: 'neutral' },
                  { label: 'Dissatisfied', value: 'dissatisfied' },
                  { label: 'Very Dissatisfied', value: 'very_dissatisfied' },
                ],
                required: true,
              },
            },
          ],
        },
        {
          id: 'website-feedback',
          name: 'Website Feedback',
          description: 'Share feedback about our website.',
          categoryId: 'feedback',
          fields: [
            {
              key: 'easeOfUse',
              type: 'select',
              props: {
                label: 'Ease of Use',
                options: [
                  { label: 'Very Easy', value: 'very_easy' },
                  { label: 'Easy', value: 'easy' },
                  { label: 'Neutral', value: 'neutral' },
                  { label: 'Difficult', value: 'difficult' },
                  { label: 'Very Difficult', value: 'very_difficult' },
                ],
              },
            },
            {
              key: 'suggestions',
              type: 'textarea',
              props: {
                label: 'Suggestions',
              },
            },
          ],
        },
        {
          id: 'customer-satisfaction',
          name: 'Customer Satisfaction Survey',
          description: 'Complete our customer satisfaction survey.',
          categoryId: 'feedback',
          fields: [
            {
              key: 'overallSatisfaction',
              type: 'select',
              props: {
                label: 'Overall Satisfaction',
                options: [
                  { label: 'Very Satisfied', value: 'very_satisfied' },
                  { label: 'Satisfied', value: 'satisfied' },
                  { label: 'Neutral', value: 'neutral' },
                  { label: 'Dissatisfied', value: 'dissatisfied' },
                ],
                required: true,
              },
            },
            {
              key: 'improvements',
              type: 'textarea',
              props: {
                label: 'Suggested Improvements',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: 'folder',
      templates: [
        {
          id: 'email-preferences',
          name: 'Email Preferences',
          description: 'Manage your email notification preferences.',
          categoryId: 'notifications',
          fields: [
            {
              key: 'marketingEmails',
              type: 'checkbox',
              props: {
                label: 'Marketing Emails',
              },
            },
            {
              key: 'productUpdates',
              type: 'checkbox',
              props: {
                label: 'Product Updates',
              },
            },
            {
              key: 'newsletter',
              type: 'checkbox',
              props: {
                label: 'Newsletter',
              },
            },
          ],
        },
        {
          id: 'push-notifications',
          name: 'Push Notification Settings',
          description: 'Configure push notification settings.',
          categoryId: 'notifications',
          fields: [
            {
              key: 'enablePush',
              type: 'checkbox',
              props: {
                label: 'Enable Push Notifications',
              },
            },
            {
              key: 'notificationTypes',
              type: 'select',
              props: {
                label: 'Notification Types',
                options: [
                  { label: 'All', value: 'all' },
                  { label: 'Important Only', value: 'important' },
                  { label: 'None', value: 'none' },
                ],
              },
            },
          ],
        },
        {
          id: 'sms-preferences',
          name: 'SMS Preferences',
          description: 'Manage SMS notification preferences.',
          categoryId: 'notifications',
          fields: [
            {
              key: 'enableSMS',
              type: 'checkbox',
              props: {
                label: 'Enable SMS Notifications',
              },
            },
            {
              key: 'phoneNumber',
              type: 'input',
              props: {
                label: 'Phone Number',
                type: 'tel',
              },
            },
          ],
        },
        {
          id: 'alert-preferences',
          name: 'Alert Preferences',
          description: 'Configure system alert preferences.',
          categoryId: 'notifications',
          fields: [
            {
              key: 'securityAlerts',
              type: 'checkbox',
              props: {
                label: 'Security Alerts',
              },
            },
            {
              key: 'systemUpdates',
              type: 'checkbox',
              props: {
                label: 'System Updates',
              },
            },
          ],
        },
        {
          id: 'unsubscribe',
          name: 'Unsubscribe',
          description: 'Unsubscribe from notifications.',
          categoryId: 'notifications',
          fields: [
            {
              key: 'email',
              type: 'input',
              props: {
                label: 'Email',
                type: 'email',
                required: true,
              },
            },
            {
              key: 'reason',
              type: 'textarea',
              props: {
                label: 'Reason (Optional)',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'examples',
      name: 'Examples',
      icon: 'folder',
      templates: [
        {
          id: 'job-application',
          name: 'Job Application',
          description: 'Job application form with two-column layout example.',
          categoryId: 'examples',
          fields: [
            {
              fieldGroupClassName: 'row',
              fieldGroup: [
                {
                  key: 'firstName',
                  type: 'input',
                  className: 'col-6',
                  props: {
                    label: 'First Name',
                    placeholder: 'John',
                    required: true,
                  },
                },
                {
                  key: 'lastName',
                  type: 'input',
                  className: 'col-6',
                  props: {
                    label: 'Last Name',
                    placeholder: 'Doe',
                    required: true,
                  },
                },
              ],
            },
            {
              key: 'email',
              type: 'input',
              props: {
                label: 'Email',
                type: 'email',
                placeholder: 'john@example.com',
                required: true,
              },
            },
            {
              key: 'phone',
              type: 'input',
              props: {
                label: 'Phone Number',
                placeholder: '+1 (555) 000-0000',
              },
            },
            {
              key: 'position',
              type: 'input',
              props: {
                label: 'Position Applied For',
                placeholder: 'Software Engineer',
                required: true,
              },
            },
            {
              key: 'coverLetter',
              type: 'textarea',
              props: {
                label: 'Cover Letter',
                placeholder: 'Tell us why you want to join us...',
                rows: 5,
              },
            },
          ],
        },
      ],
    },
  ];

  getCategories(): TemplateCategory[] {
    return this.#categories;
  }

  getCategoryById(id: string): TemplateCategory | undefined {
    return this.#categories.find((cat) => cat.id === id);
  }
}
