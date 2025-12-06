// components/TermsOfUsePage.tsx or app/terms-of-use/page.tsx

import React from 'react';

/**
 * Terms of Use Page Component for Gentle Moving Inc.
 * Displays the complete Terms of Use content in English.
 */
const TermsOfUsePage: React.FC = () => {
  const lastUpdatedDate = "May 20, 2014"; // Updated date

  const sections = [
    {
      id: 1,
      title: "Consent to Contact",
      content: (
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mb-6">
          <p className="text-lg font-medium text-gray-800 mb-4">
            By clicking <strong className="font-bold text-blue-700">"get quotes"</strong> I consent to being contacted, including by text messages, at the phone number I've provided above, including marketing by using an automated dialing system or an artificial or pre-recorded voice:
          </p>
          <div className="space-y-3 pl-4">
            <p className="flex items-start">
              <span className="font-semibold text-gray-800 mr-2">(A)</span>
              <span>by up to <strong className="font-semibold text-gray-800">four (4) companies</strong> as may be selected by GentleMoving.net, to receive moving quotes, and</span>
            </p>
            <p className="flex items-start">
              <span className="font-semibold text-gray-800 mr-2">(B)</span>
              <span>by GentleMoving.net to confirm my request, receive a request to complete a moving company review, and otherwise administer my request for moving quotes.</span>
            </p>
          </div>
          <p className="mt-6 p-4 bg-white border border-gray-300 rounded-lg">
            I understand that I am <strong className="font-semibold text-gray-800">not required to provide this consent</strong> as a condition of purchasing any property, goods, or services.
          </p>
        </div>
      )
    },
    {
      id: 2,
      title: "Privacy Policy Overview",
      content: (
        <>
          <p className="mb-6">
            This Privacy Policy governs the manner in which <strong className="font-semibold text-gray-800">Gentle Moving Inc</strong> collects, uses, maintains and discloses information collected from users (each, a "User") of the{" "}
            <a 
              href="https://gentlemoving.net" 
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
            >
              https://gentlemoving.net
            </a>{" "}
            website ("Site"). This privacy policy applies to the Site and all products and services offered by Gentle Moving Inc.
          </p>
        </>
      )
    },
    {
      id: 3,
      title: "Personal Identification Information",
      content: (
        <>
          <p className="mb-4">
            We may collect <strong className="font-semibold text-gray-800">personal identification information</strong> from Users in a variety of ways, including, but not limited to, when Users visit our site, fill out a form, and in connection with other activities, services, features or resources we make available on our Site. Users may be asked for, as appropriate, <strong className="font-semibold text-gray-800">name, email address, mailing address, phone number</strong>.
          </p>
          <p>
            Users may, however, visit our Site <strong className="font-semibold text-gray-800">anonymously</strong>. We will collect personal identification information from Users only if they voluntarily submit such information to us. Users can always refuse to supply personally identification information, except that it may prevent them from engaging in certain Site related activities.
          </p>
        </>
      )
    },
    {
      id: 4,
      title: "Non-Personal Identification Information",
      content: (
        <p>
          We may collect <strong className="font-semibold text-gray-800">non-personal identification information</strong> about Users whenever they interact with our Site. Non-personal identification information may include the <strong className="font-semibold text-gray-800">browser name</strong>, the <strong className="font-semibold text-gray-800">type of computer</strong> and <strong className="font-semibold text-gray-800">technical information</strong> about Users means of connection to our Site, such as the operating system and the Internet service providers utilized and other similar information.
        </p>
      )
    },
    {
      id: 5,
      title: "Web Browser Cookies",
      content: (
        <p>
          Our Site may use <strong className="font-semibold text-gray-800">cookies</strong> to enhance User experience. User's web browser places cookies on their hard drive for record-keeping purposes and sometimes to track information about them. User may choose to set their web browser to <strong className="font-semibold text-gray-800">refuse cookies</strong>, or to alert you when cookies are being sent. If they do so, note that some parts of the Site may not function properly.
        </p>
      )
    },
    {
      id: 6,
      title: "How We Use Collected Information",
      content: (
        <>
          <p className="mb-4">Gentle Moving Inc may collect and use Users personal information for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-3 mb-4">
            <li>
              <strong className="font-semibold text-gray-800">To process payments:</strong> We may use the information Users provide about themselves when placing an order only to provide service to that order. We do not share this information with outside parties except to the extent necessary to provide the service.
            </li>
            <li>
              <strong className="font-semibold text-gray-800">To send periodic emails:</strong> We may use the email address to send User information and updates pertaining to their order. It may also be used to respond to their inquiries, questions, and/or other requests.
            </li>
          </ul>
        </>
      )
    },
    {
      id: 7,
      title: "How We Protect Your Information",
      content: (
        <>
          <p className="mb-4">
            We adopt appropriate data collection, storage and processing practices and <strong className="font-semibold text-gray-800">security measures</strong> to protect against unauthorized access, alteration, disclosure or destruction of your personal information, username, password, transaction information and data stored on our Site.
          </p>
          <p>
            Sensitive and private data exchange between the Site and its Users happens over a <strong className="font-semibold text-gray-800">SSL secured communication channel</strong> and is encrypted and protected with digital signatures.
          </p>
        </>
      )
    },
    {
      id: 8,
      title: "Sharing Your Personal Information",
      content: (
        <p className="mb-4">
          We <strong className="font-semibold text-gray-800">do not sell, trade, or rent</strong> Users personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates and advertisers for the purposes outlined above.
        </p>
      )
    },
    {
      id: 9,
      title: "Changes to This Privacy Policy",
      content: (
        <>
          <p className="mb-4">
            Gentle Moving Inc has the discretion to update this privacy policy at any time. When we do, we will revise the <strong className="font-semibold text-gray-800">updated date</strong> at the bottom of this page. We encourage Users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect.
          </p>
          <p>
            You acknowledge and agree that it is your responsibility to review this privacy policy periodically and become aware of modifications.
          </p>
        </>
      )
    },
    {
      id: 10,
      title: "Your Acceptance of These Terms",
      content: (
        <p>
          By <strong className="font-semibold text-gray-800">using this Site</strong>, you signify your acceptance of this policy and terms of service. If you do not agree to this policy, please do not use our Site. Your continued use of the Site following the posting of changes to this policy will be deemed your acceptance of those changes.
        </p>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10 pb-8 border-b-2 border-gray-300">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Terms of Use
          </h1>
          <div className="inline-block bg-gray-100 px-4 py-2 rounded-lg border border-gray-300">
            <span className="text-sm md:text-base text-gray-700">
              Last Updated: <span className="font-semibold">{lastUpdatedDate}</span>
            </span>
          </div>
        </header>

        {/* Introduction Note */}
        <div className="mb-10 p-6 bg-amber-50 rounded-lg border-l-4 border-amber-500 shadow-sm">
          <div className="flex items-start">
            <div className="mr-4 mt-1">
              <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Important Information</h3>
              <p className="text-gray-700">
                Please read these Terms of Use carefully before using our website. By accessing or using our site, you agree to be bound by these terms. These terms include our Privacy Policy and consent provisions for contacting you.
              </p>
            </div>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <section 
              key={section.id} 
              className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-6 transition-all duration-200 hover:shadow-md"
            >
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                <span className="text-blue-600 font-bold mr-2">{section.id}.</span>
                {section.title}
              </h2>
              <div className="text-gray-700 leading-relaxed">
                {section.content}
              </div>
            </section>
          ))}

          {/* Contact Section */}
          <section className="bg-gray-50 rounded-lg border-l-4 border-green-500 p-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-300">
              <span className="text-green-600 font-bold mr-2">11.</span>
              Contacting Us
            </h2>
            <div className="text-gray-700 leading-relaxed">
              <p className="mb-6">
                If you have any questions about these Terms of Use, the practices of this site, or your dealings with this site, please contact us at:
              </p>
              <address className="not-italic bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
                <strong className="block text-lg font-semibold text-gray-900 mb-3">
                  Gentle Moving Inc
                </strong>
                <div className="space-y-2">
                  <p className="flex items-start">
                    <span className="font-medium text-gray-800 min-w-24">Website:</span>
                    <a 
                      href="https://gentlemoving.net" 
                      className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                    >
                      https://gentlemoving.net
                    </a>
                  </p>
                  <p className="flex items-start">
                    <span className="font-medium text-gray-800 min-w-24">Address:</span>
                    <span>2719 Hollywood Blvd #1372 Hollywood, FL 33020</span>
                  </p>
                  <p className="flex items-start">
                    <span className="font-medium text-gray-800 min-w-24">Phone:</span>
                    <a 
                      href="tel:8882021370" 
                      className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                    >
                      (888) 202-1370
                    </a>
                  </p>
                  <p className="flex items-start">
                    <span className="font-medium text-gray-800 min-w-24">Email:</span>
                    <a 
                      href="mailto:sales@gentlemoving.net" 
                      className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                    >
                      sales@gentlemoving.net
                    </a>
                  </p>
                </div>
              </address>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-300 text-center">
          <p className="text-gray-600 text-sm md:text-base">
            These Terms of Use are effective as of{" "}
            <strong className="font-semibold text-gray-800">{lastUpdatedDate}</strong>.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default TermsOfUsePage;